import type { ReactNode, Ref } from 'react';
import { useRef, useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';
import { resolveAuth, createTileTransform } from '@gebeta/core';
import { GebetaMapContext } from './context/MapContext';
import { createPlatform } from './adapters';
import { ClusteringManager } from './Clustering/ClusteringManager';

import 'maplibre-gl/dist/maplibre-gl.css';

export type GebetaMapProps = API.Components.Types.GebetaMapProps;
export type GebetaMapRef = MapLibreMap;

const DEFAULT_STYLE_URL = 'https://tiles.gebeta.app/styles/standard/style.json';

/**
 * Main React component for rendering a Gebeta map.
 *
 * Manages the MapLibre GL map lifecycle: creates the map on mount, tears it down
 * on unmount, and exposes a React context that child components can consume via
 * `useGebetaMap()`.
 *
 * @example
 * ```jsx
 * import { GebetaMap } from '@gebeta/react';
 *
 * const auth = { accessToken: '...', refreshToken: '...' };
 * const style = { width: '100vw', height: '100vh' };
 *
 * function App() {
 *   return (
 *     <div style={style}>
 *       <GebetaMap
 *         auth={auth}
 *         center={[38.74, 9.02]}
 *         zoom={12}
 *         onLoad={(map) => console.log('Map ready', map)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
function GebetaMapImpl(
  {
    apiKey,
    auth: authProp,
    styleUrl,
    style: styleProp,
    clustering,
    onLoad,
    onError,
    children,
    navigationControl = false,
    navigationControlPosition = 'top-right',
    ...rest
  }: GebetaMapProps,
  ref: Ref<GebetaMapRef>
): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [contextValue, setContextValue] = useState<{
    platform: import('./adapters/createPlatform').PlatformContext;
    clusteringManager: ClusteringManager | null;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useImperativeHandle(ref, () => mapRef.current as MapLibreMap, [contextValue]);

  const auth = useMemo(
    () => resolveAuth({ apiKey, auth: authProp }),
    [apiKey, authProp?.accessToken, authProp?.refreshToken]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoadError(null);
    const resolvedStyle = styleProp || styleUrl || DEFAULT_STYLE_URL;
    const transformTile = createTileTransform(auth);

    const map = new maplibre.Map({
      container,
      style: resolvedStyle,
      attributionControl: false,
      ...rest,
      transformRequest: (url: string, _resourceType: string) => {
        if (url.startsWith('https://tiles.gebeta.app')) {
          return transformTile(url);
        }
        return { url };
      },
    });
    mapRef.current = map;

    const platform = createPlatform(map);

    if (navigationControl && platform.mapAdapter.addControl) {
      platform.mapAdapter.addControl(new maplibre.NavigationControl(), navigationControlPosition);
    }

    const onStyleLoad = () => {
      let clusteringManager: ClusteringManager | null = null;
      if (clustering?.enabled) {
        clusteringManager = new ClusteringManager(
          platform.mapAdapter,
          platform.markerFactory,
          platform.popupFactory,
          clustering
        );
      }
      setContextValue({ platform, clusteringManager });
      onLoad?.({ clustering: clusteringManager });
    };

    if (map.isStyleLoaded()) {
      onStyleLoad();
    } else {
      map.once('style.load', onStyleLoad);
    }

    map.on('error', (...args: unknown[]) => {
      const e = args[0] as { error?: Error };
      const err = e?.error ?? new Error('Map error');
      setLoadError(err.message);
      onError?.(err);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setContextValue(null);
    };
  }, [auth]);

  return (
    <GebetaMapContext.Provider value={contextValue}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
        {!contextValue ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f0f0f0',
              pointerEvents: 'none',
              padding: 20,
            }}
          >
            {loadError ? (
              <>
                <span style={{ color: '#c00', marginBottom: 8 }}>Error: {loadError}</span>
                <span style={{ fontSize: 12, color: '#666' }}>
                  Set VITE_GEBETA_API_KEY in .env for Gebeta tiles.
                </span>
              </>
            ) : (
              'Loading map...'
            )}
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>{children}</div>
          </div>
        )}
      </div>
    </GebetaMapContext.Provider>
  );
}

export const GebetaMap = forwardRef<GebetaMapRef, GebetaMapProps>(GebetaMapImpl);
