declare module 'maplibre-gl' {
  export class Map {
    constructor(options?: unknown);
    isStyleLoaded(): boolean;
    once(event: string, fn: () => void): this;
    on(event: string, fn: (...args: unknown[]) => void): this;
    off(event: string, fn: (...args: unknown[]) => void): this;
    getContainer(): HTMLElement;
    getBounds(): LngLatBounds;
    getZoom(): number;
    getSource(id: string): unknown;
    getStyle(): { layers: { id: string; type: string }[] } | null;
    addSource(id: string, spec: unknown): this;
    removeSource(id: string): this;
    addLayer(spec: unknown, beforeId?: string): this;
    removeLayer(id: string): this;
    addControl(control: unknown, position?: string): this;
    setPaintProperty(layer: string, name: string, value: unknown): this;
    setLayoutProperty(layer: string, name: string, value: unknown): this;
    fitBounds(bounds: LngLatBounds, options?: { padding?: number; duration?: number }): this;
    easeTo(options: { center: [number, number]; zoom: number; duration?: number }): this;
    resize(): this;
    setStyle(style: string | object): this;
    remove(): void;
  }

  export class NavigationControl {
    constructor();
  }

  export class Marker {
    constructor(options?: {
      element?: HTMLElement;
      anchor?: string;
      offset?: number | [number, number];
    });
    setLngLat(lngLat: [number, number] | { lng: number; lat: number }): this;
    addTo(map: Map): this;
    remove(): void;
    setPopup(popup: Popup | null): this;
  }

  export class Popup {
    constructor(options?: {
      offset?: number | [number, number];
      closeButton?: boolean;
      anchor?: string;
    });
    setHTML(html: string): this;
    setDOMContent(element: HTMLElement): this;
    setLngLat(lngLat: [number, number]): this;
    addTo(map: Map): this;
    remove(): void;
  }

  export class LngLatBounds {
    constructor();
    extend(point: [number, number]): this;
    getWest(): number;
    getSouth(): number;
    getEast(): number;
    getNorth(): number;
  }

  export default { Map, Marker, Popup, LngLatBounds, NavigationControl };
}
