import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { FenceManager as CoreFenceManager } from '@gebeta/maps-core';
import { API, ValidationError } from '@gebeta/maps-api';
import {
  FENCE_SOURCE_ID,
  FENCE_LAYER_ID,
  FENCE_BORDER_LAYER_ID,
  DEFAULT_MARKER_IMAGE,
  DEFAULT_MARKER_SIZE,
} from './constants';
import { initFenceLayers, updateFenceLayerData, clearFenceLayers } from './layers';
import { initDynamicPolyline, updateDynamicPolyline, updateDynamicPolylineStyle, clearDynamicPolyline } from './dynamicPolyline';
import { createFenceMarker, createCentroidOverlay } from './markers';

type FenceDefinition = API.Fencing.Types.Definition;
type FenceStyleOptions = API.Fencing.Types.StyleOptions;
type FencePointOptions = API.Fencing.Types.PointOptions;
type LngLat = API.Common.Types.LngLat;
type LngLatLike = API.Common.Types.LngLatLike;

export interface FenceManagerOptions {
  defaultStyle?: FenceStyleOptions;
  markerImage?: string;
  markerSize?: [number, number];
  proximityThresholdMeters?: number;
  onFenceCompleted?: (event: API.Fencing.Events.CompletedEvent) => void;
}

export class FenceManager {
  private readonly map: MapLibreMap;
  private readonly core: CoreFenceManager;
  private readonly markerImage: string;
  private readonly markerSize: [number, number];
  private readonly renderedMarkers: Map<string | number, MapLibreMarker> = new Map();
  private readonly renderedOverlays: Map<string | number, MapLibreMarker> = new Map();
  private readonly storedFences: Map<string | number, { sourceId: string; layerId: string; borderLayerId: string }> = new Map();
  private mouseMoveHandler: ((...args: unknown[]) => void) | null = null;
  private clickHandler: ((...args: unknown[]) => void) | null = null;
  private isDrawing = false;

  constructor(map: MapLibreMap, options: FenceManagerOptions = {}) {
    if (!map) {
      throw new ValidationError('Map is required for FenceManager', 'map');
    }
    this.map = map;
    this.markerImage = options.markerImage ?? DEFAULT_MARKER_IMAGE;
    this.markerSize = options.markerSize ?? DEFAULT_MARKER_SIZE;

    const apiDefault = API.Fencing.Constants.DEFAULT_STYLE;
    const defaultStyle = options.defaultStyle
      ? { ...apiDefault, lineDashArray: [...apiDefault.lineDashArray], ...options.defaultStyle }
      : { ...apiDefault, lineDashArray: [...apiDefault.lineDashArray] };

    this.core = new CoreFenceManager(defaultStyle);

    if (options.proximityThresholdMeters !== undefined) {
      this.core.setProximityThreshold(options.proximityThresholdMeters);
    }

    if (options.onFenceCompleted) {
      this.core.on('fenceCompleted', options.onFenceCompleted);
    }

    this.core.on('fenceCompleted', this.handleFenceCompleted.bind(this));
  }

  /**
   * Start drawing a new fence.
   * @param style - Optional style options for this fence
   */
  startDrawing(style?: FenceStyleOptions): void {
    if (this.isDrawing) {
      this.stopDrawing();
    }

    this.core.startDrawing(style);
    this.isDrawing = true;
    this.setupDrawingListeners();
    initDynamicPolyline(this.map, this.core.getCurrentStyle());
  }

  /**
   * Stop drawing the current fence.
   */
  stopDrawing(): void {
    this.isDrawing = false;
    this.removeDrawingListeners();
    clearDynamicPolyline(this.map);
    this.core.stopDrawing();
  }

  /**
   * Add a point to the current fence.
   * @param point - Point to add
   * @param options - Optional point options
   */
  addPoint(point: LngLatLike, options?: FencePointOptions & { onClick?: (point: LngLatLike, marker: MapLibreMarker, event: MouseEvent) => void }): void {
    const wasAdded = this.core.addPoint(point, options);
    if (!wasAdded) {
      return;
    }

    const points = this.core.getCurrentFencePoints();
    const pointIndex = points.length - 1;
    const isFirstPoint = pointIndex === 0;

    if (points.length === 1) {
      initDynamicPolyline(this.map, this.core.getCurrentStyle());
    }

    const marker = createFenceMarker(
      this.map,
      point,
      this.markerImage,
      this.markerSize,
      options?.markerId,
      (clickedPoint, markerEl, event) => {
        const currentPoints = this.core.getCurrentFencePoints();
        if (isFirstPoint && currentPoints.length >= 3 && this.isDrawing) {
          event.stopPropagation();
          this.closeFence();
          return;
        }
        if (options?.onClick) {
          options.onClick(clickedPoint, markerEl, event);
        }
      }
    );
    if (marker) {
      const pointId = options?.markerId ?? `fence-point-${pointIndex}`;
      this.renderedMarkers.set(pointId, marker);
    }

    if (points.length >= 3) {
      this.updateCurrentFence();
    }

    updateDynamicPolyline(this.map, points);
  }

