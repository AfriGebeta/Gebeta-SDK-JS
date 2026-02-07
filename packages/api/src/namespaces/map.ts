import { MapStyle } from '../types/common';
import { MAP_STYLES, DEFAULT_STYLE_URL, DEFAULT_POSITIONS } from '../constants';

export namespace Map {
  export namespace Types {
    export type ConstructorOptions = import('../types/options').GebetaMapsConstructorOptions;
    export type InitOptions = import('../types/options').GebetaMapsInitOptions;
    export type SatelliteToggleOptions = import('../types/options').SatelliteToggleOptions;
  }

  export const Enums = {
    Style: MapStyle,
  } as const;

  export const Constants = {
    STYLES: MAP_STYLES,
    DEFAULT_STYLE_URL,
    DEFAULT_POSITIONS,
  } as const;
}
