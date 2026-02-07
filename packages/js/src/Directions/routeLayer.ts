import type { API } from '@gebeta/maps-api';
import { ROUTE_SOURCE_ID, ROUTE_LAYER_ID, DEFAULT_ROUTE_STYLE } from './constants';

type IMapAdapter = API.Platform.Types.IMapAdapter;

export function initRouteLayer(mapAdapter: IMapAdapter): void {
  if (!mapAdapter.isStyleLoaded()) {
    mapAdapter.once('style.load', () => initRouteLayer(mapAdapter));
    return;
  }
  if (mapAdapter.getSource(ROUTE_SOURCE_ID)) return;

  mapAdapter.addSource(ROUTE_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
  });

  mapAdapter.addLayer({
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
  mapAdapter: IMapAdapter,
  coordinates: [number, number][]
): void {
  const source = mapAdapter.getSource(ROUTE_SOURCE_ID);
  if (!source) return;
  const geoJsonSource = source as { setData?: (data: unknown) => void };
  if (geoJsonSource.setData) {
    geoJsonSource.setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates },
    });
  }
}

export function clearRouteLayerData(mapAdapter: IMapAdapter): void {
  updateRouteLayerData(mapAdapter, []);
}

export function updateRouteLayerStyle(
  mapAdapter: IMapAdapter,
  style: { 'line-color'?: string; 'line-width'?: number; 'line-opacity'?: number }
): void {
  const styleObj = mapAdapter.getStyle();
  const hasLayer = styleObj?.layers.some(layer => layer.id === ROUTE_LAYER_ID);
  if (!hasLayer) return;

  if (style['line-color'] != null)
    mapAdapter.setPaintProperty(ROUTE_LAYER_ID, 'line-color', style['line-color']);
  if (style['line-width'] != null)
    mapAdapter.setPaintProperty(ROUTE_LAYER_ID, 'line-width', style['line-width']);
  if (style['line-opacity'] != null)
    mapAdapter.setPaintProperty(ROUTE_LAYER_ID, 'line-opacity', style['line-opacity']);
}
