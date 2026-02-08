import '../_test_utilities/consoleMock';
import { HttpTrackingClient } from './HttpTrackingClient';
import { API, ValidationError } from '@gebeta/maps-api';

describe('HttpTrackingClient', () => {
  let mockLocationProvider: API.Platform.Types.ILocationProvider;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockLocationProvider = {
      start: jest.fn(),
      stop: jest.fn(),
    };

    mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
    });
    global.fetch = mockFetch as unknown as typeof fetch;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('constructor', () => {
    test('should throw ValidationError if userId is missing', () => {
      // GIVEN invalid options without userId
      // WHEN creating an HttpTrackingClient instance
      // THEN it should throw a ValidationError
      expect(() => {
        new HttpTrackingClient({} as unknown as API.Tracking.Types.HttpClientOptions);
      }).toThrow(ValidationError);
    });

    test('should create instance with valid options', () => {
      // GIVEN valid options with userId and role
      // WHEN creating an HttpTrackingClient instance
      const client = new HttpTrackingClient({
        userId: 'test-user',
        role: 'driver',
      });
      // THEN it should create the instance successfully
      expect(client).toBeInstanceOf(HttpTrackingClient);
    });

    test('should use default role if not provided', () => {
      // GIVEN options with only userId
      // WHEN creating an HttpTrackingClient instance
      const client = new HttpTrackingClient({
        userId: 'test-user',
      });
      // THEN it should create the instance with default role
      expect(client).toBeInstanceOf(HttpTrackingClient);
    });
  });

  describe('start', () => {
    test('should start location provider', () => {
      // GIVEN an HttpTrackingClient instance and a location provider
      const client = new HttpTrackingClient({
        userId: 'test-user',
      });
      // WHEN starting the client
      client.start(mockLocationProvider);
      // THEN it should start the location provider
      expect(mockLocationProvider.start).toHaveBeenCalled();
    });

    test('should send location updates at interval', () => {
      // GIVEN an HttpTrackingClient instance that is started
      const client = new HttpTrackingClient({
        userId: 'test-user',
      });
      client.start(mockLocationProvider);
      // WHEN the interval elapses
      jest.advanceTimersByTime(API.Tracking.Constants.INTERVAL_MS);
      // THEN it should send location updates via HTTP
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    test('should stop location provider', () => {
      // GIVEN an HttpTrackingClient instance that is started
      const client = new HttpTrackingClient({
        userId: 'test-user',
      });
      client.start(mockLocationProvider);
      // WHEN stopping the client
      client.stop();
      // THEN it should stop the location provider
      expect(mockLocationProvider.stop).toHaveBeenCalled();
    });
  });

  describe('isActive', () => {
    test('should return false when not started', () => {
      // GIVEN an HttpTrackingClient instance that is not started
      const client = new HttpTrackingClient({
        userId: 'test-user',
      });
      // WHEN checking if it is active
      // THEN it should return false
      expect(client.isActive()).toBe(false);
    });

    test('should return true when active', () => {
      // GIVEN an HttpTrackingClient instance that is started
      const client = new HttpTrackingClient({
        userId: 'test-user',
      });
      client.start(mockLocationProvider);
      // WHEN checking if it is active
      // THEN it should return true
      expect(client.isActive()).toBe(true);
    });
  });
});
