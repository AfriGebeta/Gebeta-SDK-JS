import { API } from '@gebeta/api';
import type { ResolvedAuth } from '../Auth/resolveAuth';

const { AuthTypes } = API.Auth.Enums;

/**
 * Returns a fetch-compatible function bound to the given ResolvedAuth.
 *
 * - SERVICE_ACCOUNT: delegates to authManager.fetch(), which injects Bearer token
 *   and handles 401 → refresh → single retry automatically.
 * - API_KEY: appends ?apiKey=<key> as a query param.
 *
 * When clientId is provided, an X-Device-ID header is injected on every request.
 */
export function createFetch(
  auth: ResolvedAuth | undefined,
  clientId?: string
): typeof globalThis.fetch {
  const deviceHeader: Record<string, string> = clientId ? { 'X-Device-ID': clientId } : {};

  if (!auth) {
    if (!clientId) return globalThis.fetch;
    return (url: RequestInfo | URL, init?: RequestInit) =>
      globalThis.fetch(url, { ...init, headers: { ...init?.headers, ...deviceHeader } });
  }

  if (auth.type === AuthTypes.API_KEY) {
    return (url: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = url.toString();
      const separator = urlStr.includes('?') ? '&' : '?';
      return globalThis.fetch(`${urlStr}${separator}apiKey=${auth.key}`, {
        ...init,
        headers: { ...init?.headers, ...deviceHeader },
      });
    };
  }

  // SERVICE_ACCOUNT — delegate to AuthManager.fetch() which handles Bearer + 401 retry
  const boundFetch = auth.manager.fetch.bind(auth.manager);
  if (!clientId) {
    return boundFetch as typeof globalThis.fetch;
  }
  return (url: RequestInfo | URL, init?: RequestInit) =>
    boundFetch(url as string, {
      ...init,
      headers: { ...init?.headers, ...deviceHeader },
    });
}
