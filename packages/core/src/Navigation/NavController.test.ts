import '../_test_utilities/consoleMock';
import { NavController } from './NavController';
import { API, ValidationError } from '@gebeta/maps-api';

describe('NavController', () => {
  let mockLocationProvider: API.Platform.Types.ILocationProvider;
  const mockRoute: API.Routing.Types.RouteData = {
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 0],
        [1, 1],
      ],
    },
    origin: { lng: 0, lat: 0 },
    destination: { lng: 1, lat: 1 },
    instructions: [
      {
        coord: [0, 0],
        instruction: 'Start',
        length: 100000,
      },
      {
        coord: [1, 1],
        instruction: 'Arrive',
        length: 100000,
      },
    ],
  };

  beforeEach(() => {
    mockLocationProvider = {
      start: jest.fn(),
      stop: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should create instance with apiKey and options', () => {
      // GIVEN an API key and navigation options
      // WHEN creating a NavController instance
      const controller = new NavController('test-api-key', {
        offRouteThresholdMeters: 50,
      });
      // THEN it should create the instance successfully
      expect(controller).toBeInstanceOf(NavController);
    });
  });

  describe('start', () => {
    test('should throw ValidationError if route is invalid', () => {
      // GIVEN a NavController instance and an invalid route
      const controller = new NavController('test-api-key');
      // WHEN starting navigation with invalid route
      // THEN it should throw a ValidationError
      expect(() => {
        controller.start({} as unknown as API.Routing.Types.RouteData, { userId: 'test' }, mockLocationProvider);
      }).toThrow(ValidationError);
    });

    test('should throw ValidationError if userId is missing', () => {
      // GIVEN a NavController instance and a valid route but missing userId
      const controller = new NavController('test-api-key');
      // WHEN starting navigation without userId
      // THEN it should throw a ValidationError
      expect(() => {
        controller.start(mockRoute, {} as unknown as API.Navigation.Types.StartOptions, mockLocationProvider);
      }).toThrow(ValidationError);
    });

    test('should start navigation with valid route', () => {
      // GIVEN a NavController instance, valid route, and location provider
      const controller = new NavController('test-api-key');
      // WHEN starting navigation
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      // THEN it should start the location provider and be navigating
      expect(mockLocationProvider.start).toHaveBeenCalled();
      expect(controller.isNavigating()).toBe(true);
    });

    test('should emit start event', (done) => {
      // GIVEN a NavController instance with a start event listener
      const controller = new NavController('test-api-key');
      controller.on('start', (event) => {
        // THEN it should emit the start event with the route
        expect(event.route).toEqual(mockRoute);
        done();
      });
      // WHEN starting navigation
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
    });
  });

  describe('stop', () => {
    test('should stop navigation', () => {
      // GIVEN a NavController instance that is navigating
      const controller = new NavController('test-api-key');
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      // WHEN stopping navigation
      controller.stop();
      // THEN it should stop the location provider and no longer be navigating
      expect(mockLocationProvider.stop).toHaveBeenCalled();
      expect(controller.isNavigating()).toBe(false);
    });

    test('should emit stop event', (done) => {
      // GIVEN a NavController instance that is navigating with a stop listener
      const controller = new NavController('test-api-key');
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      controller.on('stop', () => {
        // THEN it should emit the stop event
        done();
      });
      // WHEN stopping navigation
      controller.stop();
    });
  });

  describe('getCurrentRoute', () => {
    test('should return current route when navigating', () => {
      // GIVEN a NavController instance that is navigating
      const controller = new NavController('test-api-key');
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      // WHEN getting the current route
      // THEN it should return the route
      expect(controller.getCurrentRoute()).toEqual(mockRoute);
    });

    test('should return null when not navigating', () => {
      // GIVEN a NavController instance that is not navigating
      const controller = new NavController('test-api-key');
      // WHEN getting the current route
      // THEN it should return null
      expect(controller.getCurrentRoute()).toBeNull();
    });
  });

  describe('getCurrentStepIndex', () => {
    test('should return current step index', () => {
      // GIVEN a NavController instance that is navigating
      const controller = new NavController('test-api-key');
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      // WHEN getting the current step index
      // THEN it should return a valid step index
      expect(controller.getCurrentStepIndex()).toBeGreaterThanOrEqual(0);
    });
  });
});
