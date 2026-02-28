import { MapAdapter } from './MapAdapter';
import { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/maps-api';

type EaseToOptions = API.Platform.Types.EaseToOptions;
type MapBounds = API.Platform.Types.MapBounds;

describe('MapAdapter', () => {
  let mockMap: MapLibreMap;
  let adapter: MapAdapter;

  beforeEach(() => {
    mockMap = new MapLibreMap({ container: 'map', style: 'test' } as never);
    adapter = new MapAdapter(mockMap);
  });

  describe('event handling', () => {
    it('should register event listeners via map.on', () => {
      // GIVEN a handler and spy on map.on
      const handler = jest.fn<void, unknown[]>();
      const onSpy = jest.spyOn(mockMap, 'on');

      // WHEN adapter.on is called with event and handler
      adapter.on('click', handler);

      // THEN map.on is called with the event name and the exact handler
      expect(onSpy).toHaveBeenCalledWith('click', handler);
    });

    it('should register once event listeners via map.once', () => {
      // GIVEN a handler and spy on map.once
      const handler = jest.fn<void, unknown[]>();
      const onceSpy = jest.spyOn(mockMap, 'once');

      // WHEN adapter.once is called
      adapter.once('load', handler);

      // THEN map.once is called with the event name and handler
      expect(onceSpy).toHaveBeenCalledWith('load', handler);
    });

    it('should remove event listeners via map.off', () => {
      // GIVEN a handler that was registered
      const handler = jest.fn<void, unknown[]>();
      adapter.on('click', handler);
      const offSpy = jest.spyOn(mockMap, 'off');

      // WHEN adapter.off is called with the same handler
      adapter.off('click', handler);

      // THEN map.off is called with the event name and handler
      expect(offSpy).toHaveBeenCalledWith('click', handler);
    });
  });

  describe('map properties', () => {
    it('should return container from map.getContainer', () => {
      // GIVEN a spy on map.getContainer
      const getContainerSpy = jest.spyOn(mockMap, 'getContainer');

      // WHEN getContainer is called
      const container = adapter.getContainer();

      // THEN map.getContainer is called and its return value is returned
      expect(getContainerSpy).toHaveBeenCalled();
      expect(container).toBe(getContainerSpy.mock.results[0].value);
    });

    it('should return bounds adapter wrapping map.getBounds', () => {
      // GIVEN the map returns bounds with getWest, getSouth, getEast, getNorth
      const getBoundsSpy = jest.spyOn(mockMap, 'getBounds');

      // WHEN getBounds is called
      const bounds = adapter.getBounds();

      // THEN map.getBounds is called and returned bounds expose the expected methods
      expect(getBoundsSpy).toHaveBeenCalled();
      expect(bounds.getWest()).toBe(0);
      expect(bounds.getSouth()).toBe(0);
      expect(bounds.getEast()).toBe(1);
      expect(bounds.getNorth()).toBe(1);
    });

    it('should return zoom from map.getZoom', () => {
      // GIVEN a spy on map.getZoom
      const getZoomSpy = jest.spyOn(mockMap, 'getZoom');

      // WHEN getZoom is called
      const zoom = adapter.getZoom();

      // THEN map.getZoom is called and its value is returned
      expect(getZoomSpy).toHaveBeenCalled();
      expect(zoom).toBe(10);
    });
  });

  describe('camera control', () => {
    it('should call map.easeTo with all options when provided', () => {
      // GIVEN easeTo options with center, zoom, pitch, bearing, duration
      const easeToSpy = jest.spyOn(mockMap, 'easeTo');
      const options: EaseToOptions = {
        center: [0, 0],
        zoom: 10,
        pitch: 45,
        bearing: 90,
        duration: 1000,
      };

      // WHEN adapter.easeTo is called with full options
      adapter.easeTo(options);

      // THEN map.easeTo is called with the exact options
      expect(easeToSpy).toHaveBeenCalledWith({
        center: [0, 0],
        zoom: 10,
        pitch: 45,
        bearing: 90,
        duration: 1000,
      });
    });

    it('should call map.easeTo with only center and zoom when minimal options provided', () => {
      // GIVEN minimal easeTo options
      const easeToSpy = jest.spyOn(mockMap, 'easeTo');
      const options: EaseToOptions = {
        center: [10, 20],
        zoom: 15,
      };

      // WHEN adapter.easeTo is called with minimal options
      adapter.easeTo(options);

      // THEN map.easeTo is called with only center and zoom
      expect(easeToSpy).toHaveBeenCalledWith({
        center: [10, 20],
        zoom: 15,
      });
    });
  });

  describe('style management', () => {
    it('should delegate isStyleLoaded to map', () => {
      // GIVEN a spy on map.isStyleLoaded
      const isStyleLoadedSpy = jest.spyOn(mockMap, 'isStyleLoaded');

      // WHEN isStyleLoaded is called
      const loaded = adapter.isStyleLoaded();

      // THEN map.isStyleLoaded is called and its value is returned
      expect(isStyleLoadedSpy).toHaveBeenCalled();
      expect(loaded).toBe(true);
    });

    it('should return style with layers from map.getStyle', () => {
      // GIVEN map.getStyle returns an object with layers
      const getStyleSpy = jest.spyOn(mockMap, 'getStyle');

      // WHEN getStyle is called
      const style = adapter.getStyle();

      // THEN map.getStyle is called and result has layers array
      expect(getStyleSpy).toHaveBeenCalled();
      expect(style).toEqual({ layers: [] });
    });

    it('should call map.setStyle with string URL', () => {
      // GIVEN a style URL string
      const setStyleSpy = jest.spyOn(mockMap, 'setStyle');
      const styleUrl = 'mapbox://styles/test';

      // WHEN setStyle is called with string
      adapter.setStyle(styleUrl);

      // THEN map.setStyle is called with the exact string
      expect(setStyleSpy).toHaveBeenCalledWith(styleUrl);
    });

    it('should call map.setStyle with style object', () => {
      // GIVEN a style object
      const setStyleSpy = jest.spyOn(mockMap, 'setStyle');
      const styleObj = { version: 8, sources: {}, layers: [] };

      // WHEN setStyle is called with object
      adapter.setStyle(styleObj);

      // THEN map.setStyle is called with the exact object
      expect(setStyleSpy).toHaveBeenCalledWith(styleObj);
    });
  });

  describe('source management', () => {
    it('should call map.addSource with id and spec', () => {
      // GIVEN a source id and spec
      const addSourceSpy = jest.spyOn(mockMap, 'addSource');
      const sourceId = 'test-source';
      const sourceSpec = { type: 'geojson', data: { type: 'FeatureCollection', features: [] } };

      // WHEN addSource is called
      adapter.addSource(sourceId, sourceSpec);

      // THEN map.addSource is called with id and spec
      expect(addSourceSpy).toHaveBeenCalledWith(sourceId, sourceSpec);
    });

    it('should call map.getSource with id', () => {
      // GIVEN a source id
      const getSourceSpy = jest.spyOn(mockMap, 'getSource');
      const sourceId = 'test-source';

      // WHEN getSource is called
      adapter.getSource(sourceId);

      // THEN map.getSource is called with the id
      expect(getSourceSpy).toHaveBeenCalledWith(sourceId);
    });

    it('should call map.removeSource with id', () => {
      // GIVEN a source id
      const removeSourceSpy = jest.spyOn(mockMap, 'removeSource');
      const sourceId = 'test-source';

      // WHEN removeSource is called
      adapter.removeSource(sourceId);

      // THEN map.removeSource is called with the id
      expect(removeSourceSpy).toHaveBeenCalledWith(sourceId);
    });
  });

  describe('layer management', () => {
    it('should call map.addLayer with spec and undefined beforeId when not provided', () => {
      // GIVEN a layer spec without beforeId
      const addLayerSpy = jest.spyOn(mockMap, 'addLayer');
      const layerSpec = { id: 'test-layer', type: 'line', source: 'test-source' };

      // WHEN addLayer is called without beforeId
      adapter.addLayer(layerSpec);

      // THEN map.addLayer is called with spec and undefined
      expect(addLayerSpy).toHaveBeenCalledWith(layerSpec, undefined);
    });

    it('should call map.addLayer with spec and beforeId when provided', () => {
      // GIVEN a layer spec and beforeId
      const addLayerSpy = jest.spyOn(mockMap, 'addLayer');
      const layerSpec = { id: 'test-layer', type: 'line', source: 'test-source' };
      const beforeId = 'before-layer';

      // WHEN addLayer is called with beforeId
      adapter.addLayer(layerSpec, beforeId);

      // THEN map.addLayer is called with spec and beforeId
      expect(addLayerSpy).toHaveBeenCalledWith(layerSpec, beforeId);
    });

    it('should call map.removeLayer with layer id', () => {
      // GIVEN a layer id
      const removeLayerSpy = jest.spyOn(mockMap, 'removeLayer');
      const layerId = 'test-layer';

      // WHEN removeLayer is called
      adapter.removeLayer(layerId);

      // THEN map.removeLayer is called with the id
      expect(removeLayerSpy).toHaveBeenCalledWith(layerId);
    });
  });

  describe('layer properties', () => {
    it('should call map.setPaintProperty with layer, name, and value', () => {
      // GIVEN layer id, property name, and value
      const setPaintPropertySpy = jest.spyOn(mockMap, 'setPaintProperty');
      const layerId = 'test-layer';
      const propertyName = 'line-color';
      const value = '#ff0000';

      // WHEN setPaintProperty is called
      adapter.setPaintProperty(layerId, propertyName, value);

      // THEN map.setPaintProperty is called with exact args
      expect(setPaintPropertySpy).toHaveBeenCalledWith(layerId, propertyName, value);
    });

    it('should call map.setLayoutProperty with layer, name, and value', () => {
      // GIVEN layer id, property name, and value
      const setLayoutPropertySpy = jest.spyOn(mockMap, 'setLayoutProperty');
      const layerId = 'test-layer';
      const propertyName = 'visibility';
      const value = 'visible';

      // WHEN setLayoutProperty is called
      adapter.setLayoutProperty(layerId, propertyName, value);

      // THEN map.setLayoutProperty is called with exact args
      expect(setLayoutPropertySpy).toHaveBeenCalledWith(layerId, propertyName, value);
    });
  });

  describe('bounds fitting', () => {
    it('should call map.fitBounds with LngLatBounds built from bounds and no options when options omitted', () => {
      // GIVEN bounds and spy on map.fitBounds
      const fitBoundsSpy = jest.spyOn(mockMap, 'fitBounds');
      const bounds: MapBounds = {
        getWest: () => 0,
        getSouth: () => 0,
        getEast: () => 1,
        getNorth: () => 1,
      };

      // WHEN fitBounds is called without options
      adapter.fitBounds(bounds);

      // THEN fitBounds is called with bounds that had extend called with [0,0] and [1,1]
      expect(fitBoundsSpy).toHaveBeenCalledTimes(1);
      const passedBounds = fitBoundsSpy.mock.calls[0][0] as unknown as {
        extendedPoints: [number, number][];
      };
      expect(passedBounds.extendedPoints).toEqual([
        [0, 0],
        [1, 1],
      ]);
      expect(fitBoundsSpy.mock.calls[0][1]).toBeUndefined();
    });

    it('should call map.fitBounds with bounds and options when provided', () => {
      // GIVEN bounds and options
      const fitBoundsSpy = jest.spyOn(mockMap, 'fitBounds');
      const bounds: MapBounds = {
        getWest: () => 0,
        getSouth: () => 0,
        getEast: () => 1,
        getNorth: () => 1,
      };
      const options = { padding: 50, duration: 1000 };

      // WHEN fitBounds is called with options
      adapter.fitBounds(bounds, options);

      // THEN fitBounds is called with bounds and exact options
      expect(fitBoundsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ extendedPoints: expect.any(Array) }),
        options
      );
      expect(fitBoundsSpy.mock.calls[0][1]).toEqual({ padding: 50, duration: 1000 });
    });
  });

  describe('resize', () => {
    it('should call map.resize when resize is invoked', () => {
      // GIVEN a spy on map.resize
      const resizeSpy = jest.spyOn(mockMap, 'resize');

      // WHEN adapter.resize is called
      adapter.resize();

      // THEN map.resize is called
      expect(resizeSpy).toHaveBeenCalled();
    });
  });
});
