import { API, RoutingError } from '@gebeta/maps-api';
import type { DirectionsApiResponse } from './types';
import { decodePolyline } from './polyline';
import { getManeuverIcon } from './maneuvers';

/**
 * Formats duration from seconds to human-readable string.
 */
function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Estimates travel time based on distance and average speed.
 */
function estimateDuration(distanceMeters: number, avgSpeedKmh: number): string {
  const distanceKm = distanceMeters / 1000;
  const durationHours = distanceKm / avgSpeedKmh;
  const durationMinutes = Math.round(durationHours * 60);

  if (durationMinutes < 60) {
    return `${durationMinutes} min`;
  }
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Transforms Valhalla format API response to RouteData.
 */
function transformValhallaResponse(
  apiResponse: DirectionsApiResponse,
  origin: API.Common.Types.LngLat,
  destination: API.Common.Types.LngLat,
  avgSpeedKmh: number
): API.Routing.Types.RouteData {
  if (!apiResponse.trip?.legs || apiResponse.trip.legs.length === 0) {
    throw new RoutingError(
      API.Errors.Codes.ROUTING_REQUEST_FAILED,
      'Invalid route response: missing trip legs'
    );
  }

  const leg = apiResponse.trip.legs[0];
  const summary = apiResponse.trip.summary || leg.summary;

  if (!leg.shape) {
    throw new RoutingError(
      API.Errors.Codes.ROUTING_REQUEST_FAILED,
      'Invalid route response: missing route geometry'
    );
  }

  let coordinates = decodePolyline(leg.shape);

  if (coordinates.length > 0 && apiResponse.trip.locations && apiResponse.trip.locations.length >= 2) {
    const startLocation = apiResponse.trip.locations[0];
    const endLocation = apiResponse.trip.locations[apiResponse.trip.locations.length - 1];

      const expectedStartLat = startLocation.lat;
      const expectedStartLng = startLocation.lon ?? startLocation.lng;
      const expectedEndLat = endLocation.lat;
      const expectedEndLng = endLocation.lon ?? endLocation.lng;

      if (expectedStartLng != null && expectedEndLng != null) {

      const options = [
        { coords: coordinates, desc: 'original [lng, lat]' },
        { coords: coordinates.map((c) => [c[1], c[0]] as [number, number]), desc: 'swapped [lat, lng]' },
        { coords: coordinates.map((c) => [c[0] / 10, c[1] / 10] as [number, number]), desc: 'scaled /10 [lng, lat]' },
        {
          coords: coordinates.map((c) => [c[1] / 10, c[0] / 10] as [number, number]),
          desc: 'swapped and scaled /10 [lat, lng]',
        },
      ];

      let bestOption = options[0];
      let bestScore = Infinity;

      for (const option of options) {
        const first = option.coords[0];
        const last = option.coords[option.coords.length - 1];

        const startError = Math.abs(first[0] - expectedStartLng) + Math.abs(first[1] - expectedStartLat);
        const endError = Math.abs(last[0] - expectedEndLng) + Math.abs(last[1] - expectedEndLat);
        const totalError = startError + endError;

        if (totalError < bestScore) {
          bestScore = totalError;
          bestOption = option;
        }
      }

      if (bestScore < 1.0) {
        coordinates = bestOption.coords;
      } else {
        coordinates = apiResponse.trip.locations.map((loc) => [
          loc.lon ?? loc.lng ?? 0,
          loc.lat,
        ] as [number, number]);
      }
    }
  }

  const instructions: API.Routing.Types.RouteInstruction[] = (leg.maneuvers || []).map((maneuver, index) => {
    let coord: [number, number] | undefined;
    if (maneuver.begin_shape_index !== undefined && coordinates[maneuver.begin_shape_index]) {
      coord = coordinates[maneuver.begin_shape_index];
    } else if (coordinates.length > 0) {
      coord = coordinates[0];
    }

    return {
      type: maneuver.type,
      instruction: maneuver.instruction,
      verbal_pre_transition_instruction: maneuver.verbal_pre_transition_instruction,
      verbal_post_transition_instruction: maneuver.verbal_post_transition_instruction,
      bearing_after: maneuver.bearing_after,
      time: maneuver.time,
      length: maneuver.length,
      coord,
      icon: maneuver.type !== undefined ? getManeuverIcon(maneuver.type) : undefined,
      index,
    };
  });

  const totalDistance = summary?.length ? summary.length * 1000 : null;
  const totalTime = summary?.time ?? null;

  return {
    geometry: {
      type: 'LineString',
      coordinates,
    },
    origin: {
      lat: origin.lat,
      lng: origin.lng,
    },
    destination: {
      lat: destination.lat,
      lng: destination.lng,
    },
    distance: totalDistance ? `${(totalDistance / 1000).toFixed(2)} km` : null,
    duration: totalTime ? formatDuration(totalTime) : totalDistance ? estimateDuration(totalDistance, avgSpeedKmh) : null,
    instructions,
    summary: {
      length: summary?.length,
      time: summary?.time,
    },
  };
}

/**
 * Transforms a raw directions API response (Valhalla format) to RouteData format.
 * @param apiResponse - Raw API response in Valhalla format
 * @param origin - Origin coordinates
 * @param destination - Destination coordinates
 * @param avgSpeedKmh - Average speed in km/h for duration estimation
 * @returns Transformed RouteData
 * @throws RoutingError if response is invalid
 */
export function transformDirectionsResponse(
  apiResponse: DirectionsApiResponse,
  origin: API.Common.Types.LngLat,
  destination: API.Common.Types.LngLat,
  avgSpeedKmh: number = API.Routing.Constants.DEFAULT_AVG_SPEED_KMH
): API.Routing.Types.RouteData {
  return transformValhallaResponse(apiResponse, origin, destination, avgSpeedKmh);
}
