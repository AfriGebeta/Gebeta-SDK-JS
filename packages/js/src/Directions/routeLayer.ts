import type { Map as MapLibreMap } from 'maplibre-gl';
import { ROUTE_SOURCE_ID, ROUTE_LAYER_ID, DEFAULT_ROUTE_STYLE } from './constants';

export function initRouteLayer(map: MapLibreMap): void {
  if (!map.isStyleLoaded()) {
    map.once('style.load', () => initRouteLayer(map));
    return;
  }
  if (map.getSource(ROUTE_SOURCE_ID)) return;

  map.addSource(ROUTE_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
  });

  map.addLayer({
    id: ROUTE_LAYER_ID,
    type: 'line',
    source: ROUTE_SOURCE_ID,
    layout: {
      'line-join': DEFAULT_ROUTE_STYLE['line-join'],
      'line-cap': DEFAULT_ROUTE_STYLE['line-cap'],
      visibility: 'visible',
    },
    paint: {
      'line-color': DEFAULT_ROUTE_STYLE['line-color'],
      'line-width': DEFAULT_ROUTE_STYLE['line-width'],
      'line-opacity': DEFAULT_ROUTE_STYLE['line-opacity'],
    },
  });
}

export function updateRouteLayerData(
  map: MapLibreMap,
  coordinates: [number, number][]
): void {
  const source = map.getSource(ROUTE_SOURCE_ID);
  if (!source) return;
  (source as import('maplibre-gl').GeoJSONSource).setData({
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates },
  });
}

export function clearRouteLayerData(map: MapLibreMap): void {
  updateRouteLayerData(map, []);
}

export function updateRouteLayerStyle(
  map: MapLibreMap,
  style: { 'line-color'?: string; 'line-width'?: number; 'line-opacity'?: number }
): void {
  if (!map.getLayer(ROUTE_LAYER_ID)) return;
  if (style['line-color'] != null)
    map.setPaintProperty(ROUTE_LAYER_ID, 'line-color', style['line-color']);
  if (style['line-width'] != null)
    map.setPaintProperty(ROUTE_LAYER_ID, 'line-width', style['line-width']);
  if (style['line-opacity'] != null)
    map.setPaintProperty(ROUTE_LAYER_ID, 'line-opacity', style['line-opacity']);
}
