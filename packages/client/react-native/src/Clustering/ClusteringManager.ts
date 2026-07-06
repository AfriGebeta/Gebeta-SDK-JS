import { ClusteringManager as CoreClusteringManager } from '@gebeta/core';
import type { API } from '@gebeta/api';
import type { MarkerFactory } from '../adapters/MarkerFactory';
import { createClusterMarker, createIndividualMarker } from './markers';

type MarkerData = API.Overlay.Types.MarkerData;
type ClusteringOptions = API.Clustering.Types.Options;
type IMapAdapter = API.Platform.Types.IMapAdapter;
type IPopupFactory = API.Platform.Types.IPopupFactory;
type IMarker = API.Platform.Types.IMarker;

/**
 * React Native marker clustering. Wraps the platform-agnostic core `ClusteringManager` (which
 * runs Supercluster) and renders clusters/individual markers via the RN `MarkerFactory`. Mirrors
 * the web `@gebeta/js` ClusteringManager — the only platform-specific part is the marker helper
 * (RN count-circles instead of styled HTML divs). Re-clusters on map `moveend`/`zoomend`.
 */
export class ClusteringManager {
  private readonly core: CoreClusteringManager;
  private readonly rendered: Map<string | number, IMarker[]> = new Map();
  private updateTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly mapAdapter: IMapAdapter,
    private readonly markerFactory: MarkerFactory,
    private readonly popupFactory: IPopupFactory,
    options: ClusteringOptions = {}
  ) {
    this.core = new CoreClusteringManager(options);
    this.mapAdapter.on('moveend', () => this.updateClustering());
    this.mapAdapter.on('zoomend', () => this.updateClustering());
  }

  addMarker(marker: MarkerData): void {
    this.core.addMarker(marker);
    this.scheduleUpdate();
  }

  addMarkers(markers: MarkerData[]): void {
    markers.forEach(m => this.core.addMarker(m));
    this.scheduleUpdate();
  }

  removeMarker(markerId: string): boolean {
    const removed = this.core.removeMarker(markerId);
    if (removed) {
      this.removeRendered(markerId);
      this.scheduleUpdate();
    }
    return removed;
  }

  clearMarkers(): void {
    this.core.clearMarkers();
    this.clearRendered();
  }

  getMarkers(): MarkerData[] {
    return this.core.getMarkers();
  }

  getMarker(markerId: string): MarkerData | undefined {
    return this.core.getMarker(markerId);
  }

  updateOptions(options: Partial<ClusteringOptions>): void {
    this.core.updateOptions(options);
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
    this.updateClustering();
  }

  getOptions(): ReturnType<CoreClusteringManager['getOptions']> {
    return this.core.getOptions();
  }

  /** Re-render clusters now (call once after the initial map load / addMarkers). */
  refresh(): void {
    this.updateClustering();
  }

  private scheduleUpdate(): void {
    if (this.updateTimeout) clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.updateClustering();
      this.updateTimeout = null;
    }, 0);
  }

  private updateClustering(): void {
    const markers = this.core.getMarkers();
    if (markers.length === 0) {
      this.clearRendered();
      return;
    }

    const bounds = this.mapAdapter.getBounds();
    const zoom = this.mapAdapter.getZoom();
    const clusters = this.core.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );

    this.clearRendered();
    const options = this.core.getOptions();

    clusters.forEach(cluster => {
      if (cluster.properties.cluster) {
        const marker = createClusterMarker(this.mapAdapter, this.markerFactory, cluster, {
          clusterImage: options.clusterImage,
          showClusterCount: options.showClusterCount,
          clusterOnClick:
            options.clusterOnClick != null
              ? c => options.clusterOnClick?.(c, {} as never)
              : c => {
                  const expansionZoom = this.core.getClusterExpansionZoom(c.id);
                  this.mapAdapter.easeTo({
                    center: c.geometry.coordinates,
                    zoom: expansionZoom,
                  });
                },
        });
        this.rendered.set(cluster.id, [marker]);
      } else {
        const markerId = cluster.properties.markerId;
        if (!markerId) return;
        const markerData = this.core.getMarker(markerId);
        if (!markerData) return;
        const created = createIndividualMarker(
          this.mapAdapter,
          this.markerFactory,
          this.popupFactory,
          markerData,
          cluster
        );
        this.rendered.set(markerId, created);
      }
    });
  }

  private removeRendered(key: string | number): void {
    this.rendered.get(key)?.forEach(m => m.remove());
    this.rendered.delete(key);
  }

  private clearRendered(): void {
    this.rendered.forEach(markers => markers.forEach(m => m.remove()));
    this.rendered.clear();
  }
}
