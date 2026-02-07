/**
 * Raw geocoding result from the API before transformation.
 * The API returns lat/lng as separate fields, which we transform to lngLat.
 */
export interface RawGeocodeResult {
  /** Place name */
  name?: string;
  /** Latitude (short form) */
  lat?: number;
  /** Longitude (short form) */
  lng?: number;
  /** Latitude (long form) */
  latitude?: number;
  /** Longitude (long form) */
  longitude?: number;
  /** Additional properties from API */
  [key: string]: unknown;
}

export enum GeocodingMessage {
  OK = 'ok',
  ERROR = 'error',
}
/**
 * Raw API response structure for geocoding endpoints.
 */
export interface GeocodingApiResponse {
  /** Response status message */
  msg: GeocodingMessage;
  /** Array of geocoding results */
  data?: RawGeocodeResult[];
  /** Error details (if msg === 'error') */
  error?: {
    message?: string;
    [key: string]: unknown;
  };
}
