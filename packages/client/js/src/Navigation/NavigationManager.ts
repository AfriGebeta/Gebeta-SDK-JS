import { NavigationManager as CoreNavigationManager } from '@gebeta/core';
import { API, ValidationError } from '@gebeta/api';

type AuthParam = API.Auth.Types.AuthParam;

type IMapAdapter = API.Platform.Types.IMapAdapter;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type ILocationProvider = API.Platform.Types.ILocationProvider;
type IMarker = API.Platform.Types.IMarker;

type RouteData = API.Routing.Types.RouteData;
type NavigationManagerOptions = API.Navigation.Types.ManagerOptions;
type NavigationStartOptions = API.Navigation.Types.StartOptions;

/**
 * Browser navigation manager — wraps the core NavigationManager and adds
 * map rendering: a live location marker and a camera that follows the driver.
 *
 * Access via `sdk.navigation` after calling `sdk.init()`.
 *
 * @example
 * ```ts
 * const route = await sdk.getDirections(origin, destination);
 * sdk.displayRoute(route);
 *
 * sdk.navigation.on('progress', e => console.log('remaining:', e.remainingDistance));
 * sdk.navigation.on('arrive', () => console.log('Arrived!'));
 *
 * sdk.navigation.start(route, { userId: 'user-123' }, new BrowserLocationProvider());
 * ```
 */
export class NavigationManager {
  private readonly core: CoreNavigationManager;
  private readonly mapAdapter: IMapAdapter;
  private readonly markerFactory: IMarkerFactory;
  private locationMarker: IMarker | null = null;
  private isFollowingLocation = false;
  private lastKnownLocation: API.Platform.Types.LocationData | null = null;

  /**
   * Creates a new NavigationManager instance.
   * @param auth - API key or service key authentication input
   * @param mapAdapter - Map adapter for camera control
   * @param markerFactory - Marker factory for location marker
   * @param options - Configuration options for navigation behavior
   * @throws {ValidationError} If apiKey, mapAdapter, or markerFactory is missing
   */
  constructor(
    auth: AuthParam,
    mapAdapter: IMapAdapter,
    markerFactory: IMarkerFactory,
    options: NavigationManagerOptions = {},
    clientId?: string
  ) {
    if (!mapAdapter) {
      throw new ValidationError('Map adapter is required for NavigationManager', 'mapAdapter');
    }
    if (!markerFactory) {
      throw new ValidationError(
        'Marker factory is required for NavigationManager',
        'markerFactory'
      );
    }

    this.mapAdapter = mapAdapter;
    this.markerFactory = markerFactory;
    this.core = new CoreNavigationManager(auth, options, clientId);

    this.setupEventListeners();
  }

  /**
   * Starts navigation along the provided route.
   * @param route - Route data containing geometry and instructions
   * @param startOptions - Options for starting navigation (userId, role, precision)
   * @param locationProvider - Provider that supplies location data
   */
  start(
    route: RouteData,
    startOptions: NavigationStartOptions,
    locationProvider: ILocationProvider
  ): void {
    this.createLocationMarker(route);
    this.isFollowingLocation = true;

    const wrappedLocationProvider = this.createWrappedLocationProvider(locationProvider);
    this.core.start(route, startOptions, wrappedLocationProvider);
  }

  /**
   * Creates a wrapped location provider that updates the location marker.
   * @param locationProvider - Original location provider
   * @returns Wrapped location provider
   * @private
   */
  private createWrappedLocationProvider(locationProvider: ILocationProvider): ILocationProvider {
    return {
      start: (onLocation: (location: API.Platform.Types.LocationData) => void) => {
        locationProvider.start((location: API.Platform.Types.LocationData) => {
          this.lastKnownLocation = location;
          this.updateLocationMarker(location);
          this.updateCamera();
          onLocation(location);
        });
      },
      stop: () => {
        locationProvider.stop();
      },
    };
  }

  /**
   * Stops navigation and removes location marker.
   */
  stop(): void {
    this.core.stop();
    this.removeLocationMarker();
    this.isFollowingLocation = false;
  }

  /**
   * Sets up event listeners for camera updates.
   * @private
   */
  private setupEventListeners(): void {
    this.core.on('progress', (event: API.Navigation.Events.ProgressEvent) => {
      this.updateCamera(event);
    });

    this.core.on('stepchange', () => {
      this.updateCamera();
    });
  }

