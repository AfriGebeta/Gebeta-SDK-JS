import type { CornerPosition, LngLat, Position, Precision, Role } from './common';
import type { RouteData, ClusterData } from './data';
import type { AuthParam, ServiceAccountAuth } from './auth';

/**
 * Options for constructing a GebetaMaps instance (imperative JS API).
 * Used with: `new GebetaMaps({ apiKey, clustering })`
 *
 * Note: For React/React Native/Vue components, use `GebetaMapProps` instead,
 * which combines constructor and init options into a single props interface.
 */
export interface GebetaMapsConstructorOptions {
  /** @deprecated Use `auth` instead. API key authentication is insecure — the key is visible in browser devtools. */
  apiKey?: string;
  /** Service account authentication credentials (access + refresh token pair) */
  auth?: ServiceAccountAuth;
  /** Clustering configuration options */
  clustering?: ClusteringOptions;
}

/**
 * Options for initializing the map (imperative JS API).
 * Used with: `map.init({ container, styleUrl, ... })`
 *
 * This is called AFTER constructing the instance. For component-based APIs
 * (React/RN/Vue), these options are combined with constructor options into
 * `GebetaMapProps` and passed as props when rendering the component.
 */
export interface GebetaMapsInitOptions {
  /**
   * Container for the map. Platform-specific:
   * - JS: string selector (e.g., '#map') or HTMLElement
   * - React: ref to container element
   * - React Native: view ref
   */
  container?: any;
  /** Custom style URL (map style JSON URL) */
  styleUrl?: string;
  /** Custom style object (map style JSON object) */
  style?: object;
  /** Whether to show fullscreen popup control (default: true) */
  fullscreenControl?: boolean;
  /** Whether to show navigation controls (zoom +/-) (default: false) */
  navigationControl?: boolean;
  /** Position of navigation controls (default: 'top-right') */
  navigationControlPosition?: string;
  /** Whether to show style selector toggle (satellite/standard/terrain) (default: false) */
  satelliteToggle?: boolean;
  /** Custom style URLs and images for style selector */
  satelliteToggleOptions?: SatelliteToggleOptions;
  /** Additional map options (platform-specific) */
  [key: string]: any;
}

/**
 * Options for marker clustering.
 */
export interface ClusteringOptions {
  /** Enable clustering (default: false) */
  enabled?: boolean;
  /** Cluster radius in pixels (default: 50) */
  radius?: number;
  /** Maximum zoom level for clustering (default: 16) */
  maxZoom?: number;
  /** Custom image URL for cluster markers */
  clusterImage?: string | null;
  /** Custom click handler for clusters. If not provided, defaults to zooming into cluster. */
  clusterOnClick?: ((cluster: ClusterData, event: MouseEvent) => void) | null;
  /** Show count badge on cluster markers (default: false) */
  showClusterCount?: boolean;
}

/**
 * Options for styling fences (geofences/polygons).
 */
export interface FenceStyleOptions {
  /** Fill color (CSS color string, e.g., '#ff0000' or 'rgba(255,0,0,0.5)') */
  fillColor?: string;
  /** Fill opacity (0.0 to 1.0) */
  fillOpacity?: number;
  /** Line/border color (CSS color string) */
  lineColor?: string;
  /** Line width in pixels */
  lineWidth?: number;
  /** Line opacity (0.0 to 1.0) */
  lineOpacity?: number;
  /** Dash array for dashed lines (e.g., [2, 2] for 2px dash, 2px gap) */
  lineDashArray?: number[];
  /** Line cap style: 'butt' (flat), 'round' (rounded), 'square' (square cap) */
  lineCap?: 'butt' | 'round' | 'square';
  /** Line join style: 'bevel' (beveled), 'round' (rounded), 'miter' (sharp) */
  lineJoin?: 'bevel' | 'round' | 'miter';
  /** Border color (CSS color string) */
  borderColor?: string;
  /** Border width in pixels */
  borderWidth?: number;
  /** Border opacity (0.0 to 1.0) */
  borderOpacity?: number;
}

