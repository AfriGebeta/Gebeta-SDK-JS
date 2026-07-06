import type { API } from '@gebeta/api';
import { DYNAMIC_POLYLINE_SOURCE_ID, DYNAMIC_POLYLINE_LAYER_ID } from './constants';

type FenceStyleOptions = API.Fencing.Types.StyleOptions;
type LngLatLike = API.Common.Types.LngLatLike;
type IMapAdapter = API.Platform.Types.IMapAdapter;

/**
 * The in-progress fence outline drawn while adding points. Ported from web `dynamicPolyline.ts`;
 * platform-agnostic (`IMapAdapter` only). Empty/short lines are sanitized by the renderer.
 */
export function initDynamicPolyline(mapAdapter: IMapAdapter, style: FenceStyleOptions): void {
  if (mapAdapter.getSource(DYNAMIC_POLYLINE_SOURCE_ID)) return;

  mapAdapter.addSource(DYNAMIC_POLYLINE_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
  });

  mapAdapter.addLayer({
    id: DYNAMIC_POLYLINE_LAYER_ID,
    type: 'line',
    source: DYNAMIC_POLYLINE_SOURCE_ID,
    layout: {
      'line-cap': style.lineCap ?? 'butt',
      'line-join': style.lineJoin ?? 'miter',
    },
    paint: {
      'line-color': style.lineColor ?? '#ff0000',
      'line-width': style.lineWidth ?? 2,
      'line-opacity': style.lineOpacity ?? 1,
      ...(style.lineDashArray && style.lineDashArray.length > 0
        ? { 'line-dasharray': style.lineDashArray }
        : {}),
    },
  });
}

export function updateDynamicPolyline(mapAdapter: IMapAdapter, points: LngLatLike[]): void {
  const source = mapAdapter.getSource(DYNAMIC_POLYLINE_SOURCE_ID) as
    | { setData?: (data: unknown) => void }
    | undefined;
  source?.setData?.({
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: points },
  });
}

export function clearDynamicPolyline(mapAdapter: IMapAdapter): void {
  const style = mapAdapter.getStyle();
  if (style?.layers.some(l => l.id === DYNAMIC_POLYLINE_LAYER_ID)) {
    mapAdapter.removeLayer(DYNAMIC_POLYLINE_LAYER_ID);
  }
  if (mapAdapter.getSource(DYNAMIC_POLYLINE_SOURCE_ID)) {
    mapAdapter.removeSource(DYNAMIC_POLYLINE_SOURCE_ID);
  }
}
