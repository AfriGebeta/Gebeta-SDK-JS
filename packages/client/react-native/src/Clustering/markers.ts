import type { API } from '@gebeta/api';
import type { MarkerFactory, RNMarkerFactoryOptions } from '../adapters/MarkerFactory';

type ClusterData = API.Overlay.Types.ClusterData;
type MarkerData = API.Overlay.Types.MarkerData;
type IMapAdapter = API.Platform.Types.IMapAdapter;
type IPopupFactory = API.Platform.Types.IPopupFactory;
type IMarker = API.Platform.Types.IMarker;

const DEFAULT_MARKER_SIZE: [number, number] = [30, 30];

/**
 * Create a cluster marker via the RN MarkerFactory. Unlike the web (styled HTML div), RN renders
 * the cluster as a count circle (or a custom `clusterImage` with a count badge) — see
 * MarkerRenderer's cluster branch. Tapping runs `clusterOnClick`.
 */
export function createClusterMarker(
  mapAdapter: IMapAdapter,
  markerFactory: MarkerFactory,
  cluster: ClusterData,
  options: {
    clusterImage?: string | null;
    showClusterCount: boolean;
    clusterOnClick?: ((cluster: ClusterData) => void) | null;
  }
): IMarker {
  const count = cluster.properties.point_count ?? 0;
  const factoryOptions: RNMarkerFactoryOptions = {
    anchor: 'center',
    imageUrl: options.clusterImage ?? undefined,
    clusterCount: options.showClusterCount ? count : 0,
    onClick: options.clusterOnClick ? () => options.clusterOnClick?.(cluster) : undefined,
  };

  const marker = markerFactory.createMarker(factoryOptions);
  if (!marker) throw new Error('Failed to create cluster marker');
  marker.setLngLat(cluster.geometry.coordinates).addTo(mapAdapter);
  return marker;
}

/**
 * Create an individual (non-clustered) marker positioned at the cluster point's coordinate
 * (which equals the marker's own position when not clustered). If the marker has `popupContent`,
 * a text popup is created at the same coordinate (RN popups are independent store records, not
 * attached to a marker as on the web) and returned so the caller can remove it alongside.
 */
export function createIndividualMarker(
  mapAdapter: IMapAdapter,
  markerFactory: MarkerFactory,
  popupFactory: IPopupFactory,
  markerData: MarkerData,
  clusterPoint: ClusterData
): IMarker[] {
  const [lng, lat] = clusterPoint.geometry.coordinates;
  const created: IMarker[] = [];

  const marker = markerFactory.createMarker({
    anchor: 'bottom',
    imageUrl: markerData.imageUrl,
    size: markerData.size ?? DEFAULT_MARKER_SIZE,
    onClick: markerData.onClick
      ? (point, m) => {
          const ll = Array.isArray(point) ? { lng: point[0], lat: point[1] } : point;
          // The web MarkerData.onClick expects a MapLibre marker; RN passes the IMarker adapter.
          markerData.onClick?.(ll, m as never, {} as never);
        }
      : undefined,
  });
  if (!marker) throw new Error('Failed to create individual marker');
  marker.setLngLat({ lng, lat }).addTo(mapAdapter);
  created.push(marker);

  if (markerData.popupContent) {
    const popup = popupFactory.createPopup({
      content: markerData.popupContent,
      offset: 18,
      closeable: false,
    });
    if (popup) {
      popup.setLngLat({ lng, lat }).addTo(mapAdapter);
      created.push(popup as unknown as IMarker);
    }
  }

  return created;
}
