export const DEFAULT_MARKER_IMAGE = 'https://cdn-icons-png.flaticon.com/512/484/484167.png';
export const DEFAULT_MARKER_SIZE: [number, number] = [30, 30];

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
