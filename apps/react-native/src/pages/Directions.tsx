/**
 * Directions demo.
 *
 * Flow:
 *   1. Tap the map to set origin, then destination (map 'click' event drops a pick-marker).
 *   2. `useDirections()` gives a DirectionsManager wired to this map's platform.
 *   3. Get Directions calls `directions.getDirections()` + `directions.displayRoute()`, which
 *      draws the route line (via the declarative MapSpecStore) and origin/destination markers,
 *      and fits the camera to the route.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  GebetaMap,
  useGebetaMapContextOrNull,
  useDirections,
} from '@gebeta/react-native';
import type { API } from '@gebeta/api';
import { authProps, type Auth } from '../config';

const ORIGIN_ICON = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
const DEST_ICON = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';

type LngLat = API.Common.Types.LngLat;

export default function Directions({ auth }: { auth: Auth }) {
  return (
    <GebetaMap
      {...authProps(auth)}
      center={[38.7685, 9.0161]}
      zoom={12}
      style={styles.map}
    >
      <DirectionsPanel auth={auth} />
    </GebetaMap>
  );
}

/** Rendered as a child of <GebetaMap>, so it can read the platform from context. */
function DirectionsPanel({ auth }: { auth: Auth }) {
  const ctx = useGebetaMapContextOrNull();
  const platform = ctx?.platform ?? null;

  const [mode, setMode] = useState<'origin' | 'destination' | null>(null);
  const [origin, setOrigin] = useState<LngLat | null>(null);
  const [dest, setDest] = useState<LngLat | null>(null);
  const [info, setInfo] = useState<{
    distance?: string | number;
    duration?: string | number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const modeRef = useRef(mode);
  modeRef.current = mode;

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

  // The DirectionsManager, wired to this <GebetaMap>'s platform (map adapter + marker factory).
  const { directions } = useDirections(authProps(auth));

  // Bind the map 'click' handler to the live mapAdapter. Using an effect (not a render-body
  // ref guard) ensures we bind to the CURRENT adapter and clean up if it changes.
  useEffect(() => {
    if (!platform) return;
    const onClick = (...args: unknown[]) => {
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
  }, [platform, dropMarker]);

  const getDirections = useCallback(async () => {
    if (!directions || !origin || !dest) return;
    setLoading(true);
    try {
      const route = await directions.getDirections(origin, dest, {});
      // The manager draws the route line and its own origin/destination markers, so remove the
      // temporary pick-markers first to avoid duplicates.
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      destMarkerRef.current?.remove();
      destMarkerRef.current = null;
      directions.displayRoute(route, { showMarkers: true });
      setInfo({
        distance: route.distance ?? undefined,
        duration: route.duration ?? undefined,
      });
    } catch (err) {
      setInfo({
        distance: `Error: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setLoading(false);
    }
  }, [directions, origin, dest]);

  const clearAll = useCallback(() => {
    directions?.clearRoute();
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    destMarkerRef.current?.remove();
    destMarkerRef.current = null;
    setOrigin(null);
    setDest(null);
    setInfo(null);
  }, [directions]);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Directions</Text>
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
      <Text style={styles.coords}>
        Origin:{' '}
        {origin ? `${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}` : '—'}
      </Text>
      <Text style={styles.coords}>
        Dest: {dest ? `${dest.lat.toFixed(4)}, ${dest.lng.toFixed(4)}` : '—'}
      </Text>
      <Btn
        label={loading ? 'Loading…' : 'Get Directions'}
        primary
        disabled={!origin || !dest || loading}
        onPress={getDirections}
      />
      <Btn label="Clear" onPress={clearAll} />
      {info && (
        <View style={styles.info}>
          {info.distance != null && (
            <Text style={styles.infoText}>Distance: {info.distance}</Text>
          )}
          {info.duration != null && (
            <Text style={styles.infoText}>Duration: {info.duration}</Text>
          )}
        </View>
      )}
      <Text style={styles.hint}>
        Tap "Set Origin" then the map. Repeat for Dest, then Get Directions.
      </Text>
    </View>
  );
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
  coords: { fontSize: 12, color: '#444' },
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
  info: { marginTop: 4 },
  infoText: { fontSize: 12, color: '#222' },
  hint: { fontSize: 11, color: '#888', marginTop: 4 },
});
