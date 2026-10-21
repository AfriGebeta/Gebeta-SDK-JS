import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  Map as MapLibreMap,
  Camera,
  type MapRef,
  type CameraRef,
  type ViewStateChangeEvent,
  type PressEvent,
} from '@maplibre/maplibre-react-native';
import type { API } from '@gebeta/api';
import { resolveAuth, createTileTransform } from '@gebeta/core';
import { GebetaMapContext } from './context/MapContext';
import { createPlatform, type PlatformContext } from './adapters/createPlatform';
import { MapSpecRenderer } from './adapters/MapSpecRenderer';
import { MarkerRenderer } from './adapters/MarkerRenderer';
import { fetchSignedStyle } from './utils/signStyle';

const DEFAULT_STYLE_URL = 'https://tiles.gebeta.app/styles/standard/style.json';
const LOGO_URI = 'https://tiles.gebeta.app/static/glogo.svg';
const LOGO_LINK = 'https://gebetamaps.com';

export interface GebetaMapProps {
  /** @deprecated Use `auth` instead. */
  apiKey?: string;
  auth?: API.Auth.Types.ServiceAccountAuth;
  center?: [number, number];
  zoom?: number;
  styleUrl?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Main React Native component for rendering a Gebeta map.
 *
 * Wraps `@maplibre/maplibre-react-native`'s `<MapView>`, signs the configured style URL
 * with the consumer-provided auth, and exposes a `PlatformContext` to descendants via
 * `GebetaMapContext`. Hooks like `useGeocoding`, `useDirections`, etc. consume the
 * context to drive map features.
 */
export function GebetaMap({
  apiKey,
  auth: authProp,
  center = [38.74, 9.02],
  zoom = 12,
  styleUrl,
  style,
  children,
  onLoad,
  onError,
}: GebetaMapProps): ReactNode {
  const [contextValue, setContextValue] = useState<{ platform: PlatformContext } | null>(null);
  const [signedStyleJson, setSignedStyleJson] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const mapRef = useRef<MapRef | null>(null);
  const cameraRef = useRef<CameraRef | null>(null);

  const auth = useMemo(
    () => resolveAuth({ apiKey, auth: authProp }),
    [apiKey, authProp?.accessToken, authProp?.refreshToken]
  );

  useEffect(() => {
    const controller = new AbortController();
    const transform = createTileTransform(auth);
    const resolvedStyleUrl = styleUrl ?? DEFAULT_STYLE_URL;

    setLoadError(null);
    setSignedStyleJson(null);

    fetchSignedStyle(resolvedStyleUrl, transform, controller.signal)
      .then(json => {
        if (controller.signal.aborted) return;
        const platform = createPlatform({
          center: { lng: center[0], lat: center[1] },
          zoom,
        });
        setContextValue({ platform });
        setSignedStyleJson(json);
        onLoad?.();
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        const err = error instanceof Error ? error : new Error(String(error));
        setLoadError(err.message);
        onError?.(err);
      });

    return () => {
      controller.abort();
      setContextValue(null);
      setSignedStyleJson(null);
    };
  }, [auth, styleUrl]);

  // Attach the live Map/Camera refs to the platform's MapHandle once both exist, so the
  // MapAdapter can drive the camera and read cached region state.
  const attachRefs = useCallback(() => {
    const handle = contextValue?.platform.mapHandle;
    if (!handle) return;
    handle.mapRef = mapRef.current;
    handle.cameraRef = cameraRef.current;
  }, [contextValue]);

  const handleStyleLoaded = useCallback(() => {
    const handle = contextValue?.platform.mapHandle;
    if (!handle) return;
    handle.styleLoaded = true;
    handle.emit('style.load');
    handle.emit('load');
  }, [contextValue]);

  // Keep the MapHandle's cached region fresh so IMapAdapter's synchronous getters
  // (getZoom/getCenter/getBounds) return real values. Re-emits web-style map events.
  const handleRegionDidChange = useCallback(
    (event: { nativeEvent: ViewStateChangeEvent }) => {
      const handle = contextValue?.platform.mapHandle;
      if (!handle) return;
      // v11 ViewState: center is [lng, lat], bounds is [west, south, east, north].
      const { center, zoom, bounds } = event.nativeEvent;
      const [lng, lat] = center;
      const [west, south, east, north] = bounds;
      handle.region = {
        center: { lng, lat },
        zoom,
        bounds: { west, south, east, north },
      };
      handle.emit('moveend');
      handle.emit('zoomend');
    },
    [contextValue]
  );

  return (
    <GebetaMapContext.Provider value={contextValue}>
      <View style={[styles.container, style]}>
        {signedStyleJson && contextValue ? (
          <MapLibreMap
            ref={ref => {
              mapRef.current = ref;
              attachRefs();
            }}
            style={styles.map}
            mapStyle={signedStyleJson}
            logo={false}
            attribution={false}
            compass
            onDidFinishLoadingStyle={handleStyleLoaded}
            onRegionDidChange={handleRegionDidChange}
            onPress={event => {
              const pressed = event.nativeEvent as PressEvent;
              const lngLat = pressed?.lngLat;
              if (!lngLat) return;
              contextValue.platform.mapHandle.emit('click', {
                lngLat: { lng: lngLat[0], lat: lngLat[1] },
              });
            }}
          >
            <Camera
              ref={ref => {
                cameraRef.current = ref;
                attachRefs();
              }}
              initialViewState={{ center, zoom }}
            />
            <MapSpecRenderer store={contextValue.platform.mapHandle.store} />
            <MarkerRenderer store={contextValue.platform.markerStore} />
          </MapLibreMap>
        ) : (
          <View style={styles.placeholder}>
            {loadError ? (
              <>
                <Text style={styles.errorText}>Error: {loadError}</Text>
                <Text style={styles.hintText}>
                  Pass a valid apiKey or auth prop to load Gebeta tiles.
                </Text>
              </>
            ) : (
              <Text style={styles.hintText}>Loading map…</Text>
            )}
          </View>
        )}
        <View pointerEvents="box-none" style={styles.overlay}>
          {/*
            `box-none` on the wrapper too so it never captures map taps itself — only the
            actual interactive children (e.g. a control panel) capture touches; taps on empty
            space fall through to the map's onPress.
          */}
          <View pointerEvents="box-none" style={styles.overlay}>
            {children}
          </View>
        </View>
        <TouchableOpacity
          accessibilityLabel="Gebeta Maps"
          activeOpacity={0.8}
          onPress={() => {
            Linking.openURL(LOGO_LINK).catch(() => {});
          }}
          style={styles.logoButton}
        >
          <Image source={{ uri: LOGO_URI }} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </GebetaMapContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#c00',
    marginBottom: 8,
    textAlign: 'center',
  },
  hintText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 999,
  },
  logo: {
    width: 80,
    height: 28,
  },
});
