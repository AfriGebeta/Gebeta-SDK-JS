import type { RouteInstruction, RouteData } from './data';
import type { LngLat } from './common';
import type { LocationData } from './options';

/**
 * Event payload emitted when a fence is completed (closed polygon).
 */
export interface FenceCompletedEvent {
  /** Unique identifier of the completed fence */
  fenceId: string;
  /** Array of points that form the fence */
  points: LngLat[];
  /** Name/label of the fence (if provided) */
  name?: string;
}

/**
 * Event payload emitted during navigation with progress updates.
 */
export interface NavigationProgressEvent {
  /** Remaining distance to destination in meters */
  remainingDistance: number;
  /** Remaining duration (number in seconds or formatted string like "15 min") */
  remainingDuration: number | string;
  /** Current navigation step/instruction */
  currentStep?: RouteInstruction;
  /** Index of current step in route instructions */
  stepIndex?: number;
  /** Progress percentage (0-100) */
  progress?: number;
}

/**
 * Event payload emitted when navigation step changes.
 */
export interface NavigationStepChangeEvent {
  /** New current step/instruction */
  step: RouteInstruction;
  /** Index of the new step */
  stepIndex: number;
  /** Previous step (if available) */
  previousStep?: RouteInstruction;
}

/**
 * Event payload emitted when navigation starts.
 */
export interface NavigationStartEvent {
  /** Route being navigated */
  route: RouteData;
}

/**
 * Event payload emitted when navigation stops.
 */
export interface NavigationStopEvent {
  /** Route that was being navigated (if available) */
  route?: RouteData;
}

/**
 * Event payload emitted when the user goes off-route during navigation.
 * Triggered when the distance from the current location to the nearest point
 * on the route exceeds the off-route threshold.
 */
export interface NavigationOffRouteEvent {
  /** Current location of the user */
  location: LocationData;
  /** Snapped point on the route (nearest point to current location) */
  snapped: {
    /** Distance in meters from current location to nearest point on route */
    distance: number;
    /** Nearest point on the route */
    point: LngLat;
    /** Index in the route coordinates array */
    index: number;
    /** Parameter along the segment (0-1) */
    t: number;
    /** Distance traveled along the route in meters */
    along: number;
  };
}

/**
 * Event payload emitted when the user arrives at the destination.
 * Triggered when the remaining distance to destination is less than
 * the arrival threshold.
 */
export interface NavigationArriveEvent {
  /** Current location when arrival was detected */
  location: LocationData;
}

/**
 * Generic map event payload.
 * Used for standard map events (load, click, move, etc.).
 */
export interface MapEventPayload {
  /** Event-specific properties */
  [key: string]: any;
}

/**
 * Map of all event names to their payload types.
 * Used for type-safe event handling.
 */
export type EventMap = {
  /** Fence completed event */
  fenceCompleted: FenceCompletedEvent;
  /** Navigation progress event */
  progress: NavigationProgressEvent;
  /** Navigation step change event */
  stepchange: NavigationStepChangeEvent;
  /** Navigation start event */
  start: NavigationStartEvent;
  /** Navigation stop event */
  stop: NavigationStopEvent;
  /** Navigation off-route event */
  offroute: NavigationOffRouteEvent;
  /** Navigation arrive event */
  arrive: NavigationArriveEvent;
  /** Additional custom events */
  [key: string]: any;
};
