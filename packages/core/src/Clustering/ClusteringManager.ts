import { ValidationError } from '@gebeta/api';
import type { API } from '@gebeta/api';
import Supercluster from 'supercluster';
import type { NormalizedClusteringOptions, SuperclusterPoint } from './types';
import { normalizeClusteringOptions } from './utils';
import { markerToSuperclusterPoint, superclusterToClusterData } from './transform';

type MarkerData = API.Overlay.Types.MarkerData;
type ClusterData = API.Overlay.Types.ClusterData;
type ClusteringOptions = API.Clustering.Types.Options;

type LngLatBounds = [number, number, number, number];

/**
 * ClusteringManager handles marker clustering logic using Supercluster.
 * Platform-agnostic: pure clustering math, no DOM or Map dependencies.
 *
 * This manager maintains a list of markers and uses Supercluster to calculate
 * clusters based on the current map viewport and zoom level. It provides methods
 * to add/remove markers and query clusters for rendering.
 */
export class ClusteringManager {
  private readonly options: NormalizedClusteringOptions;
  private markers: MarkerData[] = [];
  private supercluster: Supercluster<
    SuperclusterPoint['properties'],
    SuperclusterPoint['geometry']
  >;

  constructor(options: ClusteringOptions = {}) {
    this.options = normalizeClusteringOptions(options);

    this.supercluster = new Supercluster({
      radius: this.options.radius,
      maxZoom: this.options.maxZoom,
    });
  }

  /**
   * Add a marker to the clustering manager.
   * @param marker - Marker data to add
   */
  addMarker(marker: MarkerData): void {
    if (!marker?.id) {
      throw new ValidationError('Marker ID is required', 'marker.id', { marker });
    }
    if (!marker?.lngLat) {
      throw new ValidationError('Marker lngLat is required', 'marker.lngLat', { marker });
    }

    const existingIndex = this.markers.findIndex(m => m.id === marker.id);
    if (existingIndex >= 0) {
      this.markers[existingIndex] = marker;
    } else {
      this.markers.push(marker);
    }
  }

  /**
   * Remove a marker by ID.
   * @param markerId - ID of marker to remove
   * @returns True if marker was removed, false if not found
   */
  removeMarker(markerId: string): boolean {
    const before = this.markers.length;
    this.markers = this.markers.filter(m => m.id !== markerId);
    return before !== this.markers.length;
  }

  /**
   * Clear all markers.
   */
  clearMarkers(): void {
    this.markers = [];
  }

  /**
   * Get all markers.
   * @returns Array of all markers
   */
  getMarkers(): MarkerData[] {
    return [...this.markers];
  }

  /**
   * Get marker by ID.
   * @param markerId - ID of marker to find
   * @returns Marker data or undefined if not found
   */
  getMarker(markerId: string): MarkerData | undefined {
    return this.markers.find(m => m.id === markerId);
  }

  /**
   * Load markers into Supercluster and get clusters for the current view.
   * @param bounds - Map bounds [west, south, east, north]
   * @param zoom - Current zoom level
   * @returns Array of cluster data (clusters and individual markers)
   */
  getClusters(bounds: LngLatBounds, zoom: number): ClusterData[] {
    if (this.markers.length === 0) {
      return [];
    }

    const points: SuperclusterPoint[] = this.markers.map(markerToSuperclusterPoint);
    this.supercluster.load(points);

    const clusters = this.supercluster.getClusters(bounds, Math.floor(zoom));
    return clusters.map(superclusterToClusterData);
  }

  /**
   * Get the expansion zoom level for a cluster.
   * @param clusterId - Cluster ID
   * @returns Zoom level to expand to, or 0 if not found or error occurs
   */
  getClusterExpansionZoom(clusterId: number): number {
    try {
      return this.supercluster.getClusterExpansionZoom(clusterId) ?? 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get current clustering options.
   * @returns Copy of current normalized options
   */
  getOptions(): NormalizedClusteringOptions {
    return { ...this.options };
  }

  /**
   * Update clustering options.
   * Recreates Supercluster instance if radius or maxZoom changes.
   * @param options - Partial options to update
   */
  updateOptions(options: Partial<ClusteringOptions>): void {
    const needsRecreate = options.radius != null || options.maxZoom != null;

    if (needsRecreate) {
      const updatedOptions = normalizeClusteringOptions({
        ...this.options,
        ...options,
      });
      this.supercluster = new Supercluster({
        radius: updatedOptions.radius,
        maxZoom: updatedOptions.maxZoom,
      });
      Object.assign(this.options, updatedOptions);
    } else {
      const updatedOptions = normalizeClusteringOptions({
        ...this.options,
        ...options,
      });
      Object.assign(this.options, updatedOptions);
    }
  }
}
