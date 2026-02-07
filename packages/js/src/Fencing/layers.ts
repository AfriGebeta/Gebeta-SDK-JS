import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import { closePolygon } from '@gebeta/maps-core';

type FenceStyleOptions = API.Fencing.Types.StyleOptions;
type LngLatLike = API.Common.Types.LngLatLike;

/**
 * Initialize fence layers (fill and border) on the map.
 * @param map - MapLibre map instance
 * @param sourceId - Source ID for the fence
 * @param layerId - Fill layer ID
 * @param borderLayerId - Border layer ID
 * @param style - Fence style options
 */
export function initFenceLayers(
  map: MapLibreMap,
  sourceId: string,
  layerId: string,
  borderLayerId: string,
  style: FenceStyleOptions
): void {
  if (map.getSource(sourceId)) {
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [],
      },
    },
  });

  map.addLayer({
    id: layerId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': style.fillColor ?? '#ff0000',
      'fill-opacity': style.fillOpacity ?? 0.3,
    },
  });

  map.addLayer({
    id: borderLayerId,
    type: 'line',
    source: sourceId,
    layout: {
      'line-cap': style.lineCap ?? 'butt',
      'line-join': style.lineJoin ?? 'miter',
    },
    paint: {
      'line-color': style.borderColor ?? style.lineColor ?? '#ff0000',
      'line-width': style.borderWidth ?? style.lineWidth ?? 1,
      'line-opacity': style.borderOpacity ?? style.lineOpacity ?? 1,
    },
  }, layerId);
}

/**
 * Update fence layer data with new points.
 * @param map - MapLibre map instance
 * @param sourceId - Source ID for the fence
 * @param points - Array of fence points
 */
export function updateFenceLayerData(
  map: MapLibreMap,
  sourceId: string,
  points: LngLatLike[]
): void {
  const source = map.getSource(sourceId);
  if (!source || source.type !== 'geojson') return;

  if (points.length < 3) {
    (source as { setData: (data: unknown) => void }).setData({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [],
      },
    });
    return;
  }

  const closedPoints = closePolygon(points);
  (source as { setData: (data: unknown) => void }).setData({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [closedPoints],
    },
  });
}

/**
 * Clear fence layers from the map.
 * @param map - MapLibre map instance
 * @param sourceId - Source ID for the fence
 * @param layerId - Fill layer ID
 * @param borderLayerId - Border layer ID
 */
export function clearFenceLayers(
  map: MapLibreMap,
  sourceId: string,
  layerId: string,
  borderLayerId: string
): void {
  if (map.getLayer(borderLayerId)) {
    map.removeLayer(borderLayerId);
  }
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}