/**
 * Options for adding a point to a fence.
 */
export interface FencePointOptions {
  /**
   * Overlay content to display at the fence centroid. Platform-specific:
   * - JS: string (HTML) or HTMLElement
   * - React: ReactNode
   * - React Native: View component
   */
  overlayContent?: any;
  /** Options for positioning the overlay */
  overlayOptions?: OverlayOptions;
  /** Name/label for the fence */
  name?: string;
  /** Custom marker ID for the first point */
  markerId?: string;
}

/**
 * Options for overlays (HTML/content displayed at coordinates).
 */
export interface OverlayOptions {
  /**
   * Anchor point for the overlay relative to the coordinate.
   * Valid values: 'center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
   * Default: 'center'
   */
  anchor?: Position;
  /** Pixel offset [x, y] from the anchor point */
  offset?: [number, number];
  /** Whether the overlay can be closed (shows close button) */
  closeable?: boolean;
  /**
   * Close button content. Platform-specific:
   * - JS: HTML string (e.g., '&times;')
   * - React: ReactNode
   * - React Native: View component
   */
  closeButtonContent?: any;
  /** Callback when overlay is closed */
  onClose?: () => void;
  /** CSS class name (JS only) */
  className?: string;
  /** Z-index for layering */
  zIndex?: number;
}

/**
 * Options for getting directions between points.
 */
export interface DirectionsOptions {
  /** Intermediate waypoints along the route */
  waypoints?: LngLat[];
  /** Average speed in km/h for duration estimation */
  avgSpeedKmh?: number;
}

/**
 * Options for displaying a route on the map.
 */
export interface DisplayRouteOptions {
  /** Whether to show origin/destination markers (default: true) */
  showMarkers?: boolean;
  /** Custom icon URL for origin marker */
  originIcon?: string;
  /** Custom icon URL for destination marker */
  destinationIcon?: string;
  /** Custom icon URL for waypoint markers */
  waypointIcon?: string;
}

/**
 * Style options for route line display.
 */
export interface RouteStyleOptions {
  /** Route line color (CSS color string, default: '#007cbf') */
  'line-color'?: string;
  /** Route line width in pixels (default: 4) */
  'line-width'?: number;
  /** Route line opacity (0.0 to 1.0, default: 0.8) */
  'line-opacity'?: number;
  /** Dash array for dashed route line (e.g., [5, 5]) */
  'line-dasharray'?: number[];
}

/**
 * Options for starting navigation.
 */
export interface NavigationStartOptions {
  /** Pre-calculated route to use. If not provided, will calculate from origin/destination. */
  route?: RouteData;
  /** Starting point (required if route not provided) */
  origin?: LngLat;
  /** Destination point (required if route not provided) */
  destination?: LngLat;
  /** Waypoints for route calculation (if route not provided) */
  waypoints?: LngLat[];
  /** User ID for tracking (required) */
  userId: string;
  /** User role (default: 'driver') */
  role?: Role;
  /**
   * Tracking precision (default: 'high')
   * - 'low': HTTP tracking (~15s updates)
   * - 'high': WebSocket tracking (~5s updates)
   */
  precision?: Precision;
  /** Use remote tracking feed instead of device GPS */
  useRemoteFeed?: boolean;
  /** Custom location provider (overrides default browser/device GPS) */
  locationProvider?: ILocationProvider;
}

/**
 * Options for navigation controller behavior.
 */
export interface NavigationControllerOptions {
  /** Distance threshold in meters for detecting off-route (default: 40) */
  offRouteThresholdMeters?: number;
  /** Distance threshold in meters for arrival detection (default: 25) */
  arriveThresholdMeters?: number;
  /** Automatically reroute when off-route (default: false) */
  autoReroute?: boolean;
  /** Custom reroute function. If not provided, uses default directions API.
   *
   * @param origin - The origin point
   * @param destination - The destination point
   * @returns A promise that resolves to the route data
   */
  rerouteFn?: ((origin: LngLat, destination: LngLat) => Promise<RouteData>) | null;
}

