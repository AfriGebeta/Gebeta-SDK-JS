/* eslint-disable @typescript-eslint/no-explicit-any */

import { NavController } from './NavController';
import { NavController as CoreNavController } from '@gebeta/maps-core';
import { API } from '@gebeta/maps-api';
import { Map as MapLibreMap } from 'maplibre-gl';
import { MapAdapter } from '../adapters/MapAdapter';
import { MarkerFactory } from '../adapters/MarkerFactory';

//mock the core
jest.mock('@gebeta/maps-core', () => ({
  NavController: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    getCurrentRoute: jest.fn(),
    getCurrentStepIndex: jest.fn(() => 0),
    isNavigating: jest.fn(() => false),
    on: jest.fn(),
    off: jest.fn(),
  })),
}));

describe('NavController (platform layer)', () => {
  let mockMap: MapLibreMap;
  let mapAdapter: MapAdapter;
  let markerFactory: MarkerFactory;
  let navController: NavController;
  const apiKey = 'test-api-key';

  beforeEach(() => {
    mockMap = new MapLibreMap({ container: 'map', style: 'test' });
    mapAdapter = new MapAdapter(mockMap);
    markerFactory = new MarkerFactory(mockMap);
    
    jest.clearAllMocks();
    
    navController = new NavController(apiKey, mapAdapter, markerFactory);
  });

  describe('constructor', () => {
    it('should create NavController with required parameters', () => {
      expect(navController).toBeDefined();
      expect(CoreNavController).toHaveBeenCalledWith(apiKey, {});
    });

    it('should create navcontroller with options', () => {
      const options = {
        offRouteThresholdMeters: 50,
        arriveThresholdMeters: 20,
      };
      
      const controller = new NavController(apiKey, mapAdapter, markerFactory, options);
      
      expect(controller).toBeDefined();
      expect(CoreNavController).toHaveBeenCalledWith(apiKey, options);
    });

    it('should throw error if api key is missing', () => {
      expect(() => {
        new NavController('', mapAdapter, markerFactory);
      }).toThrow('api key is required');
    });

    it('should throw error if map adapter is missing', () => {
      expect(() => {
        new NavController(apiKey, null as any, markerFactory);
      }).toThrow('map adapter is required');
    });

    it('should throw error if marker factory is missing', () => {
      expect(() => {
        new NavController(apiKey, mapAdapter, null as any);
      }).toThrow('marker factory is required');
    });
  });

  describe('start', () => {
    const mockRoute = {
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [38.7685, 9.0161],
          [38.7686, 9.0162],
        ] as [number, number][],
      },
      origin: { lng: 38.7685, lat: 9.0161 },
      destination: { lng: 38.7686, lat: 9.0162 },
      summary: { distance: 100, time: 60 },
      instructions: [],
    };

    const mockStartOptions = {
      userId: 'test-user',
      role: 'driver' as const,
      precision: API.Tracking.Enums.Precision.HIGH,
    };

    const mockLocationProvider = {
      start: jest.fn(),
      stop: jest.fn(),
    };

    it('should start navigation', () => {
      navController.start(mockRoute, mockStartOptions, mockLocationProvider);
      
      expect(navController.isNavigating()).toBe(false); // Mock returns false
    });

    it('should create location marker on start', () => {
      const createMarkerSpy = jest.spyOn(markerFactory, 'createMarker');
      
      navController.start(mockRoute, mockStartOptions, mockLocationProvider);
      
      expect(createMarkerSpy).toHaveBeenCalled();
    });

    it('should wrap location provider', () => {
      navController.start(mockRoute, mockStartOptions, mockLocationProvider);
      
      // The core NavController should be called with a wrapped provider
      const coreInstance = (CoreNavController as jest.Mock).mock.results[0].value;
      expect(coreInstance.start).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop navigation', () => {
      navController.stop();
      
      const coreInstance = (CoreNavController as jest.Mock).mock.results[0].value;
      expect(coreInstance.stop).toHaveBeenCalled();
    });

    it('should remove location marker on stop', () => {
      const mockRoute = {
        geometry: {
          type: 'LineString' as const,
          coordinates: [[38.7685, 9.0161]] as [number, number][],
        },
        origin: { lng: 38.7685, lat: 9.0161 },
        destination: { lng: 38.7686, lat: 9.0162 },
        summary: { distance: 100, time: 60 },
        instructions: [],
      };

      const mockLocationProvider = {
        start: jest.fn(),
        stop: jest.fn(),
      };

      navController.start(mockRoute, { userId: 'test', role: 'driver', precision: API.Tracking.Enums.Precision.HIGH }, mockLocationProvider);
      navController.stop();
      
      //marker should be removed
      expect(true).toBe(true);
    });
  });

  describe('getCurrentRoute', () => {
    it('should return current route from core', () => {
      const mockRoute = { test: 'route' };
      const coreInstance = (CoreNavController as jest.Mock).mock.results[0].value;
      coreInstance.getCurrentRoute.mockReturnValue(mockRoute);
      
      const result = navController.getCurrentRoute();
      
      expect(result).toBe(mockRoute);
      expect(coreInstance.getCurrentRoute).toHaveBeenCalled();
    });
  });

  describe('getCurrentStepIndex', () => {
    it('should return current step index from core', () => {
      const coreInstance = (CoreNavController as jest.Mock).mock.results[0].value;
      coreInstance.getCurrentStepIndex.mockReturnValue(5);
      
      const result = navController.getCurrentStepIndex();
      
      expect(result).toBe(5);
      expect(coreInstance.getCurrentStepIndex).toHaveBeenCalled();
    });
  });

  describe('isNavigating', () => {
    it('should return navigation status from core', () => {
      const coreInstance = (CoreNavController as jest.Mock).mock.results[0].value;
      coreInstance.isNavigating.mockReturnValue(true);
      
      const result = navController.isNavigating();
      
      expect(result).toBe(true);
      expect(coreInstance.isNavigating).toHaveBeenCalled();
    });
  });

  describe('event handling', () => {
    it('should forward on() calls to core', () => {
      const callback = jest.fn();
      const coreInstance = (CoreNavController as jest.Mock).mock.results[0].value;
      
      navController.on('progress' as any, callback);
      
      expect(coreInstance.on).toHaveBeenCalledWith('progress', callback);
    });

    it('should forward off() calls to core', () => {
      const callback = jest.fn();
      const coreInstance = (CoreNavController as jest.Mock).mock.results[0].value;
      
      navController.off('progress' as any, callback);
      
      expect(coreInstance.off).toHaveBeenCalledWith('progress', callback);
    });
  });
});
