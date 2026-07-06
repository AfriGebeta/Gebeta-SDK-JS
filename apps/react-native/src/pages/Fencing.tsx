/**
 * Fencing demo.
 *
 * Tap "Draw" then tap the map to drop fence points; a dashed outline follows. Tap the first
 * point (or "Close") once you have 3+ points to close the polygon into a filled geofence. The
 * fence CRUD + geometry is core's FenceManager; rendering is the RN FenceManager (fill/line
 * layers via the declarative store).
 */

import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GebetaMap, useFencing } from '@gebeta/react-native';
import { authProps, type Auth } from '../config';

export default function Fencing({ auth }: { auth: Auth }) {
  return (
    <GebetaMap
      {...authProps(auth)}
      center={[38.7685, 9.0161]}
      zoom={13}
      style={styles.map}
    >
      <FencingPanel />
    </GebetaMap>
  );
}

function FencingPanel() {
  const { fencing } = useFencing({ proximityThresholdMeters: 50 });
  const [drawing, setDrawing] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const [fenceCount, setFenceCount] = useState(0);

  const startDraw = useCallback(() => {
    if (!fencing) return;
    fencing.startDrawing();
    setDrawing(true);
    setPointCount(0);
    // Poll the point count while drawing so the UI reflects taps (points are added via the
    // map click handler inside the manager).
    const interval = setInterval(() => {
      setPointCount(fencing.getCurrentFencePoints().length);
      if (!fencing.isDrawingFence()) {
        clearInterval(interval);
        setDrawing(false);
        setFenceCount(fencing.getFences().length);
      }
    }, 300);
  }, [fencing]);

  const closeFence = useCallback(() => {
    if (!fencing) return;
    const fence = fencing.closeFence();
    setDrawing(false);
    if (fence) setFenceCount(fencing.getFences().length);
  }, [fencing]);

  const clearAll = useCallback(() => {
    fencing?.clearAllFences();
    setDrawing(false);
    setPointCount(0);
    setFenceCount(0);
  }, [fencing]);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Geofencing</Text>
      <View style={styles.row}>
        <Btn
          label="Draw"
          active={drawing}
          disabled={drawing}
          onPress={startDraw}
        />
        <Btn
          label="Close"
          primary
          disabled={!drawing || pointCount < 3}
          onPress={closeFence}
        />
        <Btn label="Clear" onPress={clearAll} />
      </View>
      <Text style={styles.meta}>
        {drawing
          ? `Drawing: ${pointCount} point${pointCount === 1 ? '' : 's'}`
          : `Fences: ${fenceCount}`}
      </Text>
      <Text style={styles.hint}>
        {drawing
          ? 'Tap the map to add points. Tap the first point or "Close" (3+ points) to finish.'
          : 'Tap "Draw", then tap the map to outline a geofence.'}
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
  meta: { fontSize: 13, color: '#222' },
  hint: { fontSize: 12, color: '#666' },
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
