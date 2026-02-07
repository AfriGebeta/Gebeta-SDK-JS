import { GeocodingManager } from '@gebeta/maps-core';

export { GeocodingManager };

if (typeof window !== 'undefined') {
  (window as any).GebetaMaps = {
    GeocodingManager,
  };
}
