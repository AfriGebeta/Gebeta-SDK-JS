import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { DirectionsManager as CoreDirectionsManager } from '@gebeta/maps-core';
import { API, ValidationError } from '@gebeta/maps-api';
import { ROUTE_SOURCE_ID, DEFAULT_ROUTE_STYLE, DEFAULT_FIT_BOUNDS_OPTIONS } from './constants';
import { initRouteLayer, updateRouteLayerData, clearRouteLayerData, updateRouteLayerStyle } from './routeLayer';
import { createRouteMarker, getMarkerIcon, getMarkerSize } from './markers';

type RouteData = API.Routing.Types.RouteData;
type LngLat = API.Common.Types.LngLat;
type DirectionsOptions = API.Routing.Types.DirectionsOptions;
type DisplayRouteOptions = API.Routing.Types.DisplayRouteOptions;
type RouteStyleOptions = API.Routing.Types.RouteStyleOptions;

export class DirectionsManager {
  private readonly map: MapLibreMap;
  private readonly core: CoreDirectionsManager;
  private currentRoute: RouteData | null = null;
  private markers: MapLibreMarker[] = [];

  constructor(map: MapLibreMap, apiKey: string) {
    if (!map) {
      throw new ValidationError('Map is required for DirectionsManager', 'map');
    }
    this.map = map;
    this.core = new CoreDirectionsManager(apiKey);
    initRouteLayer(this.map);
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
    if (!this.map || !routeData) return;

    const {
      showMarkers = true,
      originIcon,
      destinationIcon,
      waypointIcon,
      routeStyle = {},
    } = options;

    if (!this.map.getSource(ROUTE_SOURCE_ID)) {
      initRouteLayer(this.map);
    }

    this.clearRoute();

    const coords = routeData.geometry?.coordinates ?? [];
    if (coords.length > 0 && this.map.getSource(ROUTE_SOURCE_ID)) {
      updateRouteLayerData(this.map, coords);
      updateRouteLayerStyle(this.map, {
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
    if (!this.map?.getSource(ROUTE_SOURCE_ID)) return;
    clearRouteLayerData(this.map);
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
    updateRouteLayerStyle(this.map, style);
  }

  private addRouteMarkers(
    routeData: RouteData,
    options: { originIcon: string; destinationIcon: string; waypointIcon: string }
  ): void {
    this.clearMarkers();
    const waypoints = (routeData as RouteData & { waypoints?: LngLat[] }).waypoints ?? [];

    if (routeData.origin) {
      this.markers.push(
        createRouteMarker(
          this.map,
          [routeData.origin.lng, routeData.origin.lat],
          options.originIcon,
          getMarkerSize('origin')
        )
      );
    }
    if (routeData.destination) {
      this.markers.push(
        createRouteMarker(
          this.map,
          [routeData.destination.lng, routeData.destination.lat],
          options.destinationIcon,
          getMarkerSize('destination')
        )
      );
    }
    waypoints.forEach(wp => {
      this.markers.push(
        createRouteMarker(this.map, [wp.lng, wp.lat], options.waypointIcon, getMarkerSize('waypoint'))
      );
    });
  }

  private fitMapToRoute(routeData: RouteData): void {
    const coords = routeData.geometry?.coordinates;
    if (!coords?.length) return;
    const bounds = new maplibre.LngLatBounds();
    coords.forEach(c => bounds.extend(c as [number, number]));
    this.map.fitBounds(bounds, DEFAULT_FIT_BOUNDS_OPTIONS);
  }

  private clearMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }
}
