/**
 * Raw geocoding result from the API before transformation.
 * The API returns lat/lng as separate fields, which we transform to lngLat.
 */
export interface RawGeocodeResult {
  /** Place name */
  name?: string;
  /** Latitude */
  lat?: number;
  /** Longitude */
  lng?: number;
  /** Additional properties from API */
  [key: string]: unknown;
}

/**
 * Raw API response structure for geocoding endpoints.
 */
export interface GeocodingApiResponse {
  /** Response status message */
  msg: 'ok' | 'error';
  /** Array of geocoding results */
  data?: RawGeocodeResult[];
  /** Error details (if msg === 'error') */
  error?: {
    message?: string;
    [key: string]: unknown;
  };
}
