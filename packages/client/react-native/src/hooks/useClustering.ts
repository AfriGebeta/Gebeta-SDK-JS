import { useEffect, useMemo } from 'react';
import type { API } from '@gebeta/api';
import { ClusteringManager } from '../Clustering';
import { MarkerFactory } from '../adapters/MarkerFactory';
import { useGebetaMapContextOrNull } from '../context/MapContext';

type MarkerData = API.Overlay.Types.MarkerData;
type ClusteringOptions = API.Clustering.Types.Options;

export interface UseClusteringResult {
  /** The clustering manager, or null until the map platform is ready. */
  clustering: ClusteringManager | null;
}

/**
 * Hook that provides a {@link ClusteringManager} wired to the enclosing `<GebetaMap>`. Optionally
 * seeds it with an initial marker set (re-seeded whenever `markers` identity changes). Must be
 * called from a component rendered inside `<GebetaMap>`.
 */
export function useClustering(
  options: ClusteringOptions = {},
  markers?: MarkerData[]
): UseClusteringResult {
  const ctx = useGebetaMapContextOrNull();
  const platform = ctx?.platform ?? null;

  const clustering = useMemo(() => {
    if (!platform) return null;
    // The manager needs the concrete RN MarkerFactory (for cluster-count markers); the platform
    // exposes it typed as the IMarkerFactory interface, so narrow it here.
    return new ClusteringManager(
      platform.mapAdapter,
      platform.markerFactory as MarkerFactory,
      platform.popupFactory,
      options
    );
    // Recreate only when the platform changes; `options` is a fresh object each render and
    // updateOptions() is the intended path for live option changes.
  }, [platform]);

  useEffect(() => {
    if (!clustering || !markers) return;
    clustering.clearMarkers();
    clustering.addMarkers(markers);
    clustering.refresh();
    return () => {
      clustering.clearMarkers();
    };
  }, [clustering, markers]);

  return { clustering };
}
