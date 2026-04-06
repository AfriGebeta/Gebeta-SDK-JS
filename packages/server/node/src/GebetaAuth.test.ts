import { GebetaAuth } from './GebetaAuth';
import { API } from '@gebeta/api';
import { UnauthorizedError, NetworkError } from '@gebeta/api';

const SERVER_TOKEN = 'server-token-secret';
const CLIENT_TOKEN = 'client-token-public';

const VALID_CREDENTIALS = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

function makeAuthResponse(credentials = VALID_CREDENTIALS) {
  return { data: credentials };
}

describe('GebetaAuth', () => {
  let fetchSpy: jest.SpyInstance;

  afterEach(() => {
    fetchSpy?.mockRestore();
    jest.clearAllMocks();
  });

  describe('authenticate()', () => {
    test('should POST to AUTH_URL with client_token and server_token', async () => {
      // GIVEN a GebetaAuth instance with server token 'server-token-secret'
      const auth = new GebetaAuth({ serverToken: SERVER_TOKEN });
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(makeAuthResponse()), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // WHEN authenticate() is called with client token 'client-token-public'
      await auth.authenticate(CLIENT_TOKEN);

      // THEN fetch POSTs to API.Auth.Constants.AUTH_URL with { client_token, server_token }
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe(API.Auth.Constants.AUTH_URL);
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body)).toEqual({
        client_token: CLIENT_TOKEN,
        server_token: SERVER_TOKEN,
      });
    });

    test('should return { accessToken, refreshToken } from the response data field', async () => {
      // GIVEN a GebetaAuth instance and an API response with valid credentials
      const auth = new GebetaAuth({ serverToken: SERVER_TOKEN });
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(makeAuthResponse()), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // WHEN authenticate() is called with 'client-token-public'
      const result = await auth.authenticate(CLIENT_TOKEN);

      // THEN the returned credentials match { accessToken: 'access-token-abc', refreshToken: 'refresh-token-xyz' }
      expect(result).toEqual(VALID_CREDENTIALS);
    });

    test('should throw UnauthorizedError when the API returns a non-2xx status', async () => {
      // GIVEN a GebetaAuth instance and an API that returns 401
      const auth = new GebetaAuth({ serverToken: SERVER_TOKEN });
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Unauthorized', { status: 401 })
      );

      // WHEN authenticate() is called
      // THEN UnauthorizedError is thrown with the response status
      await expect(auth.authenticate(CLIENT_TOKEN)).rejects.toThrow(UnauthorizedError);
    });

    test('should throw UnauthorizedError when the response is missing data.accessToken', async () => {
      // GIVEN a GebetaAuth instance and an API that returns 200 with malformed body (no accessToken)
      const auth = new GebetaAuth({ serverToken: SERVER_TOKEN });
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: { refreshToken: 'only-refresh' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // WHEN authenticate() is called
      // THEN UnauthorizedError is thrown describing the invalid response
      await expect(auth.authenticate(CLIENT_TOKEN)).rejects.toThrow(UnauthorizedError);
    });

    test('should throw UnauthorizedError when the response is missing data.refreshToken', async () => {
      // GIVEN a GebetaAuth instance and an API that returns 200 with malformed body (no refreshToken)
      const auth = new GebetaAuth({ serverToken: SERVER_TOKEN });
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: { accessToken: 'only-access' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // WHEN authenticate() is called
      // THEN UnauthorizedError is thrown describing the invalid response
      await expect(auth.authenticate(CLIENT_TOKEN)).rejects.toThrow(UnauthorizedError);
    });

    test('should throw NetworkError when fetch rejects (network failure)', async () => {
      // GIVEN a GebetaAuth instance and a network that fails with 'ECONNREFUSED'
      const auth = new GebetaAuth({ serverToken: SERVER_TOKEN });
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('ECONNREFUSED')
      );

      // WHEN authenticate() is called
      // THEN NetworkError is thrown wrapping the original error
      await expect(auth.authenticate(CLIENT_TOKEN)).rejects.toThrow(NetworkError);
    });

    test('should include Content-Type: application/json in the request headers', async () => {
      // GIVEN a GebetaAuth instance
      const auth = new GebetaAuth({ serverToken: SERVER_TOKEN });
      fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(makeAuthResponse()), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // WHEN authenticate() is called
      await auth.authenticate(CLIENT_TOKEN);

      // THEN the request includes Content-Type: application/json
      const [, init] = fetchSpy.mock.calls[0];
      expect(init.headers['Content-Type']).toBe('application/json');
    });
  });
});
