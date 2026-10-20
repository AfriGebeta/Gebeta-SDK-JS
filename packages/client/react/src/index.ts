export { GebetaMaps } from './GebetaMaps';
export type { GebetaMapsProps, GebetaMapsRef } from './GebetaMaps';

export { useClustering } from './hooks/useClustering';
export type { UseClusteringResult, MarkerData } from './hooks/useClustering';

export {
  GeocodingManager,
  DirectionsManager,
  FenceManager,
  NavigationManager,
  ClusteringManager,
  BrowserLocationProvider,
} from '@gebeta/js';

export {
  gebeta,
  Marker,
  Popup,
  LngLat,
  LngLatBounds,
  MercatorCoordinate,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  ScaleControl,
  AttributionControl,
  TerrainControl,
  addProtocol,
  removeProtocol,
} from '@gebeta/js';
export type {
  GebetaMapInstance,
  GebetaMarkerOptions,
  GebetaPopupOptions,
  GeoJSONSource,
  MapMouseEvent,
} from '@gebeta/js';
