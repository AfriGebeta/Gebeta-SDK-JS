import { NavigationManager as CoreNavigationManager } from '@gebeta/core';
import type { ResolvedAuth } from '@gebeta/core';
import type { API } from '@gebeta/api';

type IMapAdapter = API.Platform.Types.IMapAdapter;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type ILocationProvider = API.Platform.Types.ILocationProvider;
type IMarker = API.Platform.Types.IMarker;
type LocationData = API.Platform.Types.LocationData;

type RouteData = API.Routing.Types.RouteData;
type NavigationManagerOptions = API.Navigation.Types.ManagerOptions;
type NavigationStartOptions = API.Navigation.Types.StartOptions;

/**
 * Public, payload-typed navigation event map. Consumers get `nav.on('progress', e => …)` with
 * `e` correctly typed, without reaching into core's private event map (the web wrapper used
 * `Parameters<Core['on']>`, which leaks internal types).
 */
export interface NavigationEventMap {
  start: (event: API.Navigation.Events.StartEvent) => void;
  stop: (event: API.Navigation.Events.StopEvent) => void;
  progress: (event: API.Navigation.Events.ProgressEvent) => void;
  stepchange: (event: API.Navigation.Events.StepChangeEvent) => void;
  offroute: (event: API.Navigation.Events.OffRouteEvent) => void;
  arrive: (event: API.Navigation.Events.ArriveEvent) => void;
  error: (error: Error) => void;
}

const LOCATION_MARKER_ICON = 'https://cdn-icons-png.flaticon.com/512/149/149060.png';

/**
 * React Native turn-by-turn navigation manager. Wraps the platform-agnostic core
 * `NavigationManager` (off-route detection, rerouting, progress/step/arrive events) and adds map
 * rendering: a live location marker and a driver-POV camera that follows the device (`easeTo`
 * with zoom/pitch/bearing). Ported from the web `@gebeta/js` NavigationManager.
 *
 * Feed it the RN `ILocationProvider` (device GPS) via `start()`.
 */
export class NavigationManager {
  private readonly core: CoreNavigationManager;
  private locationMarker: IMarker | null = null;
  private isFollowingLocation = false;
  private lastKnownLocation: LocationData | null = null;

  constructor(
    auth: ResolvedAuth,
    private readonly mapAdapter: IMapAdapter,
    private readonly markerFactory: IMarkerFactory,
    options: NavigationManagerOptions = {},
    clientId?: string
  ) {
    this.core = new CoreNavigationManager(auth, options, clientId);
    this.setupEventListeners();
  }

  /**
   * Start navigation along `route`. `startOptions.userId` is required by the core engine.
   * `locationProvider` supplies device fixes (use the platform's `locationProvider`).
   */
  start(
    route: RouteData,
    startOptions: NavigationStartOptions,
    locationProvider: ILocationProvider
  ): void {
    this.createLocationMarker(route);
    this.isFollowingLocation = true;
    this.core.start(route, startOptions, this.wrapLocationProvider(locationProvider));
  }

  stop(): void {
    this.core.stop();
    this.removeLocationMarker();
    this.isFollowingLocation = false;
    this.lastKnownLocation = null;
  }

  getCurrentRoute(): RouteData | null {
    return this.core.getCurrentRoute();
  }

  getCurrentStepIndex(): number {
    return this.core.getCurrentStepIndex();
  }

  isNavigating(): boolean {
    return this.core.isNavigating();
  }

  on<K extends keyof NavigationEventMap>(event: K, callback: NavigationEventMap[K]): void {
    this.core.on(event, callback as never);
  }

  off<K extends keyof NavigationEventMap>(event: K, callback: NavigationEventMap[K]): void {
    this.core.off(event, callback as never);
  }

  /**
   * Wrap the location provider so each fix also moves the marker and camera before forwarding to
   * the core engine (which computes progress/off-route/arrival).
   */
  private wrapLocationProvider(locationProvider: ILocationProvider): ILocationProvider {
    return {
      start: (onLocation: (location: LocationData) => void) => {
        locationProvider.start((location: LocationData) => {
          this.lastKnownLocation = location;
          this.updateLocationMarker(location);
          this.updateCamera();
          onLocation(location);
        });
      },
      stop: () => locationProvider.stop(),
    };
  }

  private setupEventListeners(): void {
    this.core.on('progress', (event: API.Navigation.Events.ProgressEvent) => {
      this.updateCamera(event);
    });
    this.core.on('stepchange', () => this.updateCamera());
  }

  private createLocationMarker(route: RouteData): void {
    if (this.locationMarker) return;

    let initial: { lng: number; lat: number };
    if (route?.origin?.lng != null && route.origin.lat != null) {
      initial = { lng: route.origin.lng, lat: route.origin.lat };
    } else if (route?.geometry?.coordinates?.length) {
      const [lng, lat] = route.geometry.coordinates[0];
      initial = { lng, lat };
    } else {
      initial = { lng: 0, lat: 0 };
    }

    this.locationMarker = this.markerFactory.createMarker({
      imageUrl: LOCATION_MARKER_ICON,
      size: [28, 28],
      anchor: 'center',
    });
    this.locationMarker?.setLngLat(initial).addTo(this.mapAdapter);
  }

  private removeLocationMarker(): void {
    this.locationMarker?.remove();
    this.locationMarker = null;
  }

  private updateLocationMarker(location: LocationData): void {
    this.locationMarker?.setLngLat({ lng: location.lng, lat: location.lat });
  }

  private updateCamera(event?: API.Navigation.Events.ProgressEvent): void {
    if (!this.isFollowingLocation || !this.locationMarker || !this.lastKnownLocation) return;
    if (!this.core.getCurrentRoute()) return;

    let bearing = 0;
    if (this.lastKnownLocation.heading != null && this.lastKnownLocation.heading !== 0) {
      bearing = this.lastKnownLocation.heading;
    } else if (event?.currentStep?.coord) {
      bearing = calculateBearing(
        { lng: this.lastKnownLocation.lng, lat: this.lastKnownLocation.lat },
        { lng: event.currentStep.coord[0], lat: event.currentStep.coord[1] }
      );
    }

    this.mapAdapter.easeTo({
      center: [this.lastKnownLocation.lng, this.lastKnownLocation.lat],
      zoom: 17,
      pitch: 50,
      bearing,
      duration: 300,
    });
  }
}

function calculateBearing(
  from: { lng: number; lat: number },
  to: { lng: number; lat: number }
): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
