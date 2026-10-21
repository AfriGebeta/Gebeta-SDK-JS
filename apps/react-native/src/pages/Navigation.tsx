/**
 * Navigation demo — turn-by-turn along a route with a simulated GPS driver.
 *
 * Flow: tap Set Origin/Dest → tap map → Get Route (draws it) → Start. A simulated location
 * provider walks the route coordinates; the NavigationManager moves the location marker, follows
 * with a driver-POV camera, and emits progress/step/arrive events shown in the panel.
 *
 * (Real device GPS would use `platform.locationProvider` instead of the simulator — but an
 * emulator has no moving fix, so the demo simulates movement along the fetched route.)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  GebetaMap,
  useGebetaMapContextOrNull,
  useDirections,
  useNavigation,
  createSimulatedLocationProvider,
} from '@gebeta/react-native';
import type { API } from '@gebeta/api';
import { authProps, type Auth } from '../config';

const ORIGIN_ICON = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
const DEST_ICON = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';

type LngLat = API.Common.Types.LngLat;
type RouteData = API.Routing.Types.RouteData;

export default function Navigation({ auth }: { auth: Auth }) {
  return (
    <GebetaMap
      {...authProps(auth)}
      center={[38.7685, 9.0161]}
      zoom={13}
      style={styles.map}
    >
      <NavigationPanel auth={auth} />
    </GebetaMap>
  );
}

function NavigationPanel({ auth }: { auth: Auth }) {
  const ctx = useGebetaMapContextOrNull();
  const platform = ctx?.platform ?? null;
  const { directions } = useDirections(authProps(auth));
  const { navigation, isNavigating, progress, arrived } = useNavigation(
    authProps(auth),
    {
      autoReroute: true,
    },
  );

  const [mode, setMode] = useState<'origin' | 'destination' | null>(null);
  const [origin, setOrigin] = useState<LngLat | null>(null);
  const [dest, setDest] = useState<LngLat | null>(null);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);

  const modeRef = useRef(mode);
  modeRef.current = mode;
  const speedRef = useRef(4);

  type Marker = ReturnType<
    NonNullable<typeof platform>['markerFactory']['createMarker']
  >;
  const originMarkerRef = useRef<Marker>(null);
  const destMarkerRef = useRef<Marker>(null);

  const dropMarker = useCallback(
    (lng: number, lat: number, iconUrl: string): Marker => {
      if (!platform) return null;
      return (
        platform.markerFactory
          .createMarker({ imageUrl: iconUrl, size: [30, 30], anchor: 'bottom' })
          ?.setLngLat({ lng, lat })
          .addTo(platform.mapAdapter) ?? null
      );
    },
    [platform],
  );

  // Pick origin/dest by tapping the map.
  useEffect(() => {
    if (!platform) return;
    const onClick = (...args: unknown[]) => {
      if (navigation?.isNavigating()) return;
      const e = args[0] as { lngLat: LngLat };
      const point = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      if (modeRef.current === 'origin') {
        originMarkerRef.current?.remove();
        originMarkerRef.current = dropMarker(point.lng, point.lat, ORIGIN_ICON);
        setOrigin(point);
        setMode(null);
      } else if (modeRef.current === 'destination') {
        destMarkerRef.current?.remove();
        destMarkerRef.current = dropMarker(point.lng, point.lat, DEST_ICON);
        setDest(point);
        setMode(null);
      }
    };
    platform.mapAdapter.on('click', onClick);
    return () => {
      platform.mapAdapter.off('click', onClick);
    };
  }, [platform, dropMarker, navigation]);

  const getRoute = useCallback(async () => {
    if (!directions || !origin || !dest) return;
    setLoading(true);
    try {
      const r = await directions.getDirections(origin, dest, {});
      directions.displayRoute(r, { showMarkers: false });
      setRoute(r);
    } catch (err) {
      console.warn(
        'Route failed:',
        err instanceof Error ? err.message : String(err),
      );
    } finally {
      setLoading(false);
    }
  }, [directions, origin, dest]);

  const startNav = useCallback(() => {
    if (!navigation || !route) return;
    const coords = route.geometry?.coordinates ?? [];
    if (coords.length < 2) return;
    const provider = createSimulatedLocationProvider(
      coords,
      () => speedRef.current,
    );
    navigation.start(route, { userId: `demo-${Date.now()}` }, provider);
  }, [navigation, route]);

  const stopNav = useCallback(() => navigation?.stop(), [navigation]);

  const clearAll = useCallback(() => {
    navigation?.stop();
    directions?.clearRoute();
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    destMarkerRef.current?.remove();
    destMarkerRef.current = null;
    setOrigin(null);
    setDest(null);
    setRoute(null);
  }, [navigation, directions]);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Navigation</Text>

      {!isNavigating ? (
        <>
          <View style={styles.row}>
            <Btn
              label="Set Origin"
              active={mode === 'origin'}
              onPress={() => setMode(m => (m === 'origin' ? null : 'origin'))}
            />
            <Btn
              label="Set Dest"
              active={mode === 'destination'}
              onPress={() =>
                setMode(m => (m === 'destination' ? null : 'destination'))
              }
            />
          </View>
          <View style={styles.row}>
            <Btn
              label={loading ? 'Routing…' : 'Get Route'}
              disabled={!origin || !dest || loading}
              onPress={getRoute}
            />
            <Btn label="Start" primary disabled={!route} onPress={startNav} />
            <Btn label="Clear" onPress={clearAll} />
          </View>
          {arrived && <Text style={styles.arrived}>✓ Arrived!</Text>}
          <Text style={styles.hint}>
            Set origin & destination, Get Route, then Start to simulate driving.
          </Text>
        </>
      ) : (
        <>
          {progress?.currentStep?.instruction && (
            <Text style={styles.instruction}>
              {progress.currentStep.instruction}
            </Text>
          )}
          <Text style={styles.meta}>
            {formatDistance(progress?.remainingDistance)} left ·{' '}
            {formatDuration(progress?.remainingDuration)}
          </Text>
          {progress?.progress != null && (
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progress.progress, 100)}%` },
                ]}
              />
            </View>
          )}
          <Btn label="Stop" onPress={stopNav} />
        </>
      )}
    </View>
  );
}

function formatDistance(meters?: number): string {
  if (meters == null) return '—';
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
}

function formatDuration(duration?: number | string): string {
  if (duration == null) return '—';
  if (typeof duration === 'string') return duration;
  const min = Math.round(duration / 60);
  return min >= 1 ? `${min} min` : `${Math.round(duration)} s`;
}

function Btn({
  label,
  onPress,
  active,
  primary,
  disabled,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        (active || primary) && styles.btnActive,
        disabled && styles.btnDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.btnText, (active || primary) && styles.btnTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  panel: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  title: { fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  instruction: { fontSize: 15, fontWeight: '600', color: '#111' },
  meta: { fontSize: 13, color: '#333' },
  arrived: { fontSize: 14, fontWeight: '700', color: '#2e7d32' },
  hint: { fontSize: 12, color: '#666' },
  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: 6, backgroundColor: '#007cbf' },
  btn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  btnActive: { backgroundColor: '#007cbf' },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 13, fontWeight: '600', color: '#333' },
  btnTextActive: { color: '#fff' },
});
