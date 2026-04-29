import {
  API,
  ValidationError,
  NetworkError,
  RoutingError,
  createApiError,
  parseApiErrorResponse,
} from '@gebeta/api';
import type { DirectionsApiResponse } from './types';
import { transformDirectionsResponse } from './transform';
import { createFetch } from '../utils/fetch';

type AuthParam = API.Auth.Types.AuthParam;

/**
 * DirectionsManager handles route calculation between points.
 * Platform-agnostic: uses fetch API which is available in all JS environments.
 */
export class DirectionsManager {
  private readonly auth: AuthParam;
  private readonly baseUrl: string;

  constructor(auth: AuthParam) {
    if (!auth) {
      throw new ValidationError('auth is required for DirectionsManager', 'auth');
    }
    this.auth = auth;
    this.baseUrl = API.Routing.Constants.API_URL;
  }

  /**
   * Get directions between two points.
   * @param origin - Origin coordinates
   * @param destination - Destination coordinates
   * @param options - Additional options (waypoints, avgSpeedKmh)
   * @returns Promise resolving to RouteData
   */
  async getDirections(
    origin: API.Common.Types.LngLat,
    destination: API.Common.Types.LngLat,
    options: API.Routing.Types.DirectionsOptions = {}
  ): Promise<API.Routing.Types.RouteData> {
    if (origin?.lat == null || origin.lng == null) {
      throw new ValidationError('Origin is required for directions', 'origin', { origin });
    }

    if (destination?.lat == null || destination.lng == null) {
      throw new ValidationError('Destination is required for directions', 'destination', {
        destination,
      });
    }

    const { waypoints = [], avgSpeedKmh = API.Routing.Constants.DEFAULT_AVG_SPEED_KMH } = options;

    const params = new URLSearchParams({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      instruction: '1',
      format: 'valhalla',
    });

    if (typeof this.auth === 'string') {
      params.set('apiKey', this.auth);
    } else {
      const manager = this.auth as { getAccessToken(): string };
      params.set('accessToken', manager.getAccessToken());
    }

    if (waypoints.length > 0) {
      const waypointsString = `[${waypoints.map((wp: API.Common.Types.LngLat) => `{${wp.lat},${wp.lng}}`).join(',')}]`;
      params.append('waypoints', waypointsString);
    }

    const url = `${this.baseUrl}?${params.toString()}`;

    let response: Response;
    try {
      response = await createFetch(this.auth)(url);
    } catch (error) {
      throw new NetworkError(
        error instanceof Error
          ? `Directions request failed: ${error.message}`
          : 'Directions request failed',
        API.Errors.Codes.NETWORK_REQUEST_FAILED,
        error instanceof Error ? error : undefined
      );
    }

    if (!response.ok) {
      const errorResponse = await parseApiErrorResponse(response);
      throw createApiError(response.status, errorResponse);
    }

    const data: DirectionsApiResponse = await response.json();

    if (data.msg === 'error' || data.error) {
      throw new RoutingError(
        API.Errors.Codes.ROUTING_REQUEST_FAILED,
        data.error?.message || data.msg || 'Directions request failed'
      );
    }

    return transformDirectionsResponse(data, origin, destination, avgSpeedKmh);
  }
}
