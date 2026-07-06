/**
 * Declarative source/layer store for the React Native MapAdapter.
 *
 * `@maplibre/maplibre-react-native` has no imperative `map.addSource()` / `map.addLayer()`
 * API — sources and layers are declared as JSX children (`<ShapeSource>`, `<LineLayer>`, …).
 * But the platform-agnostic managers in `@gebeta/core` and the web-derived logic in
 * `@gebeta/js` speak the imperative `IMapAdapter` contract.
 *
 * This store is the bridge. `MapAdapter` records source/layer specs here; a `MapSpecRenderer`
 * component subscribes and renders the current specs as MapLibre-RN children. Mutations
 * (setData, setPaintProperty, setLayoutProperty) update the store and notify subscribers,
 * which re-render the affected children.
 *
 * Specs use the MapLibre GL Style Spec shape (`{ type: 'geojson', data }` sources,
 * `{ id, type, source, layout, paint }` layers) exactly as the managers emit them — the
 * translation to RN's camelCase `style` prop happens in the renderer, not here.
 */

export interface GeoJsonSourceSpec {
  type: 'geojson';
  data: unknown;
  cluster?: boolean;
  clusterRadius?: number;
  clusterMaxZoom?: number;
}

export interface LayerSpec {
  id: string;
  type: string;
  source: string;
  sourceLayer?: string;
  layout?: Record<string, unknown>;
  paint?: Record<string, unknown>;
  /** Layer id this layer should render beneath, from addLayer(spec, beforeId). */
  beforeId?: string;
}

/**
 * Handle returned by `MapAdapter.getSource(id)`. Mirrors the subset of the maplibre-gl
 * GeoJSONSource API that the managers actually call — today just `setData`.
 */
export interface SourceHandle {
  setData(data: unknown): void;
}

export interface MapSpecSnapshot {
  sources: ReadonlyMap<string, GeoJsonSourceSpec>;
  /** Insertion-ordered; `beforeId` is resolved by the renderer, not by array position. */
  layers: readonly LayerSpec[];
}

type Listener = () => void;

export class MapSpecStore {
  private sources = new Map<string, GeoJsonSourceSpec>();
  private layers: LayerSpec[] = [];
  private listeners = new Set<Listener>();
  private snapshot: MapSpecSnapshot = { sources: new Map(), layers: [] };
  private snapshotDirty = false;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Stable snapshot for `useSyncExternalStore`. A fresh object is produced only when the
   * store has actually changed since the last read, so React can bail out of re-renders.
   */
  getSnapshot(): MapSpecSnapshot {
    if (this.snapshotDirty) {
      this.snapshot = {
        sources: new Map(this.sources),
        layers: this.layers.slice(),
      };
      this.snapshotDirty = false;
    }
    return this.snapshot;
  }

  addSource(id: string, spec: GeoJsonSourceSpec): void {
    this.sources.set(id, spec);
    this.markChanged();
  }

  hasSource(id: string): boolean {
    return this.sources.has(id);
  }

  getSourceHandle(id: string): SourceHandle | undefined {
    if (!this.sources.has(id)) return undefined;
    return {
      setData: (data: unknown) => {
        const existing = this.sources.get(id);
        if (!existing) return;
        this.sources.set(id, { ...existing, data });
        this.markChanged();
      },
    };
  }

  removeSource(id: string): void {
    if (this.sources.delete(id)) this.markChanged();
  }

  addLayer(spec: LayerSpec): void {
    const idx = this.layers.findIndex(l => l.id === spec.id);
    if (idx >= 0) {
      this.layers[idx] = spec;
    } else {
      this.layers.push(spec);
    }
    this.markChanged();
  }

  hasLayer(id: string): boolean {
    return this.layers.some(l => l.id === id);
  }

  removeLayer(id: string): void {
    const idx = this.layers.findIndex(l => l.id === id);
    if (idx >= 0) {
      this.layers.splice(idx, 1);
      this.markChanged();
    }
  }

  setPaintProperty(layerId: string, name: string, value: unknown): void {
    const layer = this.layers.find(l => l.id === layerId);
    if (!layer) return;
    layer.paint = { ...(layer.paint ?? {}), [name]: value };
    this.markChanged();
  }

  setLayoutProperty(layerId: string, name: string, value: unknown): void {
    const layer = this.layers.find(l => l.id === layerId);
    if (!layer) return;
    layer.layout = { ...(layer.layout ?? {}), [name]: value };
    this.markChanged();
  }

  /** Layer ids and types, for MapAdapter.getStyle(). */
  getLayerSummaries(): Array<{ id: string; type: string }> {
    return this.layers.map(l => ({ id: l.id, type: l.type }));
  }

  private markChanged(): void {
    this.snapshotDirty = true;
    this.listeners.forEach(listener => listener());
  }
}
