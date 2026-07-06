import type { API } from '@gebeta/api';
import { ROUTE_SOURCE_ID, ROUTE_LAYER_ID, DEFAULT_ROUTE_STYLE } from './constants';

type IMapAdapter = API.Platform.Types.IMapAdapter;

/** Valid "no route" GeoJSON — an empty FeatureCollection renders nothing without erroring. */
const EMPTY_ROUTE_DATA = { type: 'FeatureCollection', features: [] } as const;

/**
 * Route-line source/layer helpers, driven purely through the abstract `IMapAdapter`. On RN the
 * adapter records these into the declarative MapSpecStore, which renders them as
 * `<GeoJSONSource>`/`<Layer>`. Same logic as the web `routeLayer.ts` (the calls are
 * platform-agnostic).
 */
export function initRouteLayer(mapAdapter: IMapAdapter): void {
  if (mapAdapter.getSource(ROUTE_SOURCE_ID)) return;

  // Seed with an empty FeatureCollection, not a zero-coordinate LineString: MapLibre native
  // rejects a LineString with fewer than two points ("must have two or more coordinate points").
  mapAdapter.addSource(ROUTE_SOURCE_ID, {
    type: 'geojson',
    data: EMPTY_ROUTE_DATA,
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
  const source = mapAdapter.getSource(ROUTE_SOURCE_ID) as
    | { setData?: (data: unknown) => void }
    | undefined;
  // Fewer than two points can't form a line; clear to the empty FeatureCollection instead of
  // emitting an invalid LineString.
  const data =
    coordinates.length >= 2
      ? { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } }
      : EMPTY_ROUTE_DATA;
  source?.setData?.(data);
}

export function clearRouteLayerData(mapAdapter: IMapAdapter): void {
  updateRouteLayerData(mapAdapter, []);
}

export function updateRouteLayerStyle(
  mapAdapter: IMapAdapter,
  style: { 'line-color'?: string; 'line-width'?: number; 'line-opacity'?: number }
): void {
  const hasLayer = mapAdapter.getStyle()?.layers.some(layer => layer.id === ROUTE_LAYER_ID);
  if (!hasLayer) return;
  if (style['line-color'] != null)
    mapAdapter.setPaintProperty(ROUTE_LAYER_ID, 'line-color', style['line-color']);
  if (style['line-width'] != null)
    mapAdapter.setPaintProperty(ROUTE_LAYER_ID, 'line-width', style['line-width']);
  if (style['line-opacity'] != null)
    mapAdapter.setPaintProperty(ROUTE_LAYER_ID, 'line-opacity', style['line-opacity']);
}
