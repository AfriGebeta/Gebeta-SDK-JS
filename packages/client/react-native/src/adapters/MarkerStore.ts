/**
 * Declarative marker store for the React Native platform.
 *
 * Same bridge pattern as {@link MapSpecStore} but for markers. The web `IMarker` contract is
 * imperative (`new Marker().setLngLat().addTo(map)`), while MapLibre-RN v11 markers are
 * declarative JSX (`<Marker lngLat={…}>`). `MarkerFactory` hands out `IMarker` adapters that
 * record into this store; a `MarkerRenderer` subscribes and renders each record as a
 * `<Marker>` child of `<Map>`.
 *
 * Each marker gets a stable numeric id so React keys stay consistent across re-renders even
 * as position/content change.
 */

import type { API } from '@gebeta/api';

export interface MarkerRecord {
  id: number;
  lngLat: API.Common.Types.LngLat;
  imageUrl?: string;
  size?: [number, number];
  anchor?: string;
  offset?: [number, number];
  onClick?: (record: MarkerRecord) => void;
  /**
   * Plain-text bubble content. Used by popups (there is no HTML in RN, so `IPopup.setHTML`
   * content is stripped to text and rendered as a styled bubble instead of an image/pin).
   */
  text?: string;
  /**
   * Cluster point count. When set, the marker renders as a cluster bubble (circle + count,
   * or `imageUrl` with a count badge) instead of a pin. Used by the ClusteringManager.
   */
  clusterCount?: number;
  /** Whether this marker is currently added to the map (addTo called, remove not yet). */
  visible: boolean;
}

type Listener = () => void;

export class MarkerStore {
  private markers = new Map<number, MarkerRecord>();
  private nextId = 1;
  private listeners = new Set<Listener>();
  private snapshot: readonly MarkerRecord[] = [];
  private snapshotDirty = false;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Stable snapshot of the visible markers for `useSyncExternalStore`. */
  getSnapshot(): readonly MarkerRecord[] {
    if (this.snapshotDirty) {
      this.snapshot = Array.from(this.markers.values()).filter(m => m.visible);
      this.snapshotDirty = false;
    }
    return this.snapshot;
  }

  /** Create a record (not yet visible until `setVisible(id, true)`). Returns its id. */
  create(init: Omit<MarkerRecord, 'id' | 'visible'>): number {
    const id = this.nextId++;
    this.markers.set(id, { ...init, id, visible: false });
    // No notify: an unadded marker is not rendered.
    return id;
  }

  get(id: number): MarkerRecord | undefined {
    return this.markers.get(id);
  }

  update(id: number, patch: Partial<Omit<MarkerRecord, 'id'>>): void {
    const existing = this.markers.get(id);
    if (!existing) return;
    this.markers.set(id, { ...existing, ...patch });
    if (existing.visible || patch.visible) this.markChanged();
  }

  setVisible(id: number, visible: boolean): void {
    const existing = this.markers.get(id);
    if (!existing || existing.visible === visible) return;
    this.markers.set(id, { ...existing, visible });
    this.markChanged();
  }

  remove(id: number): void {
    const existing = this.markers.get(id);
    if (!existing) return;
    this.markers.delete(id);
    if (existing.visible) this.markChanged();
  }

  private markChanged(): void {
    this.snapshotDirty = true;
    this.listeners.forEach(listener => listener());
  }
}
