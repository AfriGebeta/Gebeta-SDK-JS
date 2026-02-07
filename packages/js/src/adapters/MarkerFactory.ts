import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import type { Marker as MapLibreMarker, Popup as MapLibrePopup } from 'maplibre-gl';

const markerElementMap = new WeakMap<MapLibreMarker, HTMLElement>();

function getMarkerElement(marker: MapLibreMarker): HTMLElement | null {
  return markerElementMap.get(marker) ?? null;
}

type IMarker = API.Platform.Types.IMarker;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type MarkerFactoryOptions = API.Platform.Types.MarkerFactoryOptions;

class MapLibreMarkerAdapter implements IMarker {
  constructor(private marker: MapLibreMarker) {}

  setLngLat(lngLat: API.Common.Types.LngLatLike): this {
    const coords: [number, number] = Array.isArray(lngLat) ? [lngLat[0], lngLat[1]] : [lngLat.lng, lngLat.lat];
    this.marker.setLngLat(coords);
    return this;
  }

  addTo(map: unknown): this {
    if (map) {
      this.marker.addTo(map as MapLibreMap);
    }
    return this;
  }

  remove(): void {
    this.marker.remove();
  }

  getElement(): HTMLElement | null {
    return getMarkerElement(this.marker);
  }

  setPopup(popup: API.Platform.Types.IPopup | null): this {
    this.marker.setPopup(popup as unknown as MapLibrePopup | null);
    return this;
  }
}

export class MarkerFactory implements IMarkerFactory {
  constructor(private map: MapLibreMap) {}

  createMarker(options: MarkerFactoryOptions): IMarker | null {
    if (!this.map) return null;

    try {
      let element: HTMLElement;

      if (options.element && options.element instanceof HTMLElement) {
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

      const markerOptions: { element: HTMLElement; anchor?: string; offset?: number | [number, number] } = { element };
      if (options.anchor) markerOptions.anchor = options.anchor;
      if (options.offset !== undefined) markerOptions.offset = options.offset;
      const marker = new maplibre.Marker(markerOptions);

      if (options.onClick) {
        element.addEventListener('click', (event) => {
          const adapter = new MapLibreMarkerAdapter(marker);
          const lngLat = { lng: 0, lat: 0 };
          options.onClick!(lngLat, adapter, event);
        });
      }

      markerElementMap.set(marker, element);
      return new MapLibreMarkerAdapter(marker);
    } catch (error) {
      console.error('Failed to create marker:', error);
      return null;
    }
  }
}
