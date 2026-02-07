import maplibre from 'maplibre-gl';
import { GeocodingManager } from '@gebeta/maps-core';
import { DirectionsManager } from './Directions/DirectionsManager';
import { ClusteringManager } from './Clustering/ClusteringManager';
import { FenceManager } from './Fencing/FenceManager';
import { GebetaMaps } from './GebetaMaps';
import { injectMapLibreStyles } from './injectMapLibreStyles';

export { GeocodingManager, DirectionsManager, ClusteringManager, FenceManager, GebetaMaps };

if (typeof window !== 'undefined') {
  injectMapLibreStyles();
  (window as unknown as Record<string, unknown>).maplibregl = maplibre;
  (window as unknown as Record<string, unknown>).GebetaMaps = GebetaMaps;
}
