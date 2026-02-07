declare module 'maplibre-gl' {
  export class Map {
    constructor(options?: unknown);
    isStyleLoaded(): boolean;
    once(event: string, fn: () => void): this;
    on(event: string, fn: (...args: unknown[]) => void): this;
    getSource(id: string): GeoJSONSource | undefined;
    getLayer(id: string): unknown;
    getStyle(): { layers: { id: string; type: string }[] };
    addSource(id: string, spec: unknown): this;
    addLayer(spec: unknown, beforeId?: string): this;
    addControl(control: unknown, position?: string): this;
    setPaintProperty(layer: string, name: string, value: unknown): this;
    setLayoutProperty(layer: string, name: string, value: unknown): this;
    fitBounds(bounds: LngLatBounds, options?: { padding?: number; duration?: number }): this;
  }

  export class Marker {
    constructor(options?: { element?: HTMLElement });
    setLngLat(lngLat: [number, number]): this;
    addTo(map: Map): this;
    remove(): void;
  }

  export class LngLatBounds {
    constructor();
    extend(point: [number, number]): this;
  }

  export class NavigationControl {
    constructor();
  }

  export interface GeoJSONSource {
    setData(data: GeoJSON.Feature<GeoJSON.Geometry>): void;
  }

  export default { Map, Marker, LngLatBounds, NavigationControl };
}
