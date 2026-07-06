/**
 * Location demo — shows the device's live GPS position.
 *
 * Renders MapLibre's `<UserLocation>` dot on the map and reads the stream of fixes via
 * `useUserLocation()` (backed by the RN LocationProvider / native LocationManager). Requires
 * the ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION permissions in the app manifest.
 */

import { StyleSheet, Text, View } from 'react-native';
import { GebetaMap, UserLocation, useUserLocation } from '@gebeta/react-native';
import { authProps, type Auth } from '../config';

export default function Location({ auth }: { auth: Auth }) {
  return (
    <GebetaMap
      {...authProps(auth)}
      center={[38.7685, 9.0161]}
      zoom={13}
      style={styles.map}
    >
      <UserLocation accuracy heading />
      <LocationPanel />
    </GebetaMap>
  );
}

function LocationPanel() {
  const { location } = useUserLocation();

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>My Location</Text>
      {location ? (
        <>
          <Text style={styles.coords}>
            Lat: {location.lat.toFixed(6)} Lng: {location.lng.toFixed(6)}
          </Text>
          {location.accuracy != null && (
            <Text style={styles.meta}>
              Accuracy: ±{Math.round(location.accuracy)} m
            </Text>
          )}
          {location.speed != null && location.speed >= 0 && (
            <Text style={styles.meta}>
              Speed: {location.speed.toFixed(1)} m/s
            </Text>
          )}
        </>
      ) : (
        <Text style={styles.meta}>
          Waiting for GPS fix… (grant location permission)
        </Text>
      )}
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
  coords: { fontSize: 13, color: '#222' },
  meta: { fontSize: 12, color: '#666' },
});
