import type { Marker as MapLibreMarker } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import { DEFAULT_CLUSTER_STYLE, DEFAULT_CLUSTER_COUNT_BADGE_STYLE } from './constants';
import { DEFAULT_MARKER_SIZE } from '../Markers/constants';

type ClusterData = API.Overlay.Types.ClusterData;
type MarkerData = API.Overlay.Types.MarkerData;
type IMapAdapter = API.Platform.Types.IMapAdapter;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type IPopupFactory = API.Platform.Types.IPopupFactory;
type IMarker = API.Platform.Types.IMarker;

export function createClusterMarker(
  mapAdapter: IMapAdapter,
  markerFactory: IMarkerFactory,
  cluster: ClusterData,
  options: {
    clusterImage?: string | null;
    showClusterCount: boolean;
    clusterOnClick?: ((cluster: ClusterData, event: MouseEvent) => void) | null;
  }
): IMarker {
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

  const marker = markerFactory.createMarker({
    element: el,
    onClick: options.clusterOnClick
      ? (_point, _marker, event) => {
          event.stopPropagation();
          options.clusterOnClick!(cluster, event);
        }
      : undefined,
  });

  if (!marker) {
    throw new Error('Failed to create cluster marker');
  }

  marker.setLngLat(cluster.geometry.coordinates).addTo(mapAdapter);

  return marker;
}

export function createIndividualMarker(
  mapAdapter: IMapAdapter,
  markerFactory: IMarkerFactory,
  popupFactory: IPopupFactory,
  markerData: MarkerData,
  clusterPoint: ClusterData
): IMarker {
  const lngLat: API.Common.Types.LngLatLike = {
    lng: clusterPoint.geometry.coordinates[0],
    lat: clusterPoint.geometry.coordinates[1],
  };

  const onClickHandler = markerData.onClick
    ? (point: API.Common.Types.LngLatLike, marker: IMarker, event: MouseEvent) => {
        event.stopPropagation();
        const lngLat: API.Common.Types.LngLat = Array.isArray(point)
          ? { lng: point[0], lat: point[1] }
          : point;
        markerData.onClick?.(lngLat, marker as unknown as MapLibreMarker, event);
      }
    : undefined;

  let marker: IMarker | null;
  if (markerData.popupContent) {
    const popup = popupFactory.createPopup({
      content: markerData.popupContent,
      offset: 18,
      closeable: false,
    });
    marker = markerFactory.createMarker({
      imageUrl: markerData.imageUrl,
      size: markerData.size ?? DEFAULT_MARKER_SIZE,
      cursor: 'pointer',
      onClick: onClickHandler,
    });
    if (marker && popup && marker.setPopup) {
      marker.setPopup(popup);
    }
  } else {
    marker = markerFactory.createMarker({
      imageUrl: markerData.imageUrl,
      size: markerData.size ?? DEFAULT_MARKER_SIZE,
      cursor: 'pointer',
      onClick: onClickHandler,
    });
  }

  if (!marker) {
    throw new Error('Failed to create marker');
  }

  marker.setLngLat(lngLat).addTo(mapAdapter);

  const el = marker.getElement?.() as HTMLElement | null;
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
