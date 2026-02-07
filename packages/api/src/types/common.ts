import type { RouteData } from './data';

/**
 * Geographic coordinate with longitude and latitude.
 * @example { lng: 38.7, lat: 9.0 }
 */
export type LngLat = {
  /** Longitude in degrees (-180 to 180) */
  lng: number;
  /** Latitude in degrees (-90 to 90) */
  lat: number;
};

/**
 * A coordinate that can be represented as LngLat object, [lng, lat] array, or object with lng/lat properties.
 * Used for flexible coordinate input.
 */
export type LngLatLike = LngLat | [number, number] | { lng: number; lat: number };

/**
 * Corner position values for placing controls at map corners.
 */
export enum CornerPosition {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

/**
 * Position values for placing controls or UI elements on the map.
 * Includes corner positions, edge positions, and center.
 *
 * Valid values: 'top-left', 'top-right', 'bottom-left', 'bottom-right',
 * 'top', 'bottom', 'left', 'right', 'center'
 */
export enum Position {
  // Corner positions (from CornerPosition)
  TOP_LEFT = CornerPosition.TOP_LEFT,
  TOP_RIGHT = CornerPosition.TOP_RIGHT,
  BOTTOM_LEFT = CornerPosition.BOTTOM_LEFT,
  BOTTOM_RIGHT = CornerPosition.BOTTOM_RIGHT,
  // Edge positions
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  // Center position
  CENTER = 'center',
}

/**
 * Map style variant.
 * - 'standard': Default street map style
 * - 'satellite': Satellite imagery
 * - 'terrain': Terrain/topographic style
 */
export enum MapStyle {
  STANDARD = 'standard',
  SATELLITE = 'satellite',
  TERRAIN = 'terrain',
}

/**
 * Tracking precision level.
 * - 'low': HTTP tracking with ~15 second updates
 * - 'high': WebSocket tracking with ~5 second updates
 */
export enum Precision {
  LOW = 'low',
  HIGH = 'high',
}

/**
 * User role for tracking.
 * Default: 'driver'
 */
export type Role = 'driver' | string;
