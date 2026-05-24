// CDN / <script> entry point.
// Registers GebetaMaps and maplibregl on window and injects maplibre CSS.
// For bundler usage (webpack, Vite, Rollup), import from '@gebeta/js' instead.
declare const __GEBETA_VERSION__: string;
import maplibre from 'maplibre-gl';
import { GeocodingManager } from '@gebeta/core';
import { DirectionsManager } from './Directions/DirectionsManager';
import { ClusteringManager } from './Clustering/ClusteringManager';
import { FenceManager } from './Fencing/FenceManager';
import { NavigationManager } from './Navigation/NavigationManager';
import { GebetaMaps } from './GebetaMaps';
import { injectMapLibreStyles } from './injectMapLibreStyles';
import { BrowserLocationProvider } from './adapters/LocationProvider';

// Expose everything on window for CDN usage
if (typeof window !== 'undefined') {
  injectMapLibreStyles();
  (window as unknown as Record<string, unknown>).maplibregl = maplibre;
  (GebetaMaps as unknown as Record<string, unknown>).VERSION = __GEBETA_VERSION__;
  (window as unknown as Record<string, unknown>).GebetaMaps = GebetaMaps;
  (window as unknown as Record<string, unknown>).GeocodingManager = GeocodingManager;
  (window as unknown as Record<string, unknown>).DirectionsManager = DirectionsManager;
  (window as unknown as Record<string, unknown>).ClusteringManager = ClusteringManager;
  (window as unknown as Record<string, unknown>).FenceManager = FenceManager;
  (window as unknown as Record<string, unknown>).NavigationManager = NavigationManager;
  (window as unknown as Record<string, unknown>).BrowserLocationProvider = BrowserLocationProvider;
}

export {
  GebetaMaps,
  GeocodingManager,
  DirectionsManager,
  ClusteringManager,
  FenceManager,
  NavigationManager,
  BrowserLocationProvider,
};
