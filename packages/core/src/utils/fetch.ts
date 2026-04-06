import type { AuthManager } from '../Auth';

/**
 * Returns a fetch-compatible function bound to the given auth credential.
 *
 * - AuthManager: delegates to authManager.fetch(), which injects Bearer token
 *   and handles 401 → refresh → single retry automatically.
 * - string (legacy apiKey): injects Authorization: Bearer <apiKey> header and
 *   calls globalThis.fetch directly (no retry — legacy tokens don't refresh).
 * - undefined: returns globalThis.fetch unmodified.
 */
export function createFetch(auth: object | string | undefined): typeof globalThis.fetch {
  if (!auth) {
    return globalThis.fetch;
  }

  if (typeof auth === 'string') {
    return (url: RequestInfo | URL, init?: RequestInit) =>
      globalThis.fetch(url, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${auth}`,
        },
      });
  }

  const manager = auth as AuthManager;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return manager.fetch.bind(manager) as any as typeof globalThis.fetch;
}
