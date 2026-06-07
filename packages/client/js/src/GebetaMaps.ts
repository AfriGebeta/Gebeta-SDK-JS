import maplibre from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { DirectionsManager } from './Directions/DirectionsManager';
import { ClusteringManager } from './Clustering/ClusteringManager';
import { FenceManager } from './Fencing/FenceManager';
import { NavigationManager } from './Navigation/NavigationManager';
import { GeocodingManager, ClientIdManager, createTileTransform, resolveAuth } from '@gebeta/core';
import type { ResolvedAuth } from '@gebeta/core';
import { API, PlatformError } from '@gebeta/api';
import { createPlatform, type PlatformContext } from './adapters';
import { LocalStorageClientIdStorage } from './adapters/LocalStorageClientIdStorage';

/**
 * Main entry point for the Gebeta Maps JavaScript SDK.
 *
 * @example
 * ```ts
 * // Service account auth (recommended)
 * const sdk = new GebetaMaps({
 *   auth: { accessToken: '...', refreshToken: '...' }
 * });
 * const map = sdk.init({ container: '#map', center: [38.74, 9.02], zoom: 12 });
 *
 * // Legacy API key (deprecated)
 * const sdk = new GebetaMaps({ apiKey: 'your-api-key' });
 * ```
 */
export class GebetaMaps {
  private readonly auth: ResolvedAuth;
  private readonly enableClientId: boolean;
  private clientIdManager: ClientIdManager | null = null;
  private map: MapLibreMap | null = null;
  private platform: PlatformContext | null = null;
  private directionsManager: DirectionsManager | null = null;
  private clusteringManager: ClusteringManager | null = null;
  private fenceManager: FenceManager | null = null;
  private navigationManager: NavigationManager | null = null;
  private _geocodingManager: GeocodingManager | null = null;

  /**
   * Access geocoding functionality (forward and reverse).
   * @throws {PlatformError} If called before `init()` completes map style loading.
   */
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

  /**
   * Creates a new GebetaMaps instance.
   *
   * Provide either `apiKey` (deprecated) or `auth` (service account) — not both.
   *
   * @param options - Constructor options
   * @param options.auth - Service account credentials `{ accessToken, refreshToken }`
   * @param options.apiKey - Deprecated legacy API key
   * @param options.clustering - Clustering configuration (must be set here; cannot be changed after init)
   * @param options.enableClientId - Attach a stable `X-Device-ID` header to all requests (default: false)
   * @throws {ValidationError} If neither `apiKey` nor `auth` is provided, or if both are provided.
   */
  constructor(options: API.Map.Types.ConstructorOptions & { platform?: PlatformContext }) {
    this.auth = resolveAuth(options);
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

  /**
   * Initialize the map and mount it to a DOM element.
   *
   * All SDK managers (geocoding, directions, fencing, clustering, navigation) are
   * created after the map style finishes loading. Do not call manager methods until
   * the map `style.load` event fires.
   *
   * @param options - Initialization options
   * @param options.container - CSS selector (e.g., `'#map'`) or HTMLElement to mount into
   * @param options.center - Initial center `[lng, lat]`
   * @param options.zoom - Initial zoom level (0–22)
   * @param options.navigationControl - Show zoom +/- buttons (default: false)
   * @param options.navigationControlPosition - Corner for navigation controls (default: 'top-right')
   * @param options.styleUrl - Custom map style URL
   * @returns The underlying MapLibre GL `Map` instance
   */
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
    const transformTile = createTileTransform(this.auth, this.clientIdManager?.getId());

    this.map = new maplibre.Map({
      ...mapOptions,
      container,
      style: resolvedStyle,
      attributionControl: false,
      transformRequest: (url: string, _resourceType: string) => {
        if (url.startsWith('https://tiles.gebeta.app')) {
          return transformTile(url);
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

  /**
   * Returns the platform context (map adapter, marker/popup factories).
   * Useful for advanced use cases that need direct access to the underlying adapters.
   * @throws {PlatformError} If called before `init()`.
   */
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

  /**
   * Add zoom +/- navigation controls to the map.
   * Alternatively, pass `navigationControl: true` in `init()` options.
   * @param position - Corner position (default: 'top-right')
   */
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

  /**
   * Calculate a route between two points.
   *
   * @param origin - Starting point `{ lng, lat }`
   * @param destination - Ending point `{ lng, lat }`
   * @param options - Optional waypoints and average speed
   * @returns RouteData with geometry, instructions, and summary
   * @throws {PlatformError} If called before `init()` completes map style loading.
   * @throws {ValidationError} If origin or destination coordinates are missing.
   * @throws {NetworkError} If the directions API request fails.
   *
   * @example
   * ```ts
   * const route = await sdk.getDirections(
   *   { lng: 38.74, lat: 9.02 },
   *   { lng: 38.78, lat: 9.05 }
   * );
   * sdk.displayRoute(route);
   * ```
   */
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

  /**
   * Render a route on the map as a colored line with optional origin/destination markers.
   * @param routeData - Route returned from `getDirections()`
   * @param options - Display options (showMarkers, originIcon, destinationIcon, routeStyle)
   */
  displayRoute(
    routeData: API.Routing.Types.RouteData,
    options?: API.Routing.Types.DisplayRouteOptions & {
      routeStyle?: API.Routing.Types.RouteStyleOptions;
    }
  ): void {
    if (!this.directionsManager) return;
    this.directionsManager.displayRoute(routeData, options);
  }

  /** Remove the currently displayed route line and markers from the map. */
  clearRoute(): void {
    if (!this.directionsManager) return;
    this.directionsManager.clearRoute();
  }

  /** Returns the currently active route, or `null` if no route is loaded. */
  getCurrentRoute(): API.Routing.Types.RouteData | null {
    if (!this.directionsManager) return null;
    return this.directionsManager.getCurrentRoute();
  }

  /** Returns distance, duration, origin, destination, and waypoints for the current route. */
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

  /**
   * Update the visual style of the displayed route line.
   * @param style - Style properties (`line-color`, `line-width`, `line-opacity`, `line-dasharray`)
   */
  updateRouteStyle(style: API.Routing.Types.RouteStyleOptions): void {
    if (!this.directionsManager) return;
    this.directionsManager.updateRouteStyle(style);
  }

  /**
   * Access clustering functionality for grouping nearby markers.
   * Returns `null` if clustering was not enabled in the constructor options.
   */
  get clustering(): ClusteringManager | null {
    return this.clusteringManager;
  }

  /**
   * Access geofencing functionality for drawing and managing polygon fences.
   * @throws {PlatformError} If called before `init()` completes map style loading.
   */
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

  /** Returns the underlying MapLibre GL `Map` instance, or `null` before `init()`. */
  getMap(): MapLibreMap | null {
    return this.map;
  }

  /**
   * Access turn-by-turn navigation with real-time tracking.
   * @throws {PlatformError} If called before `init()` completes map style loading.
   */
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
