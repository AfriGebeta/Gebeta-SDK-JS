import { useMemo } from 'react';
import type { API } from '@gebeta/maps-api';
import { useGebetaMapContext } from '../context/MapContext';
import type { ClusteringManager } from '../Clustering/ClusteringManager';

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

export function useClustering(): UseClusteringResult {
  const { clusteringManager } = useGebetaMapContext();
  if (!clusteringManager) {
    throw new Error(
      'useClustering requires clustering to be enabled on GebetaMap (clustering={{ enabled: true }})'
    );
  }
  return useMemo<UseClusteringResult>(
    () => ({
      addMarker: (marker: MarkerData) => clusteringManager.addMarker(marker),
      removeMarker: (markerId: string) => clusteringManager.removeMarker(markerId),
      clearMarkers: () => clusteringManager.clearMarkers(),
      getMarkers: () => clusteringManager.getMarkers(),
      getMarker: (markerId: string) => clusteringManager.getMarker(markerId),
      updateOptions: opts => clusteringManager.updateOptions(opts),
      getOptions: () => clusteringManager.getOptions(),
    }),
    [clusteringManager]
  );
}
