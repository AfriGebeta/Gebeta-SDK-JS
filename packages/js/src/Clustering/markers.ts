import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import { DEFAULT_CLUSTER_STYLE, DEFAULT_CLUSTER_COUNT_BADGE_STYLE } from './constants';

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
  const el = document.createElement('div');
  el.style.backgroundImage = markerData.imageUrl ? `url('${markerData.imageUrl}')` : 'none';
  el.style.backgroundSize = 'contain';
  el.style.backgroundRepeat = 'no-repeat';
  el.style.width = `${markerData.size?.[0] ?? 30}px`;
  el.style.height = `${markerData.size?.[1] ?? 30}px`;
  el.style.cursor = 'pointer';

  el.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  el.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
  el.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  });

  const mapMarker = new maplibre.Marker({ element: el })
    .setLngLat(clusterPoint.geometry.coordinates)
    .addTo(map);

  if (markerData.popupContent) {
    const popup = new maplibre.Popup({ offset: 18, closeOnClick: false });
    if (typeof markerData.popupContent === 'string') {
      popup.setHTML(markerData.popupContent);
    } else if (markerData.popupContent instanceof HTMLElement) {
      if (typeof popup.setDOMContent === 'function') {
        popup.setDOMContent(markerData.popupContent);
      } else {
        popup.setHTML(markerData.popupContent.outerHTML);
      }
    } else {
      popup.setHTML(String(markerData.popupContent));
    }
    mapMarker.setPopup(popup);
  }

  if (markerData.onClick) {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const lngLat = {
        lng: clusterPoint.geometry.coordinates[0],
        lat: clusterPoint.geometry.coordinates[1],
      };
      markerData.onClick?.(lngLat, mapMarker, e);
    });
  }

  return mapMarker;
}
