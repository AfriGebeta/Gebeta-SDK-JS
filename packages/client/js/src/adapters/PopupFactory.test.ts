import { PopupFactory } from './PopupFactory';
import { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';

type IPopup = API.Platform.Types.IPopup;
type PopupFactoryOptions = API.Platform.Types.PopupFactoryOptions;

describe('PopupFactory', () => {
  let mockMap: MapLibreMap;
  let factory: PopupFactory;

  beforeEach(() => {
    mockMap = new MapLibreMap({ container: 'map', style: 'test' } as never);
    factory = new PopupFactory(mockMap);
  });

  describe('createPopup', () => {
    it('should create popup with content and default options', () => {
      // GIVEN options with string content
      const options: PopupFactoryOptions = { content: 'Test' };

      // WHEN createPopup is called
      const popup = factory.createPopup(options);

      // THEN popup is created with required methods
      expect(popup).not.toBeNull();
      expect(popup).toHaveProperty('setLngLat');
      expect(popup).toHaveProperty('setHTML');
      expect(popup).toHaveProperty('addTo');
      expect(popup).toHaveProperty('remove');
    });

    it('should create popup with custom options', () => {
      // GIVEN options with custom content and anchor
      const options: PopupFactoryOptions = {
        content: 'Custom popup',
        anchor: 'top',
      };

      // WHEN createPopup is called
      const popup = factory.createPopup(options);

      // THEN popup is created successfully
      expect(popup).not.toBeNull();
    });

    it('should create popup with offset option', () => {
      // GIVEN options with offset
      const options: PopupFactoryOptions = {
        content: 'Test',
        offset: [10, 20],
      };

      // WHEN createPopup is called
      const popup = factory.createPopup(options);

      // THEN popup is created successfully
      expect(popup).not.toBeNull();
    });
  });

  describe('popup operations', () => {
    it('should delegate setLngLat to underlying popup and return popup for chaining', () => {
      // GIVEN a created popup
      const popup = factory.createPopup({ content: 'Test' }) as IPopup;

      // WHEN setLngLat is called with coordinates
      const result = popup.setLngLat({ lng: 10, lat: 20 });

      // THEN method returns the popup for chaining
      expect(result).toBe(popup);
    });

    it('should delegate setHTML to underlying popup and return popup for chaining', () => {
      // GIVEN a created popup
      const popup = factory.createPopup({ content: 'Test' }) as IPopup;

      // WHEN setHTML is called
      const html = '<div>Test Content</div>';
      const result = popup.setHTML(html);

      // THEN method returns the popup for chaining
      expect(result).toBe(popup);
    });

    it('should delegate addTo to underlying popup when given map', () => {
      // GIVEN a created popup
      const popup = factory.createPopup({ content: 'Test' }) as IPopup;

      // WHEN addTo is called with map
      const result = popup.addTo(mockMap);

      // THEN addTo returns popup for chaining
      expect(result).toBe(popup);
    });

    it('should delegate remove to underlying popup', () => {
      // GIVEN a created popup added to map
      const popup = factory.createPopup({ content: 'Test' }) as IPopup;
      popup.addTo(mockMap);

      // WHEN remove is called
      popup.remove();

      // THEN no error is thrown
      expect(popup).toBeDefined();
    });
  });

  describe('popup chaining', () => {
    it('should support method chaining on setLngLat, setHTML, and addTo', () => {
      // GIVEN a created popup
      const popup = factory.createPopup({ content: 'Test' }) as IPopup;

      // WHEN setLngLat, setHTML, and addTo are chained
      const result = popup
        .setLngLat({ lng: 10, lat: 20 })
        .setHTML('<div>Test</div>')
        .addTo(mockMap);

      // THEN the chain returns the popup
      expect(result).toBe(popup);
    });
  });
});
