export { GebetaMap } from './GebetaMap';
export type { GebetaMapProps } from './GebetaMap';

export {
  GebetaMapContext,
  useGebetaMapContext,
  useGebetaMapContextOrNull,
  type GebetaMapContextValue,
} from './context/MapContext';

export { type PlatformContext } from './adapters/createPlatform';

export { DirectionsManager } from './Directions';
export {
  ROUTE_SOURCE_ID,
  ROUTE_LAYER_ID,
  DEFAULT_ROUTE_STYLE,
  DEFAULT_MARKER_ICONS,
  DEFAULT_MARKER_SIZES,
} from './Directions';

export { useDirections, type UseDirectionsResult } from './hooks/useDirections';
export { useUserLocation, type UseUserLocationResult } from './hooks/useUserLocation';

// Re-export MapLibre's declarative user-location components so consumers can render the
// location dot/puck without importing @maplibre/maplibre-react-native directly.
export { UserLocation } from '@maplibre/maplibre-react-native';
