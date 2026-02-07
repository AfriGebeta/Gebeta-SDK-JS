import type { API } from '@gebeta/maps-api';

export type FenceDefinition = API.Fencing.Types.Definition;
export type FenceStyleOptions = API.Fencing.Types.StyleOptions;
export type FencePointOptions = API.Fencing.Types.PointOptions;

/**
 * Normalized fence style with all required fields filled from defaults.
 */
export interface NormalizedFenceStyle {
  fillColor: string;
  fillOpacity: number;
  lineColor: string;
  lineWidth: number;
  lineOpacity: number;
  lineDashArray: number[];
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'bevel' | 'round' | 'miter';
  borderColor: string;
  borderWidth: number;
  borderOpacity: number;
}

/**
 * Internal fence state during drawing.
 */
export interface FenceDrawingState {
  points: API.Common.Types.LngLatLike[];
  name?: string;
  overlayContent?: any;
  overlayOptions?: API.Overlay.Types.Options;
  persistent: boolean;
  style: NormalizedFenceStyle;
}
