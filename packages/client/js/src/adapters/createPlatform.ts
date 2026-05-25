import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';
import { MarkerFactory } from './MarkerFactory';
import { PopupFactory } from './PopupFactory';
import { MapAdapter } from './MapAdapter';
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

function injectGebetaLogo(map: MapLibreMap): void {
  const container = map.getContainer();
  if (container.querySelector('.gebeta-logo')) return;

  // Ensure the container is positioned so absolute children work
  const containerStyle = getComputedStyle(container);
  if (containerStyle.position === 'static') {
    container.style.position = 'relative';
  }

  const el = document.createElement('div');
  el.className = 'gebeta-logo';
  el.style.cssText =
    'position:absolute;bottom:10px;right:10px;z-index:999;pointer-events:auto;line-height:0';
  el.innerHTML =
    '<a href="https://gebetamaps.com" target="_blank" rel="noopener noreferrer">' +
    '<img src="https://tiles.gebeta.app/static/glogo.svg" alt="Gebeta Maps" ' +
    'style="height:28px;border-radius:4px;display:block"/></a>';
  container.appendChild(el);
}

export function createPlatform(map: MapLibreMap): PlatformContext {
  injectGebetaLogo(map);
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
