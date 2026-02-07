import { DEFAULT_FENCE_STYLE } from '../constants';
import { Colors } from '../constants/colors';

export namespace Fencing {
  export namespace Types {
    export type Definition = import('../types/data').FenceDefinition;
    export type StyleOptions = import('../types/options').FenceStyleOptions;
    export type PointOptions = import('../types/options').FencePointOptions;
    export type RenderOptions = import('../types/options').RenderFencesOptions;
  }

  export namespace Events {
    export type CompletedEvent = import('../types/events').FenceCompletedEvent;
  }

  export const Enums = {
    Colors,
  } as const;

  export const Constants = {
    DEFAULT_STYLE: DEFAULT_FENCE_STYLE,
  } as const;
}
