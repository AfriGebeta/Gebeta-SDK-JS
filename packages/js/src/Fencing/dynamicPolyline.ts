import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import { DYNAMIC_POLYLINE_SOURCE_ID, DYNAMIC_POLYLINE_LAYER_ID } from './constants';

type FenceStyleOptions = API.Fencing.Types.StyleOptions;
type LngLatLike = API.Common.Types.LngLatLike;

/**
 * Initialize dynamic polyline for drawing fence preview.
 * @param map - MapLibre map instance
 * @param style - Fence style options
 */
export function initDynamicPolyline(map: MapLibreMap, style: FenceStyleOptions): void {
  if (map.getSource(DYNAMIC_POLYLINE_SOURCE_ID)) {
    return;
  }

  map.addSource(DYNAMIC_POLYLINE_SOURCE_ID, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
    },
  });

  map.addLayer({
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

/**
 * Update dynamic polyline with new points.
 * @param map - MapLibre map instance
 * @param points - Array of points for the polyline
 */
export function updateDynamicPolyline(map: MapLibreMap, points: LngLatLike[]): void {
  const source = map.getSource(DYNAMIC_POLYLINE_SOURCE_ID);
  if (source?.type !== 'geojson') return;

  (source as { setData: (data: unknown) => void }).setData({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points,
    },
  });
}

/**
 * Update dynamic polyline style.
 * @param map - MapLibre map instance
 * @param points - Array of points for the polyline
 * @param style - Fence style options
 */
export function updateDynamicPolylineStyle(
  map: MapLibreMap,
  points: LngLatLike[],
  style: FenceStyleOptions
): void {
  if (!map.getLayer(DYNAMIC_POLYLINE_LAYER_ID)) {
    initDynamicPolyline(map, style);
  }

  const layer = map.getLayer(DYNAMIC_POLYLINE_LAYER_ID);
  if (!layer) return;

  if (style.lineColor !== undefined) {
    map.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-color', style.lineColor);
  }
  if (style.lineWidth !== undefined) {
    map.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-width', style.lineWidth);
  }
  if (style.lineOpacity !== undefined) {
    map.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-opacity', style.lineOpacity);
  }
  if (style.lineDashArray !== undefined) {
    if (style.lineDashArray.length > 0) {
      map.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-dasharray', style.lineDashArray);
    } else {
      map.setPaintProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-dasharray', null);
    }
  }
  if (style.lineCap !== undefined) {
    map.setLayoutProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-cap', style.lineCap);
  }
  if (style.lineJoin !== undefined) {
    map.setLayoutProperty(DYNAMIC_POLYLINE_LAYER_ID, 'line-join', style.lineJoin);
  }

  updateDynamicPolyline(map, points);
}

/**
 * Clear dynamic polyline from the map.
 * @param map - MapLibre map instance
 */
export function clearDynamicPolyline(map: MapLibreMap): void {
  if (map.getLayer(DYNAMIC_POLYLINE_LAYER_ID)) {
    map.removeLayer(DYNAMIC_POLYLINE_LAYER_ID);
  }
  if (map.getSource(DYNAMIC_POLYLINE_SOURCE_ID)) {
    map.removeSource(DYNAMIC_POLYLINE_SOURCE_ID);
  }
}
