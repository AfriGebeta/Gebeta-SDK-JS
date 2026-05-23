import { NavigationManager } from './NavigationManager';
import { NavigationManager as CoreNavigationManager } from '@gebeta/core';
import { API, ValidationError } from '@gebeta/api';
import { Map as MapLibreMap } from 'maplibre-gl';
import { MapAdapter, MarkerFactory } from '../adapters';

type RouteData = API.Routing.Types.RouteData;
type NavigationStartOptions = API.Navigation.Types.StartOptions;

const mockCoreInstance = {
  start: jest.fn(),
  stop: jest.fn(),
  getCurrentRoute: jest.fn(),
  getCurrentStepIndex: jest.fn(() => 0),
  isNavigating: jest.fn(() => false),
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock('@gebeta/core', () => ({
  NavigationManager: jest.fn().mockImplementation(() => mockCoreInstance),
}));

describe('NavigationManager (platform layer)', () => {
  let mockMap: MapLibreMap;
  let mapAdapter: MapAdapter;
  let markerFactory: MarkerFactory;
  let navController: NavigationManager;
  const apiKey = 'test-api-key';

  const mockRoute: RouteData = {
    geometry: {
      type: 'LineString',
      coordinates: [
        [38.7685, 9.0161],
        [38.7686, 9.0162],
      ],
    },
    origin: { lng: 38.7685, lat: 9.0161 },
    destination: { lng: 38.7686, lat: 9.0162 },
    summary: { distance: 100, time: 60 },
    instructions: [],
  };

  const mockStartOptions: NavigationStartOptions = {
    userId: 'test-user',
    role: 'driver',
    precision: API.Tracking.Enums.Precision.HIGH,
  };

  const mockLocationProvider: API.Platform.Types.ILocationProvider = {
    start: jest.fn(),
    stop: jest.fn(),
  };

  beforeEach(() => {
    mockMap = new MapLibreMap({ container: 'map', style: 'test' } as never);
    mapAdapter = new MapAdapter(mockMap);
    markerFactory = new MarkerFactory(mockMap);

    jest.clearAllMocks();
    mockCoreInstance.getCurrentStepIndex.mockReturnValue(0);
    mockCoreInstance.isNavigating.mockReturnValue(false);

    navController = new NavigationManager(apiKey, mapAdapter, markerFactory);
  });

  describe('constructor', () => {
    it('should create NavigationManager with required parameters', () => {
      // GIVEN valid apiKey, mapAdapter, markerFactory
      // WHEN NavigationManager is constructed
      const controller = new NavigationManager(apiKey, mapAdapter, markerFactory);

      // THEN controller is defined and CoreNavigationManager was called with apiKey and empty options
      expect(controller).toBeDefined();
      expect(CoreNavigationManager).toHaveBeenCalledWith(apiKey, {});
    });

    it('should create NavigationManager with options', () => {
      // GIVEN options for offRouteThresholdMeters and arriveThresholdMeters
      const options: API.Navigation.Types.ManagerOptions = {
        offRouteThresholdMeters: 50,
        arriveThresholdMeters: 20,
      };

      // WHEN NavigationManager is constructed with options
      const controller = new NavigationManager(apiKey, mapAdapter, markerFactory, options);

      // THEN controller is defined and CoreNavigationManager was called with apiKey and options
      expect(controller).toBeDefined();
      expect(CoreNavigationManager).toHaveBeenCalledWith(apiKey, options);
    });

    it('should throw ValidationError if mapAdapter is missing', () => {
      // GIVEN null mapAdapter
      // WHEN NavigationManager is constructed with null mapAdapter
      // THEN ValidationError is thrown with correct message
      expect(() =>
        new NavigationManager(apiKey, null as unknown as API.Platform.Types.IMapAdapter, markerFactory)
      ).toThrow(ValidationError);
      expect(() =>
        new NavigationManager(apiKey, null as unknown as API.Platform.Types.IMapAdapter, markerFactory)
      ).toThrow('Map adapter is required for NavigationManager');
    });

    it('should throw ValidationError if markerFactory is missing', () => {
      // GIVEN null markerFactory
      // WHEN NavigationManager is constructed with null markerFactory
      // THEN ValidationError is thrown with correct message
      expect(() =>
        new NavigationManager(apiKey, mapAdapter, null as unknown as API.Platform.Types.IMarkerFactory)
      ).toThrow(ValidationError);
      expect(() =>
        new NavigationManager(apiKey, mapAdapter, null as unknown as API.Platform.Types.IMarkerFactory)
      ).toThrow('Marker factory is required for NavigationManager');
    });
  });

  describe('start', () => {
    it('should delegate to core.start with route, options, and wrapped location provider', () => {
      // GIVEN route, startOptions, and locationProvider
      // WHEN start is called
      navController.start(mockRoute, mockStartOptions, mockLocationProvider);

      // THEN core.start was called with route, options, and wrapped provider (has start and stop)
      expect(mockCoreInstance.start).toHaveBeenCalledTimes(1);
      const [routeArg, optionsArg, wrappedProviderArg] = mockCoreInstance.start.mock.calls[0];
      expect(routeArg).toBe(mockRoute);
      expect(optionsArg).toBe(mockStartOptions);
      expect(wrappedProviderArg).toHaveProperty('start');
      expect(wrappedProviderArg).toHaveProperty('stop');
      expect(typeof wrappedProviderArg.start).toBe('function');
      expect(typeof wrappedProviderArg.stop).toBe('function');
    });

    it('should create location marker with expected options on start', () => {
      // GIVEN spy on markerFactory.createMarker
      const createMarkerSpy = jest.spyOn(markerFactory, 'createMarker');

      // WHEN start is called
      navController.start(mockRoute, mockStartOptions, mockLocationProvider);

      // THEN createMarker was called with className and size
      expect(createMarkerSpy).toHaveBeenCalledWith({
        className: 'gebeta-navigation-location-marker',
        size: [20, 20],
      });
    });

    it('should invoke locationProvider.start when wrapped provider start is called', () => {
      // GIVEN start was called to obtain wrapped provider
      navController.start(mockRoute, mockStartOptions, mockLocationProvider);
      const wrappedProvider = mockCoreInstance.start.mock.calls[0][2];
      const onLocationCallback = jest.fn<void, [API.Platform.Types.LocationData]>();

      // WHEN wrapped provider start is called with a callback
      wrappedProvider.start(onLocationCallback);

      // THEN locationProvider.start was called and the passed callback forwards to onLocationCallback
      expect(mockLocationProvider.start).toHaveBeenCalledTimes(1);
      const innerCallback = (mockLocationProvider.start as jest.Mock).mock.calls[0][0] as (
        loc: API.Platform.Types.LocationData
      ) => void;
      innerCallback({ lng: 38.77, lat: 9.02, timestamp: 123 });
      expect(onLocationCallback).toHaveBeenCalledWith({ lng: 38.77, lat: 9.02, timestamp: 123 });
    });
  });

  describe('stop', () => {
    it('should delegate to core.stop', () => {
      // GIVEN NavigationManager
      // WHEN stop is called
      navController.stop();

      // THEN core.stop was called
      expect(mockCoreInstance.stop).toHaveBeenCalled();
    });

    it('should remove location marker on stop', () => {
      // GIVEN createMarker returns a marker with spyable remove; start was called
      const mockRemove = jest.fn();
      jest.spyOn(markerFactory, 'createMarker').mockReturnValue({
        setLngLat: jest.fn(),
        addTo: jest.fn(),
        remove: mockRemove,
        getElement: jest.fn(),
      } as unknown as API.Platform.Types.IMarker);

      navController.start(mockRoute, mockStartOptions, mockLocationProvider);

      // WHEN stop is called
      navController.stop();

      // THEN marker remove was called
      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe('getCurrentRoute', () => {
    it('should return current route from core', () => {
      // GIVEN core.getCurrentRoute returns a mock route
      const mockRouteResult = { test: 'route' } as unknown as RouteData;
      mockCoreInstance.getCurrentRoute.mockReturnValue(mockRouteResult);

      // WHEN getCurrentRoute is called
      const result = navController.getCurrentRoute();

      // THEN result equals core return value and core was called
      expect(result).toBe(mockRouteResult);
      expect(mockCoreInstance.getCurrentRoute).toHaveBeenCalled();
    });
  });

  describe('getCurrentStepIndex', () => {
    it('should return current step index from core', () => {
      // GIVEN core.getCurrentStepIndex returns 5
      mockCoreInstance.getCurrentStepIndex.mockReturnValue(5);

      // WHEN getCurrentStepIndex is called
      const result = navController.getCurrentStepIndex();

      // THEN result is 5 and core was called
      expect(result).toBe(5);
      expect(mockCoreInstance.getCurrentStepIndex).toHaveBeenCalled();
    });
  });

  describe('isNavigating', () => {
    it('should return navigation status from core', () => {
      // GIVEN core.isNavigating returns true
      mockCoreInstance.isNavigating.mockReturnValue(true);

      // WHEN isNavigating is called
      const result = navController.isNavigating();

      // THEN result is true and core was called
      expect(result).toBe(true);
      expect(mockCoreInstance.isNavigating).toHaveBeenCalled();
    });
  });

  describe('event handling', () => {
    it('should forward on() to core with event and callback', () => {
      // GIVEN event name and callback
      const callback = jest.fn<void, [API.Navigation.Events.ProgressEvent]>();
      const event = 'progress' as Parameters<CoreNavigationManager['on']>[0];

      // WHEN on is called
      navController.on(event, callback);

      // THEN core.on was called with event and callback
      expect(mockCoreInstance.on).toHaveBeenCalledWith('progress', callback);
    });

    it('should forward off() to core with event and callback', () => {
      // GIVEN event name and callback
      const callback = jest.fn<void, [API.Navigation.Events.ProgressEvent]>();
      const event = 'progress' as Parameters<CoreNavigationManager['off']>[0];

      // WHEN off is called
      navController.off(event, callback);

      // THEN core.off was called with event and callback
      expect(mockCoreInstance.off).toHaveBeenCalledWith('progress', callback);
    });
  });
});
