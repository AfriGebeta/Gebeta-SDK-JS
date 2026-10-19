import { Marker, Popup } from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';

type LngLatLike = API.Common.Types.LngLatLike;
type Anchor =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/** Options for `sdk.addMarker()`. */
export interface GebetaMarkerOptions {
  /** Marker position `[lng, lat]` or `{ lng, lat }`. */
  lngLat: LngLatLike;
  /** Custom HTML element. Takes precedence over `imageUrl` and `color`. */
  element?: HTMLElement;
  /** Image URL for the marker icon. */
  imageUrl?: string;
  /** Icon size `[width, height]` in pixels when using `imageUrl` (default: `[30, 30]`). */
  size?: [number, number];
  /** Color of the default pin (ignored with `element` / `imageUrl`). */
  color?: string;
  /** Part of the marker placed at `lngLat` (default: `'center'`, or `'bottom'` for `imageUrl`). */
  anchor?: Anchor;
  /** Pixel offset `[x, y]`. */
  offset?: [number, number];
  /** Allow the user to drag the marker. */
  draggable?: boolean;
  /** Rotation in degrees. */
  rotation?: number;
  /** CSS class added to the marker element. */
  className?: string;
  /** Popup opened when the marker is clicked: plain text, or an HTMLElement. */
  popup?: string | HTMLElement;
  /** Click handler. */
  onClick?: (marker: Marker, event: MouseEvent) => void;
  /** Called after the user finishes dragging (requires `draggable`). */
  onDragEnd?: (lngLat: { lng: number; lat: number }, marker: Marker) => void;
}

/** Options for `sdk.addPopup()`. */
export interface GebetaPopupOptions {
  /** Popup position `[lng, lat]` or `{ lng, lat }`. */
  lngLat: LngLatLike;
  /** Plain text content (safe for user data). */
  text?: string;
  /** HTML content. Only use with trusted markup. */
  html?: string;
  /** DOM element content. */
  element?: HTMLElement;
  /** Show the close button (default: true). */
  closeButton?: boolean;
  /** Close when the map is clicked (default: true). */
  closeOnClick?: boolean;
  /** Popup anchor relative to `lngLat`. */
  anchor?: Anchor;
  /** Pixel offset. */
  offset?: number | [number, number];
  /** CSS max-width (default: '240px'). */
  maxWidth?: string;
  /** CSS class added to the popup container. */
  className?: string;
}

export function toLngLatTuple(lngLat: LngLatLike): [number, number] {
  return Array.isArray(lngLat) ? [lngLat[0], lngLat[1]] : [lngLat.lng, lngLat.lat];
}

function imageElement(imageUrl: string, size: [number, number]): HTMLElement {
  const el = document.createElement('div');
  el.style.width = `${size[0]}px`;
  el.style.height = `${size[1]}px`;
  el.style.backgroundImage = `url("${imageUrl}")`;
  el.style.backgroundSize = 'contain';
  el.style.backgroundRepeat = 'no-repeat';
  el.style.backgroundPosition = 'center';
  el.style.cursor = 'pointer';
  return el;
}

/** Creates a marker, adds it to the map and returns it. */
export function addMarker(map: MapLibreMap, options: GebetaMarkerOptions): Marker {
  const element =
    options.element ??
    (options.imageUrl ? imageElement(options.imageUrl, options.size ?? [30, 30]) : undefined);

  const marker = new Marker({
    element,
    color: element ? undefined : options.color,
    anchor: options.anchor ?? (options.imageUrl && !options.element ? 'bottom' : undefined),
    offset: options.offset,
    draggable: options.draggable,
    rotation: options.rotation,
    className: options.className,
  }).setLngLat(toLngLatTuple(options.lngLat));

  if (options.popup !== undefined) {
    const popup = new Popup({ offset: 25 });
    if (typeof options.popup === 'string') popup.setText(options.popup);
    else popup.setDOMContent(options.popup);
    marker.setPopup(popup);
  }

  if (options.onClick) {
    const onClick = options.onClick;
    marker.getElement().addEventListener('click', event => onClick(marker, event));
  }

  if (options.onDragEnd) {
    const onDragEnd = options.onDragEnd;
    marker.on('dragend', () => {
      const { lng, lat } = marker.getLngLat();
      onDragEnd({ lng, lat }, marker);
    });
  }

  return marker.addTo(map);
}

/** Creates a popup, opens it on the map and returns it. */
export function addPopup(map: MapLibreMap, options: GebetaPopupOptions): Popup {
  const popup = new Popup({
    closeButton: options.closeButton ?? true,
    closeOnClick: options.closeOnClick ?? true,
    anchor: options.anchor,
    offset: options.offset,
    maxWidth: options.maxWidth,
    className: options.className,
  }).setLngLat(toLngLatTuple(options.lngLat));

  if (options.element) popup.setDOMContent(options.element);
  else if (options.html !== undefined) popup.setHTML(options.html);
  else popup.setText(options.text ?? '');

  return popup.addTo(map);
}
