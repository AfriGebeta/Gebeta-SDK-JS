/**
 * Access and refresh token pair returned by the Gebeta auth API
 * and held by the client SDK.
 */
export interface AuthCredentials {
  accessToken: string;
  refreshToken: string;
}

/**
 * Service account credentials provided at SDK construction time.
 * Obtained from your backend after calling GebetaAuth.authenticate().
 */
export interface ServiceAccountAuth {
  accessToken: string;
  refreshToken: string;
}

/**
 * Auth parameter accepted by manager constructors.
 * - Pass an `AuthManager` instance for service account auth (new).
 * - Pass a `string` (apiKey) for legacy API key auth (deprecated).
 *
 * `AuthManager` is defined in @gebeta/core. To avoid a circular
 * dependency, the non-string branch is typed as `object` here.
 * Managers narrow at runtime using `typeof auth === 'string'`.
 */
export type AuthParam = object | string;

/**
 * Auth options for SDK constructors and component props.
 *
 * Discriminated union that enforces "exactly one of apiKey or auth" at
 * compile time. The type-level XOR prevents accidentally passing both
 * (would throw at runtime) or neither (would also throw at runtime).
 *
 * Used by `GebetaMapsConstructorOptions` and `GebetaMapProps` (composed
 * via intersection) so React / React Native / Vue / plain-JS clients
 * all share the same compile-time guarantee.
 */
export type AuthOptions =
  | { apiKey: string; auth?: never }
  | { apiKey?: never; auth: ServiceAccountAuth };
