import type { API } from '@gebeta/api';
import { LocationManager, type GeolocationPosition } from '@maplibre/maplibre-react-native';

type ILocationProvider = API.Platform.Types.ILocationProvider;
type LocationData = API.Platform.Types.LocationData;
type LocationProviderOptions = API.Platform.Types.LocationProviderOptions;

/**
 * React Native `ILocationProvider` backed by MapLibre-RN v11's native `LocationManager` (the
 * same location source that powers `<UserLocation>`). Using it avoids pulling in a separate
 * geolocation dependency and reuses the permission plumbing already required for the map.
 *
 * `LocationManager` is a native singleton, so this provider is a thin wrapper: `start` requests
 * permissions, subscribes a listener, and maps each `GeolocationPosition` onto the
 * platform-agnostic `LocationData` shape; `stop` unsubscribes and stops updates when no
 * listeners remain.
 */
export class RNLocationProvider implements ILocationProvider {
  private static instance: RNLocationProvider | null = null;

  private listener: ((location: GeolocationPosition) => void) | null = null;

  static getInstance(_options?: LocationProviderOptions): RNLocationProvider {
    if (!RNLocationProvider.instance) {
      RNLocationProvider.instance = new RNLocationProvider();
    }
    return RNLocationProvider.instance;
  }

  start(onLocation: (location: LocationData) => void): void {
    // Replace any existing subscription so start() is idempotent.
    this.stop();

    const listener = (position: GeolocationPosition) => {
      onLocation(toLocationData(position));
    };
    this.listener = listener;

    // requestPermissions resolves false if denied; on grant, begin native updates.
    void LocationManager.requestPermissions()
      .then(granted => {
        if (!granted || this.listener !== listener) return;
        LocationManager.addListener(listener);
        LocationManager.start();
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.warn('[Gebeta] location permission request failed:', error);
      });
  }

  stop(): void {
    if (this.listener) {
      LocationManager.removeListener(this.listener);
      this.listener = null;
    }
    LocationManager.stop();
  }
}

function toLocationData(position: GeolocationPosition): LocationData {
  const c = position.coords;
  return {
    lat: c.latitude,
    lng: c.longitude,
    accuracy: c.accuracy,
    altitude: c.altitude,
    altitudeAccuracy: c.altitudeAccuracy,
    heading: c.heading,
    speed: c.speed,
    timestamp: position.timestamp,
  };
}
