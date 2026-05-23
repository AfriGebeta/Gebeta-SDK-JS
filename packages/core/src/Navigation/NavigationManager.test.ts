import '../_test_utilities/consoleMock';
import { NavigationManager } from './NavigationManager';
import { API, ValidationError } from '@gebeta/api';

describe('NavigationManager', () => {
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

    global.WebSocket = jest.fn().mockImplementation(() => {
      const ws = {
        onopen: null as ((event: Event) => void) | null,
        onclose: null as ((event: CloseEvent) => void) | null,
        onerror: null as ((event: Event) => void) | null,
        onmessage: null as ((event: MessageEvent) => void) | null,
        readyState: 0 as number,
        send: jest.fn(),
        close: jest.fn(),
      };
      setTimeout(() => {
        (ws as { readyState: number }).readyState = 1;
        if (ws.onopen) {
          ws.onopen(new Event('open'));
        }
      }, 0);
      return ws as unknown as WebSocket;
    }) as unknown as typeof WebSocket;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should create instance with apiKey and options', () => {
      // GIVEN an API key and navigation options
      // WHEN creating a NavigationManager instance
      const controller = new NavigationManager('test-api-key', {
        offRouteThresholdMeters: 50,
      });
      // THEN it should create the instance successfully
      expect(controller).toBeInstanceOf(NavigationManager);
    });
  });

  describe('start', () => {
    test('should throw ValidationError if route is invalid', () => {
      // GIVEN a NavigationManager instance and an invalid route
      const controller = new NavigationManager('test-api-key');
      // WHEN starting navigation with invalid route
      // THEN it should throw a ValidationError
      expect(() => {
        controller.start(
          {} as unknown as API.Routing.Types.RouteData,
          { userId: 'test' },
          mockLocationProvider
        );
      }).toThrow(ValidationError);
    });

    test('should throw ValidationError if userId is missing', () => {
      // GIVEN a NavigationManager instance and a valid route but missing userId
      const controller = new NavigationManager('test-api-key');
      // WHEN starting navigation without userId
      // THEN it should throw a ValidationError
      expect(() => {
        controller.start(
          mockRoute,
          {} as unknown as API.Navigation.Types.StartOptions,
          mockLocationProvider
        );
      }).toThrow(ValidationError);
    });

    test('should start navigation with valid route', () => {
      // GIVEN a NavigationManager instance, valid route, and location provider
      const controller = new NavigationManager('test-api-key');
      // WHEN starting navigation
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      // THEN it should start the location provider and be navigating
      expect(mockLocationProvider.start).toHaveBeenCalled();
      expect(controller.isNavigating()).toBe(true);
      controller.stop();
    });

    test('should emit start event', done => {
      // GIVEN a NavigationManager instance with a start event listener
      const controller = new NavigationManager('test-api-key');
      controller.on('start', event => {
        // THEN it should emit the start event with the route
        expect(event.route).toEqual(mockRoute);
        controller.stop();
        done();
      });
      // WHEN starting navigation
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
    });
  });

  describe('stop', () => {
    test('should stop navigation', () => {
      // GIVEN a NavigationManager instance that is navigating
      const controller = new NavigationManager('test-api-key');
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      // WHEN stopping navigation
      controller.stop();
      // THEN it should stop the location provider and no longer be navigating
      expect(mockLocationProvider.stop).toHaveBeenCalled();
      expect(controller.isNavigating()).toBe(false);
    });

    test('should emit stop event', done => {
      // GIVEN a NavigationManager instance that is navigating with a stop listener
      const controller = new NavigationManager('test-api-key');
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
      // GIVEN a NavigationManager instance that is navigating
      const controller = new NavigationManager('test-api-key');
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      // WHEN getting the current route
      // THEN it should return the route
      expect(controller.getCurrentRoute()).toEqual(mockRoute);
      controller.stop();
    });

    test('should return null when not navigating', () => {
      // GIVEN a NavigationManager instance that is not navigating
      const controller = new NavigationManager('test-api-key');
      // WHEN getting the current route
      // THEN it should return null
      expect(controller.getCurrentRoute()).toBeNull();
    });
  });

  describe('getCurrentStepIndex', () => {
    test('should return current step index', () => {
      // GIVEN a NavigationManager instance that is navigating
      const controller = new NavigationManager('test-api-key');
      controller.start(mockRoute, { userId: 'test-user' }, mockLocationProvider);
      // WHEN getting the current step index
      // THEN it should return a valid step index
      expect(controller.getCurrentStepIndex()).toBeGreaterThanOrEqual(0);
      controller.stop();
    });
  });
});
