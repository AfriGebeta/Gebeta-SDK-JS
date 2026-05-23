import { AUTH_URLS, AuthEvents, TOKEN_EXPIRY_MS, TOKEN_REFRESH_INTERVAL_MS } from '../constants';

export namespace Auth {
  export namespace Types {
    export type AuthCredentials = import('../types/auth').AuthCredentials;
    export type ServiceAccountAuth = import('../types/auth').ServiceAccountAuth;
    export type AuthParam = import('../types/auth').AuthParam;
  }

  export const Enums = {
    Events: AuthEvents,
  } as const;

  export const Constants = {
    AUTH_URL: AUTH_URLS.auth,
    REFRESH_URL: AUTH_URLS.refresh,
    TOKEN_EXPIRY_MS,
    TOKEN_REFRESH_INTERVAL_MS,
  } as const;
}
