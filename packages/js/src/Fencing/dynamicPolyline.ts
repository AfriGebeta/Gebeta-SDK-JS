import type { API } from '@gebeta/maps-api';
import { DYNAMIC_POLYLINE_SOURCE_ID, DYNAMIC_POLYLINE_LAYER_ID } from './constants';

type FenceStyleOptions = API.Fencing.Types.StyleOptions;
type LngLatLike = API.Common.Types.LngLatLike;
type IMapAdapter = API.Platform.Types.IMapAdapter;

export function initDynamicPolyline(mapAdapter: IMapAdapter, style: FenceStyleOptions): void {
  if (mapAdapter.getSource(DYNAMIC_POLYLINE_SOURCE_ID)) {
    return;
  }

  mapAdapter.addSource(DYNAMIC_POLYLINE_SOURCE_ID, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
    },
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
  const source = mapAdapter.getSource(DYNAMIC_POLYLINE_SOURCE_ID);
  const geoJsonSource = source as { type?: string; setData?: (data: unknown) => void };
  if (geoJsonSource.type !== 'geojson' || !geoJsonSource.setData) return;

  geoJsonSource.setData({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points,
    },
  });
}

export function updateDynamicPolylineStyle(
  mapAdapter: IMapAdapter,
  points: LngLatLike[],
  style: FenceStyleOptions
): void {
  const styleObj = mapAdapter.getStyle();
  const hasLayer = styleObj?.layers.some(layer => layer.id === DYNAMIC_POLYLINE_LAYER_ID);
  if (!hasLayer) {
    initDynamicPolyline(mapAdapter, style);
  }

  if (style.lineColor !== undefined) {
    mapAdapter.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-color', style.lineColor);
  }
  if (style.lineWidth !== undefined) {
    mapAdapter.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-width', style.lineWidth);
  }
  if (style.lineOpacity !== undefined) {
    mapAdapter.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-opacity', style.lineOpacity);
  }
  if (style.lineDashArray !== undefined) {
    if (style.lineDashArray.length > 0) {
      mapAdapter.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-dasharray', style.lineDashArray);
    } else {
      mapAdapter.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-dasharray', null);
    }
  }
  if (style.lineCap !== undefined) {
    mapAdapter.setLayoutProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-cap', style.lineCap);
  }
  if (style.lineJoin !== undefined) {
    mapAdapter.setLayoutProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-join', style.lineJoin);
  }

  updateDynamicPolyline(mapAdapter, points);
}

export function clearDynamicPolyline(mapAdapter: IMapAdapter): void {
  const style = mapAdapter.getStyle();
  const hasLayer = style?.layers.some(layer => layer.id === DYNAMIC_POLYLINE_LAYER_ID);
  if (hasLayer) {
    mapAdapter.removeLayer(DYNAMIC_POLYLINE_LAYER_ID);
  }
  if (mapAdapter.getSource(DYNAMIC_POLYLINE_SOURCE_ID)) {
    mapAdapter.removeSource(DYNAMIC_POLYLINE_SOURCE_ID);
  }
}
