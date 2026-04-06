import { ValidationError } from '@gebeta/api';
import type { API } from '@gebeta/api';
import { EventEmitter } from '../utils/EventEmitter';
import type {
  NormalizedFenceStyle,
  FenceDrawingState,
  FenceDefinition,
  FenceStyleOptions,
  FencePointOptions,
} from './types';
import { normalizeFenceStyle } from './styleUtils';
import { calculateCentroid, normalizeLngLat, closePolygon, isPointNear } from './utils';

type LngLat = API.Common.Types.LngLat;
type LngLatLike = API.Common.Types.LngLatLike;

interface FenceEvents {
  fenceCompleted: (event: API.Fencing.Events.CompletedEvent) => void;
}

/**
 * FenceManager handles fence state management, centroid calculations, and style options.
 * Platform-agnostic: pure logic, no DOM or MapLibre dependencies.
 *
 * This manager maintains fence state, validates operations, calculates centroids,
 * and emits events when fences are completed. Platform packages handle rendering.
 */
export class FenceManager extends EventEmitter<FenceEvents> {
  private fences: FenceDefinition[] = [];
  private currentFence: FenceDrawingState | null = null;
  private defaultStyle: NormalizedFenceStyle;
  private nextFenceId = 0;
  private proximityThresholdMeters = 50;

  constructor(defaultStyle?: FenceStyleOptions) {
    super();
    this.defaultStyle = normalizeFenceStyle(defaultStyle);
  }

  /**
   * Start drawing a new fence.
   * @param style - Optional style options for this fence
   */
  startDrawing(style?: FenceStyleOptions): void {
    this.currentFence = {
      points: [],
      persistent: false,
      style: style ? normalizeFenceStyle(style) : { ...this.defaultStyle },
    };
  }

  /**
   * Stop drawing the current fence.
   */
  stopDrawing(): void {
    this.currentFence = null;
  }

  /**
   * Check if currently drawing a fence.
   * @returns True if drawing is active
   */
  isDrawing(): boolean {
    return this.currentFence !== null;
  }

  /**
   * Add a point to the current fence.
   * @param point - Point to add
   * @param options - Optional point options (name, overlay, etc.)
   * @returns True if point was added, false if fence was closed
   */
  addPoint(
    point: LngLatLike,
    options?: FencePointOptions & { suppressAutoClose?: boolean; persistent?: boolean }
  ): boolean {
    if (!this.currentFence) {
      this.startDrawing();
    }

    if (!this.currentFence) {
      throw new ValidationError('Failed to initialize fence drawing state', 'currentFence');
    }

    const normalizedPoint = normalizeLngLat(point);
    const currentPoints = this.currentFence.points;

    if (currentPoints.length > 0 && options?.suppressAutoClose !== true) {
      const firstPoint = normalizeLngLat(currentPoints[0]);
      if (isPointNear(normalizedPoint, firstPoint, this.proximityThresholdMeters)) {
        this.closeFence();
        return false;
      }
    }

    currentPoints.push(point);

    if (options?.name && !this.currentFence.name) {
      this.currentFence.name = options.name;
    }

    if (options?.overlayContent && !this.currentFence.overlayContent) {
      this.currentFence.overlayContent = options.overlayContent;
      this.currentFence.overlayOptions = options.overlayOptions;
    }

    if (options?.persistent !== undefined) {
      this.currentFence.persistent = options.persistent;
    }

    return true;
  }

  /**
   * Close the current fence and store it.
   * @returns Fence definition if closed successfully, null otherwise
   */
  closeFence(): FenceDefinition | null {
    if (!this.currentFence || this.currentFence.points.length < 3) {
      return null;
    }

    const closedPoints = closePolygon(this.currentFence.points);

    const fence: FenceDefinition & { persistent?: boolean } = {
      id: String(this.nextFenceId++),
      name: this.currentFence.name,
      points: closedPoints,
      color: this.currentFence.style.fillColor,
      borderColor: this.currentFence.style.borderColor,
      overlayContent: this.currentFence.overlayContent,
      overlayOptions: this.currentFence.overlayOptions,
      persistent: this.currentFence.persistent,
    };

    if (this.currentFence.persistent) {
      this.fences.push(fence);
    }

    const event: API.Fencing.Events.CompletedEvent = {
      fenceId: fence.id!,
      points: closedPoints.map(normalizeLngLat),
      name: fence.name,
    };

    this.emit('fenceCompleted', event);

    this.currentFence = null;
    return fence;
  }

  /**
   * Clear the current fence being drawn.
   */
  clearCurrentFence(): void {
    this.currentFence = null;
  }

  /**
   * Get the current fence points.
   * @returns Array of points or empty array if not drawing
   */
  getCurrentFencePoints(): LngLatLike[] {
    return this.currentFence ? [...this.currentFence.points] : [];
  }

