import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';

function isHTMLElement(el: unknown): el is HTMLElement {
  return el != null && typeof el === 'object' && (el as Node).nodeType === 1;
}

type IPopup = API.Platform.Types.IPopup;
type IPopupFactory = API.Platform.Types.IPopupFactory;
type PopupFactoryOptions = API.Platform.Types.PopupFactoryOptions;

type MapLibrePopup = import('maplibre-gl').Popup;

class MapLibrePopupAdapter implements IPopup {
  constructor(private popup: MapLibrePopup) {}

  getMapLibrePopup(): MapLibrePopup {
    return this.popup;
  }

  setHTML(html: string): this {
    this.popup.setHTML(html);
    return this;
  }

  setDOMContent(element: unknown): this {
    if (isHTMLElement(element)) {
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
      const m = map as { getMapLibreMap?: () => MapLibreMap };
      this.popup.addTo(m.getMapLibreMap ? m.getMapLibreMap() : (map as MapLibreMap));
    }
    return this;
  }

  remove(): void {
    this.popup.remove();
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
      } else if (options.content && isHTMLElement(options.content)) {
        popup.setDOMContent(options.content);
      }
      return new MapLibrePopupAdapter(popup);
    } catch {
      return null;
    }
  }
}
