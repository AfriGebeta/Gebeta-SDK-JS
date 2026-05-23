import { AuthManager } from './AuthManager';
import { API } from '@gebeta/api';
import { UnauthorizedError } from '@gebeta/api';
import { setupFetchSpy } from '../_test_utilities/fetchSpy';
import { DirectionsManager } from '../Directions/DirectionsManager';

const VALID_CREDENTIALS = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

const NEW_CREDENTIALS = {
  accessToken: 'new-access-token',
  refreshToken: 'new-refresh-token',
};

function makeRefreshResponse(credentials = NEW_CREDENTIALS) {
  return { data: credentials };
}

describe('AuthManager', () => {
  let fetchSpy: jest.SpyInstance;

  afterEach(() => {
    fetchSpy?.mockRestore();
    jest.clearAllMocks();
  });

  describe('fetch()', () => {
    test('should include Bearer token in Authorization header', async () => {
      // GIVEN an AuthManager constructed with accessToken 'access-token-abc'
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = setupFetchSpy(200, { ok: true }, 'application/json;charset=UTF-8');

      // WHEN fetch() is called
      await manager.fetch('https://example.com/api');

      // THEN the outgoing request has Authorization: Bearer access-token-abc
      const [, init] = fetchSpy.mock.calls[0];
      expect(init.headers['Authorization']).toBe(`Bearer ${VALID_CREDENTIALS.accessToken}`);
    });

    test('should call the refresh endpoint and retry the original request on 401', async () => {
      // GIVEN an AuthManager and a server that returns 401 on the first attempt
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('', { status: 401 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }))
        .mockResolvedValueOnce(new Response('{}', { status: 200 }));

      // WHEN fetch() is called with the target URL
      await manager.fetch('https://example.com/api');

      // THEN fetch is called 3 times: original request, refresh, retry
      expect(fetchSpy).toHaveBeenCalledTimes(3);
      expect(fetchSpy.mock.calls[0][0]).toBe('https://example.com/api');
      expect(fetchSpy.mock.calls[1][0]).toBe(API.Auth.Constants.REFRESH_URL);
      expect(fetchSpy.mock.calls[2][0]).toBe('https://example.com/api');
    });

    test('should use the new accessToken in the retry request after a successful refresh', async () => {
      // GIVEN an AuthManager and a server that returns 401, then issues new tokens on refresh
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('', { status: 401 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }))
        .mockResolvedValueOnce(new Response('{}', { status: 200 }));

      // WHEN fetch() is called
      await manager.fetch('https://example.com/api');

      // THEN the retry request uses the new accessToken 'new-access-token'
      const [, retryInit] = fetchSpy.mock.calls[2];
      expect(retryInit.headers['Authorization']).toBe(`Bearer ${NEW_CREDENTIALS.accessToken}`);
    });

    test('should throw UnauthorizedError and not retry again if the retry also returns 401', async () => {
      // GIVEN an AuthManager where both the original request and the retry return 401
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('', { status: 401 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }))
        .mockResolvedValueOnce(new Response('', { status: 401 }));

      // WHEN fetch() is called
      // THEN UnauthorizedError is thrown and fetch is not called a 4th time
      await expect(manager.fetch('https://example.com/api')).rejects.toThrow(UnauthorizedError);
      expect(fetchSpy).toHaveBeenCalledTimes(3);
    });

    test('should throw UnauthorizedError and emit tokenRefreshFailed if the refresh endpoint returns non-2xx', async () => {
      // GIVEN an AuthManager where the original request returns 401 and the refresh endpoint returns 401
      const manager = new AuthManager(VALID_CREDENTIALS);
      const onRefreshFailed = jest.fn();
      manager.on(API.Auth.Enums.Events.tokenRefreshFailed, onRefreshFailed);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('', { status: 401 }))
        .mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }));

      // WHEN fetch() is called
      // THEN UnauthorizedError is thrown and the tokenRefreshFailed event is emitted once
      await expect(manager.fetch('https://example.com/api')).rejects.toThrow(UnauthorizedError);
      expect(onRefreshFailed).toHaveBeenCalledTimes(1);
    });

    test('should emit tokenRefreshed with the new credentials after a successful refresh', async () => {
      // GIVEN an AuthManager where the original request returns 401 and refresh succeeds with new credentials
      const manager = new AuthManager(VALID_CREDENTIALS);
      const onRefreshed = jest.fn();
      manager.on(API.Auth.Enums.Events.tokenRefreshed, onRefreshed);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('', { status: 401 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }))
        .mockResolvedValueOnce(new Response('{}', { status: 200 }));

      // WHEN fetch() is called
      await manager.fetch('https://example.com/api');

      // THEN the tokenRefreshed event is emitted with { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' }
      expect(onRefreshed).toHaveBeenCalledWith(NEW_CREDENTIALS);
    });
  });

  describe('startAutoRefresh() / stopAutoRefresh()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // 10% before 7 minutes = 6m 18s = 378 000 ms
    const REFRESH_INTERVAL_MS = 7 * 60 * 1000 * 0.9;

    test('should not refresh before 6m 18s and should refresh at exactly 6m 18s', async () => {
      // GIVEN an AuthManager with auto-refresh started
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }));

      manager.startAutoRefresh();

      // WHEN just under 6m 18s elapses
      jest.advanceTimersByTime(REFRESH_INTERVAL_MS - 1);
      await Promise.resolve();

      // THEN no refresh has happened yet
      expect(fetchSpy).not.toHaveBeenCalled();

      // WHEN 6m 18s elapses
      await jest.advanceTimersByTimeAsync(1);

      // THEN the refresh endpoint was called
      expect(fetchSpy).toHaveBeenCalledWith(
        API.Auth.Constants.REFRESH_URL,
        expect.objectContaining({ method: 'POST' })
      );

      manager.stopAutoRefresh();
    });

    test('should emit tokenRefreshed after a successful timer-triggered refresh', async () => {
      // GIVEN an AuthManager with auto-refresh started
      const manager = new AuthManager(VALID_CREDENTIALS);
      const onRefreshed = jest.fn();
      manager.on(API.Auth.Enums.Events.tokenRefreshed, onRefreshed);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }));

      manager.startAutoRefresh();
      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_MS + 1);

      // THEN tokenRefreshed is emitted with the new credentials
      expect(onRefreshed).toHaveBeenCalledWith(NEW_CREDENTIALS);

      manager.stopAutoRefresh();
    });

    test('should not refresh after stopAutoRefresh() is called', async () => {
      // GIVEN an AuthManager with auto-refresh started then immediately stopped
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } })
      );

      manager.startAutoRefresh();
      manager.stopAutoRefresh();

      jest.advanceTimersByTime(REFRESH_INTERVAL_MS + 1);
      await Promise.resolve();

      // THEN no fetch calls were made
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    test('should reschedule after a successful refresh', async () => {
      // GIVEN an AuthManager with auto-refresh started
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }));

      manager.startAutoRefresh();

      // WHEN the first timer fires
      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_MS + 1);

      const callsAfterFirst = fetchSpy.mock.calls.length;

      // WHEN another interval passes
      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_MS + 1);

      // THEN the refresh endpoint was called a second time
      expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsAfterFirst);

      manager.stopAutoRefresh();
    });

    test('should reschedule after a failed refresh (transient error recovery)', async () => {
      // GIVEN an AuthManager where the first timer-refresh fails, then succeeds
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('error', { status: 500 }))
        .mockResolvedValue(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }));

      manager.startAutoRefresh();

      // first fire — refresh fails
      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_MS + 1);

      // second fire — refresh succeeds
      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_MS + 1);

      // THEN the refresh endpoint was called twice (once fail, once success)
      expect(fetchSpy).toHaveBeenCalledTimes(2);

      manager.stopAutoRefresh();
    });

    test('calling startAutoRefresh() twice should not cause double refreshes', async () => {
      // GIVEN an AuthManager where startAutoRefresh is called twice
      const manager = new AuthManager(VALID_CREDENTIALS);
      fetchSpy = jest.spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(makeRefreshResponse()), { status: 200, headers: { 'Content-Type': 'application/json' } }));

      manager.startAutoRefresh();
      manager.startAutoRefresh();

      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_MS + 1);

      // THEN only one refresh call was made
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      manager.stopAutoRefresh();
    });
  });

  describe('getAccessToken()', () => {
    test('should return the updated accessToken after updateCredentials() is called', () => {
      // GIVEN an AuthManager constructed with VALID_CREDENTIALS
      const manager = new AuthManager(VALID_CREDENTIALS);

      // WHEN updateCredentials() is called with NEW_CREDENTIALS
      manager.updateCredentials(NEW_CREDENTIALS);

      // THEN getAccessToken() returns 'new-access-token'
      expect(manager.getAccessToken()).toBe(NEW_CREDENTIALS.accessToken);
    });
  });

  describe('DirectionsManager with legacy string apiKey', () => {
    test('should append the apiKey as a query param when constructed with a string', async () => {
      // GIVEN a DirectionsManager constructed with a legacy string apiKey
      const apiKey = 'my-legacy-api-key';
      const directionsManager = new DirectionsManager(apiKey);
      fetchSpy = setupFetchSpy(200, {
        trip: {
          legs: [{ shape: 'mz`wFa`{xE~A@', maneuvers: [], summary: { length: 1, time: 60 } }],
          locations: [{ lat: 9.0, lon: 38.7 }, { lat: 9.1, lon: 38.8 }],
        },
      }, 'application/json;charset=UTF-8');

      // WHEN getDirections() is called
      await directionsManager.getDirections({ lat: 9.0, lng: 38.7 }, { lat: 9.1, lng: 38.8 });

      // THEN the request URL contains apiKey=my-legacy-api-key as a query param
      const url = new URL(fetchSpy.mock.calls[0][0] as string);
      expect(url.searchParams.get('apiKey')).toBe(apiKey);
    });
  });

  describe('DirectionsManager with AuthManager', () => {
    test('should delegate HTTP calls to authManager.fetch() instead of calling globalThis.fetch directly', async () => {
      // GIVEN a DirectionsManager constructed with an AuthManager
      const authManager = new AuthManager(VALID_CREDENTIALS);
      const directionsManager = new DirectionsManager(authManager);
      const authFetchSpy = jest.spyOn(authManager, 'fetch');
      fetchSpy = setupFetchSpy(200, {
        trip: {
          legs: [{ shape: 'mz`wFa`{xE~A@', maneuvers: [], summary: { length: 1, time: 60 } }],
          locations: [{ lat: 9.0, lon: 38.7 }, { lat: 9.1, lon: 38.8 }],
        },
      }, 'application/json;charset=UTF-8');

      // WHEN getDirections() is called
      await directionsManager.getDirections({ lat: 9.0, lng: 38.7 }, { lat: 9.1, lng: 38.8 });

      // THEN authManager.fetch() is called once (not globalThis.fetch directly)
      expect(authFetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
