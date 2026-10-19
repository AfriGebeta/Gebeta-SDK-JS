declare module 'maplibre-gl' {
  export class Map {
    constructor(options?: unknown);
    isStyleLoaded(): boolean;
    once(event: string, fn: () => void): this;
    on(event: string, fn: (...args: unknown[]) => void): this;
    off(event: string, fn: (...args: unknown[]) => void): this;
    getContainer(): HTMLElement;
    getSource(id: string): GeoJSONSource | undefined;
    getLayer(id: string): unknown;
    getStyle(): { layers: { id: string; type: string }[] } | null;
    addSource(id: string, spec: unknown): this;
    addLayer(spec: unknown, beforeId?: string): this;
    removeLayer(id: string): this;
    removeSource(id: string): this;
    addControl(control: unknown, position?: string): this;
    setPaintProperty(layer: string, name: string, value: unknown): this;
    setLayoutProperty(layer: string, name: string, value: unknown): this;
    fitBounds(bounds: LngLatBounds, options?: { padding?: number; duration?: number }): this;
    getBounds(): LngLatBounds;
    getZoom(): number;
    easeTo(options: { center: [number, number]; zoom: number; duration?: number }): this;
    resize(): this;
    setStyle(style: string | object): this;
  }

  export class Marker {
    constructor(options?: {
      element?: HTMLElement;
      anchor?: string;
      offset?: number | [number, number];
      color?: string;
      draggable?: boolean;
      rotation?: number;
      className?: string;
    });
    setLngLat(lngLat: [number, number]): this;
    getLngLat(): LngLat;
    getElement(): HTMLElement;
    addTo(map: Map): this;
    remove(): void;
    setPopup(popup: Popup | null): this;
    on(event: string, fn: (...args: unknown[]) => void): this;
  }

  export class Popup {
    constructor(options?: {
      offset?: number | [number, number];
      closeOnClick?: boolean;
      closeButton?: boolean;
      anchor?: string;
      maxWidth?: string;
      className?: string;
    });
    setHTML(html: string): this;
    setText(text: string): this;
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

  export class NavigationControl {
    constructor(options?: unknown);
  }

  export class LngLat {
    constructor(lng: number, lat: number);
    lng: number;
    lat: number;
  }

  export class MercatorCoordinate {
    constructor(x: number, y: number, z?: number);
  }

  export class GeolocateControl {
    constructor(options?: unknown);
  }

  export class FullscreenControl {
    constructor(options?: unknown);
  }

  export class ScaleControl {
    constructor(options?: unknown);
  }

  export class AttributionControl {
    constructor(options?: unknown);
  }

  export class TerrainControl {
    constructor(options?: unknown);
  }

  export function addProtocol(name: string, handler: unknown): void;
  export function removeProtocol(name: string): void;

  export interface GeoJSONSource {
    type: 'geojson';
    setData(data: GeoJSON.Feature<GeoJSON.Geometry>): void;
  }

  export interface MapMouseEvent {
    lngLat: { lng: number; lat: number };
  }

  export default { Map, Marker, LngLatBounds, NavigationControl, Popup };
}
