import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { createMarker } from '../Markers/markers';
import { DEFAULT_MARKER_ICONS, DEFAULT_MARKER_SIZES } from '../Markers/constants';

export function createRouteMarker(
  map: MapLibreMap,
  lngLat: [number, number],
  iconUrl: string,
  size: [number, number] = DEFAULT_MARKER_SIZES.waypoint
): MapLibreMarker {
  const marker = createMarker(map, lngLat, {
    imageUrl: iconUrl,
    size,
    className: 'gebeta-route-marker',
  });
  if (!marker) {
    throw new Error('Failed to create route marker');
  }
  return marker;
}

export function getMarkerIcon(
  type: 'origin' | 'destination' | 'waypoint',
  customIcon?: string
): string {
  return customIcon ?? DEFAULT_MARKER_ICONS[type];
}

export function getMarkerSize(type: 'origin' | 'destination' | 'waypoint'): [number, number] {
  return DEFAULT_MARKER_SIZES[type];
}
