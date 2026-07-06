import { useEffect, useState } from 'react';
import type { API } from '@gebeta/api';
import { useGebetaMapContextOrNull } from '../context/MapContext';

type LocationData = API.Platform.Types.LocationData;

export interface UseUserLocationResult {
  /** Latest device location, or null until the first fix (or if permission is denied). */
  location: LocationData | null;
}

/**
 * Hook that subscribes to the device location via the enclosing `<GebetaMap>`'s
 * `ILocationProvider` (MapLibre's native LocationManager). Requests location permission on
 * mount, streams updates while mounted, and stops on unmount.
 *
 * Must be called from a component rendered inside `<GebetaMap>`. Ensure the app declares the
 * ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION permissions.
 *
 * @param enabled pass false to pause tracking without unmounting (default true).
 */
export function useUserLocation(enabled = true): UseUserLocationResult {
  const ctx = useGebetaMapContextOrNull();
  const provider = ctx?.platform?.locationProvider ?? null;
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    if (!provider || !enabled) return;
    provider.start(setLocation);
    return () => {
      provider.stop();
    };
  }, [provider, enabled]);

  return { location };
}
