import { DEFAULT_NAVIGATION_OPTIONS } from '../constants';

export namespace Navigation {
  export namespace Types {
    export type StartOptions = import('../types/options').NavigationStartOptions;
    export type ManagerOptions = import('../types/options').NavigationManagerOptions;
  }

  export namespace Events {
    export type ProgressEvent = import('../types/events').NavigationProgressEvent;
    export type StepChangeEvent = import('../types/events').NavigationStepChangeEvent;
    export type StartEvent = import('../types/events').NavigationStartEvent;
    export type StopEvent = import('../types/events').NavigationStopEvent;
    export type OffRouteEvent = import('../types/events').NavigationOffRouteEvent;
    export type ArriveEvent = import('../types/events').NavigationArriveEvent;
  }

  export const Constants = {
    DEFAULT_OPTIONS: DEFAULT_NAVIGATION_OPTIONS,
  } as const;
}
