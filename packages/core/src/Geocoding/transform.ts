import { API, GeocodingError } from '@gebeta/maps-api';
import type { RawGeocodeResult } from './types';

/**
 * Transforms a raw geocoding result from the API to the SDK's GeocodeResult format.
 * @param item - Raw geocoding result from the API
 * @returns Transformed geocoding result
 * @throws GeocodingError if required fields are missing
 */
export function transformGeocodeResult(item: RawGeocodeResult): API.Geocoding.Types.Result {  
  const { lat: _lat, lng: _lng, latitude: _latitude, longitude: _longitude, name: _name, ...rest } = item;

  if (_name == null || _name === '') {
    throw new GeocodingError(
      API.Errors.Codes.GEOCODING_REQUEST_FAILED,
      'Invalid geocoding result: missing name'
    );
  }

  const lat = _lat ?? _latitude;
  const lng = _lng ?? _longitude;

  if (lat == null || lng == null) {
    throw new GeocodingError(
      API.Errors.Codes.GEOCODING_REQUEST_FAILED,
      `Invalid geocoding result: missing coordinates for "${_name}"`
    );
  }

  return {
    name: item.name,
    lngLat: {
      lng,
      lat,
    },
    ...rest,
  };
}