  /**
   * Creates a location marker on the map.
   * @param route - Route data to get initial position from
   * @private
   */
  private createLocationMarker(route: RouteData): void {
    if (this.locationMarker) {
      return;
    }

    let initialPosition: { lng: number; lat: number };
    if (route?.origin?.lng != null && route.origin.lat != null) {
      initialPosition = { lng: route.origin.lng, lat: route.origin.lat };
    } else if (route?.geometry?.coordinates && route.geometry.coordinates.length > 0) {
      const firstCoord = route.geometry.coordinates[0];
      initialPosition = { lng: firstCoord[0], lat: firstCoord[1] };
    } else {
      initialPosition = { lng: 0, lat: 0 };
    }

    this.locationMarker = this.markerFactory.createMarker({
      className: 'gebeta-navigation-location-marker',
      size: [20, 20],
    });

    if (this.locationMarker) {
      this.locationMarker.setLngLat(initialPosition);
      this.locationMarker.addTo(this.mapAdapter);
    }
  }

  /**
   * Removes the location marker from the map.
   * @private
   */
  private removeLocationMarker(): void {
    if (this.locationMarker) {
      this.locationMarker.remove();
      this.locationMarker = null;
    }
  }

  /**
   * Updates the location marker position.
   * @param location - Current location data
   * @private
   */
  private updateLocationMarker(location: API.Platform.Types.LocationData): void {
    if (this.locationMarker) {
      this.locationMarker.setLngLat({ lng: location.lng, lat: location.lat });
    }
  }

  /**
   * Updates camera position to follow navigation with driver POV tilt.
   * @param event - Optional progress event with step information
   * @private
   */
  private updateCamera(event?: API.Navigation.Events.ProgressEvent): void {
    if (!this.isFollowingLocation || !this.locationMarker || !this.lastKnownLocation) {
      return;
    }

    const currentRoute = this.core.getCurrentRoute();
    if (!currentRoute) {
      return;
    }

    let bearing = 0;
    if (this.lastKnownLocation.heading != null && this.lastKnownLocation.heading !== 0) {
      bearing = this.lastKnownLocation.heading;
    } else if (event?.currentStep?.coord) {
      const from = { lng: this.lastKnownLocation.lng, lat: this.lastKnownLocation.lat };
      const to = { lng: event.currentStep.coord[0], lat: event.currentStep.coord[1] };
      bearing = this.calculateBearing(from, to);
    }

    this.mapAdapter.easeTo({
      center: [this.lastKnownLocation.lng, this.lastKnownLocation.lat],
      zoom: 17,
      pitch: 50,
      bearing,
      duration: 300,
    });
  }

  /**
   * Calculates bearing between two points for camera orientation.
   * @param from - Starting point
   * @param to - Destination point
   * @returns Bearing in degrees
   * @private
   */
  private calculateBearing(
    from: { lng: number; lat: number },
    to: { lng: number; lat: number }
  ): number {
    const lat1 = (from.lat * Math.PI) / 180;
    const lat2 = (to.lat * Math.PI) / 180;
    const dLng = ((to.lng - from.lng) * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  }

  /**
   * Gets the current route being navigated.
   * @returns Current route data or null if not navigating
   */
  getCurrentRoute(): RouteData | null {
    return this.core.getCurrentRoute();
  }

  /**
   * Gets the current step index in the route instructions.
   * @returns Current step index
   */
  getCurrentStepIndex(): number {
    return this.core.getCurrentStepIndex();
  }

  /**
   * Checks if navigation is currently active.
   * @returns True if navigating, false otherwise
   */
  isNavigating(): boolean {
    return this.core.isNavigating();
  }

  on<K extends Parameters<CoreNavigationManager['on']>[0]>(
    event: K,
    callback: Parameters<CoreNavigationManager['on']>[1]
  ): void {
    this.core.on(event, callback as never);
  }

  off<K extends Parameters<CoreNavigationManager['off']>[0]>(
    event: K,
    callback: Parameters<CoreNavigationManager['off']>[1]
  ): void {
    this.core.off(event, callback as never);
  }
}
