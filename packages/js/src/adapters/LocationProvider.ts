import type { API } from '@gebeta/maps-api';

type ILocationProvider = API.Platform.Types.ILocationProvider;
type LocationData = API.Platform.Types.LocationData;

export class BrowserLocationProvider implements ILocationProvider {
  private watchId: number | null = null;
  private onLocationCallback: ((location: LocationData) => void) | null = null;

  start(onLocation: (location: LocationData) => void): void {
    if (this.watchId !== null) {
      this.stop();
    }

    this.onLocationCallback = onLocation;

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        if (this.onLocationCallback) {
          this.onLocationCallback({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
        }
      },
      (error: GeolocationPositionError) => {
        console.error('Geolocation error:', error);
      },
      options
    );
  }

  stop(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.onLocationCallback = null;
  }
}
