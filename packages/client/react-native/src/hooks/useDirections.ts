import { useMemo } from 'react';
import type { API } from '@gebeta/api';
import { resolveAuth } from '@gebeta/core';
import { DirectionsManager } from '../Directions';
import { useGebetaMapContextOrNull } from '../context/MapContext';

export interface UseDirectionsResult {
  /** The directions manager, or null until the map platform is ready. */
  directions: DirectionsManager | null;
}

/**
 * Hook that provides a ready-to-use {@link DirectionsManager} wired to the enclosing
 * `<GebetaMap>`'s platform (map adapter + marker factory). Must be called from a component
 * rendered inside `<GebetaMap>`.
 *
 * Pass the same auth you gave `<GebetaMap>`. Returns `{ directions: null }` until the map is
 * mounted.
 */
export function useDirections(auth: {
  apiKey?: string;
  auth?: API.Auth.Types.ServiceAccountAuth;
}): UseDirectionsResult {
  const ctx = useGebetaMapContextOrNull();
  const platform = ctx?.platform ?? null;

  const directions = useMemo(() => {
    if (!platform) return null;
    return new DirectionsManager(
      platform.mapAdapter,
      platform.markerFactory,
      resolveAuth({ apiKey: auth.apiKey, auth: auth.auth })
    );
  }, [platform, auth.apiKey, auth.auth]);

  return { directions };
}
