import type { API } from '@gebeta/maps-api';
import type { SuperclusterPoint } from './types';

type MarkerData = API.Overlay.Types.MarkerData;
type ClusterData = API.Overlay.Types.ClusterData;

/**
 * Convert MarkerData to SuperclusterPoint format.
 * @param marker - Marker data to convert
 * @returns SuperclusterPoint feature
 */
export function markerToSuperclusterPoint(marker: MarkerData): SuperclusterPoint {
  const lngLat = Array.isArray(marker.lngLat)
    ? { lng: marker.lngLat[0], lat: marker.lngLat[1] }
    : marker.lngLat;

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lngLat.lng, lngLat.lat],
    },
    properties: {
      markerId: marker.id,
      imageUrl: marker.imageUrl,
      size: marker.size,
      onClick: marker.onClick,
      popupContent: marker.popupContent,
    },
  };
}

/**
 * Convert Supercluster cluster result to ClusterData format.
 * @param cluster - Supercluster cluster result (PointFeature or ClusterFeature)
 * @returns ClusterData structure
 */
export function superclusterToClusterData(cluster: {
  id?: string | number;
  geometry: { coordinates: number[] };
  properties: {
    cluster?: boolean;
    point_count?: number;
    markerId?: string;
    imageUrl?: string;
    size?: [number, number];
    onClick?: MarkerData['onClick'];
    popupContent?: MarkerData['popupContent'];
  };
}): ClusterData {
  const clusterId = typeof cluster.id === 'number' ? cluster.id : Number(cluster.id) || 0;
  const coordinates = cluster.geometry.coordinates.slice(0, 2) as [number, number];

  return {
    id: clusterId,
    geometry: {
      type: 'Point',
      coordinates,
    },
    properties: {
      cluster: cluster.properties.cluster ?? false,
      point_count: cluster.properties.point_count,
      markerId: cluster.properties.markerId,
      imageUrl: cluster.properties.imageUrl,
      size: cluster.properties.size,
      onClick: cluster.properties.onClick,
      popupContent: cluster.properties.popupContent,
    },
  };
}
