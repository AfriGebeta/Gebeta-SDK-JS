import type { API } from '@gebeta/maps-api';
import { closePolygon } from '@gebeta/maps-core';

type FenceStyleOptions = API.Fencing.Types.StyleOptions;
type LngLatLike = API.Common.Types.LngLatLike;
type IMapAdapter = API.Platform.Types.IMapAdapter;

export function initFenceLayers(
  mapAdapter: IMapAdapter,
  sourceId: string,
  layerId: string,
  borderLayerId: string,
  style: FenceStyleOptions
): void {
  if (mapAdapter.getSource(sourceId)) {
    return;
  }

  mapAdapter.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [],
      },
    },
  });

  mapAdapter.addLayer({
    id: layerId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': style.fillColor ?? '#ff0000',
      'fill-opacity': style.fillOpacity ?? 0.3,
    },
  });

  mapAdapter.addLayer({
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

export function updateFenceLayerData(
  mapAdapter: IMapAdapter,
  sourceId: string,
  points: LngLatLike[]
): void {
  const source = mapAdapter.getSource(sourceId);
  if (!source) return;

  const geoJsonSource = source as { type?: string; setData?: (data: unknown) => void };
  if (geoJsonSource.type !== 'geojson' || !geoJsonSource.setData) return;

  if (points.length < 3) {
    geoJsonSource.setData({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [],
      },
    });
    return;
  }

  const closedPoints = closePolygon(points);
  geoJsonSource.setData({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [closedPoints],
    },
  });
}

export function clearFenceLayers(
  mapAdapter: IMapAdapter,
  sourceId: string,
  layerId: string,
  borderLayerId: string
): void {
  const style = mapAdapter.getStyle();
  const hasBorderLayer = style?.layers.some(layer => layer.id === borderLayerId);
  const hasLayer = style?.layers.some(layer => layer.id === layerId);
  
  if (hasBorderLayer) {
    mapAdapter.removeLayer(borderLayerId);
  }
  if (hasLayer) {
    mapAdapter.removeLayer(layerId);
  }
  if (mapAdapter.getSource(sourceId)) {
    mapAdapter.removeSource(sourceId);
  }
}
