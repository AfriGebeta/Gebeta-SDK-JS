export { GeocodingManager } from './Geocoding/GeocodingManager';
export { DirectionsManager } from './Directions/DirectionsManager';
export { ClusteringManager } from './Clustering/ClusteringManager';
export { FenceManager } from './Fencing/FenceManager';
export { TrackingClient } from './Tracking/TrackingClient';
export { HttpTrackingClient } from './Tracking/HttpTrackingClient';
export { OfflineQueue } from './Tracking/OfflineQueue';
export type { QueuedRequest, OfflineQueueOptions } from './Tracking/OfflineQueue';
export { NavController } from './Navigation/NavController';
export { EventEmitter } from './utils/EventEmitter';

export {
  closePolygon,
  calculateCentroid,
  normalizeLngLat,
  isPolygonClosed,
  calculateDistance,
  isPointNear,
} from './Fencing/utils';
