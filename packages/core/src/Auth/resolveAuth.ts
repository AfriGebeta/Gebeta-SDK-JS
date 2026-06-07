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
    return { type: AuthTypes.API_KEY, key: options.apiKey! };
  }

  return { type: AuthTypes.SERVICE_ACCOUNT, manager: new AuthManager(options.auth!) };
}
