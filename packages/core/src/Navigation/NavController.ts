import { API, NavigationError, createNavigationError, ValidationError } from '@gebeta/api';
import { EventEmitter } from '../utils/EventEmitter';
import { TrackingClient } from '../Tracking/TrackingClient';
import { HttpTrackingClient } from '../Tracking/HttpTrackingClient';
import {
  nearestPointOnLine,
  calculateRouteDistance,
  calculateProgressAlongRoute,
  findStepIndex,
  type NearestPointResult,
} from './utils';

type RouteData = API.Routing.Types.RouteData;
type NavigationControllerOptions = API.Navigation.Types.ControllerOptions;
type NavigationStartOptions = API.Navigation.Types.StartOptions;
type LocationData = API.Platform.Types.LocationData;
type ILocationProvider = API.Platform.Types.ILocationProvider;
type Precision = (typeof API.Tracking.Enums.Precision)[keyof typeof API.Tracking.Enums.Precision];
type Role = API.Tracking.Types.Role;

type EventHandler = (...args: never[]) => void;

interface NavigationEventMap {
  start: (event: API.Navigation.Events.StartEvent) => void;
  stop: (event: API.Navigation.Events.StopEvent) => void;
  progress: (event: API.Navigation.Events.ProgressEvent) => void;
  stepchange: (event: API.Navigation.Events.StepChangeEvent) => void;
  offroute: (event: API.Navigation.Events.OffRouteEvent) => void;
  arrive: (event: API.Navigation.Events.ArriveEvent) => void;
  error: (error: NavigationError) => void;
  [key: string]: EventHandler;
}

/**
 * Navigation controller for route following and tracking.
 * Platform-agnostic: uses location provider and tracking clients.
 */
export class NavController extends EventEmitter<NavigationEventMap> {
  private route: RouteData | null = null;
  private locationProvider: ILocationProvider | null = null;
  private trackingClient: TrackingClient | HttpTrackingClient | null = null;
  private currentStepIndex = 0;
  private isActive = false;
  private readonly options: Required<
    Pick<
      NavigationControllerOptions,
      'offRouteThresholdMeters' | 'arriveThresholdMeters' | 'autoReroute'
    >
  > &
    Pick<NavigationControllerOptions, 'rerouteFn'>;
  private routeCoordinates: [number, number][] = [];
  private totalRouteDistance = 0;
  private stepDistances: number[] = [];
  private lastLocation: LocationData | null = null;
  private readonly apiKey: string;
  private userId: string = '';
  private role: Role = 'driver';
  private precision: Precision = API.Tracking.Enums.Precision.HIGH;

  /**
   * Creates a new NavController instance.
   * @param apiKey - API key for tracking and rerouting
   * @param options - Configuration options for navigation behavior
   */
  constructor(apiKey: string, options: NavigationControllerOptions = {}) {
    super();

    const defaults = API.Navigation.Constants.DEFAULT_OPTIONS;
    this.options = {
      offRouteThresholdMeters: options.offRouteThresholdMeters ?? defaults.offRouteThresholdMeters,
      arriveThresholdMeters: options.arriveThresholdMeters ?? defaults.arriveThresholdMeters,
      autoReroute: options.autoReroute ?? defaults.autoReroute,
      rerouteFn: options.rerouteFn ?? null,
    };

    this.apiKey = apiKey;
  }

  /**
   * Starts navigation along the provided route.
   * @param route - Route data containing geometry and instructions
   * @param startOptions - Options for starting navigation (userId, role, precision)
   * @param locationProvider - Provider that supplies location data
   * @throws {ValidationError} If route or userId is invalid
   */
  start(
    route: RouteData,
    startOptions: NavigationStartOptions,
    locationProvider: ILocationProvider
  ): void {
    if (this.isActive) {
      this.stop();
    }

    if (!route || !route.geometry || !route.geometry.coordinates) {
      throw new ValidationError('Valid route is required to start navigation', 'route');
    }

    if (!startOptions.userId) {
      throw new ValidationError('User ID is required for navigation', 'userId');
    }

    this.route = route;
    this.locationProvider = locationProvider;
    this.userId = startOptions.userId;
    this.role = startOptions.role ?? 'driver';
    this.precision = startOptions.precision ?? API.Tracking.Enums.Precision.HIGH;

    this.routeCoordinates = route.geometry.coordinates;
    this.totalRouteDistance = calculateRouteDistance(this.routeCoordinates);
    this.calculateStepDistances();
    this.currentStepIndex = this.route.instructions && this.route.instructions.length > 0 ? 0 : -1;
    this.isActive = true;

    this.startTracking(startOptions);

    this.locationProvider.start((location: LocationData) => {
      this.updateLocation(location);
    });

    this.emit('start', { route });
  }

