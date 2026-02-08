import '../_test_utilities/consoleMock';
import { TrackingClient } from './TrackingClient';
import { API, ValidationError } from '@gebeta/maps-api';

describe('TrackingClient', () => {
  let mockLocationProvider: API.Platform.Types.ILocationProvider;
  let locationCallback: ((location: API.Platform.Types.LocationData) => void) | null = null;

  beforeEach(() => {
    locationCallback = null;
    mockLocationProvider = {
      start: jest.fn(callback => {
        locationCallback = callback;
      }),
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
    test('should throw ValidationError if userId is missing', () => {
      // GIVEN invalid options without userId
      // WHEN creating a TrackingClient instance
      // THEN it should throw a ValidationError
      expect(() => {
        new TrackingClient({} as unknown as API.Tracking.Types.ClientOptions);
      }).toThrow(ValidationError);
    });

    test('should create instance with valid options', () => {
      // GIVEN valid options with userId and role
      // WHEN creating a TrackingClient instance
      const client = new TrackingClient({
        userId: 'test-user',
        role: 'driver',
      });
      // THEN it should create the instance successfully
      expect(client).toBeInstanceOf(TrackingClient);
    });

    test('should use default values for optional options', () => {
      // GIVEN options with only userId
      // WHEN creating a TrackingClient instance
      const client = new TrackingClient({
        userId: 'test-user',
      });
      // THEN it should create the instance with default values
      expect(client).toBeInstanceOf(TrackingClient);
    });
  });

  describe('start', () => {
    test('should start location provider', () => {
      // GIVEN a TrackingClient instance and a location provider
      const client = new TrackingClient({
        userId: 'test-user',
      });
      // WHEN starting the client
      client.start(mockLocationProvider);
      // THEN it should start the location provider
      expect(mockLocationProvider.start).toHaveBeenCalled();
      client.stop();
    });

    test('should not start if already started', () => {
      // GIVEN a TrackingClient instance that is already started
      const client = new TrackingClient({
        userId: 'test-user',
      });
      client.start(mockLocationProvider);
      const firstCallCount = (mockLocationProvider.start as jest.Mock).mock.calls.length;
      // WHEN attempting to start again
      client.start(mockLocationProvider);
      // THEN it should not call start again
      expect(mockLocationProvider.start).toHaveBeenCalledTimes(firstCallCount);
      client.stop();
    });
  });

  describe('stop', () => {
    test('should stop location provider and disconnect', () => {
      // GIVEN a TrackingClient instance that is started
      const client = new TrackingClient({
        userId: 'test-user',
      });
      client.start(mockLocationProvider);
      // WHEN stopping the client
      client.stop();
      // THEN it should stop the location provider
      expect(mockLocationProvider.stop).toHaveBeenCalled();
    });

    test('should handle stop when not started', () => {
      // GIVEN a TrackingClient instance that is not started
      const client = new TrackingClient({
        userId: 'test-user',
      });
      // WHEN stopping the client
      // THEN it should not throw an error
      expect(() => client.stop()).not.toThrow();
    });
  });

  describe('isActive', () => {
    test('should return false when not started', () => {
      // GIVEN a TrackingClient instance that is not started
      const client = new TrackingClient({
        userId: 'test-user',
      });
      // WHEN checking if it is active
      // THEN it should return false
      expect(client.isActive()).toBe(false);
    });

    test('should return true when active', done => {
      // GIVEN a TrackingClient instance that is started
      const client = new TrackingClient({
        userId: 'test-user',
      });
      client.start(mockLocationProvider);
      // WHEN checking if it is active after connection
      setTimeout(() => {
        // THEN it should return true
        expect(client.isActive()).toBe(true);
        client.stop();
        done();
      }, 100);
    });
  });

  describe('events', () => {
    test('should emit connect event when WebSocket opens', done => {
      // GIVEN a TrackingClient instance with a connect listener
      const client = new TrackingClient({
        userId: 'test-user',
      });
      client.on('connect', () => {
        // THEN it should emit the connect event
        client.stop();
        done();
      });
      // WHEN starting the client
      client.start(mockLocationProvider);
    });

    test('should emit location event when location provider sends update', done => {
      // GIVEN a TrackingClient instance with a location listener
      const client = new TrackingClient({
        userId: 'test-user',
      });
      client.on('location', location => {
        // THEN it should emit the location event with valid location data
        expect(location).toHaveProperty('lat');
        expect(location).toHaveProperty('lng');
        client.stop();
        done();
      });
      client.start(mockLocationProvider);
      // WHEN the location provider sends an update
      if (locationCallback) {
        locationCallback({
          lat: 9.145,
          lng: 38.7666,
          accuracy: 10,
          timestamp: Date.now(),
        });
      }
    });
  });
});
