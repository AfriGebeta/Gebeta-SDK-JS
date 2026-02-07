import type { CornerPosition, LngLat, LngLatLike, Position } from './common';

/**
 * Route data structure returned from directions API and used for navigation.
 */
export interface RouteData {
  /** GeoJSON LineString geometry of the route */
  geometry: {
    type: 'LineString';
    /** Array of [lng, lat] coordinate pairs */
    coordinates: [number, number][];
  };
  /** Origin point of the route */
  origin: LngLat;
  /** Destination point of the route */
  destination: LngLat;
  /** Total distance (string like "5.2 km" or number in meters) */
  distance?: string | number | null;
  /** Total duration (string like "15 min" or number in seconds) */
  duration?: string | number | null;
  /** Turn-by-turn instructions */
  instructions?: RouteInstruction[];
  /** Route summary (total length, time) */
  summary?: RouteSummary;
  /** Additional route properties */
  [key: string]: any;
}

/**
 * Single instruction/step in a route.
 * Represents a maneuver or direction change along the route.
 */
export interface RouteInstruction {
  /** Maneuver type (Valhalla maneuver type code) */
  type?: number;
  /** Text instruction (e.g., "Turn right onto Main St") */
  instruction?: string;
  /** Verbal instruction before the maneuver */
  verbal_pre_transition_instruction?: string;
  /** Verbal instruction after the maneuver */
  verbal_post_transition_instruction?: string;
  /** Bearing after completing this instruction (degrees, 0-360) */
  bearing_after?: number;
  /** Time to complete this step (seconds) */
  time?: number;
  /** Length of this step (meters) */
  length?: number;
  /** Coordinate where this instruction occurs [lng, lat] */
  coord?: [number, number];
  /** Icon/emoji for this instruction */
  icon?: string;
  /** Index of this instruction in the route */
  index?: number;
  /** Alternative instruction text */
  path?: string;
  /** Turn direction */
  turn?: string;
  /** Additional instruction properties */
  [key: string]: any;
}

/**
 * Summary of route statistics.
 */
export interface RouteSummary {
  /** Total route length (kilometers) */
  length?: number;
  /** Total route time (seconds) */
  time?: number;
  /** Additional summary properties */
  [key: string]: any;
}

/**
 * Result from geocoding (forward geocoding: name → coordinates).
 */
export interface GeocodeResult {
  /** Place name */
  name?: string;
  /** Geographic coordinates */
  lngLat: LngLat;
  /** Additional geocoding result properties */
  [key: string]: any;
}

/**
 * Definition of a fence (geofence/polygon).
 * Used for storing and rendering fences.
 */
export interface FenceDefinition {
  /** Unique identifier for the fence */
  id?: string | null;
  /** Name/label for the fence */
  name?: string;
  /** Array of points defining the fence boundary */
  points: LngLatLike[];
  /** Fill color (CSS color string) */
  color?: string;
  /** Border color (CSS color string) */
  borderColor?: string;
  /**
   * Overlay content displayed at fence centroid. Platform-specific:
   * - JS: string (HTML) or HTMLElement
   * - React: ReactNode
   * - React Native: View component
   */
  overlayContent?: any;
  /** Options for positioning the overlay */
  overlayOptions?: {
    /** Anchor position for overlay */
    anchor?: Omit<Position, CornerPosition>;
    /** Pixel offset [x, y] */
    offset?: [number, number];
  };
  /** Custom marker ID for the first point */
  markerId?: string;
}

/**
 * Data structure for a marker on the map.
 */
export interface MarkerData {
  /** Unique identifier for the marker */
  id: string;
  /** Marker position */
  lngLat: LngLatLike;
  /** Image URL for marker icon */
  imageUrl?: string;
  /** Marker size [width, height] in pixels (default: [30, 30]) */
  size?: [number, number];
  /** Click handler callback
   *
   * @param lngLat - The longitude and latitude of the marker
   * @param marker - The marker object
   * @param event - The event object (platform-specific)
   */
  onClick?: ((lngLat: LngLat, marker: any, event: any) => void) | null;
  /** Z-index for marker layering */
  zIndex?: number;
  /**
   * Popup content displayed when marker is clicked. Platform-specific:
   * - JS: string (HTML) or HTMLElement
   * - React: ReactNode
   * - React Native: View component
   */
  popupContent?: any;
}

/**
 * Result returned from adding a marker.
 */
export interface AddMarkerResult {
  /** Marker instance (platform-specific) */
  marker?: any;
  /** Popup instance (platform-specific, if popup was created) */
  popup?: any;
  /** Marker ID */
  id: string;
}

/**
 * Cluster data structure from clustering algorithm.
 */
export interface ClusterData {
  /** Cluster ID */
  id: number;
  /** GeoJSON Point geometry */
  geometry: {
    type: 'Point';
    /** Cluster center coordinate [lng, lat] */
    coordinates: [number, number];
  };
  /** Cluster properties */
  properties: {
    /** Whether this is a cluster (true) or individual marker (false) */
    cluster: boolean;
    /** Number of points in cluster (if cluster is true) */
    point_count?: number;
    /** Marker ID (if cluster is false) */
    markerId?: string;
    /** Additional cluster properties */
    [key: string]: any;
  };
}
