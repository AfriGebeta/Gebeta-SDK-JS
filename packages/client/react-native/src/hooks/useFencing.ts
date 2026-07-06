import { useMemo } from 'react';
import { FenceManager, type FenceManagerOptions } from '../Fencing';
import { useGebetaMapContextOrNull } from '../context/MapContext';

export interface UseFencingResult {
  /** The fence manager, or null until the map platform is ready. */
  fencing: FenceManager | null;
}

/**
 * Hook that provides a {@link FenceManager} wired to the enclosing `<GebetaMap>` (map adapter +
 * marker/popup factories). Must be called from a component rendered inside `<GebetaMap>`.
 */
export function useFencing(options: FenceManagerOptions = {}): UseFencingResult {
  const ctx = useGebetaMapContextOrNull();
  const platform = ctx?.platform ?? null;

  const fencing = useMemo(() => {
    if (!platform) return null;
    return new FenceManager(
      platform.mapAdapter,
      platform.markerFactory,
      platform.popupFactory,
      options
    );
    // Recreate only when the platform changes; options are read once at construction.
  }, [platform]);

  return { fencing };
}