  /**
   * Stops navigation and tracking.
   */
  stop(): void {
    if (!this.isActive) {
      return;
    }

    const route = this.route;
    this.isActive = false;
    this.route = null;
    this.currentStepIndex = 0;
    this.lastLocation = null;

    if (this.locationProvider) {
      this.locationProvider.stop();
      this.locationProvider = null;
    }

    this.stopTracking();

    this.emit('stop', { route: route || undefined });
  }

  /**
   * Starts tracking based on precision setting.
   * @param _startOptions - Start options (unused but kept for API consistency)
   * @private
   */
  private startTracking(_startOptions: NavigationStartOptions): void {
    if (this.precision === API.Tracking.Enums.Precision.HIGH) {
      this.trackingClient = new TrackingClient({
        userId: this.userId,
        role: this.role,
        bearerToken: this.apiKey,
      });
    } else {
      this.trackingClient = new HttpTrackingClient({
        userId: this.userId,
        role: this.role,
        bearerToken: this.apiKey,
      });
    }

    if (this.trackingClient && this.locationProvider) {
      this.trackingClient.start(this.locationProvider);
    }
  }

  /**
   * Stops tracking client.
   * @private
   */
  private stopTracking(): void {
    if (this.trackingClient) {
      this.trackingClient.stop();
      this.trackingClient = null;
    }
  }

  /**
   * Calculates distances for each step in the route.
   * @private
   */
  private calculateStepDistances(): void {
    this.stepDistances = [];
    if (!this.route?.instructions || this.routeCoordinates.length === 0) {
      return;
    }

    let currentIndex = 0;
    for (const instruction of this.route.instructions) {
      if (instruction.length !== undefined) {
        this.stepDistances.push(instruction.length);
      } else if (instruction.coord) {
        const coordIndex = this.findCoordinateIndex(instruction.coord);
        if (coordIndex > currentIndex) {
          let stepDistance = 0;
          for (let i = currentIndex; i < coordIndex; i++) {
            if (i < this.routeCoordinates.length - 1) {
              const dist = this.calculateSegmentDistance(
                this.routeCoordinates[i],
                this.routeCoordinates[i + 1]
              );
              stepDistance += dist;
            }
          }
          this.stepDistances.push(stepDistance);
          currentIndex = coordIndex;
        } else {
          this.stepDistances.push(0);
        }
      } else {
        this.stepDistances.push(0);
      }
    }
  }

