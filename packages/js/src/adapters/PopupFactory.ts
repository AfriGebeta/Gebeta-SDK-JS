import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import type { Popup as MapLibrePopup } from 'maplibre-gl';

type IPopup = API.Platform.Types.IPopup;
type IPopupFactory = API.Platform.Types.IPopupFactory;
type PopupFactoryOptions = API.Platform.Types.PopupFactoryOptions;

class MapLibrePopupAdapter implements IPopup {
  constructor(private popup: MapLibrePopup) {}

  setHTML(html: string): this {
    this.popup.setHTML(html);
    return this;
  }

  setDOMContent(element: unknown): this {
    if (element instanceof HTMLElement) {
      this.popup.setDOMContent(element);
    } else if (typeof element === 'string') {
      this.popup.setHTML(element);
    }
    return this;
  }

  setLngLat(lngLat: API.Common.Types.LngLatLike): this {
    const coords: [number, number] = Array.isArray(lngLat)
      ? [lngLat[0], lngLat[1]]
      : [lngLat.lng, lngLat.lat];
    this.popup.setLngLat(coords);
    return this;
  }

  addTo(map: unknown): this {
    if (map) {
      this.popup.addTo(map as MapLibreMap);
    }
    return this;
  }

  remove(): void {
    if (typeof (this.popup as unknown as { remove?: () => void }).remove === 'function') {
      (this.popup as unknown as { remove: () => void }).remove();
    }
  }
}

export class PopupFactory implements IPopupFactory {
  constructor(private map: MapLibreMap) {}

  createPopup(options: PopupFactoryOptions): IPopup | null {
    if (!this.map) return null;

    try {
      const popup = new maplibre.Popup({
        closeButton: options.closeable ?? false,
        anchor: options.anchor ?? 'center',
        offset: options.offset ?? [0, 0],
      });

      if (typeof options.content === 'string') {
        popup.setHTML(options.content);
      } else if (options.content instanceof HTMLElement) {
        popup.setDOMContent(options.content);
      }

      return new MapLibrePopupAdapter(popup);
    } catch (error) {
      console.error('Failed to create popup:', error);
      return null;
    }
  }
}