  /**
   * Get the current fence state.
   * @returns Current fence state or null if not drawing
   */
  getCurrentFence(): FenceDrawingState | null {
    if (!this.currentFence) return null;
    return {
      ...this.currentFence,
      points: [...this.currentFence.points],
    };
  }

  /**
   * Check if current fence can be closed (has at least 3 points).
   * @returns True if fence can be closed
   */
  canCloseFence(): boolean {
    return this.currentFence !== null && this.currentFence.points.length >= 3;
  }

  /**
   * Get all stored fences.
   * @returns Array of fence definitions
   */
  getFences(): FenceDefinition[] {
    return this.fences.map(f => ({ ...f }));
  }

  /**
   * Get a fence by ID.
   * @param fenceId - Fence ID
   * @returns Fence definition or undefined if not found
   */
  getFence(fenceId: string | number): FenceDefinition | undefined {
    const id = String(fenceId);
    return this.fences.find(f => String(f.id) === id);
  }

  /**
   * Get a fence by name.
   * @param name - Fence name
   * @returns Fence definition or undefined if not found
   */
  getFenceByName(name: string): FenceDefinition | undefined {
    return this.fences.find(f => f.name === name);
  }

  /**
   * Remove a fence by ID.
   * @param fenceId - Fence ID
   * @returns True if fence was removed, false if not found
   */
  removeFence(fenceId: string | number): boolean {
    const id = String(fenceId);
    const index = this.fences.findIndex(f => String(f.id) === id);
    if (index === -1) return false;
    this.fences.splice(index, 1);
    return true;
  }

  /**
   * Remove a fence by name.
   * @param name - Fence name
   * @returns True if fence was removed, false if not found
   */
  removeFenceByName(name: string): boolean {
    const index = this.fences.findIndex(f => f.name === name);
    if (index === -1) return false;
    this.fences.splice(index, 1);
    return true;
  }

  /**
   * Clear all stored fences.
   */
  clearAllFences(): void {
    this.fences = [];
  }

  /**
   * Clear non-persistent fences.
   */
  clearNonPersistentFences(): void {
    this.fences = this.fences.filter(f => {
      const storedFence = f as FenceDefinition & { persistent?: boolean };
      return storedFence.persistent === true;
    });
  }

  /**
   * Calculate centroid for a fence.
   * @param fence - Fence definition or fence ID
   * @returns Centroid coordinates
   */
  getFenceCentroid(fence: FenceDefinition | string | number): LngLat {
    let fenceDef: FenceDefinition;
    if (typeof fence === 'string' || typeof fence === 'number') {
      const found = this.getFence(fence);
      if (!found) {
        throw new ValidationError(`Fence with ID ${fence} not found`, 'fenceId');
      }
      fenceDef = found;
    } else {
      fenceDef = fence;
    }

    if (fenceDef.points.length === 0) {
      throw new ValidationError('Fence has no points', 'fence.points');
    }

    return calculateCentroid(fenceDef.points);
  }

  /**
   * Update the style for the current fence being drawn.
   * @param style - Style options to update
   */
  updateCurrentFenceStyle(style: Partial<FenceStyleOptions>): void {
    if (!this.currentFence) return;
    const updated = normalizeFenceStyle({
      ...this.currentFence.style,
      ...style,
    });
    this.currentFence.style = updated;
  }

  /**
   * Set default fence style for future fences.
   * @param style - Style options
   */
  setDefaultStyle(style: FenceStyleOptions): void {
    this.defaultStyle = normalizeFenceStyle(style);
  }

  /**
   * Get current default style.
   * @returns Copy of default style
   */
  getDefaultStyle(): NormalizedFenceStyle {
    return { ...this.defaultStyle };
  }

  /**
   * Get current fence style (if drawing).
   * @returns Current fence style or default style
   */
  getCurrentStyle(): NormalizedFenceStyle {
    return this.currentFence ? { ...this.currentFence.style } : { ...this.defaultStyle };
  }

  /**
   * Set proximity threshold for auto-closing fences.
   * @param meters - Threshold distance in meters
   */
  setProximityThreshold(meters: number): void {
    if (meters < 0) {
      throw new ValidationError('Proximity threshold must be non-negative', 'meters');
    }
    this.proximityThresholdMeters = meters;
  }

  /**
   * Get proximity threshold.
   * @returns Threshold in meters
   */
  getProximityThreshold(): number {
    return this.proximityThresholdMeters;
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
    const { clearExisting = true, persistent = false } = options ?? {};

    if (clearExisting) {
      this.clearAllFences();
    }

    fences.forEach(fence => {
      const fenceWithPersistent = { ...fence, persistent } as FenceDefinition & {
        persistent?: boolean;
      };
      if (persistent) {
        fenceWithPersistent.persistent = true;
      }
      this.fences.push(fenceWithPersistent);
    });
  }
}
