import type { API } from '@gebeta/api';
import { DirectionsManager as CoreDirectionsManager } from '@gebeta/core';
import type { ResolvedAuth } from '@gebeta/core';
import {
  ROUTE_SOURCE_ID,
  DEFAULT_ROUTE_STYLE,
  DEFAULT_MARKER_ICONS,
  DEFAULT_MARKER_SIZES,
  DEFAULT_FIT_BOUNDS_OPTIONS,
} from './constants';
import {
  initRouteLayer,
  updateRouteLayerData,
  clearRouteLayerData,
  updateRouteLayerStyle,
} from './routeLayer';

type RouteData = API.Routing.Types.RouteData;
type LngLat = API.Common.Types.LngLat;
type DirectionsOptions = API.Routing.Types.DirectionsOptions;
type DisplayRouteOptions = API.Routing.Types.DisplayRouteOptions;
type RouteStyleOptions = API.Routing.Types.RouteStyleOptions;
type IMapAdapter = API.Platform.Types.IMapAdapter;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type IMarker = API.Platform.Types.IMarker;

/**
 * React Native directions manager. Wraps the platform-agnostic core `DirectionsManager` (which
 * does the API call + polyline decode) and adds map rendering: draws the route line via the
 * declarative MapSpecStore (through `IMapAdapter`) and drops origin/destination/waypoint markers
 * via `IMarkerFactory`. Mirrors the web `@gebeta/js` DirectionsManager, but its calls are all
 * against the abstract platform interfaces so it needs no maplibre-gl.
 */
export class DirectionsManager {
  private readonly core: CoreDirectionsManager;
  private currentRoute: RouteData | null = null;
  private markers: IMarker[] = [];

  constructor(
    private readonly mapAdapter: IMapAdapter,
    private readonly markerFactory: IMarkerFactory,
    auth: ResolvedAuth,
    clientId?: string
  ) {
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
    const { showMarkers = true, originIcon, destinationIcon, routeStyle = {} } = options;

    if (!this.mapAdapter.getSource(ROUTE_SOURCE_ID)) initRouteLayer(this.mapAdapter);
    this.clearRoute();

    const coords = routeData.geometry?.coordinates ?? [];
    if (coords.length > 0) {
      updateRouteLayerData(this.mapAdapter, coords);
      updateRouteLayerStyle(this.mapAdapter, {
        'line-color': routeStyle['line-color'] ?? DEFAULT_ROUTE_STYLE['line-color'],
        'line-width': routeStyle['line-width'] ?? DEFAULT_ROUTE_STYLE['line-width'],
        'line-opacity': routeStyle['line-opacity'] ?? DEFAULT_ROUTE_STYLE['line-opacity'],
      });
    }

    if (showMarkers) {
      this.addRouteMarkers(routeData, {
        originIcon: originIcon ?? DEFAULT_MARKER_ICONS.origin,
        destinationIcon: destinationIcon ?? DEFAULT_MARKER_ICONS.destination,
      });
    }

    this.fitMapToRoute(routeData);
  }

  clearRoute(): void {
    if (this.mapAdapter.getSource(ROUTE_SOURCE_ID)) clearRouteLayerData(this.mapAdapter);
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
  } | null {
    if (!this.currentRoute) return null;
    const r = this.currentRoute;
    return {
      distance: r.distance,
      duration: r.duration,
      origin: r.origin,
      destination: r.destination,
    };
  }

  updateRouteStyle(style: RouteStyleOptions): void {
    updateRouteLayerStyle(this.mapAdapter, style);
  }

  private addRouteMarkers(
    routeData: RouteData,
    icons: { originIcon: string; destinationIcon: string }
  ): void {
    this.clearMarkers();
    const drop = (point: LngLat, iconUrl: string, size: [number, number]) => {
      const marker = this.markerFactory
        .createMarker({ imageUrl: iconUrl, size, anchor: 'bottom' })
        ?.setLngLat(point)
        .addTo(this.mapAdapter);
      if (marker) this.markers.push(marker);
    };
    if (routeData.origin) drop(routeData.origin, icons.originIcon, DEFAULT_MARKER_SIZES.origin);
    if (routeData.destination)
      drop(routeData.destination, icons.destinationIcon, DEFAULT_MARKER_SIZES.destination);
  }

  private clearMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }

  private fitMapToRoute(routeData: RouteData): void {
    const coords = routeData.geometry?.coordinates ?? [];
    if (coords.length === 0) return;
    let west = coords[0][0];
    let east = coords[0][0];
    let south = coords[0][1];
    let north = coords[0][1];
    for (const [lng, lat] of coords) {
      if (lng < west) west = lng;
      if (lng > east) east = lng;
      if (lat < south) south = lat;
      if (lat > north) north = lat;
    }
    this.mapAdapter.fitBounds(
      {
        getWest: () => west,
        getSouth: () => south,
        getEast: () => east,
        getNorth: () => north,
      },
      DEFAULT_FIT_BOUNDS_OPTIONS
    );
  }
}
