/**
 * Directions demo — the end-to-end test for the RN declarative map store (Step 3).
 *
 * Flow:
 *   1. Tap the map to set origin, then destination (map 'click' event from the RN adapter).
 *   2. Fetch a route with core's platform-agnostic `DirectionsManager`.
 *   3. Render the route line by driving the RN `MapAdapter` with `addSource` / `addLayer` /
 *      `getSource().setData` — exactly the calls the web route-layer helper makes.
 *
 * If the blue line appears on the native map, the declarative store + renderer bridge works:
 * imperative adapter calls became `<ShapeSource>`/`<LineLayer>` children.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GebetaMap, useGebetaMapContextOrNull } from '@gebeta/react-native';
import type { API } from '@gebeta/api';
import { DirectionsManager, resolveAuth } from '@gebeta/core';
import { authProps, type Auth } from '../config';

const ROUTE_SOURCE_ID = 'gebeta-route';
const ROUTE_LAYER_ID = 'gebeta-route';

const DEFAULT_ROUTE_STYLE = {
  'line-color': '#007cbf',
  'line-width': 4,
  'line-opacity': 0.8,
  'line-join': 'round' as const,
  'line-cap': 'round' as const,
};

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

  const directions = useMemo(() => {
    if (!platform) return null;
    return new DirectionsManager(
      resolveAuth({
        apiKey: auth.type === 'api_key' ? auth.apiKey : undefined,
      }),
    );
  }, [platform, auth]);

  // Bind the map 'click' handler to the live mapAdapter. Using an effect (not a render-body
  // ref guard) ensures we bind to the CURRENT adapter and clean up if it changes.
  useEffect(() => {
    if (!platform) return;
    const onClick = (...args: unknown[]) => {
      const e = args[0] as { lngLat: LngLat };
      const point = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      if (modeRef.current === 'origin') {
        setOrigin(point);
        setMode(null);
      } else if (modeRef.current === 'destination') {
        setDest(point);
        setMode(null);
      }
    };
    platform.mapAdapter.on('click', onClick);
    return () => {
      platform.mapAdapter.off('click', onClick);
    };
  }, [platform]);

  const drawRoute = useCallback(
    (coordinates: [number, number][]) => {
      if (!platform) return;
      const adapter = platform.mapAdapter;
      if (!adapter.getSource(ROUTE_SOURCE_ID)) {
        adapter.addSource(ROUTE_SOURCE_ID, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates },
          },
        });
        adapter.addLayer({
          id: ROUTE_LAYER_ID,
          type: 'line',
          source: ROUTE_SOURCE_ID,
          layout: {
            'line-join': DEFAULT_ROUTE_STYLE['line-join'],
            'line-cap': DEFAULT_ROUTE_STYLE['line-cap'],
            visibility: 'visible',
          },
          paint: {
            'line-color': DEFAULT_ROUTE_STYLE['line-color'],
            'line-width': DEFAULT_ROUTE_STYLE['line-width'],
            'line-opacity': DEFAULT_ROUTE_STYLE['line-opacity'],
          },
        });
      } else {
        const source = adapter.getSource(ROUTE_SOURCE_ID) as {
          setData?: (d: unknown) => void;
        };
        source.setData?.({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates },
        });
      }
    },
    [platform],
  );

  const getDirections = useCallback(async () => {
    if (!directions || !origin || !dest) return;
    setLoading(true);
    try {
      const route = await directions.getDirections(origin, dest, {});
      drawRoute(route.geometry?.coordinates ?? []);
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
  }, [directions, origin, dest, drawRoute]);

  const clearAll = useCallback(() => {
    platform?.mapAdapter.removeLayer(ROUTE_LAYER_ID);
    platform?.mapAdapter.removeSource(ROUTE_SOURCE_ID);
    setOrigin(null);
    setDest(null);
    setInfo(null);
  }, [platform]);

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
