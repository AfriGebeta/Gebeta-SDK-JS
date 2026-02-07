import { API_BASE_URLS, DEFAULT_AVG_SPEED_KMH, ASSETS_BASE_URL } from '../constants';

export namespace Routing {
  export namespace Types {
    export type RouteData = import('../types/data').RouteData;
    export type RouteInstruction = import('../types/data').RouteInstruction;
    export type RouteSummary = import('../types/data').RouteSummary;
    export type DirectionsOptions = import('../types/options').DirectionsOptions;
    export type DisplayRouteOptions = import('../types/options').DisplayRouteOptions;
    export type RouteStyleOptions = import('../types/options').RouteStyleOptions;
  }

  export const Constants = {
    API_URL: API_BASE_URLS.directions,
    DEFAULT_AVG_SPEED_KMH,
    MANEUVER_ICONS_BASE_URL: `${ASSETS_BASE_URL}/icons/maneuvers`,
  } as const;
}
