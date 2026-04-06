import { DEFAULT_MARKER_ICONS, DEFAULT_MARKER_SIZES } from '../Markers/constants';

export const ROUTE_SOURCE_ID = 'gebeta-route';
export const ROUTE_LAYER_ID = 'gebeta-route';

export { DEFAULT_MARKER_ICONS, DEFAULT_MARKER_SIZES };

export const DEFAULT_ROUTE_STYLE = {
  'line-color': '#007cbf',
  'line-width': 4,
  'line-opacity': 0.8,
  'line-join': 'round' as const,
  'line-cap': 'round' as const,
} as const;

export const DEFAULT_FIT_BOUNDS_OPTIONS = {
  padding: 50,
  duration: 1000,
} as const;
