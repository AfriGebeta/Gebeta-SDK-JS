export const ROUTE_SOURCE_ID = 'gebeta-route';
export const ROUTE_LAYER_ID = 'gebeta-route';

export const DEFAULT_ROUTE_STYLE = {
  'line-color': '#007cbf',
  'line-width': 4,
  'line-opacity': 0.8,
  'line-join': 'round' as const,
  'line-cap': 'round' as const,
};

export const DEFAULT_MARKER_ICONS: Record<'origin' | 'destination' | 'waypoint', string> = {
  origin: 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png',
  destination: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
  waypoint: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
};

export const DEFAULT_MARKER_SIZES: Record<'origin' | 'destination' | 'waypoint', [number, number]> =
  {
    origin: [30, 30],
    destination: [30, 30],
    waypoint: [24, 24],
  };

export const DEFAULT_FIT_BOUNDS_OPTIONS = {
  padding: 60,
  duration: 800,
};
