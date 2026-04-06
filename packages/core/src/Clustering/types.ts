import type { API } from '@gebeta/api';

type MarkerData = API.Overlay.Types.MarkerData;
type ClusterData = API.Overlay.Types.ClusterData;

/**
 * GeoJSON Point feature structure used by Supercluster.
 * Represents a single marker point with its properties.
 */
export interface SuperclusterPoint {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    markerId: string;
    imageUrl?: string;
    size?: [number, number];
    onClick?: MarkerData['onClick'];
    popupContent?: MarkerData['popupContent'];
  };
}

/**
 * Normalized clustering options with required fields filled from defaults.
 * Used internally by ClusteringManager after merging user options with defaults.
 */
export interface NormalizedClusteringOptions {
  radius: number;
  maxZoom: number;
  clusterImage: string | null;
  clusterOnClick: ((cluster: ClusterData, event: MouseEvent) => void) | null;
  showClusterCount: boolean;
}
