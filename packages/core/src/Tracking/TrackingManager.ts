import { API, TrackingError, createTrackingError, ValidationError } from '@gebeta/api';
import type { AuthManager } from '../Auth/AuthManager';

type ILocationProvider = API.Platform.Types.ILocationProvider;
type LocationData = API.Platform.Types.LocationData;
import { EventEmitter } from '../utils/EventEmitter';

type TrackingManagerOptions = API.Tracking.Types.ManagerOptions;
type LocationProvider = ILocationProvider;

interface TrackingEventMap {
  location: (location: LocationData) => void;
  connect: () => void;
  disconnect: () => void;
  error: (error: TrackingError) => void;
}

/**
 * WebSocket-based tracking client for high-precision location tracking.
 * Platform-agnostic: uses WebSocket API available in all JS environments.
 */
export class TrackingManager extends EventEmitter<TrackingEventMap> {
  private ws: WebSocket | null = null;
  private locationProvider: LocationProvider | null = null;
  private sendInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly options: Required<
    Pick<
      TrackingManagerOptions,
      'userId' | 'role' | 'sendIntervalMs' | 'autoReconnect' | 'maxReconnectDelayMs'
    >
  > &
    Pick<TrackingManagerOptions, 'auth' | 'locationProvider' | 'clientId'>;
  private readonly wsUrl: string;
  private isConnected = false;
  private isStopped = false;

  /**
   * Creates a new TrackingManager instance.
   * @param options - Configuration options for the tracking client
   * @throws {ValidationError} If userId is missing
   */
  constructor(options: TrackingManagerOptions) {
    super();

    if (!options.userId) {
      throw new ValidationError('User ID is required for TrackingManager', 'userId');
    }

    this.options = {
      userId: options.userId,
      role: options.role ?? 'driver',
      sendIntervalMs: options.sendIntervalMs ?? API.Tracking.Constants.INTERVAL_MS,
      autoReconnect: options.autoReconnect ?? true,
      maxReconnectDelayMs: options.maxReconnectDelayMs ?? 15000,
      auth: options.auth,
      locationProvider: options.locationProvider,
      clientId: options.clientId,
    };

    this.wsUrl = API.Tracking.Constants.API_URLS.WEBSOCKET;
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
    this.locationProvider = null;
    this.reconnectAttempts = 0;
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
      if (this.options.auth) {
        const token = typeof this.options.auth === 'string'
          ? this.options.auth
          : (this.options.auth as AuthManager).getAccessToken();
        url.searchParams.set('token', token);
      }
      url.searchParams.set('userId', this.options.userId);
      url.searchParams.set('role', this.options.role);
      if (this.options.clientId) {
        url.searchParams.set('deviceId', this.options.clientId);
      }

      this.ws = new WebSocket(url.toString());

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connect');
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
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    if (!location && !this.locationProvider) {
      return;
    }

    const locationData: LocationData = location || {
      lat: 0,
      lng: 0,
      accuracy: 0,
      timestamp: Date.now(),
    };

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