/**
 * Options for WebSocket tracking client.
 */
export interface TrackingClientOptions {
  /** @deprecated Use `auth` instead. */
  bearerToken?: string;
  /** Auth manager or legacy API key string */
  auth?: AuthParam;
  /** User ID for tracking */
  userId?: string;
  /** User role (default: 'driver') */
  role?: Role;
  /** Interval in milliseconds for sending location updates (default: 15000) */
  sendIntervalMs?: number;
  /** Custom location provider (overrides default browser GPS) */
  locationProvider?: ILocationProvider;
  /** Automatically reconnect on disconnect (default: true) */
  autoReconnect?: boolean;
  /** Maximum delay in milliseconds before reconnection attempt (default: 15000) */
  maxReconnectDelayMs?: number;
}

/**
 * Options for HTTP tracking client.
 */
export interface HttpTrackingClientOptions {
  /** @deprecated Use `auth` instead. */
  bearerToken?: string;
  /** Auth manager or legacy API key string */
  auth?: AuthParam;
  /** User ID for tracking */
  userId?: string;
  /** User role (default: 'driver') */
  role?: Role;
  /** Custom location provider (overrides default browser GPS) */
  locationProvider?: ILocationProvider;
}

/**
 * Options for customizing style selector (satellite/standard/terrain toggle).
 */
export interface SatelliteToggleOptions {
  /** Custom URL for standard style JSON */
  standardStyleUrl?: string;
  /** Custom URL for satellite style JSON */
  satelliteStyleUrl?: string;
  /** Custom URL for terrain style JSON */
  terrainStyleUrl?: string;
  /** Custom image URL for standard style preview */
  standardImageUrl?: string;
  /** Custom image URL for satellite style preview */
  satelliteImageUrl?: string;
  /** Custom image URL for terrain style preview */
  terrainImageUrl?: string;
}

/**
 * Options for rendering multiple fences from an array.
 */
export interface RenderFencesOptions {
  /** Clear existing fences before rendering (default: true) */
  clearExisting?: boolean;
  /** Automatically assign colors using HSL color wheel (default: true) */
  autoColor?: boolean;
  /** Starting hue for auto-coloring (0-360, default: 0) */
  startHue?: number;
  /** Hue step between fences for auto-coloring (0-360, default: 180) */
  hueStep?: number;
  /** Anchor position for fence overlays (default: 'bottom') */
  overlayAnchor?: Omit<Position, CornerPosition>;
  /** Make fences persistent (survive clear operations) (default: false) */
  persistent?: boolean;
}

/**
 * Interface for location providers (GPS/geolocation).
 *
 * **Naming Convention:** Uses `I` prefix because this is a contract/abstraction
 * that platform packages must implement. Adapter interfaces (contracts) use `I` prefix;
 * data structures and options do not.
 *
 * Implementations provide device location updates.
 */
export interface ILocationProvider {
  /**
   * Start providing location updates.
   * @param onLocation - Callback function called with location data
   * @returns Optional cleanup function to stop location updates
   */
  start(onLocation: (location: LocationData) => void): (() => void) | void;
  /** Stop providing location updates */
  stop?(): void;
  /** Last known location (if available) */
  lastKnownLocation?: LocationData;
}

/**
 * Location data from GPS/geolocation.
 */
export interface LocationData {
  /** Latitude in degrees */
  lat: number;
  /** Longitude in degrees */
  lng: number;
  /** Speed in m/s (if available) */
  speed?: number | null;
  /** Bearing/heading in degrees (0-360, if available) */
  bearing?: number | null;
  /** Timestamp in milliseconds (if available) */
  timestamp?: number;
}
