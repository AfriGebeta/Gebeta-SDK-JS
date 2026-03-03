import {
  API,
  TrackingError,
  createTrackingError,
  ValidationError,
  NetworkError,
} from '@gebeta/maps-api';
import { EventEmitter } from '../utils/EventEmitter';
import { OfflineQueue, QueuedRequest } from './OfflineQueue';

type HttpTrackingClientOptions = API.Tracking.Types.HttpClientOptions;
type ILocationProvider = API.Platform.Types.ILocationProvider;
type LocationData = API.Platform.Types.LocationData;

type EventHandler = (...args: never[]) => void;

interface HttpTrackingEventMap {
  location: (location: LocationData) => void;
  error: (error: TrackingError) => void;
  offline: () => void;
  online: () => void;
  queued: (request: QueuedRequest) => void;
  [key: string]: EventHandler;
}

/**
 * HTTP-based tracking client for lower-precision location tracking.
 * Platform-agnostic: uses fetch API available in all JS environments.
 */
export class HttpTrackingClient extends EventEmitter<HttpTrackingEventMap> {
  private locationProvider: ILocationProvider | null = null;
  private sendInterval: ReturnType<typeof setInterval> | null = null;
  private readonly options: Required<Pick<HttpTrackingClientOptions, 'userId' | 'role'>> &
    Pick<HttpTrackingClientOptions, 'bearerToken' | 'locationProvider'>;
  private readonly httpUrl: string;
  private isStopped = false;
  private offlineQueue: OfflineQueue;
  private isOnline = true;
  private queueProcessInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Creates a new HttpTrackingClient instance.
   * @param options - Configuration options for the HTTP tracking client
   * @throws {ValidationError} If userId is missing
   */
  constructor(options: HttpTrackingClientOptions) {
    super();

    if (!options.userId) {
      throw new ValidationError('User ID is required for HttpTrackingClient', 'userId');
    }

    this.options = {
      userId: options.userId,
      role: options.role ?? 'driver',
      bearerToken: options.bearerToken,
      locationProvider: options.locationProvider,
    };

    this.httpUrl = API.Tracking.Constants.API_URLS.HTTP;
    this.offlineQueue = new OfflineQueue();
    this.setupOnlineDetection();
  }

  /**
   * Starts tracking by beginning periodic HTTP location updates.
   * @param locationProvider - Provider that supplies location data
   */
  start(locationProvider: ILocationProvider): void {
    if (this.sendInterval) {
      return;
    }

    this.isStopped = false;
    this.locationProvider = locationProvider;

    this.startLocationUpdates();
    this.startQueueProcessing();
  }

  /**
   * Stops tracking by stopping periodic HTTP location updates.
   */
  stop(): void {
    this.isStopped = true;
    this.stopLocationUpdates();
    this.stopQueueProcessing();
    this.locationProvider = null;
  }

  /**
   * Starts periodic location updates from the location provider.
   * @private
   */
  private startLocationUpdates(): void {
    if (!this.locationProvider) {
      return;
    }

    this.sendInterval = setInterval(() => {
      this.sendLocation();
    }, API.Tracking.Constants.INTERVAL_MS);

    this.locationProvider.start((location: LocationData) => {
      this.emit('location', location);
    });
  }

  /**
   * Stops periodic location updates from the location provider.
   * @private
   */
  private stopLocationUpdates(): void {
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
      this.sendInterval = null;
    }

    if (this.locationProvider) {
      this.locationProvider.stop();
    }
  }

  /**
   * Sends location data to the tracking server via HTTP POST.
   * @param location - Optional location data to send
   * @private
   */
  private async sendLocation(location?: LocationData): Promise<void> {
    if (this.isStopped || !this.locationProvider) {
      return;
    }

    const locationData: LocationData = location || {
      lat: 0,
      lng: 0,
      accuracy: 0,
      timestamp: Date.now(),
    };

    //ff offline, queue the request immediately
    if (!this.isOnline) {
      const queuedRequest = this.offlineQueue.enqueue(
        this.options.userId,
        this.options.role,
        locationData
      );
      if (queuedRequest) {
        this.emit('queued', queuedRequest);
      }
      return;
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.options.bearerToken) {
        headers['Authorization'] = `Bearer ${this.options.bearerToken}`;
      }

      const response = await fetch(this.httpUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: this.options.userId,
          role: this.options.role,
          location: {
            lat: locationData.lat,
            lng: locationData.lng,
            accuracy: locationData.accuracy,
            timestamp: locationData.timestamp || Date.now(),
            heading: locationData.heading,
            speed: locationData.speed,
          },
        }),
      });

      if (!response.ok) {
        throw new NetworkError(
          `HTTP tracking request failed: ${response.status} ${response.statusText}`,
          API.Errors.Codes.NETWORK_REQUEST_FAILED
        );
      }
    } catch (error) {
      // queue the request if it fails
      const queuedRequest = this.offlineQueue.enqueue(
        this.options.userId,
        this.options.role,
        locationData
      );
      if (queuedRequest) {
        this.emit('queued', queuedRequest);
      }

      const trackingError = createTrackingError(
        API.Errors.Codes.NETWORK_REQUEST_FAILED,
        'Failed to send location update via HTTP',
        { error }
      );
      this.emit('error', trackingError);
    }
  }

  private setupOnlineDetection(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online');
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline');
    });
  }


  private startQueueProcessing(): void {
    if (this.queueProcessInterval) {
      return;
    }

    this.queueProcessInterval = setInterval(() => {
      if (this.isOnline) {
        this.processQueue();
      }
    }, 10000); 
  }

  private stopQueueProcessing(): void {
    if (this.queueProcessInterval) {
      clearInterval(this.queueProcessInterval);
      this.queueProcessInterval = null;
    }
  }

  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.offlineQueue.isEmpty()) {
      return;
    }

    const maxRetries = 3;
    let request = this.offlineQueue.dequeue();

    while (request) {
      try {
        await this.sendQueuedLocation(request);
      } catch (error) {
        if (request.retryCount < maxRetries) {
          this.offlineQueue.retry(request);
        }
      }

      request = this.offlineQueue.dequeue();
    }
  }

  private async sendQueuedLocation(request: QueuedRequest): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.options.bearerToken) {
      headers['Authorization'] = `Bearer ${this.options.bearerToken}`;
    }

    const response = await fetch(this.httpUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId: request.userId,
        role: request.role,
        location: request.location,
      }),
    });

    if (!response.ok) {
      throw new NetworkError(
        `HTTP tracking request failed: ${response.status} ${response.statusText}`,
        API.Errors.Codes.NETWORK_REQUEST_FAILED
      );
    }
  }

  isActive(): boolean {
    return this.sendInterval !== null && !this.isStopped;
  }
}
