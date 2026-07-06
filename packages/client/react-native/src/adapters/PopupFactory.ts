import type { API } from '@gebeta/api';
import type { MarkerStore } from './MarkerStore';

type IPopup = API.Platform.Types.IPopup;
type IPopupFactory = API.Platform.Types.IPopupFactory;
type PopupFactoryOptions = API.Platform.Types.PopupFactoryOptions;
type LngLatLike = API.Common.Types.LngLatLike;
type LngLat = API.Common.Types.LngLat;

function toLngLat(lngLat: LngLatLike): LngLat {
  if (Array.isArray(lngLat)) return { lng: lngLat[0], lat: lngLat[1] };
  return { lng: lngLat.lng, lat: lngLat.lat };
}

/** Strip HTML tags to plain text — RN has no DOM, so popup content renders as a text bubble. */
function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * `IPopup` backed by a {@link MarkerStore} text record. The web popup is an HTML bubble
 * anchored to a coordinate; on RN there is no DOM, so content is reduced to text and rendered
 * as a styled bubble marker by the `MarkerRenderer`. `setDOMContent` is a no-op (no DOM).
 */
class RNPopup implements IPopup {
  constructor(
    private store: MarkerStore,
    private id: number
  ) {}

  setHTML(html: string): this {
    this.store.update(this.id, { text: htmlToText(html) });
    return this;
  }

  setDOMContent(_element: unknown): this {
    // No DOM on React Native; content must be provided via setHTML (text) instead.
    return this;
  }

  setLngLat(lngLat: LngLatLike): this {
    this.store.update(this.id, { lngLat: toLngLat(lngLat) });
    return this;
  }

  addTo(_map: unknown): this {
    this.store.setVisible(this.id, true);
    return this;
  }

  remove(): void {
    this.store.remove(this.id);
  }
}

export class PopupFactory implements IPopupFactory {
  constructor(private store: MarkerStore) {}

  createPopup(options: PopupFactoryOptions): IPopup | null {
    const text = typeof options.content === 'string' ? htmlToText(options.content) : '';
    const id = this.store.create({
      lngLat: { lng: 0, lat: 0 },
      text,
      offset:
        typeof options.offset === 'number' ? [options.offset, options.offset] : options.offset,
      anchor: options.anchor,
    });
    return new RNPopup(this.store, id);
  }
}
