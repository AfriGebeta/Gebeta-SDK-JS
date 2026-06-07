import { API } from '@gebeta/api';
import type { ResolvedAuth } from '../Auth/resolveAuth';

const { AuthTypes } = API.Auth.Enums;

export type TileTransformResult = { url: string; headers?: Record<string, string> };
export type TileTransformFn = (url: string) => TileTransformResult;

/**
 * Returns a function that transforms a tile URL for authentication.
 *
 * - SERVICE_ACCOUNT: injects Authorization: Bearer <accessToken> header.
 * - API_KEY: appends ?apiKey=<key> as a query param (no header).
 *
 * When clientId is provided, an X-Device-ID header is injected on every request.
 */
export function createTileTransform(auth: ResolvedAuth, clientId?: string): TileTransformFn {
  const deviceHeader: Record<string, string> = clientId ? { 'X-Device-ID': clientId } : {};

  if (auth.type === AuthTypes.API_KEY) {
    return (url: string): TileTransformResult => {
      const separator = url.includes('?') ? '&' : '?';
      return Object.keys(deviceHeader).length
        ? { url: `${url}${separator}apiKey=${auth.key}`, headers: { ...deviceHeader } }
        : { url: `${url}${separator}apiKey=${auth.key}` };
    };
  }

  // SERVICE_ACCOUNT — token read synchronously from manager on each tile request
  return (url: string): TileTransformResult => ({
    url,
    headers: {
      Authorization: `Bearer ${auth.manager.getAccessToken()}`,
      ...deviceHeader,
    },
  });
}
