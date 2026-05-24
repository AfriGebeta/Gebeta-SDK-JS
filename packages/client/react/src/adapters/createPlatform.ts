import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';
import { MapAdapter } from './MapAdapter';
import { MarkerFactory } from './MarkerFactory';
import { PopupFactory } from './PopupFactory';
import { BrowserLocationProvider } from './LocationProvider';
import { StyleInjector } from './StyleInjector';
import { LocalStorageClientIdStorage } from './LocalStorageClientIdStorage';

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
}

export function createPlatform(map: MapLibreMap): PlatformContext {
  return {
    mapAdapter: new MapAdapter(map),
    markerFactory: new MarkerFactory(map),
    popupFactory: new PopupFactory(map),
    locationProvider: BrowserLocationProvider.getInstance(),
    getLocationProvider: options => BrowserLocationProvider.getInstance(options),
    styleInjector: StyleInjector.getInstance(),
    clientIdStorage: new LocalStorageClientIdStorage(),
  };
}
