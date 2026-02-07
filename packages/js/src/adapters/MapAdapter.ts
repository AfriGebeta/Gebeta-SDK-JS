import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap, LngLatBounds as MapLibreLngLatBounds } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';

type IMapAdapter = API.Platform.Types.IMapAdapter;
type MapBounds = API.Platform.Types.MapBounds;
type MapStyle = API.Platform.Types.MapStyle;
type EaseToOptions = API.Platform.Types.EaseToOptions;

class MapLibreBoundsAdapter implements MapBounds {
  constructor(private bounds: MapLibreLngLatBounds) {}

  getWest(): number {
    return this.bounds.getWest();
  }

  getSouth(): number {
    return this.bounds.getSouth();
  }

  getEast(): number {
    return this.bounds.getEast();
  }

  getNorth(): number {
    return this.bounds.getNorth();
  }
}

export class MapAdapter implements IMapAdapter {
  constructor(private map: MapLibreMap) {}

  on(event: string, fn: (...args: unknown[]) => void): this {
    this.map.on(event, fn);
    return this;
  }

  once(event: string, fn: (...args: unknown[]) => void): this {
    this.map.once(event, fn);
    return this;
  }

  off(event: string, fn: (...args: unknown[]) => void): this {
    this.map.off(event, fn);
    return this;
  }

  getContainer(): HTMLElement {
    return this.map.getContainer();
  }

  getBounds(): MapBounds {
    return new MapLibreBoundsAdapter(this.map.getBounds());
  }

  getZoom(): number {
    return this.map.getZoom();
  }

  easeTo(options: EaseToOptions): this {
    const easeOptions: { center: [number, number]; zoom: number; duration?: number } = {
      center: options.center,
      zoom: options.zoom,
    };
    if (options.duration !== undefined) {
      easeOptions.duration = options.duration;
    }
    this.map.easeTo(easeOptions);
    return this;
  }

  resize(): this {
    this.map.resize();
    return this;
  }

  getStyle(): MapStyle | null {
    const style = this.map.getStyle();
    if (!style) return null;
    return {
      layers: style.layers.map(layer => ({
        id: layer.id,
        type: layer.type,
      })),
    };
  }

  setStyle(style: string | object): this {
    if (typeof style === 'string') {
      this.map.setStyle(style);
    } else {
      this.map.setStyle(style);
    }
    return this;
  }

  isStyleLoaded(): boolean {
    return this.map.isStyleLoaded();
  }

  addSource(id: string, spec: unknown): this {
    this.map.addSource(id, spec);
    return this;
  }

  getSource(id: string): unknown {
    return this.map.getSource(id);
  }

  removeSource(id: string): this {
    this.map.removeSource(id);
    return this;
  }

  addLayer(spec: unknown, beforeId?: string): this {
    this.map.addLayer(spec, beforeId);
    return this;
  }

  removeLayer(id: string): this {
    this.map.removeLayer(id);
    return this;
  }

  transformRequest?(
    url: string,
    _resourceType: string
  ): { url: string; headers?: Record<string, string> } {
    return { url };
  }

  addControl?(control: unknown, position?: string): this {
    this.map.addControl(control, position);
    return this;
  }

  fitBounds(bounds: MapBounds, options?: { padding?: number; duration?: number }): this {
    const mapLibreBounds = new maplibre.LngLatBounds();
    mapLibreBounds.extend([bounds.getWest(), bounds.getSouth()]);
    mapLibreBounds.extend([bounds.getEast(), bounds.getNorth()]);
    this.map.fitBounds(mapLibreBounds, options);
    return this;
  }

  setPaintProperty(layer: string, name: string, value: unknown): this {
    this.map.setPaintProperty(layer, name, value);
    return this;
  }

  setLayoutProperty(layer: string, name: string, value: unknown): this {
    this.map.setLayoutProperty(layer, name, value);
    return this;
  }
}
