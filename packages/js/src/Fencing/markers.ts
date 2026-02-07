import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import { createMarker, createMarkerWithPopup } from '../Markers/markers';

type LngLatLike = API.Common.Types.LngLatLike;
type OverlayOptions = API.Overlay.Types.Options;
type LngLat = API.Common.Types.LngLat;

export function createFenceMarker(
  map: MapLibreMap,
  point: LngLatLike,
  imageUrl: string,
  size: [number, number],
  markerId?: string,
  onClick?: (point: LngLatLike, marker: MapLibreMarker, event: MouseEvent) => void
): MapLibreMarker | null {
  return createMarker(map, point, {
    imageUrl,
    size,
    className: 'gebeta-fence-marker',
    onClick,
  });
}

export function createCentroidOverlay(
  map: MapLibreMap,
  centroid: LngLat,
  content: string | HTMLElement,
  options?: OverlayOptions
): MapLibreMarker | null {
  return createMarkerWithPopup(
    map,
    centroid,
    {},
    {
      content,
      closeable: options?.closeable,
      anchor: options?.anchor as string,
      offset: options?.offset,
    }
  );
}
