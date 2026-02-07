import { API } from '@gebeta/maps-api';
import type { GeocodingApiResponse, RawGeocodeResult } from './types';

/**
 * GeocodingManager handles forward and reverse geocoding operations.
 * Platform-agnostic: uses fetch API which is available in all JS environments.
 */
export class GeocodingManager {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required for GeocodingManager');
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
      throw new Error('Name is required for geocoding');
    }

    const params = new URLSearchParams({
      name,
      apiKey: this.apiKey,
    });

    const url = `${this.baseUrl}/geocoding?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data: GeocodingApiResponse = await response.json();

      if (response.ok && data.msg === 'ok') {
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

      throw new Error(data.error?.message || data.msg || 'Geocoding failed');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Geocoding request failed');
    }
  }

  /**
   * Reverse geocoding: search by coordinates.
   * @returns Promise resolving to array of geocoding results
   * @param latlng
   */
  async reverseGeocode(latlng: API.Common.Types.LngLat): Promise<API.Geocoding.Types.Result[]> {
    if (!latlng || latlng.lat == null || latlng.lng == null) {
      throw new Error('Latitude and longitude are required for reverse geocoding');
    }

    const params = new URLSearchParams({
      lat: latlng.lat.toString(),
      lon: latlng.lng.toString(),
      apiKey: this.apiKey,
    });

    const url = `${this.baseUrl}/revgeocoding?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data: GeocodingApiResponse = await response.json();

      if (response.ok && data.msg === 'ok') {
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

      throw new Error(data.error?.message || data.msg || 'Reverse geocoding failed');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Reverse geocoding request failed');
    }
  }
}
