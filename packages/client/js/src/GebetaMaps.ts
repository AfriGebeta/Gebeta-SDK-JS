import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { DirectionsManager } from './Directions/DirectionsManager';
import { ClusteringManager } from './Clustering/ClusteringManager';
import { FenceManager } from './Fencing/FenceManager';
import { NavigationManager } from './Navigation/NavigationManager';
import { GeocodingManager, AuthManager, ClientIdManager } from '@gebeta/core';
import { API, ValidationError, PlatformError } from '@gebeta/api';
import { createPlatform, type PlatformContext } from './adapters';
import { LocalStorageClientIdStorage } from './adapters/LocalStorageClientIdStorage';

type AuthParam = API.Auth.Types.AuthParam;

export class GebetaMaps {
  private readonly auth: AuthParam;
  private readonly enableClientId: boolean;
  private clientIdManager: ClientIdManager | null = null;
  private map: MapLibreMap | null = null;
  private platform: PlatformContext | null = null;
  private directionsManager: DirectionsManager | null = null;
  private clusteringManager: ClusteringManager | null = null;
  private fenceManager: FenceManager | null = null;
  private navigationManager: NavigationManager | null = null;
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

  constructor(options: API.Map.Types.ConstructorOptions & { platform?: PlatformContext }) {
    const hasApiKey = !!options?.apiKey;
    const hasAuth = !!options?.auth;

    if (!hasApiKey && !hasAuth) {
      throw new ValidationError('Either apiKey or auth is required', 'auth');
    }
    if (hasApiKey && hasAuth) {
      throw new ValidationError('Provide either apiKey or auth, not both', 'auth');
    }
    if (hasApiKey) {
      console.warn(
        '[Gebeta] apiKey auth is deprecated and will be removed in a future release. ' +
        'Use service account auth instead: https://docs.gebeta.app/auth'
      );
      this.auth = options.apiKey!;
    } else {
      this.auth = new AuthManager(options.auth!);
    }

    this.clusteringOptions = options.clustering;
    this.enableClientId = options.enableClientId ?? false;
    this.platform = options.platform ?? null;

    if (this.enableClientId) {
      this.clientIdManager = new ClientIdManager(new LocalStorageClientIdStorage());
    }
  }

  private readonly clusteringOptions?: API.Clustering.Types.Options;

  private initManagers(): void {
    if (!this.platform) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Platform must be initialized before managers can be created',
        { method: 'initManagers' }
      );
    }

    const clientId = this.clientIdManager?.getId();

    this._geocodingManager = new GeocodingManager(this.auth, clientId);
    this.directionsManager = new DirectionsManager(
      this.platform.mapAdapter,
      this.platform.markerFactory,
      this.auth,
      clientId
    );
    this.fenceManager = new FenceManager(
      this.platform.mapAdapter,
      this.platform.markerFactory,
      this.platform.popupFactory
    );
    if (this.clusteringOptions?.enabled) {
      this.clusteringManager = new ClusteringManager(
        this.platform.mapAdapter,
        this.platform.markerFactory,
        this.platform.popupFactory,
        this.clusteringOptions
      );
    }
    this.navigationManager = new NavigationManager(
      this.auth,
      this.platform.mapAdapter,
      this.platform.markerFactory,
      {},
      clientId
    );
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
          const token = typeof this.auth === 'string'
            ? this.auth
            : (this.auth as AuthManager).getAccessToken();
          const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
          if (this.clientIdManager) {
            headers['X-Device-ID'] = this.clientIdManager.getId();
          }
          return { url, headers };
        }
        return { url };
      },
    });

    if (!this.platform) {
      this.platform = createPlatform(this.map);
    }

    if (navigationControl && this.platform.mapAdapter.addControl) {
      this.platform.mapAdapter.addControl(
        new maplibre.NavigationControl(),
        navigationControlPosition
      );
    }

    const mapAdapter = this.platform.mapAdapter;
    if (mapAdapter.isStyleLoaded()) {
      this.initManagers();
    } else {
      mapAdapter.once('style.load', () => {
        this.initManagers();
      });
    }

    return this.map;
  }

  getPlatform(): PlatformContext {
    if (!this.platform) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Platform not initialized. Call init() first.',
        { method: 'getPlatform' }
      );
    }
    return this.platform;
  }

  addNavigationControls(position: string = API.Common.Enums.CornerPosition.TOP_RIGHT): void {
    if (!this.platform) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Platform not initialized. Call init() first.',
        { method: 'addNavigationControls' }
      );
    }
    if (this.platform.mapAdapter.addControl) {
      this.platform.mapAdapter.addControl(new maplibre.NavigationControl(), position);
    }
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

  get clustering(): ClusteringManager | null {
    return this.clusteringManager;
  }

  get fencing(): FenceManager {
    if (!this.fenceManager) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Fence manager not initialized. Call init() first and wait for map to load.',
        { method: 'fencing' }
      );
    }
    return this.fenceManager;
  }

  getMap(): MapLibreMap | null {
    return this.map;
  }

  get navigation(): NavigationManager {
    if (!this.navigationManager) {
      throw new PlatformError(
        API.Errors.Codes.PLATFORM_NOT_INITIALIZED,
        'Navigation manager not initialized. Call init() first and wait for map to load.',
        { method: 'navigation' }
      );
    }
    return this.navigationManager;
  }
}
