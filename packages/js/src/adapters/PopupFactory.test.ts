import { PopupFactory } from './PopupFactory';
import { Map as MapLibreMap } from 'maplibre-gl';

describe('PopupFactory', () => {
  let mockMap: MapLibreMap;
  let factory: PopupFactory;

  beforeEach(() => {
    mockMap = new MapLibreMap({ container: 'map', style: 'test' });
    factory = new PopupFactory(mockMap);
  });

  describe('createPopup', () => {
    it('should create a popup with default options', () => {
      const popup = factory.createPopup({ content: 'Test' });
      
      expect(popup).toBeDefined();
      expect(popup?.setLngLat).toBeDefined();
      expect(popup?.setHTML).toBeDefined();
      expect(popup?.addTo).toBeDefined();
      expect(popup?.remove).toBeDefined();
    });

    it('should create a popup with custom options', () => {
      const popup = factory.createPopup({
        content: 'Custom popup',
        anchor: 'top',
      });
      
      expect(popup).toBeDefined();
    });

    it('should create a popup with offset option', () => {
      const popup = factory.createPopup({
        content: 'Test',
        offset: 10,
      });
      
      expect(popup).toBeDefined();
    });
  });

  describe('popup operations', () => {
    it('should allow setting popup position', () => {
      const popup = factory.createPopup({ content: 'Test' });
      const result = popup?.setLngLat({ lng: 10, lat: 20 });
      
      expect(result).toBe(popup); 
    });

    it('should allow setting popup HTML content', () => {
      const popup = factory.createPopup({ content: 'Test' });
      const result = popup?.setHTML('<div>Test Content</div>');
      
      expect(result).toBe(popup); 
    });

    it('should allow adding popup to map', () => {
      const popup = factory.createPopup({ content: 'Test' });
      const result = popup?.addTo(mockMap);
      
      expect(result).toBe(popup);
    });

    it('should allow removing popup from map', () => {
      const popup = factory.createPopup({ content: 'Test' });
      popup?.addTo(mockMap);
      popup?.remove();
      
      //just verify it
      expect(popup).toBeDefined();
    });
  });

  describe('popup chaining', () => {
    it('should support method chaining', () => {
      const popup = factory.createPopup({ content: 'Test' });
      
      const result = popup
        ?.setLngLat({ lng: 10, lat: 20 })
        ?.setHTML('<div>Test</div>')
        ?.addTo(mockMap);
      
      expect(result).toBe(popup);
    });
  });
});
