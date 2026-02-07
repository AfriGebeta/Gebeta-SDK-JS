import type { LngLatLike } from './common';

export interface IMarker {
  setLngLat(lngLat: LngLatLike): this;
  addTo(map: unknown): this;
  remove(): void;
  getElement?(): unknown;
  setPopup?(popup: IPopup | null): this;
}

export interface IPopup {
  setHTML(html: string): this;
  setDOMContent(element: unknown): this;
  setLngLat(lngLat: LngLatLike): this;
  addTo(map: unknown): this;
  remove(): void;
}

export interface MarkerFactoryOptions {
  element?: unknown;
  anchor?: string;
  offset?: number | [number, number];
  imageUrl?: string;
  size?: [number, number];
  className?: string;
  cursor?: string;
  onClick?: (point: LngLatLike, marker: IMarker, event: MouseEvent) => void;
}

export interface PopupFactoryOptions {
  content: string | unknown;
  closeable?: boolean;
  anchor?: string;
  offset?: number | [number, number];
}

export interface IMarkerFactory {
  createMarker(options: MarkerFactoryOptions): IMarker | null;
}

export interface IPopupFactory {
  createPopup(options: PopupFactoryOptions): IPopup | null;
}

export interface MapBounds {
  getWest(): number;
  getSouth(): number;
  getEast(): number;
  getNorth(): number;
  extend?(point: [number, number]): void;
}

export interface MapStyle {
  layers: Array<{ id: string; type: string }>;
}

export interface EaseToOptions {
  center: [number, number];
  zoom: number;
  duration?: number;
}

export interface IMapAdapter {
  on(event: string, fn: (...args: unknown[]) => void): this;
  once(event: string, fn: (...args: unknown[]) => void): this;
  off(event: string, fn: (...args: unknown[]) => void): this;
  getContainer(): unknown;
  getBounds(): MapBounds;
  getZoom(): number;
  easeTo(options: EaseToOptions): this;
  resize(): this;
  getStyle(): MapStyle | null;
  setStyle(style: string | object): this;
  isStyleLoaded(): boolean;
  addSource(id: string, spec: unknown): this;
  getSource(id: string): unknown;
  removeSource(id: string): this;
  addLayer(spec: unknown, beforeId?: string): this;
  removeLayer(id: string): this;
  transformRequest?(
    url: string,
    resourceType: string
  ): { url: string; headers?: Record<string, string> };
  addControl?(control: unknown, position?: string): this;
  fitBounds(bounds: MapBounds, options?: { padding?: number; duration?: number }): this;
  setPaintProperty(layer: string, name: string, value: unknown): this;
  setLayoutProperty(layer: string, name: string, value: unknown): this;
}

export interface IPlatformDOM {
  createElement(tagName: string): unknown;
  createTextNode(text: string): unknown;
  appendChild(parent: unknown, child: unknown): unknown;
  removeChild(parent: unknown, child: unknown): unknown;
  insertBefore(parent: unknown, child: unknown, before: unknown): unknown;
  addEventListener(target: unknown, event: string, handler: (event: unknown) => void): void;
  removeEventListener(target: unknown, event: string, handler: (event: unknown) => void): void;
  querySelector(container: unknown, selector: string): unknown | null;
  querySelectorAll(container: unknown, selector: string): unknown[];
  getBody(): unknown;
  getHead(): unknown;
}

export interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
}

export interface ILocationProvider {
  start(onLocation: (location: LocationData) => void): void;
  stop(): void;
}

export interface IStyleInjector {
  injectStyle(id: string, cssText: string): void;
  removeStyle(id: string): void;
}
