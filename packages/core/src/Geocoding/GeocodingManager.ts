import { API } from '@gebeta/maps-api';
import type { GeocodingApiResponse, RawGeocodeResult } from './types';
import {
  ValidationError,
  NetworkError,
  GeocodingError,
  ApiError,
  createApiError,
  parseApiErrorResponse,
} from '@gebeta/maps-api';

/**
 * GeocodingManager handles forward and reverse geocoding operations.
 * Platform-agnostic: uses fetch API which is available in all JS environments.
 */
export class GeocodingManager {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new ValidationError('API key is required for GeocodingManager', 'apiKey');
    }
    this.apiKey = apiKey;
    this.baseUrl = API.Geocoding.Constants.API_URL;
  }

  /**
   * Forward geocoding: search by name/address.
   * @param name - Place name or address to search for
   * @returns Promise resolving to array of geocoding results
   */
  async geocode(name: string): Promise<API.Geocoding.Types.Result[]> {
    if (!name) {
      throw new ValidationError('Name is required for geocoding', 'name');
    }

    const params = new URLSearchParams({
      name,
      apiKey: this.apiKey,
    });

    const url = `${this.baseUrl}/geocoding?${params.toString()}`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      throw new NetworkError(
        error instanceof Error
          ? `Geocoding request failed: ${error.message}`
          : 'Geocoding request failed',
        API.Errors.Codes.NETWORK_REQUEST_FAILED,
        error instanceof Error ? error : undefined
      );
    }

    if (!response.ok) {
      const errorResponse = await parseApiErrorResponse(response);
      throw createApiError(response.status, errorResponse);
    }

    const data: GeocodingApiResponse = await response.json();

    if (data.msg === 'ok') {
      return (data.data || []).map((item: RawGeocodeResult) => ({
        name: item.name,
        lngLat: {
          lng: item.lng!,
          lat: item.lat!,
        },
        ...Object.fromEntries(
          Object.entries(item).filter(([key]) => key !== 'lat' && key !== 'lng' && key !== 'name')
        ),
      }));
    }

    throw new GeocodingError(
      API.Errors.Codes.GEOCODING_REQUEST_FAILED,
      data.error?.message || data.msg || 'Geocoding failed'
    );
  }

  /**
   * Reverse geocoding: search by coordinates.
   * @returns Promise resolving to array of geocoding results
   * @param latlng
   */
  async reverseGeocode(latlng: API.Common.Types.LngLat): Promise<API.Geocoding.Types.Result[]> {
    if (latlng?.lat == null || latlng.lng == null) {
      throw new ValidationError(
        'Latitude and longitude are required for reverse geocoding',
        'latlng',
        { lat: latlng?.lat, lng: latlng?.lng }
      );
    }

    const params = new URLSearchParams({
      lat: latlng.lat.toString(),
      lon: latlng.lng.toString(),
      apiKey: this.apiKey,
    });

    const url = `${this.baseUrl}/revgeocoding?${params.toString()}`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      throw new NetworkError(
        error instanceof Error
          ? `Reverse geocoding request failed: ${error.message}`
          : 'Reverse geocoding request failed',
        API.Errors.Codes.NETWORK_REQUEST_FAILED,
        error instanceof Error ? error : undefined
      );
    }

    if (!response.ok) {
      const errorResponse = await parseApiErrorResponse(response);
      throw createApiError(response.status, errorResponse);
    }

    const data: GeocodingApiResponse = await response.json();

    if (data.msg === 'ok') {
      return (data.data || []).map((item: RawGeocodeResult) => ({
        name: item.name,
        lngLat: {
          lng: item.lng!,
          lat: item.lat!,
        },
        ...Object.fromEntries(
          Object.entries(item).filter(([key]) => key !== 'lat' && key !== 'lng' && key !== 'name')
        ),
      }));
    }

    throw new GeocodingError(
      API.Errors.Codes.GEOCODING_REQUEST_FAILED,
      data.error?.message || data.msg || 'Reverse geocoding failed'
    );
  }
}
