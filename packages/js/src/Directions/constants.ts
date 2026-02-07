export const ROUTE_SOURCE_ID = 'gebeta-route';
export const ROUTE_LAYER_ID = 'gebeta-route';

export const DEFAULT_MARKER_ICONS = {
  origin: 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png',
  destination: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
  waypoint: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
} as const;

export const DEFAULT_MARKER_SIZES = {
  origin: [25, 25] as [number, number],
  destination: [25, 25] as [number, number],
  waypoint: [20, 20] as [number, number],
} as const;

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
