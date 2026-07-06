import type { API } from '@gebeta/api';
import { MapAdapter } from './MapAdapter';
import { MapHandle } from './MapHandle';
import { MarkerFactory } from './MarkerFactory';
import { PopupFactory } from './PopupFactory';
import { RNLocationProvider } from './LocationProvider';
import { StyleInjector } from './StyleInjector';
import { AsyncStorageClientIdStorage } from './AsyncStorageClientIdStorage';

export interface PlatformContext extends API.Platform.Types.IPlatformContext {
  mapAdapter: API.Platform.Types.IMapAdapter;
  markerFactory: API.Platform.Types.IMarkerFactory;
  popupFactory: API.Platform.Types.IPopupFactory;
  locationProvider: API.Platform.Types.ILocationProvider;
  getLocationProvider: (
    options?: API.Platform.Types.LocationProviderOptions
  ) => API.Platform.Types.ILocationProvider;
  styleInjector: API.Platform.Types.IStyleInjector;
  clientIdStorage: API.Platform.Types.IClientIdStorage;
  /**
   * Live handle to the mounted MapLibre-RN map. `GebetaMap` attaches the MapView/Camera
   * refs and pushes region updates here; the `MapAdapter` reads through it. Exposed on the
   * context so the `<GebetaMap>` component can wire the refs after mount.
   */
  mapHandle: MapHandle;
}

export function createPlatform(options: {
  center: API.Common.Types.LngLat;
  zoom: number;
}): PlatformContext {
  const mapHandle = new MapHandle(options.center, options.zoom);
  return {
    mapAdapter: new MapAdapter(mapHandle),
    mapHandle,
    markerFactory: new MarkerFactory(),
    popupFactory: new PopupFactory(),
    locationProvider: RNLocationProvider.getInstance(),
    getLocationProvider: options => RNLocationProvider.getInstance(options),
    styleInjector: StyleInjector.getInstance(),
    clientIdStorage: new AsyncStorageClientIdStorage(),
  };
}
