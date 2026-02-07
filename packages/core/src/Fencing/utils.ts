import type { API } from '@gebeta/maps-api';

type LngLat = API.Common.Types.LngLat;
type LngLatLike = API.Common.Types.LngLatLike;

/**
 * Calculate the centroid (center point) of a polygon.
 * For closed polygons, excludes the duplicate closing point.
 * @param points - Array of polygon points
 * @returns Centroid coordinates
 */
export function calculateCentroid(points: LngLatLike[]): LngLat {
  if (points.length === 0) {
    throw new Error('Cannot calculate centroid of empty point array');
  }

  if (points.length === 1) {
    const point = Array.isArray(points[0]) ? { lng: points[0][0], lat: points[0][1] } : points[0];
    return { lng: point.lng, lat: point.lat };
  }

  let uniquePoints = points;
  if (points.length > 2) {
    const first = normalizeLngLat(points[0]);
    const last = normalizeLngLat(points[points.length - 1]);
    if (first.lat === last.lat && first.lng === last.lng) {
      uniquePoints = points.slice(0, -1);
    }
  }

  let sumLat = 0;
  let sumLng = 0;

  for (const point of uniquePoints) {
    const lngLat = Array.isArray(point) ? { lng: point[0], lat: point[1] } : point;
    sumLat += lngLat.lat;
    sumLng += lngLat.lng;
  }

  return {
    lat: sumLat / uniquePoints.length,
    lng: sumLng / uniquePoints.length,
  };
}

/**
 * Normalize LngLatLike to LngLat format.
 * @param point - Point in any format (array or object)
 * @returns Normalized LngLat object
 */
export function normalizeLngLat(point: LngLatLike): LngLat {
  if (Array.isArray(point)) {
    return { lng: point[0], lat: point[1] };
  }
  return point;
}

/**
 * Check if a polygon is closed (first and last points are the same).
 * @param points - Array of polygon points
 * @returns True if polygon is closed
 */
export function isPolygonClosed(points: LngLatLike[]): boolean {
  if (points.length < 2) return false;
  const first = normalizeLngLat(points[0]);
  const last = normalizeLngLat(points[points.length - 1]);
  return first.lat === last.lat && first.lng === last.lng;
}

/**
 * Close a polygon by adding the first point at the end if not already closed.
 * @param points - Array of polygon points
 * @returns Closed polygon points array
 */
export function closePolygon(points: LngLatLike[]): LngLatLike[] {
  if (points.length < 3) return [...points];
  if (isPolygonClosed(points)) return [...points];
  return [...points, points[0]];
}

/**
 * Calculate distance between two points in meters using Haversine formula.
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Distance in meters
 */
export function calculateDistance(point1: LngLatLike, point2: LngLatLike): number {
  const p1 = normalizeLngLat(point1);
  const p2 = normalizeLngLat(point2);

  const R = 6371000;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if a point is near another point within a threshold distance.
 * @param point1 - First point
 * @param point2 - Second point
 * @param thresholdMeters - Threshold distance in meters (default: 50)
 * @returns True if points are within threshold
 */
export function isPointNear(point1: LngLatLike, point2: LngLatLike, thresholdMeters = 50): boolean {
  return calculateDistance(point1, point2) <= thresholdMeters;
}
