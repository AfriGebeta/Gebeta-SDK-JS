/**
 * Gebeta Maps building blocks: markers, popups, controls and geo helpers.
 *
 * Use these instead of importing the rendering engine directly, so app code only
 * references Gebeta:
 *
 * @example
 * ```ts
 * import { GebetaMaps, gebeta } from '@gebeta/js';
 *
 * const sdk = new GebetaMaps({ auth });
 * const map = sdk.init({ container: 'map' });
 * map.addControl(new gebeta.FullscreenControl());
 * new gebeta.Popup().setLngLat([38.7578, 9.0301]).setText('Meskel Square').addTo(map);
 * ```
 *
 * CDN builds expose the same object as `window.gebeta`.
 */
import {
  Marker,
  Popup,
  LngLat,
  LngLatBounds,
  MercatorCoordinate,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  ScaleControl,
  AttributionControl,
  TerrainControl,
  addProtocol,
  removeProtocol,
} from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';

export {
  Marker,
  Popup,
  LngLat,
  LngLatBounds,
  MercatorCoordinate,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  ScaleControl,
  AttributionControl,
  TerrainControl,
  addProtocol,
  removeProtocol,
};

/** The map instance returned by `sdk.init()` / `sdk.getMap()`. */
export type GebetaMapInstance = MapLibreMap;

export type { GeoJSONSource, MapMouseEvent } from 'maplibre-gl';

/** Namespace object with every Gebeta building block (also `window.gebeta` on CDN). */
export const gebeta = {
  Marker,
  Popup,
  LngLat,
  LngLatBounds,
  MercatorCoordinate,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  ScaleControl,
  AttributionControl,
  TerrainControl,
  addProtocol,
  removeProtocol,
};
