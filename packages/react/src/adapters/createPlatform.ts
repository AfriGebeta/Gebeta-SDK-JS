import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';
import { MapAdapter } from './MapAdapter';
import { MarkerFactory } from './MarkerFactory';
import { PopupFactory } from './PopupFactory';

export interface PlatformContext {
  mapAdapter: API.Platform.Types.IMapAdapter;
  markerFactory: API.Platform.Types.IMarkerFactory;
  popupFactory: API.Platform.Types.IPopupFactory;
}

export function createPlatform(map: MapLibreMap): PlatformContext {
  return {
    mapAdapter: new MapAdapter(map),
    markerFactory: new MarkerFactory(map),
    popupFactory: new PopupFactory(map),
  };
}
