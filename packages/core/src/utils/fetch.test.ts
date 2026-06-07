import { createFetch } from './fetch';
import { resolveAuth } from '../Auth/resolveAuth';

const VALID_CREDENTIALS = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

const apiKeyAuth = resolveAuth({ apiKey: 'my-api-key' });
const serviceAccountAuth = resolveAuth({ auth: VALID_CREDENTIALS });
if (serviceAccountAuth.type !== 'SERVICE_ACCOUNT') throw new Error('unexpected');

describe('createFetch', () => {
  let fetchSpy: jest.SpyInstance;

  afterEach(() => {
    fetchSpy?.mockRestore();
    jest.clearAllMocks();
  });

  describe('with no auth (undefined)', () => {
    test('should return globalThis.fetch directly', () => {
      const fetchFn = createFetch(undefined);
      expect(fetchFn).toBe(globalThis.fetch);
    });
  });

  describe('with API_KEY auth', () => {
    test('should append apiKey query param to the URL', async () => {
      fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(apiKeyAuth);

      await fetchFn('https://example.com/api');

      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe('https://example.com/api?apiKey=my-api-key');
      expect(init?.headers?.['Authorization']).toBeUndefined();
    });

    test('should append apiKey with & when URL already has query params', async () => {
      fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(apiKeyAuth);

      await fetchFn('https://example.com/api?foo=bar');

      const [url] = fetchSpy.mock.calls[0];
      expect(url).toBe('https://example.com/api?foo=bar&apiKey=my-api-key');
    });

    test('should preserve existing headers when appending apiKey', async () => {
      fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(apiKeyAuth);

      await fetchFn('https://example.com/api', { headers: { 'Content-Type': 'application/json' } });

      const [, init] = fetchSpy.mock.calls[0];
      expect(init.headers['Content-Type']).toBe('application/json');
      expect(init.headers['Authorization']).toBeUndefined();
    });
  });

  describe('with SERVICE_ACCOUNT auth', () => {
    test('should delegate to authManager.fetch() instead of calling globalThis.fetch directly', async () => {
      // spy on the manager's fetch via the resolved auth
      const managerFetchSpy = jest
        .spyOn(serviceAccountAuth.manager, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(serviceAccountAuth);

      await fetchFn('https://example.com/api');

      expect(managerFetchSpy).toHaveBeenCalledTimes(1);
      expect(managerFetchSpy).toHaveBeenCalledWith('https://example.com/api');
    });

    test('should forward init options to authManager.fetch()', async () => {
      const managerFetchSpy = jest
        .spyOn(serviceAccountAuth.manager, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(serviceAccountAuth);
      const init: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

      await fetchFn('https://example.com/api', init);

      expect(managerFetchSpy).toHaveBeenCalledWith('https://example.com/api', init);
    });
  });

  describe('with clientId (X-Device-ID header injection)', () => {
    test('should inject X-Device-ID header when clientId is provided with no auth', async () => {
      fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(undefined, 'device-abc');

      await fetchFn('https://example.com/api');

      const [, init] = fetchSpy.mock.calls[0];
      expect(init.headers['X-Device-ID']).toBe('device-abc');
    });

    test('should inject X-Device-ID and append apiKey when using API_KEY auth', async () => {
      fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(apiKeyAuth, 'device-abc');

      await fetchFn('https://example.com/api');

      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe('https://example.com/api?apiKey=my-api-key');
      expect(init.headers['X-Device-ID']).toBe('device-abc');
      expect(init.headers['Authorization']).toBeUndefined();
    });

    test('should pass X-Device-ID to authManager.fetch() when using SERVICE_ACCOUNT', async () => {
      const managerFetchSpy = jest
        .spyOn(serviceAccountAuth.manager, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(serviceAccountAuth, 'device-abc');

      await fetchFn('https://example.com/api');

      const [, init] = managerFetchSpy.mock.calls[0];
      expect((init?.headers as Record<string, string>)['X-Device-ID']).toBe('device-abc');
    });

    test('should not inject X-Device-ID when clientId is not provided', async () => {
      fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(apiKeyAuth);

      await fetchFn('https://example.com/api');

      const [, init] = fetchSpy.mock.calls[0];
      expect(init.headers['X-Device-ID']).toBeUndefined();
    });

    test('should preserve existing caller headers when injecting X-Device-ID', async () => {
      fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('{}', { status: 200 }));
      const fetchFn = createFetch(apiKeyAuth, 'device-abc');

      await fetchFn('https://example.com/api', { headers: { 'Content-Type': 'application/json' } });

      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe('https://example.com/api?apiKey=my-api-key');
      expect(init.headers['X-Device-ID']).toBe('device-abc');
      expect(init.headers['Content-Type']).toBe('application/json');
      expect(init.headers['Authorization']).toBeUndefined();
    });

    test('should return globalThis.fetch directly when both auth and clientId are absent', () => {
      const fetchFn = createFetch(undefined, undefined);
      expect(fetchFn).toBe(globalThis.fetch);
    });
  });
});
