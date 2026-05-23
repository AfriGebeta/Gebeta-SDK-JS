import type { AuthManager } from '../Auth';

/**
 * Returns a fetch-compatible function bound to the given auth credential.
 *
 * - AuthManager: delegates to authManager.fetch(), which injects Bearer token
 *   and handles 401 → refresh → single retry automatically.
 * - string (legacy apiKey): injects Authorization: Bearer <apiKey> header and
 *   calls globalThis.fetch directly (no retry — legacy tokens don't refresh).
 * - undefined: returns globalThis.fetch unmodified.
 *
 * When clientId is provided, an X-Device-ID header is injected on every request.
 */
export function createFetch(
  auth: object | string | undefined,
  clientId?: string
): typeof globalThis.fetch {
  const deviceHeader: Record<string, string> = clientId ? { 'X-Device-ID': clientId } : {};

  if (!auth) {
    if (!clientId) return globalThis.fetch;
    return (url: RequestInfo | URL, init?: RequestInit) =>
      globalThis.fetch(url, {
        ...init,
        headers: { ...init?.headers, ...deviceHeader },
      });
  }

  if (typeof auth === 'string') {
    return (url: RequestInfo | URL, init?: RequestInit) =>
      globalThis.fetch(url, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${auth}`,
          ...deviceHeader,
        },
      });
  }

  const manager = auth as AuthManager;
  if (!clientId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return manager.fetch.bind(manager) as any as typeof globalThis.fetch;
  }
  return (url: RequestInfo | URL, init?: RequestInit) =>
    manager.fetch(url as string, {
      ...init,
      headers: { ...init?.headers, ...deviceHeader },
    });
}
