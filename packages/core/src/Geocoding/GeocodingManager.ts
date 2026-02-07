import { API } from '@gebeta/maps-api';

/**
 * GeocodingManager handles forward and reverse geocoding operations.
 * Platform-agnostic: uses fetch API which is available in all JS environments.
 */
export class GeocodingManager {
  private apiKey: string;
  private baseUrl: string;

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
   * @param options - Optional geocoding options
   * @returns Promise resolving to array of geocoding results
   */
  async geocode(
    name: string,
    options?: API.Geocoding.Types.Options
  ): Promise<API.Geocoding.Types.Result[]> {
    if (!name) {
      throw new Error('Name is required for geocoding');
    }

    const apiKey = options?.apiKey || this.apiKey;
    if (!apiKey) {
      throw new Error('API key is required for geocoding');
    }

    const params = new URLSearchParams({
      name,
      apiKey,
    });

    const url = `${this.baseUrl}/geocoding?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.msg === 'ok') {
        return data.data || [];
      }

      throw new Error(
        data.error?.message || data.msg || 'Geocoding failed'
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Geocoding request failed');
    }
  }

  /**
   * Reverse geocoding: search by coordinates.
   * @param lat - Latitude in degrees
   * @param lng - Longitude in degrees
   * @param options - Optional geocoding options
   * @returns Promise resolving to array of geocoding results
   */
  async reverseGeocode(
    lat: number,
    lng: number,
    options?: API.Geocoding.Types.Options
  ): Promise<API.Geocoding.Types.Result[]> {
    if (lat == null || lng == null) {
      throw new Error('Latitude and longitude are required for reverse geocoding');
    }

    const apiKey = options?.apiKey || this.apiKey;
    if (!apiKey) {
      throw new Error('API key is required for reverse geocoding');
    }

    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      apiKey,
    });

    const url = `${this.baseUrl}/revgeocoding?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.msg === 'ok') {
        return data.data || [];
      }

      throw new Error(
        data.error?.message || data.msg || 'Reverse geocoding failed'
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Reverse geocoding request failed');
    }
  }
}
