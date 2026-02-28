import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import { MarkerFactory } from './MarkerFactory';
import { PopupFactory } from './PopupFactory';
import { MapAdapter } from './MapAdapter';
import { PlatformDOM } from './PlatformDOM';
import { BrowserLocationProvider } from './LocationProvider';
import { StyleInjector } from './StyleInjector';

export interface PlatformContext {
  mapAdapter: API.Platform.Types.IMapAdapter;
  markerFactory: API.Platform.Types.IMarkerFactory;
  popupFactory: API.Platform.Types.IPopupFactory;
  dom: API.Platform.Types.IPlatformDOM;
  locationProvider: API.Platform.Types.ILocationProvider;
  getLocationProvider: (options?: API.Platform.Types.LocationProviderOptions) => API.Platform.Types.ILocationProvider;
  styleInjector: API.Platform.Types.IStyleInjector;
}

export function createPlatform(map: MapLibreMap): PlatformContext {
  return {
    mapAdapter: new MapAdapter(map),
    markerFactory: new MarkerFactory(map),
    popupFactory: new PopupFactory(map),
    dom: PlatformDOM.getInstance(),
    locationProvider: BrowserLocationProvider.getInstance(),
    getLocationProvider: (options) => BrowserLocationProvider.getInstance(options),
    styleInjector: StyleInjector.getInstance(),
  };
}
