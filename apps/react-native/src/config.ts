/**
 * Auth config for the React Native example app.
 *
 * React Native inlines `process.env.*` at build time via the Metro/babel env transform, so
 * set these in the shell before starting Metro:
 *
 *   export GEBETA_API_KEY=your-key-here          # API-key auth (simplest)
 *
 * Service-account auth (accessToken/refreshToken via the node-auth server) is not wired into
 * the RN example yet — tracked with the SERVICE_ACCOUNT token-refresh follow-up in the RN
 * client (see signStyle.ts).
 */

import type { API } from '@gebeta/api';

export type Auth =
  | { type: 'service_account'; accessToken: string; refreshToken: string }
  | { type: 'api_key'; apiKey: string };

/** Props to spread onto <GebetaMap>. Mirrors the discriminated auth union. */
export type AuthProps =
  | { auth: API.Auth.Types.ServiceAccountAuth; apiKey?: never }
  | { apiKey: string; auth?: never };

export function authProps(auth: Auth): AuthProps {
  return auth.type === 'service_account'
    ? {
        auth: {
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
        },
      }
    : { apiKey: auth.apiKey };
}

const API_KEY = process.env.GEBETA_API_KEY ?? '';

/**
 * Resolve the ambient auth for the example. Only API-key mode is supported today; throws a
 * clear message if unset so the demo pages fail loudly rather than rendering a blank map.
 */
export function getAuth(): Auth {
  if (!API_KEY) {
    throw new Error(
      'No auth configured. Export GEBETA_API_KEY in the shell before starting Metro.',
    );
  }
  return { type: 'api_key', apiKey: API_KEY };
}
