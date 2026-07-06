/**
 * Clustering demo.
 *
 * Seeds a grid of markers around Addis Ababa and lets the clustering manager group them. Zoom
 * out to see count-circle clusters; zoom in (or tap a cluster) to expand into individual pins.
 */

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GebetaMap, useClustering } from '@gebeta/react-native';
import type { API } from '@gebeta/api';
import { authProps, type Auth } from '../config';

const MARKER_ICON = 'https://cdn-icons-png.flaticon.com/512/484/484167.png';

/** Build a scattered grid of markers around a center point. */
function makeMarkers(): API.Overlay.Types.MarkerData[] {
  const center = { lng: 38.7685, lat: 9.0161 };
  const markers: API.Overlay.Types.MarkerData[] = [];
  let id = 0;
  for (let i = -4; i <= 4; i++) {
    for (let j = -4; j <= 4; j++) {
      markers.push({
        id: `m-${id++}`,
        lngLat: { lng: center.lng + i * 0.012, lat: center.lat + j * 0.012 },
        imageUrl: MARKER_ICON,
        size: [26, 26],
      });
    }
  }
  return markers;
}

export default function Clustering({ auth }: { auth: Auth }) {
  return (
    <GebetaMap
      {...authProps(auth)}
      center={[38.7685, 9.0161]}
      zoom={11}
      style={styles.map}
    >
      <ClusteringPanel />
    </GebetaMap>
  );
}

function ClusteringPanel() {
  const markers = useMemo(() => makeMarkers(), []);
  useClustering(
    { enabled: true, radius: 60, maxZoom: 16, showClusterCount: true },
    markers,
  );

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Clustering</Text>
      <Text style={styles.hint}>
        {markers.length} markers. Zoom out to cluster; tap a cluster to expand.
      </Text>
    </View>
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
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  title: { fontSize: 16, fontWeight: '700' },
  hint: { fontSize: 12, color: '#666' },
});
