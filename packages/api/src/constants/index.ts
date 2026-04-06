import type { MapStyle } from '../types/common';
import type { ClusteringOptions } from '../types/options';
import type { LocationProviderOptions } from '../types/platform';
import { Colors } from './colors';

export * from './colors';

/**
 * Map style definitions with URLs and preview images.
 * Used by style selector control.
 */
export const MAP_STYLES: Record<MapStyle, { url: string; imageUrl: string; label: string }> = {
  standard: {
    url: 'https://tiles.gebeta.app/styles/standard/style.json',
    imageUrl: 'https://tiles.gebeta.app/static/standard.jpg',
    label: 'Standard',
  },
  satellite: {
    url: 'https://tiles.gebeta.app/styles/raster/raster.json',
    imageUrl: 'https://tiles.gebeta.app/static/satellite.jpg',
    label: 'Satellite',
  },
  terrain: {
    url: 'https://tiles.gebeta.app/styles/standard/terrain/terrain.json',
    imageUrl: 'https://tiles.gebeta.app/static/terrain.jpg',
    label: 'Terrain',
  },
};

/**
 * Default style URL for map initialization.
 */
export const DEFAULT_STYLE_URL = 'https://tiles.gebeta.app/styles/standard/style.json';

/**
 * Event names emitted by AuthManager.
 */
export const AuthEvents = {
  tokenRefreshed: 'token:refreshed',
  tokenRefreshFailed: 'token:refresh_failed',
} as const;

/**
 * URLs for service account authentication endpoints.
 */
export const AUTH_URLS = {
  /** Exchange client_token + server_token for access/refresh token pair */
  auth: 'https://mapapi.gebeta.app/api/v1/external/auth',
  /** Refresh an expired access token using a refresh token */
  refresh: 'https://mapapi.gebeta.app/api/v1/external/auth/refresh',
} as const;

/**
 * Base URLs for Gebeta Maps API endpoints.
 */
export const API_BASE_URLS = {
  /** Directions API endpoint */
  directions: 'https://mapapi.gebeta.app/api/route/direction/',
  /** Geocoding API endpoint */
  geocoding: 'https://mapapi.gebeta.app/api/v1/route',
  /** WebSocket tracking endpoint */
  tracking: 'wss://track.gebeta.app/v1/track',
  /** HTTP tracking endpoint */
  trackingHttp: 'https://track.gebeta.app/v1/driver/location',
} as const;

/**
 * Base URL for static assets (icons, images).
 */
export const ASSETS_BASE_URL = 'https://assets.gebeta.app' as const;

/**
 * Default position values for controls.
 */
export const DEFAULT_POSITIONS = {
  topLeft: 'top-left',
  topRight: 'top-right',
  bottomLeft: 'bottom-left',
  bottomRight: 'bottom-right',
} as const;

/**
 * Default tracking interval in milliseconds (15 seconds).
 */
export const TRACKING_INTERVAL_MS = 15000;

/**
 * Default average speed in km/h for route duration estimation (30 km/h).
 */
export const DEFAULT_AVG_SPEED_KMH = 30;

/**
 * Default navigation controller options.
 */
export const DEFAULT_NAVIGATION_OPTIONS = {
  /** Off-route detection threshold in meters */
  offRouteThresholdMeters: 40,
  /** Arrival detection threshold in meters */
  arriveThresholdMeters: 25,
  /** Automatically reroute when off-route */
  autoReroute: false,
} as const;

/**
 * Default clustering options.
 */
export const DEFAULT_CLUSTERING_OPTIONS: Partial<ClusteringOptions> = {
  radius: 50,
  maxZoom: 16,
  showClusterCount: false,
};

/**
 * Default location provider options for geolocation.
 */
export const DEFAULT_LOCATION_PROVIDER_OPTIONS: Required<LocationProviderOptions> = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

/**
 * Default fence style options.
 */
export const DEFAULT_FENCE_STYLE = {
  fillColor: Colors.FENCE_DEFAULT_COLOR,
  fillOpacity: 0.3,
  lineColor: Colors.FENCE_DEFAULT_COLOR,
  lineWidth: 2,
  lineOpacity: 1,
  lineDashArray: [2, 2],
  lineCap: 'butt' as const,
  lineJoin: 'miter' as const,
  borderColor: Colors.FENCE_DEFAULT_BORDER_COLOR,
  borderWidth: 1,
  borderOpacity: 1,
} as const;
