import type { API } from '@gebeta/api';
import { closePolygon } from '@gebeta/core';

type FenceStyleOptions = API.Fencing.Types.StyleOptions;
type LngLatLike = API.Common.Types.LngLatLike;
type IMapAdapter = API.Platform.Types.IMapAdapter;

/**
 * Fence polygon rendering via the abstract `IMapAdapter` (records into the RN MapSpecStore, which
 * renders a `<GeoJSONSource>` with fill + line `<Layer>`s). Ported from the web `Fencing/layers.ts`
 * — the calls are platform-agnostic. Empty polygons are sanitized by the renderer, so a
 * degenerate seed here is safe.
 */
export function initFenceLayers(
  mapAdapter: IMapAdapter,
  sourceId: string,
  layerId: string,
  borderLayerId: string,
  style: FenceStyleOptions
): void {
  if (mapAdapter.getSource(sourceId)) return;

  mapAdapter.addSource(sourceId, {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [] } },
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

  mapAdapter.addLayer(
    {
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
    },
    layerId
  );
}

export function updateFenceLayerData(
  mapAdapter: IMapAdapter,
  sourceId: string,
  points: LngLatLike[]
): void {
  const source = mapAdapter.getSource(sourceId) as
    | { setData?: (data: unknown) => void }
    | undefined;
  if (!source?.setData) return;

  if (points.length < 3) {
    source.setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [] },
    });
    return;
  }

  const closedPoints = closePolygon(points);
  source.setData({
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [closedPoints] },
  });
}

export function clearFenceLayers(
  mapAdapter: IMapAdapter,
  sourceId: string,
  layerId: string,
  borderLayerId: string
): void {
  const style = mapAdapter.getStyle();
  if (style?.layers.some(l => l.id === borderLayerId)) mapAdapter.removeLayer(borderLayerId);
  if (style?.layers.some(l => l.id === layerId)) mapAdapter.removeLayer(layerId);
  if (mapAdapter.getSource(sourceId)) mapAdapter.removeSource(sourceId);
}
