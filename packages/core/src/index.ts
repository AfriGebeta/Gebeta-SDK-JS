export { AuthManager } from './Auth/AuthManager';
export { resolveAuth } from './Auth/resolveAuth';
export type { ResolvedAuth } from './Auth/resolveAuth';
export { ClientIdManager } from './ClientId/ClientIdManager';
export { GeocodingManager } from './Geocoding/GeocodingManager';
export { DirectionsManager } from './Directions/DirectionsManager';
export { ClusteringManager } from './Clustering/ClusteringManager';
export { FenceManager } from './Fencing/FenceManager';
export { TrackingManager } from './Tracking/TrackingManager';
export { HttpTrackingManager } from './Tracking/HttpTrackingManager';
export { NavigationManager } from './Navigation/NavigationManager';
export { EventEmitter } from './utils/EventEmitter';
export { createTileTransform } from './utils/tileTransform';
export type { TileTransformFn, TileTransformResult } from './utils/tileTransform';

export {
  closePolygon,
  calculateCentroid,
  normalizeLngLat,
  isPolygonClosed,
  calculateDistance,
  isPointNear,
} from './Fencing/utils';
