import { API, TrackingError, createTrackingError, ValidationError } from '@gebeta/maps-api';

type ILocationProvider = API.Platform.Types.ILocationProvider;
type LocationData = API.Platform.Types.LocationData;
import { EventEmitter } from '../utils/EventEmitter';
import { OfflineQueue, QueuedRequest } from './OfflineQueue';

type TrackingClientOptions = API.Tracking.Types.ClientOptions;
type LocationProvider = ILocationProvider;

type EventHandler = (...args: never[]) => void;

interface TrackingEventMap {
  location: (location: LocationData) => void;
  connect: () => void;
  disconnect: () => void;
  error: (error: TrackingError) => void;
  offline: () => void;
  online: () => void;
  queued: (request: QueuedRequest) => void;
  [key: string]: EventHandler;
}

/**
 * WebSocket-based tracking client for high-precision location tracking.
 * Platform-agnostic: uses WebSocket API available in all JS environments.
 */
export class TrackingClient extends EventEmitter<TrackingEventMap> {
  private ws: WebSocket | null = null;
  private locationProvider: LocationProvider | null = null;
  private sendInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly options: Required<
    Pick<
      TrackingClientOptions,
      'userId' | 'role' | 'sendIntervalMs' | 'autoReconnect' | 'maxReconnectDelayMs'
    >
  > &
    Pick<TrackingClientOptions, 'bearerToken' | 'locationProvider'>;
  private readonly wsUrl: string;
  private isConnected = false;
  private isStopped = false;
  private offlineQueue: OfflineQueue;
  private isOnline = true;
  private queueProcessInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Creates a new TrackingClient instance.
   * @param options - Configuration options for the tracking client
   * @throws {ValidationError} If userId is missing
   */
  constructor(options: TrackingClientOptions) {
    super();

    if (!options.userId) {
      throw new ValidationError('User ID is required for TrackingClient', 'userId');
    }

    this.options = {
      userId: options.userId,
      role: options.role ?? 'driver',
      sendIntervalMs: options.sendIntervalMs ?? API.Tracking.Constants.INTERVAL_MS,
      autoReconnect: options.autoReconnect ?? true,
      maxReconnectDelayMs: options.maxReconnectDelayMs ?? 15000,
      bearerToken: options.bearerToken,
      locationProvider: options.locationProvider,
    };

    this.wsUrl = API.Tracking.Constants.API_URLS.WEBSOCKET;
    this.offlineQueue = new OfflineQueue();
    this.setupOnlineDetection();
  }

  /**
   * Starts tracking by connecting to the WebSocket server and beginning location updates.
   * @param locationProvider - Provider that supplies location data
   */
  start(locationProvider: LocationProvider): void {
    if (this.isConnected || this.locationProvider) {
      return;
    }

    this.isStopped = false;
    this.locationProvider = locationProvider;

    this.connect();
    this.startLocationUpdates();
  }

  /**
   * Stops tracking by disconnecting from the WebSocket server and stopping location updates.
   */
  stop(): void {
    this.isStopped = true;
    this.disconnect();
    this.stopLocationUpdates();
    this.stopQueueProcessing();
    this.locationProvider = null;
    this.reconnectAttempts = 0;
  }

  /**
   * sets up online/offline detection for the browser env.
   * @private
   */
  private setupOnlineDetection(): void {
    if (typeof window === 'undefined') {
      return;
    }
    //current status
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
      if (this.isOnline && this.isConnected) {
        this.processQueue();
      }
    }, 5000); //every 5 seconds
  }

  private stopQueueProcessing(): void {
    if (this.queueProcessInterval) {
      clearInterval(this.queueProcessInterval);
      this.queueProcessInterval = null;
    }
  }

  private async processQueue(): Promise<void> {
    if (!this.isOnline || !this.isConnected || this.offlineQueue.isEmpty()) {
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
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    const message = {
      type: 'location',
      userId: request.userId,
      role: request.role,
      location: request.location,
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Establishes WebSocket connection to the tracking server.
   * @private
   */
  private connect(): void {
    if (this.ws) {
      return;
    }

    try {
      const url = new URL(this.wsUrl);
      if (this.options.bearerToken) {
        url.searchParams.set('token', this.options.bearerToken);
      }
      url.searchParams.set('userId', this.options.userId);
      url.searchParams.set('role', this.options.role);

      this.ws = new WebSocket(url.toString());

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connect');
        this.startQueueProcessing();
        this.processQueue();
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.ws = null;
        this.emit('disconnect');

        if (!this.isStopped && this.options.autoReconnect) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = error => {
        const trackingError = createTrackingError(
          API.Errors.Codes.NETWORK_FAILED,
          'WebSocket connection error',
          { error }
        );
        this.emit('error', trackingError);
      };

      this.ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'error') {
            const trackingError = createTrackingError(
              API.Errors.Codes.NETWORK_REQUEST_FAILED,
              data.message || 'Tracking server error',
              { data }
            );
            this.emit('error', trackingError);
          }
        } catch (error) {
          console.warn('Failed to parse tracking message:', error);
        }
      };
    } catch (error) {
      const trackingError = createTrackingError(
        API.Errors.Codes.NETWORK_FAILED,
        'Failed to create WebSocket connection',
        { error }
      );
      this.emit('error', trackingError);
    }
  }

  /**
   * Closes the WebSocket connection and cancels any pending reconnection attempts.
   * @private
   */
  private disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
  }

  /**
   * Schedules a reconnection attempt with exponential backoff.
   * @private
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return;
    }

    const delay = Math.min(
      this.options.maxReconnectDelayMs,
      1000 * Math.pow(2, this.reconnectAttempts)
    );
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (!this.isStopped) {
        this.connect();
      }
    }, delay);
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
    }, this.options.sendIntervalMs);

    this.locationProvider.start((location: LocationData) => {
      this.emit('location', location);
      this.sendLocation(location);
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
   * Sends location data to the tracking server via WebSocket.
   * @param location - Optional location data to send. If not provided, uses default values.
   * @private
   */
  private sendLocation(location?: LocationData): void {
    if (!location && !this.locationProvider) {
      return;
    }

    const locationData: LocationData = location || {
      lat: 0,
      lng: 0,
      accuracy: 0,
      timestamp: Date.now(),
    };

    //if offline, queue the request
    if (!this.isOnline || !this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
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
      const message = {
        type: 'location',
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
      };

      this.ws.send(JSON.stringify(message));
    } catch (error) {
      //if send fails, queue the request
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
        'Failed to send location update',
        { error }
      );
      this.emit('error', trackingError);
    }
  }

  /**
   * Checks if the tracking client is currently active and connected.
   * @returns True if connected and not stopped, false otherwise
   */
  isActive(): boolean {
    return this.isConnected && !this.isStopped;
  }
}
