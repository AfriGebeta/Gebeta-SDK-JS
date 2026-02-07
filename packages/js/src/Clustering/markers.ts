import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import { DEFAULT_CLUSTER_STYLE, DEFAULT_CLUSTER_COUNT_BADGE_STYLE } from './constants';
import { createMarker, createMarkerWithPopup, getMarkerElement } from '../Markers/markers';
import { DEFAULT_MARKER_SIZE } from '../Markers/constants';

type ClusterData = API.Overlay.Types.ClusterData;
type MarkerData = API.Overlay.Types.MarkerData;

export function createClusterMarker(
  map: MapLibreMap,
  cluster: ClusterData,
  options: {
    clusterImage?: string | null;
    showClusterCount: boolean;
    clusterOnClick?: ((cluster: ClusterData, event: MouseEvent) => void) | null;
  }
): MapLibreMarker {
  const el = document.createElement('div');
  el.className = 'cluster-marker';

  if (options.clusterImage) {
    el.style.cssText = `
      background-image: url('${options.clusterImage}');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: ${DEFAULT_CLUSTER_STYLE.width}px;
      height: ${DEFAULT_CLUSTER_STYLE.height}px;
      cursor: pointer;
      position: relative;
    `;

    if (options.showClusterCount && cluster.properties.point_count) {
      const countEl = document.createElement('div');
      countEl.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.backgroundColor};
        color: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.color};
        font-weight: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.fontWeight};
        font-size: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.fontSize}px;
        width: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.width}px;
        height: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.height}px;
        border-radius: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.borderRadius};
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.borderWidth}px solid ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.borderColor};
        box-shadow: ${DEFAULT_CLUSTER_COUNT_BADGE_STYLE.boxShadow};
        line-height: 1;
      `;
      countEl.textContent = String(cluster.properties.point_count);
      el.appendChild(countEl);
    }
  } else {
    el.style.cssText = `
      background-color: ${DEFAULT_CLUSTER_STYLE.backgroundColor};
      border-radius: ${DEFAULT_CLUSTER_STYLE.borderRadius};
      color: ${DEFAULT_CLUSTER_STYLE.color};
      font-weight: ${DEFAULT_CLUSTER_STYLE.fontWeight};
      text-align: center;
      line-height: ${DEFAULT_CLUSTER_STYLE.height}px;
      width: ${DEFAULT_CLUSTER_STYLE.width}px;
      height: ${DEFAULT_CLUSTER_STYLE.height}px;
      cursor: pointer;
      border: ${DEFAULT_CLUSTER_STYLE.borderWidth}px solid ${DEFAULT_CLUSTER_STYLE.borderColor};
      box-shadow: ${DEFAULT_CLUSTER_STYLE.boxShadow};
    `;
    if (options.showClusterCount) {
      el.textContent = String(cluster.properties.point_count ?? 0);
    }
  }

  const marker = new maplibre.Marker({ element: el })
    .setLngLat(cluster.geometry.coordinates)
    .addTo(map);

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    if (options.clusterOnClick) {
      options.clusterOnClick(cluster, e);
    }
  });

  return marker;
}

export function createIndividualMarker(
  map: MapLibreMap,
  markerData: MarkerData,
  clusterPoint: ClusterData
): MapLibreMarker {
  const lngLat: API.Common.Types.LngLatLike = {
    lng: clusterPoint.geometry.coordinates[0],
    lat: clusterPoint.geometry.coordinates[1],
  };

  const onClickHandler = markerData.onClick
    ? (point: API.Common.Types.LngLatLike, marker: MapLibreMarker, event: MouseEvent) => {
        event.stopPropagation();
        const lngLat: API.Common.Types.LngLat = Array.isArray(point)
          ? { lng: point[0], lat: point[1] }
          : point;
        markerData.onClick?.(lngLat, marker, event);
      }
    : undefined;

  let marker: MapLibreMarker | null;
  if (markerData.popupContent) {
    marker = createMarkerWithPopup(map, lngLat, {
      imageUrl: markerData.imageUrl,
      size: markerData.size ?? DEFAULT_MARKER_SIZE,
      cursor: 'pointer',
      onClick: onClickHandler,
    }, {
      content: markerData.popupContent,
      offset: 18,
      closeable: false,
    });
  } else {
    marker = createMarker(map, lngLat, {
      imageUrl: markerData.imageUrl,
      size: markerData.size ?? DEFAULT_MARKER_SIZE,
      cursor: 'pointer',
      onClick: onClickHandler,
    });
  }

  if (!marker) {
    throw new Error('Failed to create marker');
  }

  const el = getMarkerElement(marker);
  if (el) {
    el.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    el.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    });
  }

  return marker;
}
