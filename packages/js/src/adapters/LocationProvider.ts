import { API } from '@gebeta/maps-api';

type ILocationProvider = API.Platform.Types.ILocationProvider;
type LocationData = API.Platform.Types.LocationData;
type LocationProviderOptions = API.Platform.Types.LocationProviderOptions;

export class BrowserLocationProvider implements ILocationProvider {
  private static readonly instances = new Map<string, BrowserLocationProvider>();

  private watchId: number | null = null;
  private onLocationCallback: ((location: LocationData) => void) | null = null;
  private readonly positionOptions: PositionOptions;

  private constructor(options?: LocationProviderOptions) {
    const opts = { ...API.Platform.Constants.DEFAULT_LOCATION_PROVIDER_OPTIONS, ...options };
    this.positionOptions = {
      enableHighAccuracy: opts.enableHighAccuracy,
      timeout: opts.timeout,
      maximumAge: opts.maximumAge,
    };
  }

  static getInstance(options?: LocationProviderOptions): BrowserLocationProvider {
    const key = JSON.stringify({ ...API.Platform.Constants.DEFAULT_LOCATION_PROVIDER_OPTIONS, ...options });
    let instance = BrowserLocationProvider.instances.get(key);
    if (!instance) {
      instance = new BrowserLocationProvider(options);
      BrowserLocationProvider.instances.set(key, instance);
    }
    return instance;
  }

  start(onLocation: (location: LocationData) => void): void {
    if (this.watchId !== null) {
      this.stop();
    }

    this.onLocationCallback = onLocation;

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

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
      this.positionOptions
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
