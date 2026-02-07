import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { ClusteringManager as CoreClusteringManager } from '@gebeta/maps-core';
import { API, ValidationError } from '@gebeta/maps-api';
import { createClusterMarker, createIndividualMarker } from './markers';

type MarkerData = API.Overlay.Types.MarkerData;
type ClusteringOptions = API.Clustering.Types.Options;

export class ClusteringManager {
  private readonly map: MapLibreMap;
  private readonly core: CoreClusteringManager;
  private readonly renderedMarkers: Map<string | number, MapLibreMarker> = new Map();
  private updateTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(map: MapLibreMap, options: ClusteringOptions = {}) {
    if (!map) {
      throw new ValidationError('Map is required for ClusteringManager', 'map');
    }
    this.map = map;
    this.core = new CoreClusteringManager(options);
    this.setupEventListeners();
  }

  /**
   * Add a marker to clustering.
   * @param marker - Marker data to add
   */
  addMarker(marker: MarkerData): void {
    this.core.addMarker(marker);
    this.scheduleUpdate();
  }

  /**
   * Remove a marker by ID.
   * @param markerId - ID of marker to remove
   * @returns True if marker was removed, false if not found
   */
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

  /**
   * Clear all markers.
   */
  clearMarkers(): void {
    this.core.clearMarkers();
    this.clearRenderedElements();
  }

  /**
   * Get all markers.
   * @returns Array of all markers
   */
  getMarkers(): MarkerData[] {
    return this.core.getMarkers();
  }

  /**
   * Get marker by ID.
   * @param markerId - ID of marker to find
   * @returns Marker data or undefined if not found
   */
  getMarker(markerId: string): MarkerData | undefined {
    return this.core.getMarker(markerId);
  }

  /**
   * Update clustering options.
   * @param options - Partial options to update
   */
  updateOptions(options: Partial<ClusteringOptions>): void {
    this.core.updateOptions(options);
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
    this.updateClustering();
  }

  /**
   * Get clustering options.
   * @returns Current clustering options
   */
  getOptions(): ReturnType<typeof this.core.getOptions> {
    return this.core.getOptions();
  }

  private setupEventListeners(): void {
    this.map.on('moveend', () => {
      this.updateClustering();
    });

    this.map.on('zoomend', () => {
      this.updateClustering();
    });
  }

  private scheduleUpdate(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = setTimeout(() => {
      this.updateClustering();
      this.updateTimeout = null;
    }, 0);
  }

  private updateClustering(): void {
    if (!this.map) return;

    const markers = this.core.getMarkers();
    if (markers.length === 0) {
      this.clearRenderedElements();
      return;
    }

    const bounds = this.map.getBounds();
    const zoom = this.map.getZoom();

    const clusters = this.core.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );

    this.clearRenderedElements();

    const options = this.core.getOptions();

    clusters.forEach(cluster => {
      if (cluster.properties.cluster) {
        const marker = createClusterMarker(this.map, cluster, {
          clusterImage: options.clusterImage,
          showClusterCount: options.showClusterCount,
          clusterOnClick:
            options.clusterOnClick ??
            ((c) => {
              const expansionZoom = this.core.getClusterExpansionZoom(c.id);
              this.map.easeTo({
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

        const marker = createIndividualMarker(this.map, markerData, cluster);
        this.renderedMarkers.set(markerId, marker);
      }
    });
  }

  private clearRenderedElements(): void {
    this.renderedMarkers.forEach(marker => {
      if (marker && typeof marker.remove === 'function') {
        marker.remove();
      }
    });
    this.renderedMarkers.clear();
  }
}
