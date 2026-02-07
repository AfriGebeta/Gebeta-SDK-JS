import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { DEFAULT_MARKER_ICONS, DEFAULT_MARKER_SIZES } from './constants';

export function createRouteMarker(
  map: MapLibreMap,
  lngLat: [number, number],
  iconUrl: string,
  size: [number, number] = DEFAULT_MARKER_SIZES.waypoint
): MapLibreMarker {
  const el = document.createElement('div');
  el.style.backgroundImage = `url('${iconUrl}')`;
  el.style.backgroundSize = 'contain';
  el.style.backgroundRepeat = 'no-repeat';
  el.style.width = `${size[0]}px`;
  el.style.height = `${size[1]}px`;
  el.style.cursor = 'pointer';
  return new maplibre.Marker({ element: el }).setLngLat(lngLat).addTo(map);
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
