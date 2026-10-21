import type { API } from '@gebeta/api';
import { MapHandle } from './MapHandle';
import type { GeoJsonSourceSpec, LayerSpec } from './MapSpecStore';

type IMapAdapter = API.Platform.Types.IMapAdapter;
type MapBounds = API.Platform.Types.MapBounds;
type MapStyle = API.Platform.Types.MapStyle;
type EaseToOptions = API.Platform.Types.EaseToOptions;
type LngLat = API.Common.Types.LngLat;

/**
 * React Native implementation of `IMapAdapter`.
 *
 * MapLibre-RN's map API is asynchronous (`getZoom(): Promise<number>`) and declarative
 * (no imperative `addLayer`). `IMapAdapter` is synchronous and imperative. Two techniques
 * bridge the gap:
 *
 * 1. **Cached region.** The synchronous getters (`getZoom`, `getCenter`, `getBounds`) read
 *    `MapHandle.region`, which `GebetaMap` keeps fresh from `onRegionDidChange`. This gives
 *    real values without an `await` at the call site.
 * 2. **Declarative store.** `addSource`/`addLayer`/`setPaintProperty` write to
 *    `MapHandle.store`; a `MapSpecRenderer` turns those specs into `<ShapeSource>`/layer
 *    children. `getSource(id)` returns a handle whose `setData` mutates the store.
 *
 * Constructed at `createPlatform()` time before any map is mounted, so it tolerates a
 * handle with null refs — camera ops no-op until the map is live.
 */
export class MapAdapter implements IMapAdapter {
  constructor(private handle: MapHandle) {}

  getHandle(): MapHandle {
    return this.handle;
  }

  on(event: string, fn: (...args: unknown[]) => void): this {
    this.handle.on(event, fn);
    return this;
  }

  once(event: string, fn: (...args: unknown[]) => void): this {
    this.handle.once(event, fn);
    return this;
  }

  off(event: string, fn: (...args: unknown[]) => void): this {
    this.handle.off(event, fn);
    return this;
  }

  getContainer(): unknown {
    // No DOM container in React Native; callers should treat this as opaque.
    return null;
  }

  getBounds(): MapBounds {
    const b = this.handle.region.bounds;
    const west = b?.west ?? this.handle.region.center.lng;
    const south = b?.south ?? this.handle.region.center.lat;
    const east = b?.east ?? this.handle.region.center.lng;
    const north = b?.north ?? this.handle.region.center.lat;
    return {
      getWest: () => west,
      getSouth: () => south,
      getEast: () => east,
      getNorth: () => north,
    };
  }

  getCenter(): LngLat {
    return this.handle.region.center;
  }

  getZoom(): number {
    return this.handle.region.zoom;
  }

  easeTo(options: EaseToOptions): this {
    this.handle.cameraRef?.easeTo({
      center: [options.center[0], options.center[1]],
      zoom: options.zoom,
      ...(options.pitch !== undefined ? { pitch: options.pitch } : {}),
      ...(options.bearing !== undefined ? { bearing: options.bearing } : {}),
      duration: options.duration ?? 500,
    });
    // Optimistically update the cache so a following getCenter/getZoom reflects the target.
    this.handle.region = {
      ...this.handle.region,
      center: { lng: options.center[0], lat: options.center[1] },
      zoom: options.zoom,
    };
    return this;
  }

  resize(): this {
    // MapLibre-RN resizes with its container automatically; nothing to do.
    return this;
  }

  getStyle(): MapStyle | null {
    return { layers: this.handle.store.getLayerSummaries() };
  }

  setStyle(): this {
    // Style is driven declaratively via GebetaMap's `styleUrl` prop, not imperatively.
    throw new Error(
      'MapAdapter.setStyle is not supported on React Native — set the `styleUrl` prop on <GebetaMap> instead.'
    );
  }

  isStyleLoaded(): boolean {
    return this.handle.styleLoaded;
  }

  addSource(id: string, spec: unknown): this {
    this.handle.store.addSource(id, spec as GeoJsonSourceSpec);
    return this;
  }

  getSource(id: string): unknown {
    return this.handle.store.getSourceHandle(id);
  }

  removeSource(id: string): this {
    this.handle.store.removeSource(id);
    return this;
  }

  addLayer(spec: unknown, beforeId?: string): this {
    const layerSpec = spec as LayerSpec;
    this.handle.store.addLayer(beforeId ? { ...layerSpec, beforeId } : layerSpec);
    return this;
  }

  removeLayer(id: string): this {
    this.handle.store.removeLayer(id);
    return this;
  }

  fitBounds(bounds: MapBounds, options?: { padding?: number; duration?: number }): this {
    // v11 CameraRef.fitBounds takes a single [west, south, east, north] tuple + options.
    // `padding` is a ViewPadding object (per-edge), so expand the scalar to all four edges.
    const pad = options?.padding ?? 0;
    this.handle.cameraRef?.fitBounds(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      {
        padding: { top: pad, right: pad, bottom: pad, left: pad },
        duration: options?.duration ?? 500,
      }
    );
    return this;
  }

  setPaintProperty(layer: string, name: string, value: unknown): this {
    this.handle.store.setPaintProperty(layer, name, value);
    return this;
  }

  setLayoutProperty(layer: string, name: string, value: unknown): this {
    this.handle.store.setLayoutProperty(layer, name, value);
    return this;
  }
}
