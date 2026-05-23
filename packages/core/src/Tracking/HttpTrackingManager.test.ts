import '../_test_utilities/consoleMock';
import { HttpTrackingManager } from './HttpTrackingManager';
import { API, ValidationError } from '@gebeta/api';
import { AuthManager } from '../Auth';

describe('HttpTrackingManager', () => {
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
      // WHEN creating an HttpTrackingManager instance
      // THEN it should throw a ValidationError
      expect(() => {
        new HttpTrackingManager({} as unknown as API.Tracking.Types.HttpManagerOptions);
      }).toThrow(ValidationError);
    });

    test('should create instance with valid options', () => {
      // GIVEN valid options with userId and role
      // WHEN creating an HttpTrackingManager instance
      const client = new HttpTrackingManager({
        userId: 'test-user',
        role: 'driver',
      });
      // THEN it should create the instance successfully
      expect(client).toBeInstanceOf(HttpTrackingManager);
    });

    test('should use default role if not provided', () => {
      // GIVEN options with only userId
      // WHEN creating an HttpTrackingManager instance
      const client = new HttpTrackingManager({
        userId: 'test-user',
      });
      // THEN it should create the instance with default role
      expect(client).toBeInstanceOf(HttpTrackingManager);
    });
  });

  describe('start', () => {
    test('should start location provider', () => {
      // GIVEN an HttpTrackingManager instance and a location provider
      const client = new HttpTrackingManager({
        userId: 'test-user',
      });
      // WHEN starting the client
      client.start(mockLocationProvider);
      // THEN it should start the location provider
      expect(mockLocationProvider.start).toHaveBeenCalled();
    });

    test('should send location updates at interval', () => {
      // GIVEN an HttpTrackingManager instance that is started
      const client = new HttpTrackingManager({
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
      // GIVEN an HttpTrackingManager instance that is started
      const client = new HttpTrackingManager({
        userId: 'test-user',
      });
      client.start(mockLocationProvider);
      // WHEN stopping the client
      client.stop();
      // THEN it should stop the location provider
      expect(mockLocationProvider.stop).toHaveBeenCalled();
    });
  });

  describe('auth', () => {
    test('should include Authorization: Bearer <apiKey> header when constructed with a string apiKey', async () => {
      // GIVEN an HttpTrackingManager constructed with legacy apiKey 'my-legacy-key'
      const client = new HttpTrackingManager({
        userId: 'test-user',
        auth: 'my-legacy-key',
      });
      client.start(mockLocationProvider);

      // WHEN the send interval elapses
      jest.advanceTimersByTime(API.Tracking.Constants.INTERVAL_MS);
      await Promise.resolve();

      // THEN globalThis.fetch is called with Authorization: Bearer my-legacy-key
      const [, init] = mockFetch.mock.calls[0];
      expect(init.headers['Authorization']).toBe('Bearer my-legacy-key');
    });

    test('should delegate fetch to authManager.fetch() when constructed with an AuthManager', async () => {
      // GIVEN an HttpTrackingManager constructed with an AuthManager
      const authManager = new AuthManager({
        accessToken: 'access-token-abc',
        refreshToken: 'refresh-token-xyz',
      });
      const authFetchSpy = jest.spyOn(authManager, 'fetch').mockResolvedValue(
        new Response('{}', { status: 200 })
      );
      const client = new HttpTrackingManager({
        userId: 'test-user',
        auth: authManager,
      });
      client.start(mockLocationProvider);

      // WHEN the send interval elapses
      jest.advanceTimersByTime(API.Tracking.Constants.INTERVAL_MS);
      await Promise.resolve();

      // THEN authManager.fetch() is called (not globalThis.fetch directly)
      expect(authFetchSpy).toHaveBeenCalledTimes(1);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('isActive', () => {
    test('should return false when not started', () => {
      // GIVEN an HttpTrackingManager instance that is not started
      const client = new HttpTrackingManager({
        userId: 'test-user',
      });
      // WHEN checking if it is active
      // THEN it should return false
      expect(client.isActive()).toBe(false);
    });

    test('should return true when active', () => {
      // GIVEN an HttpTrackingManager instance that is started
      const client = new HttpTrackingManager({
        userId: 'test-user',
      });
      client.start(mockLocationProvider);
      // WHEN checking if it is active
      // THEN it should return true
      expect(client.isActive()).toBe(true);
    });
  });
});
