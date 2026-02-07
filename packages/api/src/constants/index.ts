import type { MapStyle } from '../types/common';
import type { ClusteringOptions } from '../types/options';

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
 * Default fence style options.
 */
export const DEFAULT_FENCE_STYLE = {
  fillColor: '#ff0000',
  fillOpacity: 0.3,
  lineColor: '#ff0000',
  lineWidth: 2,
  lineOpacity: 1,
  lineDashArray: [2, 2],
  lineCap: 'butt' as const,
  lineJoin: 'miter' as const,
  borderColor: '#ff0000',
  borderWidth: 1,
  borderOpacity: 1,
} as const;
