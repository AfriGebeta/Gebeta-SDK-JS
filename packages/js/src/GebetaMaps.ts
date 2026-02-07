import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { DirectionsManager } from './Directions/DirectionsManager';
import { ClusteringManager } from './Clustering/ClusteringManager';
import { GeocodingManager } from '@gebeta/maps-core';
import { API, ValidationError, PlatformError } from '@gebeta/maps-api';

export class GebetaMaps {
  private readonly apiKey: string;
  private map: MapLibreMap | null = null;
  private directionsManager: DirectionsManager | null = null;
  private clusteringManager: ClusteringManager | null = null;
  private _geocodingManager: GeocodingManager | null = null;

  get geocodingManager(): GeocodingManager {
    if (!this._geocodingManager) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Geocoding manager not initialized. Call init() first and wait for map to load.',
        { method: 'geocodingManager' }
      );
    }
    return this._geocodingManager;
  }

  constructor(options: API.Map.Types.ConstructorOptions) {
    if (!options?.apiKey) {
      throw new ValidationError('API key is required', 'apiKey');
    }
    this.apiKey = options.apiKey;
    this.clusteringOptions = options.clustering;
  }

  private readonly clusteringOptions?: API.Clustering.Types.Options;

  private initManagers(): void {
    if (!this.map) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Map must be initialized before managers can be created',
        { method: 'initManagers' }
      );
    }
    this._geocodingManager = new GeocodingManager(this.apiKey);
    this.directionsManager = new DirectionsManager(this.map, this.apiKey);
    if (this.clusteringOptions?.enabled) {
      this.clusteringManager = new ClusteringManager(this.map, this.clusteringOptions);
    }
  }

  init(options: API.Map.Types.InitOptions): MapLibreMap {
    const defaultStyleUrl = API.Map.Constants.DEFAULT_STYLE_URL;
    const {
      styleUrl,
      style,
      container,
      navigationControl = false,
      navigationControlPosition = API.Common.Enums.CornerPosition.TOP_RIGHT,
      ...mapOptions
    } = options;

    const resolvedStyle = style || styleUrl || defaultStyleUrl;

    this.map = new maplibre.Map({
      ...mapOptions,
      container,
      style: resolvedStyle,
      attributionControl: false,
      transformRequest: (url: string, _resourceType: string) => {
        if (url.startsWith('https://tiles.gebeta.app')) {
          return {
            url,
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          };
        }
        return { url };
      },
    });

    if (navigationControl) {
      this.map.addControl(new maplibre.NavigationControl(), navigationControlPosition);
    }

    if (this.map.isStyleLoaded()) {
      this.initManagers();
    } else {
      this.map.once('style.load', () => {
        this.initManagers();
      });
    }

    return this.map;
  }

  addNavigationControls(position: string = API.Common.Enums.CornerPosition.TOP_RIGHT): void {
    if (!this.map) return;
    this.map.addControl(new maplibre.NavigationControl(), position);
  }

  getDirections(
    origin: API.Common.Types.LngLat,
    destination: API.Common.Types.LngLat,
    options?: API.Routing.Types.DirectionsOptions
  ): Promise<API.Routing.Types.RouteData> {
    if (!this.directionsManager) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Directions manager not initialized. Call init() first and wait for map to load.',
        { method: 'getDirections' }
      );
    }
    return this.directionsManager.getDirections(origin, destination, options);
  }

  displayRoute(
    routeData: API.Routing.Types.RouteData,
    options?: API.Routing.Types.DisplayRouteOptions & {
      routeStyle?: API.Routing.Types.RouteStyleOptions;
    }
  ): void {
    if (!this.directionsManager) return;
    this.directionsManager.displayRoute(routeData, options);
  }

  clearRoute(): void {
    if (!this.directionsManager) return;
    this.directionsManager.clearRoute();
  }

  getCurrentRoute(): API.Routing.Types.RouteData | null {
    if (!this.directionsManager) return null;
    return this.directionsManager.getCurrentRoute();
  }

  getRouteSummary(): {
    distance?: string | number | null;
    duration?: string | number | null;
    origin?: API.Common.Types.LngLat;
    destination?: API.Common.Types.LngLat;
    waypoints?: API.Common.Types.LngLat[];
  } | null {
    if (!this.directionsManager) return null;
    return this.directionsManager.getRouteSummary();
  }

  updateRouteStyle(style: API.Routing.Types.RouteStyleOptions): void {
    if (!this.directionsManager) return;
    this.directionsManager.updateRouteStyle(style);
  }

  get clustering(): ClusteringManager {
    if (!this.clusteringManager) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Clustering manager not initialized. Enable clustering in constructor options and call init() first.',
        { method: 'clustering' }
      );
    }
    return this.clusteringManager;
  }

  getMap(): MapLibreMap | null {
    return this.map;
  }
}
