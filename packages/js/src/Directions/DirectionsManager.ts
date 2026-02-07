import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { DirectionsManager as CoreDirectionsManager } from '@gebeta/maps-core';
import { API, ValidationError } from '@gebeta/maps-api';

type RouteData = API.Routing.Types.RouteData;
type LngLat = API.Common.Types.LngLat;
type DirectionsOptions = API.Routing.Types.DirectionsOptions;
type DisplayRouteOptions = API.Routing.Types.DisplayRouteOptions;
type RouteStyleOptions = API.Routing.Types.RouteStyleOptions;

const DEFAULT_ORIGIN_ICON = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
const DEFAULT_DESTINATION_ICON = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
const DEFAULT_WAYPOINT_ICON = 'https://cdn-icons-png.flaticon.com/512/484/484167.png';

const ROUTE_SOURCE_ID = 'gebeta-route';
const ROUTE_LAYER_ID = 'gebeta-route';

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
    if (this.map.isStyleLoaded()) {
      this.initRouteLayer();
    } else {
      this.map.once('style.load', () => this.initRouteLayer());
    }
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
      this.initRouteLayer();
    }

    this.clearRoute();

    const coords = routeData.geometry?.coordinates ?? [];
    if (coords.length > 0 && this.map.getSource(ROUTE_SOURCE_ID)) {
      (this.map.getSource(ROUTE_SOURCE_ID) as import('maplibre-gl').GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords },
      });

      if (this.map.getLayer(ROUTE_LAYER_ID)) {
        const color = routeStyle['line-color'] ?? '#007cbf';
        const width = routeStyle['line-width'] ?? 4;
        const opacity = routeStyle['line-opacity'] ?? 0.8;
        this.map.setPaintProperty(ROUTE_LAYER_ID, 'line-color', color);
        this.map.setPaintProperty(ROUTE_LAYER_ID, 'line-width', width);
        this.map.setPaintProperty(ROUTE_LAYER_ID, 'line-opacity', opacity);
      }
    }

    if (showMarkers) {
      this.addRouteMarkers(routeData, {
        originIcon: originIcon ?? DEFAULT_ORIGIN_ICON,
        destinationIcon: destinationIcon ?? DEFAULT_DESTINATION_ICON,
        waypointIcon: waypointIcon ?? DEFAULT_WAYPOINT_ICON,
      });
    }

    this.fitMapToRoute(routeData);
  }

  clearRoute(): void {
    if (!this.map?.getSource(ROUTE_SOURCE_ID)) return;
    (this.map.getSource(ROUTE_SOURCE_ID) as import('maplibre-gl').GeoJSONSource).setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: [] },
    });
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
    if (!this.map?.getLayer(ROUTE_LAYER_ID)) return;
    if (style['line-color'] != null)
      this.map.setPaintProperty(ROUTE_LAYER_ID, 'line-color', style['line-color']);
    if (style['line-width'] != null)
      this.map.setPaintProperty(ROUTE_LAYER_ID, 'line-width', style['line-width']);
    if (style['line-opacity'] != null)
      this.map.setPaintProperty(ROUTE_LAYER_ID, 'line-opacity', style['line-opacity']);
  }

  private initRouteLayer(): void {
    if (!this.map) return;
    if (!this.map.isStyleLoaded()) {
      this.map.once('style.load', () => this.initRouteLayer());
      return;
    }
    if (this.map.getSource(ROUTE_SOURCE_ID)) return;

    this.map.addSource(ROUTE_SOURCE_ID, {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
    });

    this.map.addLayer({
      id: ROUTE_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'visible' },
      paint: {
        'line-color': '#007cbf',
        'line-width': 4,
        'line-opacity': 0.8,
      },
    });
  }

  private addRouteMarkers(
    routeData: RouteData,
    options: { originIcon: string; destinationIcon: string; waypointIcon: string }
  ): void {
    this.clearMarkers();
    const waypoints = (routeData as RouteData & { waypoints?: LngLat[] }).waypoints ?? [];

    if (routeData.origin) {
      this.markers.push(
        this.createMarker(
          [routeData.origin.lng, routeData.origin.lat],
          options.originIcon,
          [25, 25]
        )
      );
    }
    if (routeData.destination) {
      this.markers.push(
        this.createMarker(
          [routeData.destination.lng, routeData.destination.lat],
          options.destinationIcon,
          [25, 25]
        )
      );
    }
    waypoints.forEach(wp => {
      this.markers.push(this.createMarker([wp.lng, wp.lat], options.waypointIcon, [20, 20]));
    });
  }

  private createMarker(
    lngLat: [number, number],
    iconUrl: string,
    size: [number, number]
  ): MapLibreMarker {
    const el = document.createElement('div');
    el.style.backgroundImage = `url('${iconUrl}')`;
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.width = `${size[0]}px`;
    el.style.height = `${size[1]}px`;
    el.style.cursor = 'pointer';
    const marker = new maplibre.Marker({ element: el }).setLngLat(lngLat).addTo(this.map);
    return marker;
  }

  private fitMapToRoute(routeData: RouteData): void {
    const coords = routeData.geometry?.coordinates;
    if (!coords?.length) return;
    const bounds = new maplibre.LngLatBounds();
    coords.forEach(c => bounds.extend(c as [number, number]));
    this.map.fitBounds(bounds, { padding: 50, duration: 1000 });
  }

  private clearMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }
}
