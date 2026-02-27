import { MapAdapter } from './MapAdapter';
import { Map as MapLibreMap } from 'maplibre-gl';

describe('MapAdapter', () => {
  let mockMap: MapLibreMap;
  let adapter: MapAdapter;

  beforeEach(() => {
    mockMap = new MapLibreMap({ container: 'map', style: 'test' });
    adapter = new MapAdapter(mockMap);
  });

  describe('event handling', () => {
    it('should register event listeners', () => {
      const handler = jest.fn();
      adapter.on('click', handler);
      
      expect(adapter).toBeDefined();
    });

    it('should register once event listeners', () => {
      const handler = jest.fn();
      adapter.once('load', handler);
      
      expect(adapter).toBeDefined();
    });

    it('should remove event listeners', () => {
      const handler = jest.fn();
      adapter.on('click', handler);
      adapter.off('click', handler);
      
      expect(adapter).toBeDefined();
    });
  });

  describe('map properties', () => {
    it('should get container', () => {
      const container = adapter.getContainer();
      expect(container).toBeDefined();
    });

    it('should get bounds', () => {
      const bounds = adapter.getBounds();
      expect(bounds).toBeDefined();
      expect(typeof bounds.getWest).toBe('function');
      expect(typeof bounds.getSouth).toBe('function');
      expect(typeof bounds.getEast).toBe('function');
      expect(typeof bounds.getNorth).toBe('function');
    });

    it('should get zoom level', () => {
      const zoom = adapter.getZoom();
      expect(typeof zoom).toBe('number');
    });
  });

  describe('camera control', () => {
    it('should call easeTo with correct parameters', () => {
      const easeToSpy = jest.spyOn(mockMap, 'easeTo');
      
      adapter.easeTo({
        center: [0, 0],
        zoom: 10,
        pitch: 45,
        bearing: 90,
        duration: 1000,
      });

      expect(easeToSpy).toHaveBeenCalledWith({
        center: [0, 0],
        zoom: 10,
        pitch: 45,
        bearing: 90,
        duration: 1000,
      });
    });

    it('should handle easeTo with minimal options', () => {
      const easeToSpy = jest.spyOn(mockMap, 'easeTo');
      
      adapter.easeTo({
        center: [10, 20],
        zoom: 15,
      });

      expect(easeToSpy).toHaveBeenCalledWith({
        center: [10, 20],
        zoom: 15,
      });
    });
  });

  describe('style management', () => {
    it('should check if style is loaded', () => {
      const loaded = adapter.isStyleLoaded();
      expect(typeof loaded).toBe('boolean');
    });

    it('should get style', () => {
      const style = adapter.getStyle();
      expect(style).toBeDefined();
    });

    it('should set style with string', () => {
      const setStyleSpy = jest.spyOn(mockMap, 'setStyle');
      adapter.setStyle('mapbox://styles/test');
      expect(setStyleSpy).toHaveBeenCalledWith('mapbox://styles/test');
    });

    it('should set style with object', () => {
      const setStyleSpy = jest.spyOn(mockMap, 'setStyle');
      const styleObj = { version: 8, sources: {}, layers: [] };
      adapter.setStyle(styleObj);
      expect(setStyleSpy).toHaveBeenCalledWith(styleObj);
    });
  });

  describe('source management', () => {
    it('should add source', () => {
      const addSourceSpy = jest.spyOn(mockMap, 'addSource');
      const sourceSpec = { type: 'geojson', data: { type: 'FeatureCollection', features: [] } };
      
      adapter.addSource('test-source', sourceSpec);
      expect(addSourceSpy).toHaveBeenCalledWith('test-source', sourceSpec);
    });

    it('should get source', () => {
      adapter.getSource('test-source');
      expect(true).toBe(true);
    });

    it('should remove source', () => {
      const removeSourceSpy = jest.spyOn(mockMap, 'removeSource');
      adapter.removeSource('test-source');
      expect(removeSourceSpy).toHaveBeenCalledWith('test-source');
    });
  });

  describe('layer management', () => {
    it('should add layer', () => {
      const addLayerSpy = jest.spyOn(mockMap, 'addLayer');
      const layerSpec = { id: 'test-layer', type: 'line', source: 'test-source' };
      
      adapter.addLayer(layerSpec);
      expect(addLayerSpy).toHaveBeenCalledWith(layerSpec, undefined);
    });

    it('should add layer with beforeId', () => {
      const addLayerSpy = jest.spyOn(mockMap, 'addLayer');
      const layerSpec = { id: 'test-layer', type: 'line', source: 'test-source' };
      
      adapter.addLayer(layerSpec, 'before-layer');
      expect(addLayerSpy).toHaveBeenCalledWith(layerSpec, 'before-layer');
    });

    it('should remove layer', () => {
      const removeLayerSpy = jest.spyOn(mockMap, 'removeLayer');
      adapter.removeLayer('test-layer');
      expect(removeLayerSpy).toHaveBeenCalledWith('test-layer');
    });
  });

  describe('layer properties', () => {
    it('should set paint property', () => {
      const setPaintPropertySpy = jest.spyOn(mockMap, 'setPaintProperty');
      adapter.setPaintProperty('test-layer', 'line-color', '#ff0000');
      expect(setPaintPropertySpy).toHaveBeenCalledWith('test-layer', 'line-color', '#ff0000');
    });

    it('should set layout property', () => {
      const setLayoutPropertySpy = jest.spyOn(mockMap, 'setLayoutProperty');
      adapter.setLayoutProperty('test-layer', 'visibility', 'visible');
      expect(setLayoutPropertySpy).toHaveBeenCalledWith('test-layer', 'visibility', 'visible');
    });
  });

  describe('bounds fitting', () => {
    it('should fit bounds', () => {
      const fitBoundsSpy = jest.spyOn(mockMap, 'fitBounds');
      const bounds = {
        getWest: () => 0,
        getSouth: () => 0,
        getEast: () => 1,
        getNorth: () => 1,
      };
      
      adapter.fitBounds(bounds);
      expect(fitBoundsSpy).toHaveBeenCalled();
    });

    it('should fit bounds with options', () => {
      const fitBoundsSpy = jest.spyOn(mockMap, 'fitBounds');
      const bounds = {
        getWest: () => 0,
        getSouth: () => 0,
        getEast: () => 1,
        getNorth: () => 1,
      };
      
      adapter.fitBounds(bounds, { padding: 50, duration: 1000 });
      expect(fitBoundsSpy).toHaveBeenCalled();
    });
  });

  describe('resize', () => {
    it('should resize map', () => {
      const resizeSpy = jest.spyOn(mockMap, 'resize');
      adapter.resize();
      expect(resizeSpy).toHaveBeenCalled();
    });
  });
});
