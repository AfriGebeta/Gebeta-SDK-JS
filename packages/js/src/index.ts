import maplibre from 'maplibre-gl';
import { GeocodingManager } from '@gebeta/maps-core';
import { DirectionsManager } from './Directions/DirectionsManager';
import { ClusteringManager } from './Clustering/ClusteringManager';
import { FenceManager } from './Fencing/FenceManager';
import { NavController } from './Navigation/NavController';
import { GebetaMaps } from './GebetaMaps';
import { injectMapLibreStyles } from './injectMapLibreStyles';
import { BrowserLocationProvider } from './adapters/LocationProvider';

export {
  GeocodingManager,
  DirectionsManager,
  ClusteringManager,
  FenceManager,
  NavController,
  GebetaMaps,
  BrowserLocationProvider,
};

if (typeof window !== 'undefined') {
  injectMapLibreStyles();
  (window as unknown as Record<string, unknown>).maplibregl = maplibre;
  const windowObj = window as unknown as Record<string, unknown>;
  windowObj.GebetaMaps = GebetaMaps;
  windowObj.BrowserLocationProvider = BrowserLocationProvider;
  injectMapLibreStyles();
  (window as unknown as Record<string, unknown>).maplibregl = maplibre;
  (window as unknown as Record<string, unknown>).GebetaMaps = GebetaMaps;
}
