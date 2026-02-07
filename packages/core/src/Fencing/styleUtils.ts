import { API } from '@gebeta/maps-api';
import type { NormalizedFenceStyle } from './types';

type FenceStyleOptions = API.Fencing.Types.StyleOptions;

/**
 * Normalize fence style options by merging with defaults.
 * @param options - User-provided style options
 * @returns Normalized style with all required fields filled
 */
export function normalizeFenceStyle(options: FenceStyleOptions = {}): NormalizedFenceStyle {
  const defaults = API.Fencing.Constants.DEFAULT_STYLE;

  return {
    fillColor: options.fillColor ?? defaults.fillColor,
    fillOpacity: options.fillOpacity ?? defaults.fillOpacity,
    lineColor: options.lineColor ?? defaults.lineColor,
    lineWidth: options.lineWidth ?? defaults.lineWidth,
    lineOpacity: options.lineOpacity ?? defaults.lineOpacity,
    lineDashArray: options.lineDashArray ?? [...defaults.lineDashArray],
    lineCap: options.lineCap ?? defaults.lineCap,
    lineJoin: options.lineJoin ?? defaults.lineJoin,
    borderColor: options.borderColor ?? defaults.borderColor,
    borderWidth: options.borderWidth ?? defaults.borderWidth,
    borderOpacity: options.borderOpacity ?? defaults.borderOpacity,
  };
}
