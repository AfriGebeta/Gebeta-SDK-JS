import type { MapRef, CameraRef } from '@maplibre/maplibre-react-native';
import type { API } from '@gebeta/api';
import { MapSpecStore } from './MapSpecStore';

/**
 * Live handle to a mounted MapLibre-RN (v11) map. `MapAdapter` reads through this; `GebetaMap`
 * populates it once `<Map>`/`<Camera>` refs attach and keeps `region` current from
 * `onRegionDidChange`.
 *
 * The adapter is constructed at `createPlatform()` time — before any map exists — so the ref
 * fields are nullable and the sync getters fall back to cached/default values until the map is
 * live.
 *
 * v11 coordinate types are tuples: `LngLat = [lng, lat]`, `LngLatBounds = [w, s, e, n]`.
 */

/** Last-known camera region, cached so the synchronous IMapAdapter getters can answer. */
export interface CachedRegion {
  center: API.Common.Types.LngLat;
  zoom: number;
  bounds: { west: number; south: number; east: number; north: number } | null;
}

type MapEventListener = (...args: unknown[]) => void;

export class MapHandle {
  readonly store = new MapSpecStore();

  mapRef: MapRef | null = null;
  cameraRef: CameraRef | null = null;
  styleLoaded = false;

  region: CachedRegion;

  private listeners = new Map<string, Set<MapEventListener>>();

  constructor(initialCenter: API.Common.Types.LngLat, initialZoom: number) {
    this.region = { center: initialCenter, zoom: initialZoom, bounds: null };
  }

  on(event: string, fn: MapEventListener): void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(fn);
  }

  once(event: string, fn: MapEventListener): void {
    const wrapper: MapEventListener = (...args) => {
      this.off(event, wrapper);
      fn(...args);
    };
    this.on(event, wrapper);
  }

  off(event: string, fn: MapEventListener): void {
    this.listeners.get(event)?.delete(fn);
  }

  /** Called by GebetaMap from Map/Camera callbacks. */
  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach(fn => fn(...args));
  }
}
