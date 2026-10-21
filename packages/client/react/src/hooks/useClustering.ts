import { useMemo } from 'react';
import type { API } from '@gebeta/api';
import type { ClusteringManager } from '@gebeta/js';
import { useGebetaMap } from '../context/MapContext';

export type MarkerData = API.Overlay.Types.MarkerData;

export interface UseClusteringResult {
  addMarker: (marker: MarkerData) => void;
  removeMarker: (markerId: string) => boolean;
  clearMarkers: () => void;
  getMarkers: () => MarkerData[];
  getMarker: (markerId: string) => MarkerData | undefined;
  updateOptions: (options: Partial<API.Clustering.Types.Options>) => void;
  getOptions: () => ReturnType<ClusteringManager['getOptions']>;
}

/**
 * React hook for managing clustered markers on a Gebeta map.
 *
 * Must be used inside a GebetaMap component with clustering enabled.
 *
 * @throws If clustering is not enabled on the parent GebetaMap component.
 */
export function useClustering(): UseClusteringResult {
  const gm = useGebetaMap();
  const clusteringManager = gm.clustering;
  if (!clusteringManager) {
    throw new Error(
      'useClustering requires clustering to be enabled on GebetaMap (clustering={{ enabled: true }})'
    );
  }
  return useMemo<UseClusteringResult>(
    () => ({
      addMarker: marker => clusteringManager.addMarker(marker),
      removeMarker: markerId => clusteringManager.removeMarker(markerId),
      clearMarkers: () => clusteringManager.clearMarkers(),
      getMarkers: () => clusteringManager.getMarkers(),
      getMarker: markerId => clusteringManager.getMarker(markerId),
      updateOptions: opts => clusteringManager.updateOptions(opts),
      getOptions: () => clusteringManager.getOptions(),
    }),
    [clusteringManager]
  );
}