  /**
   * Close the current fence.
   * @returns Fence definition if closed successfully, null otherwise
   */
  closeFence(): FenceDefinition | null {
    const fence = this.core.closeFence();
    if (!fence) return null;

    this.stopDrawing();
    this.clearCurrentMarkers();
    if (this.map.getSource(FENCE_SOURCE_ID)) {
      clearFenceLayers(this.map, FENCE_SOURCE_ID, FENCE_LAYER_ID, FENCE_BORDER_LAYER_ID);
    }
    this.renderStoredFence(fence);
    return fence;
  }

  /**
   * Clear the current fence being drawn.
   */
  clearCurrentFence(): void {
    this.stopDrawing();
    this.clearCurrentMarkers();
    if (this.map.getSource(FENCE_SOURCE_ID)) {
      clearFenceLayers(this.map, FENCE_SOURCE_ID, FENCE_LAYER_ID, FENCE_BORDER_LAYER_ID);
    }
    this.core.clearCurrentFence();
  }

  /**
   * Get all stored fences.
   * @returns Array of fence definitions
   */
  getFences(): FenceDefinition[] {
    return this.core.getFences();
  }

  /**
   * Get a fence by ID.
   * @param fenceId - Fence ID
   * @returns Fence definition or undefined if not found
   */
  getFence(fenceId: string | number): FenceDefinition | undefined {
    return this.core.getFence(fenceId);
  }

  /**
   * Get a fence by name.
   * @param name - Fence name
   * @returns Fence definition or undefined if not found
   */
  getFenceByName(name: string): FenceDefinition | undefined {
    return this.core.getFenceByName(name);
  }

  /**
   * Remove a fence by ID.
   * @param fenceId - Fence ID
   * @returns True if fence was removed
   */
  removeFence(fenceId: string | number): boolean {
    const removed = this.core.removeFence(fenceId);
    if (removed) {
      this.removeStoredFence(fenceId);
    }
    return removed;
  }

  /**
   * Remove a fence by name.
   * @param name - Fence name
   * @returns True if fence was removed
   */
  removeFenceByName(name: string): boolean {
    const fence = this.core.getFenceByName(name);
    if (!fence?.id) return false;
    return this.removeFence(fence.id);
  }

  /**
   * Clear all stored fences.
   */
  clearAllFences(): void {
    this.clearCurrentFence();
    this.core.clearAllFences();
    const fenceIds = Array.from(this.storedFences.keys());
    for (const fenceId of fenceIds) {
      this.removeStoredFence(fenceId);
    }
    this.storedFences.clear();
  }

  /**
   * Update the style for the current fence being drawn.
   * @param style - Style options to update
   */
  updateCurrentFenceStyle(style: Partial<FenceStyleOptions>): void {
    this.core.updateCurrentFenceStyle(style);
    if (this.isDrawing) {
      const currentStyle = this.core.getCurrentStyle();
      const points = this.core.getCurrentFencePoints();
      updateDynamicPolylineStyle(this.map, points, currentStyle);
    }
  }

  /**
   * Set default fence style for future fences.
   * @param style - Style options
   */
  setDefaultStyle(style: FenceStyleOptions): void {
    this.core.setDefaultStyle(style);
  }

  /**
   * Get current default style.
   * @returns Copy of default style
   */
  getDefaultStyle(): FenceStyleOptions {
    return this.core.getDefaultStyle();
  }

  /**
   * Get current fence style (if drawing).
   * @returns Current fence style or default style
   */
  getCurrentStyle(): FenceStyleOptions {
    return this.core.getCurrentStyle();
  }

  /**
   * Set proximity threshold for auto-closing fences.
   * @param meters - Threshold distance in meters
   */
  setProximityThreshold(meters: number): void {
    this.core.setProximityThreshold(meters);
  }

  /**
   * Get proximity threshold.
   * @returns Threshold in meters
   */
  getProximityThreshold(): number {
    return this.core.getProximityThreshold();
  }

  /**
   * Check if currently drawing a fence.
   * @returns True if drawing is active
   */
  isDrawingFence(): boolean {
    return this.isDrawing;
  }

  /**
   * Get the current fence points.
   * @returns Array of points or empty array if not drawing
   */
  getCurrentFencePoints(): LngLatLike[] {
    return this.core.getCurrentFencePoints();
  }

  /**
   * Check if current fence can be closed (has at least 3 points).
   * @returns True if fence can be closed
   */
  canCloseFence(): boolean {
    return this.core.canCloseFence();
  }

