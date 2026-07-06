import { FenceManager as CoreFenceManager } from '@gebeta/core';
import { API } from '@gebeta/api';
import {
  FENCE_SOURCE_ID,
  FENCE_LAYER_ID,
  FENCE_BORDER_LAYER_ID,
  DEFAULT_MARKER_IMAGE,
  DEFAULT_MARKER_SIZE,
} from './constants';
import { initFenceLayers, updateFenceLayerData, clearFenceLayers } from './layers';
import {
  initDynamicPolyline,
  updateDynamicPolyline,
  clearDynamicPolyline,
} from './dynamicPolyline';

type FenceDefinition = API.Fencing.Types.Definition;
type FenceStyleOptions = API.Fencing.Types.StyleOptions;
type FencePointOptions = API.Fencing.Types.PointOptions;
type LngLat = API.Common.Types.LngLat;
type LngLatLike = API.Common.Types.LngLatLike;
type IMapAdapter = API.Platform.Types.IMapAdapter;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type IPopupFactory = API.Platform.Types.IPopupFactory;
type IMarker = API.Platform.Types.IMarker;
type IPopup = API.Platform.Types.IPopup;

export interface FenceManagerOptions {
  defaultStyle?: FenceStyleOptions;
  markerImage?: string;
  markerSize?: [number, number];
  proximityThresholdMeters?: number;
  onFenceCompleted?: (event: API.Fencing.Events.CompletedEvent) => void;
}

/**
 * React Native geofencing manager. Wraps the platform-agnostic core `FenceManager` (drawing
 * state, geometry, CRUD, proximity, events) and renders fences via the declarative MapSpecStore:
 * a `<GeoJSONSource>` with fill + border layers per fence, point markers while drawing, and a
 * dynamic outline. Ported from the web `@gebeta/js` FenceManager.
 *
 * Two RN differences from the web:
 * - No `mousemove` on touch, so the outline follows tapped points only (no live cursor preview).
 * - RN markers don't support `setPopup`, so centroid overlays render as standalone popups
 *   (independent store records) positioned at the centroid.
 */
export class FenceManager {
  private readonly core: CoreFenceManager;
  private readonly markerImage: string;
  private readonly markerSize: [number, number];
  private readonly renderedMarkers: Map<string | number, IMarker> = new Map();
  private readonly renderedOverlays: Map<string | number, IPopup> = new Map();
  private readonly storedFences: Map<
    string | number,
    { sourceId: string; layerId: string; borderLayerId: string }
  > = new Map();
  private clickHandler: ((...args: unknown[]) => void) | null = null;
  private isDrawing = false;

  constructor(
    private readonly mapAdapter: IMapAdapter,
    private readonly markerFactory: IMarkerFactory,
    private readonly popupFactory: IPopupFactory,
    options: FenceManagerOptions = {}
  ) {
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
    this.core.on('fenceCompleted', () => this.clearCurrentMarkers());
  }

  startDrawing(style?: FenceStyleOptions): void {
    if (this.isDrawing) this.stopDrawing();
    this.core.startDrawing(style);
    this.isDrawing = true;
    this.setupDrawingListeners();
    initDynamicPolyline(this.mapAdapter, this.core.getCurrentStyle());
  }

  stopDrawing(): void {
    this.isDrawing = false;
    this.removeDrawingListeners();
    clearDynamicPolyline(this.mapAdapter);
    this.core.stopDrawing();
  }

  addPoint(
    point: LngLatLike,
    options?: FencePointOptions & {
      onClick?: (point: LngLatLike, marker: IMarker) => void;
    }
  ): void {
    const wasAdded = this.core.addPoint(point, options);
    if (!wasAdded) return;

    const points = this.core.getCurrentFencePoints();
    const pointIndex = points.length - 1;
    const isFirstPoint = pointIndex === 0;

    if (points.length === 1) initDynamicPolyline(this.mapAdapter, this.core.getCurrentStyle());

    const marker = this.markerFactory.createMarker({
      imageUrl: this.markerImage,
      size: this.markerSize,
      anchor: 'center',
      onClick: (clickedPoint, markerEl) => {
        const currentPoints = this.core.getCurrentFencePoints();
        if (isFirstPoint && currentPoints.length >= 3 && this.isDrawing) {
          this.closeFence();
          return;
        }
        options?.onClick?.(clickedPoint, markerEl);
      },
    });
    if (marker) {
      marker.setLngLat(point).addTo(this.mapAdapter);
      const pointId = options?.markerId ?? `fence-point-${pointIndex}`;
      this.renderedMarkers.set(pointId, marker);
    }

    if (points.length >= 3) this.updateCurrentFence();
    updateDynamicPolyline(this.mapAdapter, points);
  }

  closeFence(): FenceDefinition | null {
    const fence = this.core.closeFence();
    if (!fence) return null;
    this.stopDrawing();
    this.clearCurrentMarkers();
    if (this.mapAdapter.getSource(FENCE_SOURCE_ID)) {
      clearFenceLayers(this.mapAdapter, FENCE_SOURCE_ID, FENCE_LAYER_ID, FENCE_BORDER_LAYER_ID);
    }
    this.renderStoredFence(fence);
    return fence;
  }

