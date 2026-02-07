import { Precision } from '../types/common';
import { TRACKING_INTERVAL_MS, API_BASE_URLS } from '../constants';

export namespace Tracking {
  export namespace Types {
    export type ClientOptions = import('../types/options').TrackingClientOptions;
    export type HttpClientOptions = import('../types/options').HttpTrackingClientOptions;
    export type LocationProvider = import('../types/options').ILocationProvider;
    export type LocationData = import('../types/options').LocationData;
    export type Role = import('../types/common').Role;
  }

  export const Enums = {
    Precision,
  } as const;

  export const Constants = {
    INTERVAL_MS: TRACKING_INTERVAL_MS,
    API_URLS: {
      WEBSOCKET: API_BASE_URLS.tracking,
      HTTP: API_BASE_URLS.trackingHttp,
    },
  } as const;
}