  /**
   * Finds the index of the nearest coordinate in the route.
   * @param coord - Coordinate to find
   * @returns Index of nearest coordinate
   * @private
   */
  private findCoordinateIndex(coord: [number, number]): number {
    let minDistance = Infinity;
    let nearestIndex = 0;

    for (let i = 0; i < this.routeCoordinates.length; i++) {
      const dist = this.calculateSegmentDistance(this.routeCoordinates[i], coord);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    return nearestIndex;
  }

  /**
   * Calculates distance between two coordinates using Haversine formula.
   * @param coord1 - First coordinate [lng, lat]
   * @param coord2 - Second coordinate [lng, lat]
   * @returns Distance in meters
   * @private
   */
  private calculateSegmentDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371000;
    const lat1 = (coord1[1] * Math.PI) / 180;
    const lat2 = (coord2[1] * Math.PI) / 180;
    const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const dLng = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Updates navigation state based on current location.
   * @param location - Current location data
   * @private
   */
  private updateLocation(location: LocationData): void {
    if (!this.isActive || !this.route) {
      return;
    }

    this.lastLocation = location;
    const locationPoint: [number, number] = [location.lng, location.lat];

    const nearest = nearestPointOnLine(locationPoint, this.routeCoordinates);
    const remainingDistance = this.totalRouteDistance - nearest.along;
    const progress = calculateProgressAlongRoute(
      locationPoint,
      this.routeCoordinates,
      this.totalRouteDistance
    );

    const newStepIndex = findStepIndex(locationPoint, this.routeCoordinates, this.stepDistances);

    if (newStepIndex !== this.currentStepIndex && this.route.instructions) {
      const previousStep = this.route.instructions[this.currentStepIndex];
      const currentStep = this.route.instructions[newStepIndex];
      this.currentStepIndex = newStepIndex;

      this.emit('stepchange', {
        step: currentStep,
        stepIndex: newStepIndex,
        previousStep,
      });
    }

    const currentStep =
      this.currentStepIndex >= 0 && this.route.instructions
        ? this.route.instructions[this.currentStepIndex]
        : undefined;
    const remainingDuration = this.calculateRemainingDuration(remainingDistance);

    this.emit('progress', {
      remainingDistance,
      remainingDuration,
      currentStep,
      stepIndex: this.currentStepIndex,
      progress,
    });

    if (nearest.distance > this.options.offRouteThresholdMeters) {
      this.handleOffRoute(location, nearest);
    }

    if (remainingDistance <= this.options.arriveThresholdMeters) {
      this.handleArrival(location);
    }
  }

  /**
   * Handles off-route detection and triggers rerouting if enabled.
   * @param location - Current location
   * @param nearest - Nearest point on route result
   * @private
   */
  private handleOffRoute(location: LocationData, nearest: NearestPointResult): void {
    this.emit('offroute', {
      location,
      snapped: {
        distance: nearest.distance,
        point: { lng: nearest.point.lng, lat: nearest.point.lat },
        index: nearest.index,
        t: nearest.t,
        along: nearest.along,
      },
    });

    if (this.options.autoReroute && this.route && this.options.rerouteFn) {
      this.reroute(location);
    }
  }

  /**
   * Handles arrival at destination.
   * @param location - Current location
   * @private
   */
  private handleArrival(location: LocationData): void {
    this.emit('arrive', { location });
    this.stop();
  }

  /**
   * Attempts to reroute from current location to destination.
   * @param currentLocation - Current location
   * @private
   */
  private async reroute(currentLocation: LocationData): Promise<void> {
    if (!this.route || !this.options.rerouteFn) {
      return;
    }

    try {
      const newRoute = await this.options.rerouteFn(
        { lng: currentLocation.lng, lat: currentLocation.lat },
        this.route.destination
      );

      this.route = newRoute;
      this.routeCoordinates = newRoute.geometry.coordinates;
      this.totalRouteDistance = calculateRouteDistance(this.routeCoordinates);
      this.calculateStepDistances();
      this.currentStepIndex = 0;

      this.emit('start', { route: newRoute });
    } catch (error) {
      const navError = createNavigationError(
        API.Errors.Codes.NAVIGATION_REQUEST_FAILED,
        'Failed to reroute',
        { error: error instanceof Error ? error : new Error(String(error)) }
      );
      this.emit('error', navError as unknown as NavigationError);
    }
  }

  /**
   * Calculates remaining duration based on distance and route time.
   * @param remainingDistanceMeters - Remaining distance in meters
   * @returns Remaining duration in seconds or estimated seconds
   * @private
   */
  private calculateRemainingDuration(remainingDistanceMeters: number): number | string {
    if (!this.route?.summary?.time || !this.totalRouteDistance) {
      return Math.round(remainingDistanceMeters / 8.33);
    }

    const totalTimeSeconds =
      typeof this.route.summary.time === 'number'
        ? this.route.summary.time
        : parseInt(String(this.route.summary.time), 10) || 0;

    const remainingTimeSeconds = Math.round(
      (remainingDistanceMeters / this.totalRouteDistance) * totalTimeSeconds
    );

    return remainingTimeSeconds;
  }

  /**
   * Gets the current route being navigated.
   * @returns Current route data or null if not navigating
   */
  getCurrentRoute(): RouteData | null {
    return this.route;
  }

  /**
   * Gets the current step index in the route instructions.
   * @returns Current step index
   */
  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  /**
   * Checks if navigation is currently active.
   * @returns True if navigating, false otherwise
   */
  isNavigating(): boolean {
    return this.isActive;
  }
}
