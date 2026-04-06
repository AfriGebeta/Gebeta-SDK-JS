import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import type { API } from '@gebeta/api';

const markerElementMap = new WeakMap<MapLibreMarker, HTMLElement>();

function isHTMLElement(el: unknown): el is HTMLElement {
  return el != null && typeof el === 'object' && (el as Node).nodeType === 1;
}

type IMarker = API.Platform.Types.IMarker;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type MarkerFactoryOptions = API.Platform.Types.MarkerFactoryOptions;

class MapLibreMarkerAdapter implements IMarker {
  constructor(private marker: MapLibreMarker) {}

  setLngLat(lngLat: API.Common.Types.LngLatLike): this {
    const coords: [number, number] = Array.isArray(lngLat)
      ? [lngLat[0], lngLat[1]]
      : [lngLat.lng, lngLat.lat];
    this.marker.setLngLat(coords);
    return this;
  }

  addTo(map: unknown): this {
    if (!map) return this;
    const m = map as { getMapLibreMap?: () => MapLibreMap };
    const mapLibreMap = m.getMapLibreMap ? m.getMapLibreMap() : (map as MapLibreMap);
    if (mapLibreMap && 'getContainer' in mapLibreMap) {
      this.marker.addTo(mapLibreMap);
    }
    return this;
  }

  remove(): void {
    this.marker.remove();
  }

  getElement(): HTMLElement | null {
    return markerElementMap.get(this.marker) ?? null;
  }

  setPopup(popup: API.Platform.Types.IPopup | null): this {
    if (popup == null) {
      this.marker.setPopup(null);
    } else {
      const adapter = popup as unknown as { getMapLibrePopup?: () => import('maplibre-gl').Popup };
      if (adapter.getMapLibrePopup) {
        this.marker.setPopup(adapter.getMapLibrePopup());
      }
    }
    return this;
  }
}

export class MarkerFactory implements IMarkerFactory {
  constructor(private map: MapLibreMap) {}

  createMarker(options: MarkerFactoryOptions): IMarker | null {
    if (!this.map) return null;
    try {
      let element: HTMLElement;
      if (options.element && isHTMLElement(options.element)) {
        element = options.element;
      } else {
        element = document.createElement('div');
        element.className = options.className ?? 'gebeta-marker';
        if (options.size) {
          element.style.width = `${options.size[0]}px`;
          element.style.height = `${options.size[1]}px`;
        }
        if (options.imageUrl) {
          element.style.backgroundImage = `url(${options.imageUrl})`;
          element.style.backgroundSize = 'contain';
          element.style.backgroundRepeat = 'no-repeat';
          element.style.backgroundPosition = 'center';
        }
        element.style.cursor = options.cursor ?? 'pointer';
      }
      const markerOptions: {
        element: HTMLElement;
        anchor?: string;
        offset?: number | [number, number];
      } = {
        element,
      };
      if (options.anchor) markerOptions.anchor = options.anchor;
      if (options.offset !== undefined) markerOptions.offset = options.offset;
      const marker = new maplibre.Marker(markerOptions);
      if (options.onClick) {
        element.addEventListener('click', (event: MouseEvent) => {
          const adapter = new MapLibreMarkerAdapter(marker);
          options.onClick!({ lng: 0, lat: 0 }, adapter, event);
        });
      }
      markerElementMap.set(marker, element);
      return new MapLibreMarkerAdapter(marker);
    } catch {
      return null;
    }
  }
}
