import { ClusteringManager as CoreClusteringManager } from '@gebeta/maps-core';
import { API, ValidationError } from '@gebeta/maps-api';
import { createClusterMarker, createIndividualMarker } from './markers';

type MarkerData = API.Overlay.Types.MarkerData;
type ClusterData = API.Overlay.Types.ClusterData;
type ClusteringOptions = API.Clustering.Types.Options;
type IMapAdapter = API.Platform.Types.IMapAdapter;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type IPopupFactory = API.Platform.Types.IPopupFactory;
type IMarker = API.Platform.Types.IMarker;

export class ClusteringManager {
  private readonly mapAdapter: IMapAdapter;
  private readonly markerFactory: IMarkerFactory;
  private readonly popupFactory: IPopupFactory;
  private readonly core: CoreClusteringManager;
  private readonly renderedMarkers: Map<string | number, IMarker> = new Map();
  private updateTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    mapAdapter: IMapAdapter,
    markerFactory: IMarkerFactory,
    popupFactory: IPopupFactory,
    options: ClusteringOptions = {}
  ) {
    if (!mapAdapter) {
      throw new ValidationError('Map adapter is required for ClusteringManager', 'mapAdapter');
    }
    if (!markerFactory) {
      throw new ValidationError(
        'Marker factory is required for ClusteringManager',
        'markerFactory'
      );
    }
    if (!popupFactory) {
      throw new ValidationError('Popup factory is required for ClusteringManager', 'popupFactory');
    }
    this.mapAdapter = mapAdapter;
    this.markerFactory = markerFactory;
    this.popupFactory = popupFactory;
    this.core = new CoreClusteringManager(options);
    this.setupEventListeners();
  }

  addMarker(marker: MarkerData): void {
    this.core.addMarker(marker);
    this.scheduleUpdate();
  }

  removeMarker(markerId: string): boolean {
    const removed = this.core.removeMarker(markerId);
    if (removed) {
      const renderedMarker = this.renderedMarkers.get(markerId);
      if (renderedMarker) {
        renderedMarker.remove();
        this.renderedMarkers.delete(markerId);
      }
      this.scheduleUpdate();
    }
    return removed;
  }

  clearMarkers(): void {
    this.core.clearMarkers();
    this.clearRenderedElements();
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

  getOptions(): ReturnType<typeof this.core.getOptions> {
    return this.core.getOptions();
  }

  private setupEventListeners(): void {
    this.mapAdapter.on('moveend', () => this.updateClustering());
    this.mapAdapter.on('zoomend', () => this.updateClustering());
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
      this.clearRenderedElements();
      return;
    }

    const bounds = this.mapAdapter.getBounds();
    const zoom = this.mapAdapter.getZoom();
    const clusters = this.core.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );

    this.clearRenderedElements();
    const options = this.core.getOptions();

    clusters.forEach((cluster: ClusterData) => {
      if (cluster.properties.cluster) {
        const marker = createClusterMarker(this.mapAdapter, this.markerFactory, cluster, {
          clusterImage: options.clusterImage,
          showClusterCount: options.showClusterCount,
          clusterOnClick:
            options.clusterOnClick ??
            ((c: ClusterData) => {
              const expansionZoom = this.core.getClusterExpansionZoom(c.id);
              this.mapAdapter.easeTo({
                center: c.geometry.coordinates,
                zoom: expansionZoom,
              });
            }),
        });
        this.renderedMarkers.set(cluster.id, marker);
      } else {
        const markerId = cluster.properties.markerId;
        if (!markerId) return;
        const markerData = this.core.getMarker(markerId);
        if (!markerData) return;
        const marker = createIndividualMarker(
          this.mapAdapter,
          this.markerFactory,
          this.popupFactory,
          markerData,
          cluster
        );
        this.renderedMarkers.set(markerId, marker);
      }
    });
  }

  private clearRenderedElements(): void {
    this.renderedMarkers.forEach(m => m.remove());
    this.renderedMarkers.clear();
  }
}
