import type { API } from '@gebeta/api';
import { DirectionsManager as CoreDirectionsManager } from '@gebeta/core';
import { ValidationError } from '@gebeta/api';

type AuthParam = API.Auth.Types.AuthParam;
import { ROUTE_SOURCE_ID, DEFAULT_ROUTE_STYLE, DEFAULT_FIT_BOUNDS_OPTIONS } from './constants';
import {
  initRouteLayer,
  updateRouteLayerData,
  clearRouteLayerData,
  updateRouteLayerStyle,
} from './routeLayer';
import { getMarkerIcon, getMarkerSize } from './markers';

type RouteData = API.Routing.Types.RouteData;
type LngLat = API.Common.Types.LngLat;
type DirectionsOptions = API.Routing.Types.DirectionsOptions;
type DisplayRouteOptions = API.Routing.Types.DisplayRouteOptions;
type RouteStyleOptions = API.Routing.Types.RouteStyleOptions;
type IMapAdapter = API.Platform.Types.IMapAdapter;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type IMarker = API.Platform.Types.IMarker;

export class DirectionsManager {
  private readonly mapAdapter: IMapAdapter;
  private readonly markerFactory: IMarkerFactory;
  private readonly core: CoreDirectionsManager;
  private currentRoute: RouteData | null = null;
  private markers: IMarker[] = [];

  constructor(
    mapAdapter: IMapAdapter,
    markerFactory: IMarkerFactory,
    auth: AuthParam,
    clientId?: string
  ) {
    if (!mapAdapter) {
      throw new ValidationError('Map adapter is required for DirectionsManager', 'mapAdapter');
    }
    if (!markerFactory) {
      throw new ValidationError(
        'Marker factory is required for DirectionsManager',
        'markerFactory'
      );
    }
    this.mapAdapter = mapAdapter;
    this.markerFactory = markerFactory;
    this.core = new CoreDirectionsManager(auth, clientId);
    initRouteLayer(this.mapAdapter);
  }

  async getDirections(
    origin: LngLat,
    destination: LngLat,
    options: DirectionsOptions = {}
  ): Promise<RouteData> {
    const route = await this.core.getDirections(origin, destination, options);
    this.currentRoute = route;
    return route;
  }

  displayRoute(
    routeData: RouteData,
    options: DisplayRouteOptions & { routeStyle?: RouteStyleOptions } = {}
  ): void {
    if (!routeData) return;

    const {
      showMarkers = true,
      originIcon,
      destinationIcon,
      waypointIcon,
      routeStyle = {},
    } = options;

    if (!this.mapAdapter.getSource(ROUTE_SOURCE_ID)) {
      initRouteLayer(this.mapAdapter);
    }

    this.clearRoute();

    const coords = routeData.geometry?.coordinates ?? [];
    if (coords.length > 0 && this.mapAdapter.getSource(ROUTE_SOURCE_ID)) {
      updateRouteLayerData(this.mapAdapter, coords);
      updateRouteLayerStyle(this.mapAdapter, {
        'line-color': routeStyle['line-color'] ?? DEFAULT_ROUTE_STYLE['line-color'],
        'line-width': routeStyle['line-width'] ?? DEFAULT_ROUTE_STYLE['line-width'],
        'line-opacity': routeStyle['line-opacity'] ?? DEFAULT_ROUTE_STYLE['line-opacity'],
      });
    }

    if (showMarkers) {
      this.addRouteMarkers(routeData, {
        originIcon: getMarkerIcon('origin', originIcon),
        destinationIcon: getMarkerIcon('destination', destinationIcon),
        waypointIcon: getMarkerIcon('waypoint', waypointIcon),
      });
    }

    this.fitMapToRoute(routeData);
  }

  clearRoute(): void {
    if (!this.mapAdapter.getSource(ROUTE_SOURCE_ID)) return;
    clearRouteLayerData(this.mapAdapter);
    this.clearMarkers();
    this.currentRoute = null;
  }

  getCurrentRoute(): RouteData | null {
    return this.currentRoute;
  }

  getRouteSummary(): {
    distance?: string | number | null;
    duration?: string | number | null;
    origin?: LngLat;
    destination?: LngLat;
    waypoints?: LngLat[];
  } | null {
    if (!this.currentRoute) return null;
    const r = this.currentRoute;
    return {
      distance: r.distance,
      duration: r.duration,
      origin: r.origin,
      destination: r.destination,
      waypoints: (r as RouteData & { waypoints?: LngLat[] }).waypoints ?? [],
    };
  }

  updateRouteStyle(style: RouteStyleOptions): void {
    updateRouteLayerStyle(this.mapAdapter, style);
  }

  private addRouteMarkers(
    routeData: RouteData,
    options: { originIcon: string; destinationIcon: string; waypointIcon: string }
  ): void {
    this.clearMarkers();
    const waypoints = (routeData as RouteData & { waypoints?: LngLat[] }).waypoints ?? [];

    if (routeData.origin) {
      const marker = this.markerFactory.createMarker({
        imageUrl: options.originIcon,
        size: getMarkerSize('origin'),
        className: 'gebeta-route-marker',
      });
      if (marker) {
        marker.setLngLat(routeData.origin).addTo(this.mapAdapter);
        this.markers.push(marker);
      }
    }
    if (routeData.destination) {
      const marker = this.markerFactory.createMarker({
        imageUrl: options.destinationIcon,
        size: getMarkerSize('destination'),
        className: 'gebeta-route-marker',
      });
      if (marker) {
        marker.setLngLat(routeData.destination).addTo(this.mapAdapter);
        this.markers.push(marker);
      }
    }
    waypoints.forEach((wp: LngLat) => {
      const marker = this.markerFactory.createMarker({
        imageUrl: options.waypointIcon,
        size: getMarkerSize('waypoint'),
        className: 'gebeta-route-marker',
      });
      if (marker) {
        marker.setLngLat(wp).addTo(this.mapAdapter);
        this.markers.push(marker);
      }
    });
  }

  private fitMapToRoute(routeData: RouteData): void {
    const coords = routeData.geometry?.coordinates;
    if (!coords?.length) return;
    const bounds = this.mapAdapter.getBounds();
    const mapBounds = bounds as unknown as { extend?: (point: [number, number]) => void };
    coords.forEach((coord: string | Array<number>) => {
      const point: [number, number] =
        Array.isArray(coord) && coord.length >= 2 ? [coord[0], coord[1]] : [0, 0];
      if (mapBounds.extend) {
        mapBounds.extend(point);
      }
    });
    this.mapAdapter.fitBounds(bounds, DEFAULT_FIT_BOUNDS_OPTIONS);
  }

  private clearMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }
}
