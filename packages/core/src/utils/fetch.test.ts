import { createFetch } from './fetch';
import { AuthManager } from '../Auth';

const VALID_CREDENTIALS = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

describe('createFetch', () => {
  let fetchSpy: jest.SpyInstance;

  afterEach(() => {
    fetchSpy?.mockRestore();
    jest.clearAllMocks();
  });

  describe('with no auth (undefined)', () => {
    test('should return globalThis.fetch directly', () => {
      // GIVEN no auth
      // WHEN createFetch is called with undefined
      const fetchFn = createFetch(undefined);

      // THEN it returns globalThis.fetch
      expect(fetchFn).toBe(globalThis.fetch);
    });
  });

  describe('with string auth (legacy apiKey)', () => {
    test('should inject Authorization: Bearer <apiKey> header into the request', async () => {
      // GIVEN a legacy apiKey string 'my-api-key'
      const apiKey = 'my-api-key';
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(apiKey);

      // WHEN fetchFn is called with a URL
      await fetchFn('https://example.com/api');

      // THEN globalThis.fetch is called with Authorization: Bearer my-api-key
      const [, init] = fetchSpy.mock.calls[0];
      expect(init.headers['Authorization']).toBe('Bearer my-api-key');
    });

    test('should preserve existing headers alongside the injected Authorization header', async () => {
      // GIVEN a legacy apiKey and an existing 'Content-Type' header
      const apiKey = 'my-api-key';
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(apiKey);

      // WHEN fetchFn is called with a custom Content-Type header
      await fetchFn('https://example.com/api', {
        headers: { 'Content-Type': 'application/json' },
      });

      // THEN both Authorization and Content-Type headers are present
      const [, init] = fetchSpy.mock.calls[0];
      expect(init.headers['Authorization']).toBe('Bearer my-api-key');
      expect(init.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('with AuthManager', () => {
    test('should delegate to authManager.fetch() instead of calling globalThis.fetch directly', async () => {
      // GIVEN an AuthManager with access token 'access-token-abc'
      const authManager = new AuthManager(VALID_CREDENTIALS);
      const authFetchSpy = jest.spyOn(authManager, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(authManager);

      // WHEN fetchFn is called with a URL
      await fetchFn('https://example.com/api');

      // THEN authManager.fetch() is called with that URL (not globalThis.fetch directly)
      expect(authFetchSpy).toHaveBeenCalledTimes(1);
      expect(authFetchSpy).toHaveBeenCalledWith('https://example.com/api');
    });

    test('should forward init options to authManager.fetch()', async () => {
      // GIVEN an AuthManager and a request with method POST and Content-Type header
      const authManager = new AuthManager(VALID_CREDENTIALS);
      const authFetchSpy = jest.spyOn(authManager, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(authManager);
      const init: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

      // WHEN fetchFn is called with URL and init
      await fetchFn('https://example.com/api', init);

      // THEN authManager.fetch() is called with the same init object
      expect(authFetchSpy).toHaveBeenCalledWith('https://example.com/api', init);
    });
  });
});
