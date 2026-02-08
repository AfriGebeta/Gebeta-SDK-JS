import type { API } from '@gebeta/maps-api';
import { calculateDistance, normalizeLngLat } from '../Fencing/utils';

type LngLat = API.Common.Types.LngLat;
type LngLatLike = API.Common.Types.LngLatLike;

export interface NearestPointResult {
  point: LngLat;
  distance: number;
  index: number;
  t: number;
  along: number;
}

/**
 * Calculates the bearing (direction) from one point to another.
 * @param from - Starting point
 * @param to - Destination point
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(from: LngLatLike, to: LngLatLike): number {
  const fromPoint = normalizeLngLat(from);
  const toPoint = normalizeLngLat(to);

  const lat1 = (fromPoint.lat * Math.PI) / 180;
  const lat2 = (toPoint.lat * Math.PI) / 180;
  const dLng = ((toPoint.lng - fromPoint.lng) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Interpolates a point between two coordinates.
 * @param point1 - First point
 * @param point2 - Second point
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated point
 */
export function interpolate(point1: LngLatLike, point2: LngLatLike, t: number): LngLat {
  const p1 = normalizeLngLat(point1);
  const p2 = normalizeLngLat(point2);

  return {
    lng: p1.lng + (p2.lng - p1.lng) * t,
    lat: p1.lat + (p2.lat - p1.lat) * t,
  };
}

/**
 * Finds the nearest point on a line to a given point.
 * @param point - Point to find nearest location for
 * @param line - Array of coordinates forming the line
 * @returns Nearest point result with distance and position along line
 */
export function nearestPointOnLine(
  point: LngLatLike,
  line: LngLatLike[]
): NearestPointResult {
  const targetPoint = normalizeLngLat(point);
  let minDistance = Infinity;
  let nearestPoint: LngLat = targetPoint;
  let nearestIndex = 0;
  let nearestT = 0;
  let distanceAlong = 0;

  if (line.length === 0) {
    return {
      point: targetPoint,
      distance: 0,
      index: 0,
      t: 0,
      along: 0,
    };
  }

  if (line.length === 1) {
    const linePoint = normalizeLngLat(line[0]);
    return {
      point: linePoint,
      distance: calculateDistance(targetPoint, linePoint),
      index: 0,
      t: 0,
      along: 0,
    };
  }

  let cumulativeDistance = 0;

  for (let i = 0; i < line.length - 1; i++) {
    const segmentStart = normalizeLngLat(line[i]);
    const segmentEnd = normalizeLngLat(line[i + 1]);

    const segmentLength = calculateDistance(segmentStart, segmentEnd);
    if (segmentLength === 0) continue;

    const t = Math.max(0, Math.min(1, projectPointOnSegment(targetPoint, segmentStart, segmentEnd)));
    const projectedPoint = interpolate(segmentStart, segmentEnd, t);
    const distance = calculateDistance(targetPoint, projectedPoint);

    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = projectedPoint;
      nearestIndex = i;
      nearestT = t;
      distanceAlong = cumulativeDistance + segmentLength * t;
    }

    cumulativeDistance += segmentLength;
  }

  return {
    point: nearestPoint,
    distance: minDistance,
    index: nearestIndex,
    t: nearestT,
    along: distanceAlong,
  };
}

/**
 * Projects a point onto a line segment and returns the parameter t.
 * @param point - Point to project
 * @param segmentStart - Start of line segment
 * @param segmentEnd - End of line segment
 * @returns Parameter t (0-1) indicating position along segment
 */
function projectPointOnSegment(
  point: LngLat,
  segmentStart: LngLat,
  segmentEnd: LngLat
): number {
  const dx = segmentEnd.lng - segmentStart.lng;
  const dy = segmentEnd.lat - segmentStart.lat;
  const d2 = dx * dx + dy * dy;

  if (d2 === 0) return 0;

  const t = ((point.lng - segmentStart.lng) * dx + (point.lat - segmentStart.lat) * dy) / d2;
  return t;
}

/**
 * Calculates progress percentage along a route.
 * @param currentLocation - Current location
 * @param routeCoordinates - Route coordinates
 * @param totalRouteDistance - Total route distance in meters
 * @returns Progress percentage (0-100)
 */
export function calculateProgressAlongRoute(
  currentLocation: LngLatLike,
  routeCoordinates: LngLatLike[],
  totalRouteDistance: number
): number {
  if (totalRouteDistance === 0) return 0;

  const nearest = nearestPointOnLine(currentLocation, routeCoordinates);
  return Math.min(100, Math.max(0, (nearest.along / totalRouteDistance) * 100));
}

/**
 * Calculates total distance along a route.
 * @param coordinates - Route coordinates
 * @returns Total distance in meters
 */
export function calculateRouteDistance(coordinates: LngLatLike[]): number {
  if (coordinates.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += calculateDistance(coordinates[i], coordinates[i + 1]);
  }
  return totalDistance;
}

/**
 * Finds the current step index based on location along route.
 * @param currentLocation - Current location
 * @param routeCoordinates - Route coordinates
 * @param stepDistances - Array of distances for each step
 * @returns Current step index
 */
export function findStepIndex(
  currentLocation: LngLatLike,
  routeCoordinates: LngLatLike[],
  stepDistances: number[]
): number {
  const nearest = nearestPointOnLine(currentLocation, routeCoordinates);
  let cumulativeDistance = 0;

  for (let i = 0; i < stepDistances.length; i++) {
    cumulativeDistance += stepDistances[i];
    if (nearest.along <= cumulativeDistance) {
      return i;
    }
  }

  return stepDistances.length - 1;
}
