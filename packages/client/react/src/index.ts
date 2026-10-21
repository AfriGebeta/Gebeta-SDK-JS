export { GebetaMap } from './GebetaMap';
export type { GebetaMapProps, GebetaMapRef } from './GebetaMap';

export { useClustering } from './hooks/useClustering';
export type { UseClusteringResult, MarkerData } from './hooks/useClustering';

export {
  GebetaMaps,
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
