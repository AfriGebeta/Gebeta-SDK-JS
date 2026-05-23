export { AuthManager } from './Auth/AuthManager';
export { ClientIdManager } from './ClientId/ClientIdManager';
export { GeocodingManager } from './Geocoding/GeocodingManager';
export { DirectionsManager } from './Directions/DirectionsManager';
export { ClusteringManager } from './Clustering/ClusteringManager';
export { FenceManager } from './Fencing/FenceManager';
export { TrackingManager } from './Tracking/TrackingManager';
export { HttpTrackingManager } from './Tracking/HttpTrackingManager';
export { NavigationManager } from './Navigation/NavigationManager';
export { EventEmitter } from './utils/EventEmitter';

export {
  closePolygon,
  calculateCentroid,
  normalizeLngLat,
  isPolygonClosed,
  calculateDistance,
  isPointNear,
} from './Fencing/utils';
