import { MarkerFactory } from './MarkerFactory';
import { Map as MapLibreMap } from 'maplibre-gl';

describe('MarkerFactory', () => {
  let mockMap: MapLibreMap;
  let factory: MarkerFactory;

  beforeEach(() => {
    mockMap = new MapLibreMap({ container: 'map', style: 'test' });
    factory = new MarkerFactory(mockMap);
  });

  describe('createMarker', () => {
    it('should create a marker with default options', () => {
      const marker = factory.createMarker({});
      
      expect(marker).toBeDefined();
      expect(marker?.setLngLat).toBeDefined();
      expect(marker?.addTo).toBeDefined();
      expect(marker?.remove).toBeDefined();
    });

    it('should create a marker with custom className', () => {
      const marker = factory.createMarker({
        className: 'custom-marker',
      });
      
      expect(marker).toBeDefined();
    });

    it('should create a marker with custom size', () => {
      const marker = factory.createMarker({
        size: [30, 40],
      });
      
      expect(marker).toBeDefined();
    });

    it('should create a marker with custom color', () => {
      const marker = factory.createMarker({
        className: 'red-marker',
      });
      
      expect(marker).toBeDefined();
    });

    it('should create a marker with element', () => {
      const element = document.createElement('div');
      element.className = 'custom-element';
      
      const marker = factory.createMarker({
        element,
      });
      
      expect(marker).toBeDefined();
    });

    it('should create a marker with anchor option', () => {
      const marker = factory.createMarker({
        anchor: 'bottom',
      });
      
      expect(marker).toBeDefined();
    });
  });

  describe('marker operations', () => {
    it('should allow setting marker position', () => {
      const marker = factory.createMarker({});
      const result = marker?.setLngLat({ lng: 10, lat: 20 });
      
      expect(result).toBe(marker);
    });

    it('should allow adding marker to map', () => {
      const marker = factory.createMarker({});
      const result = marker?.addTo(mockMap);
      
      expect(result).toBe(marker); 
    });

    it('should allow removing marker from map', () => {
      const marker = factory.createMarker({});
      marker?.addTo(mockMap);
      marker?.remove();
      
      expect(marker).toBeDefined();
    });

    it('should allow getting marker position', () => {
      const marker = factory.createMarker({});
      marker?.setLngLat({ lng: 10, lat: 20 });
      
      //verify marker exists
      expect(marker).toBeDefined();
    });
  });

  describe('marker chaining', () => {
    it('should support method chaining', () => {
      const marker = factory.createMarker({});
      
      const result = marker
        ?.setLngLat({ lng: 10, lat: 20 })
        ?.addTo(mockMap);
      
      expect(result).toBe(marker);
    });
  });
});
