import { API, ValidationError } from '@gebeta/api';
import { AuthManager } from './AuthManager';

const { AuthTypes } = API.Auth.Enums;

export type ResolvedAuth =
  | { type: 'SERVICE_ACCOUNT'; manager: AuthManager }
  | { type: 'API_KEY'; key: string };

/**
 * Resolves the raw constructor options (apiKey / auth) into a typed ResolvedAuth.
 * Call this exactly once per SDK instance — downstream code checks auth.type, never typeof.
 */
export function resolveAuth(options: {
  apiKey?: string;
  auth?: API.Auth.Types.ServiceAccountAuth;
}): ResolvedAuth {
  const hasApiKey = !!options.apiKey;
  const hasAuth = !!options.auth;

  if (!hasApiKey && !hasAuth) {
    throw new ValidationError('Either apiKey or auth is required', 'auth');
  }
  if (hasApiKey && hasAuth) {
    throw new ValidationError('Provide either apiKey or auth, not both', 'auth');
  }

  if (hasApiKey) {
    console.warn(
      '[Gebeta] apiKey auth is deprecated and will be removed in a future release. ' +
        'Use service account auth instead: https://docs.gebeta.app/auth'
    );
    // Trim surrounding whitespace/newlines — API keys are long JWTs that consumers often
    // paste (or inject via env vars) with a stray trailing newline, which would otherwise
    // corrupt the `?apiKey=` query param on every signed tile/API URL.
    return { type: AuthTypes.API_KEY, key: options.apiKey!.trim() };
  }

  return { type: AuthTypes.SERVICE_ACCOUNT, manager: new AuthManager(options.auth!) };
}

/**
 * Auth accepted by standalone manager constructors:
 * - `ResolvedAuth` (what GebetaMaps passes internally)
 * - `AuthManager` instance (service account)
 * - `string` (legacy API key, deprecated)
 */
export type AuthInput = ResolvedAuth | AuthManager | string;

/**
 * Normalizes any AuthInput into a ResolvedAuth so standalone managers
 * (e.g. `new GeocodingManager(new AuthManager({...}))`) work the same as the internal path.
 */
export function normalizeAuth(auth: AuthInput): ResolvedAuth {
  if (typeof auth === 'string') {
    const key = auth.trim();
    if (!key) {
      throw new ValidationError('API key must not be empty', 'auth');
    }
    return { type: AuthTypes.API_KEY, key };
  }
  // Duck-typed fallback covers AuthManager instances from a duplicate copy of @gebeta/core.
  const candidate = auth as unknown as Partial<AuthManager> | null;
  if (
    auth instanceof AuthManager ||
    (typeof candidate?.fetch === 'function' && typeof candidate?.getAccessToken === 'function')
  ) {
    return { type: AuthTypes.SERVICE_ACCOUNT, manager: auth as unknown as AuthManager };
  }
  if (auth && (auth.type === AuthTypes.API_KEY || auth.type === AuthTypes.SERVICE_ACCOUNT)) {
    return auth;
  }
  throw new ValidationError(
    'Invalid auth: pass an AuthManager instance or an API key string',
    'auth'
  );
}
