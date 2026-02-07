import { Position, CornerPosition } from '../types/common';

export namespace Common {
  export namespace Types {
    export type LngLat = import('../types/common').LngLat;
    export type LngLatLike = import('../types/common').LngLatLike;
  }

  export const Enums = {
    Position,
    CornerPosition,
  } as const;
}