  clearCurrentFence(): void {
    this.stopDrawing();
    this.clearCurrentMarkers();
    if (this.mapAdapter.getSource(FENCE_SOURCE_ID)) {
      clearFenceLayers(this.mapAdapter, FENCE_SOURCE_ID, FENCE_LAYER_ID, FENCE_BORDER_LAYER_ID);
    }
    this.core.clearCurrentFence();
  }

  getFences(): FenceDefinition[] {
    return this.core.getFences();
  }

  getFence(fenceId: string | number): FenceDefinition | undefined {
    return this.core.getFence(fenceId);
  }

  getFenceByName(name: string): FenceDefinition | undefined {
    return this.core.getFenceByName(name);
  }

  removeFence(fenceId: string | number): boolean {
    const removed = this.core.removeFence(fenceId);
    if (removed) this.removeStoredFence(fenceId);
    return removed;
  }

  removeFenceByName(name: string): boolean {
    const fence = this.core.getFenceByName(name);
    if (!fence?.id) return false;
    return this.removeFence(fence.id);
  }

  clearAllFences(): void {
    this.clearCurrentFence();
    this.core.clearAllFences();
    for (const fenceId of Array.from(this.storedFences.keys())) this.removeStoredFence(fenceId);
    this.storedFences.clear();
  }

  updateCurrentFenceStyle(style: Partial<FenceStyleOptions>): void {
    this.core.updateCurrentFenceStyle(style);
  }

  setDefaultStyle(style: FenceStyleOptions): void {
    this.core.setDefaultStyle(style);
  }

  getDefaultStyle(): FenceStyleOptions {
    return this.core.getDefaultStyle();
  }

  getCurrentStyle(): FenceStyleOptions {
    return this.core.getCurrentStyle();
  }

  setProximityThreshold(meters: number): void {
    this.core.setProximityThreshold(meters);
  }

  getProximityThreshold(): number {
    return this.core.getProximityThreshold();
  }

  isDrawingFence(): boolean {
    return this.isDrawing;
  }

  getCurrentFencePoints(): LngLatLike[] {
    return this.core.getCurrentFencePoints();
  }

  canCloseFence(): boolean {
    return this.core.canCloseFence();
  }

  getFenceCentroid(fence: FenceDefinition | string | number): LngLat {
    return this.core.getFenceCentroid(fence);
  }

  renderFences(
    fences: FenceDefinition[],
    options?: { clearExisting?: boolean; persistent?: boolean }
  ): void {
    this.core.renderFences(fences, options);
    fences.forEach(fence => {
      if (fence.id) this.renderStoredFence(fence);
    });
  }

  on(event: 'fenceCompleted', callback: (event: API.Fencing.Events.CompletedEvent) => void): void {
    this.core.on(event, callback);
  }

  off(event: 'fenceCompleted', callback: (event: API.Fencing.Events.CompletedEvent) => void): void {
    this.core.off(event, callback);
  }

  private setupDrawingListeners(): void {
    this.clickHandler = (...args: unknown[]) => {
      const e = args[0] as { lngLat: { lng: number; lat: number } };
      this.addPoint([e.lngLat.lng, e.lngLat.lat]);
    };
    this.mapAdapter.on('click', this.clickHandler);
  }

  private removeDrawingListeners(): void {
    if (this.clickHandler) {
      this.mapAdapter.off('click', this.clickHandler);
      this.clickHandler = null;
    }
  }

  private updateCurrentFence(): void {
    const points = this.core.getCurrentFencePoints();
    if (points.length < 3) return;
    const style = this.core.getCurrentStyle();
    initFenceLayers(this.mapAdapter, FENCE_SOURCE_ID, FENCE_LAYER_ID, FENCE_BORDER_LAYER_ID, style);
    updateFenceLayerData(this.mapAdapter, FENCE_SOURCE_ID, points);
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

    initFenceLayers(this.mapAdapter, sourceId, layerId, borderLayerId, style);
    updateFenceLayerData(this.mapAdapter, sourceId, fence.points);
    this.storedFences.set(fence.id, { sourceId, layerId, borderLayerId });

    if (fence.overlayContent) {
      const centroid = this.core.getFenceCentroid(fence);
      const popup = this.popupFactory.createPopup({
        content: fence.overlayContent,
        closeable: false,
        anchor: fence.overlayOptions?.anchor as string,
        offset: fence.overlayOptions?.offset,
      });
      if (popup) {
        popup.setLngLat(centroid).addTo(this.mapAdapter);
        this.renderedOverlays.set(fence.id, popup);
      }
    }
  }

  private removeStoredFence(fenceId: string | number): void {
    const fenceInfo = this.storedFences.get(fenceId);
    if (fenceInfo) {
      clearFenceLayers(
        this.mapAdapter,
        fenceInfo.sourceId,
        fenceInfo.layerId,
        fenceInfo.borderLayerId
      );
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
}