  /**
   * Get fence centroid.
   * @param fence - Fence definition or fence ID
   * @returns Centroid coordinates
   */
  getFenceCentroid(fence: FenceDefinition | string | number): LngLat {
    return this.core.getFenceCentroid(fence);
  }

  /**
   * Render multiple fences from an array of definitions.
   * @param fences - Array of fence definitions
   * @param options - Render options
   */
  renderFences(
    fences: FenceDefinition[],
    options?: { clearExisting?: boolean; persistent?: boolean }
  ): void {
    this.core.renderFences(fences, options);
    fences.forEach(fence => {
      if (fence.id) {
        this.renderStoredFence(fence);
      }
    });
  }

  /**
   * Add event listener for fence events.
   * @param event - Event name
   * @param callback - Callback function
   */
  on(event: 'fenceCompleted', callback: (event: API.Fencing.Events.CompletedEvent) => void): void {
    this.core.on(event, callback);
  }

  /**
   * Remove event listener for fence events.
   * @param event - Event name
   * @param callback - Callback function to remove
   */
  off(event: 'fenceCompleted', callback: (event: API.Fencing.Events.CompletedEvent) => void): void {
    this.core.off(event, callback);
  }

  private setupDrawingListeners(): void {
    this.clickHandler = (...args: unknown[]) => {
      const e = args[0] as { lngLat: { lng: number; lat: number } };
      this.addPoint([e.lngLat.lng, e.lngLat.lat]);
    };

    this.mouseMoveHandler = (...args: unknown[]) => {
      const e = args[0] as { lngLat: { lng: number; lat: number } };
      const points = this.core.getCurrentFencePoints();
      if (points.length > 0) {
        updateDynamicPolyline(this.map, [...points, [e.lngLat.lng, e.lngLat.lat]]);
      }
    };

    this.map.on('click', this.clickHandler);
    this.map.on('mousemove', this.mouseMoveHandler);
  }

  private removeDrawingListeners(): void {
    if (this.clickHandler) {
      this.map.off('click', this.clickHandler);
      this.clickHandler = null;
    }
    if (this.mouseMoveHandler) {
      this.map.off('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }
  }

  private updateCurrentFence(): void {
    const points = this.core.getCurrentFencePoints();
    if (points.length < 3) return;

    const style = this.core.getCurrentStyle();
    initFenceLayers(this.map, FENCE_SOURCE_ID, FENCE_LAYER_ID, FENCE_BORDER_LAYER_ID, style);
    updateFenceLayerData(this.map, FENCE_SOURCE_ID, points);
  }

  private renderStoredFence(fence: FenceDefinition): void {
    if (!fence.id || fence.points.length < 3) return;

    const sourceId = `gebeta-fence-${fence.id}`;
    const layerId = `gebeta-fence-layer-${fence.id}`;
    const borderLayerId = `gebeta-fence-border-layer-${fence.id}`;

    const apiDefault = API.Fencing.Constants.DEFAULT_STYLE;
    const style: FenceStyleOptions = {
      fillColor: fence.color ?? apiDefault.fillColor!,
      fillOpacity: apiDefault.fillOpacity,
      lineColor: fence.color ?? apiDefault.lineColor!,
      lineWidth: apiDefault.lineWidth,
      lineOpacity: apiDefault.lineOpacity,
      lineDashArray: [...apiDefault.lineDashArray],
      borderColor: fence.borderColor ?? fence.color ?? apiDefault.borderColor!,
      borderWidth: apiDefault.borderWidth,
      borderOpacity: apiDefault.borderOpacity,
    };

    initFenceLayers(this.map, sourceId, layerId, borderLayerId, style);
    updateFenceLayerData(this.map, sourceId, fence.points);

    this.storedFences.set(fence.id, { sourceId, layerId, borderLayerId });

    if (fence.overlayContent) {
      const centroid = this.core.getFenceCentroid(fence);
      const overlay = createCentroidOverlay(
        this.map,
        centroid,
        fence.overlayContent,
        fence.overlayOptions as API.Overlay.Types.Options | undefined
      );
      if (overlay) {
        this.renderedOverlays.set(fence.id, overlay);
      }
    }
  }

  private removeStoredFence(fenceId: string | number): void {
    const fenceInfo = this.storedFences.get(fenceId);
    if (fenceInfo) {
      clearFenceLayers(this.map, fenceInfo.sourceId, fenceInfo.layerId, fenceInfo.borderLayerId);
      this.storedFences.delete(fenceId);
    }

    const overlay = this.renderedOverlays.get(fenceId);
    if (overlay) {
      overlay.remove();
      this.renderedOverlays.delete(fenceId);
    }
  }

  private clearCurrentMarkers(): void {
    this.renderedMarkers.forEach(marker => marker.remove());
    this.renderedMarkers.clear();
  }

  private handleFenceCompleted(_event: API.Fencing.Events.CompletedEvent): void {
    this.clearCurrentMarkers();
  }
}
