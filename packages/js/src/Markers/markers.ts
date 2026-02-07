import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker, Popup as MapLibrePopup } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';

type LngLatLike = API.Common.Types.LngLatLike;

const markerElementMap = new WeakMap<MapLibreMarker, HTMLElement>();

export interface MarkerOptions {
  imageUrl?: string;
  size?: [number, number];
  className?: string;
  cursor?: string;
  onClick?: (point: LngLatLike, marker: MapLibreMarker, event: MouseEvent) => void;
}

export interface PopupOptions {
  content: string | HTMLElement;
  closeable?: boolean;
  anchor?: string;
  offset?: number | [number, number];
}

export function createMarker(
  map: MapLibreMap,
  point: LngLatLike,
  options: MarkerOptions = {}
): MapLibreMarker | null {
  try {
    const lngLat = Array.isArray(point) ? { lng: point[0], lat: point[1] } : point;

    const el = document.createElement('div');
    el.className = options.className ?? 'gebeta-marker';
    
    if (options.size) {
      el.style.width = `${options.size[0]}px`;
      el.style.height = `${options.size[1]}px`;
    }
    
    if (options.imageUrl) {
      el.style.backgroundImage = `url(${options.imageUrl})`;
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
    }
    
    el.style.cursor = options.cursor ?? 'pointer';

    const marker = new maplibre.Marker({ element: el });
    marker.setLngLat([lngLat.lng, lngLat.lat]);
    marker.addTo(map);

    if (options.onClick) {
      el.addEventListener('click', (event) => {
        options.onClick!(point, marker, event);
      });
    }

    markerElementMap.set(marker, el);
    return marker;
  } catch (error) {
    console.error('Failed to create marker:', error);
    return null;
  }
}

export function getMarkerElement(marker: MapLibreMarker): HTMLElement | null {
  return markerElementMap.get(marker) ?? null;
}

export function createMarkerWithPopup(
  map: MapLibreMap,
  point: LngLatLike,
  markerOptions: MarkerOptions = {},
  popupOptions: PopupOptions
): MapLibreMarker | null {
  try {
    const marker = createMarker(map, point, markerOptions);
    if (!marker) return null;

    const popup = createPopup(popupOptions);
    if (popup) {
      marker.setPopup(popup);
    }

    return marker;
  } catch (error) {
    console.error('Failed to create marker with popup:', error);
    return null;
  }
}

export function createPopup(options: PopupOptions): MapLibrePopup | null {
  try {
    const popup = new maplibre.Popup({
      closeButton: options.closeable ?? false,
      anchor: options.anchor ?? 'center',
      offset: options.offset ?? [0, 0],
    });

    if (typeof options.content === 'string') {
      popup.setHTML(options.content);
    } else {
      popup.setDOMContent(options.content);
    }

    return popup;
  } catch (error) {
    console.error('Failed to create popup:', error);
    return null;
  }
}
