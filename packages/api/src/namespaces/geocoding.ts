import { API_BASE_URLS } from '../constants';

export namespace Geocoding {
  export namespace Types {
    export type Result = import('../types/data').GeocodeResult;
  }

  export const Constants = {
    API_URL: API_BASE_URLS.geocoding,
  } as const;
}
