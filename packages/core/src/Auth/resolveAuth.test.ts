import { API, ValidationError } from '@gebeta/api';
import { AuthManager } from './AuthManager';
import { normalizeAuth, resolveAuth } from './resolveAuth';
import { GeocodingManager } from '../Geocoding/GeocodingManager';

const { AuthTypes } = API.Auth.Enums;

const VALID_CREDENTIALS = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

describe('normalizeAuth', () => {
  test('should wrap an AuthManager instance as SERVICE_ACCOUNT auth', () => {
    // GIVEN an AuthManager instance
    const manager = new AuthManager(VALID_CREDENTIALS);

    // WHEN it is normalized
    const result = normalizeAuth(manager);

    // THEN it becomes SERVICE_ACCOUNT auth holding the same manager
    expect(result).toEqual({ type: AuthTypes.SERVICE_ACCOUNT, manager });
  });

  test('should wrap a duck-typed AuthManager from another package copy', () => {
    // GIVEN an object exposing fetch() and getAccessToken() but not an AuthManager instance
    const foreignManager = { fetch: jest.fn(), getAccessToken: jest.fn() };

    // WHEN it is normalized
    const result = normalizeAuth(foreignManager as unknown as AuthManager);

    // THEN it is treated as SERVICE_ACCOUNT auth
    expect(result.type).toBe(AuthTypes.SERVICE_ACCOUNT);
  });

  test('should convert an API key string to trimmed API_KEY auth', () => {
    // GIVEN an API key with a trailing newline
    // WHEN it is normalized
    const result = normalizeAuth('my-api-key\n');

    // THEN it becomes API_KEY auth with the trimmed key
    expect(result).toEqual({ type: AuthTypes.API_KEY, key: 'my-api-key' });
  });

  test('should return an already resolved auth unchanged', () => {
    // GIVEN auth produced by resolveAuth
    const resolved = resolveAuth({ apiKey: 'my-api-key' });

    // WHEN it is normalized
    // THEN the same object is returned
    expect(normalizeAuth(resolved)).toBe(resolved);
  });

  test('should throw ValidationError for an empty API key', () => {
    expect(() => normalizeAuth('   ')).toThrow(ValidationError);
  });

  test('should throw ValidationError for an unrecognized object', () => {
    expect(() => normalizeAuth({} as never)).toThrow(ValidationError);
  });
});

describe('standalone managers accept AuthManager', () => {
  test('should send a Bearer token when GeocodingManager is built from an AuthManager', async () => {
    // GIVEN a GeocodingManager constructed directly from an AuthManager
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ msg: 'ok', data: [{ name: 'Bole', lat: 9.0, lng: 38.7 }] }), {
        status: 200,
      })
    );
    const geocoder = new GeocodingManager(new AuthManager(VALID_CREDENTIALS));

    // WHEN geocoding a place
    const results = await geocoder.geocode('Bole');

    // THEN the request carries the access token and the result is parsed
    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    expect(new Headers(init.headers).get('Authorization')).toBe(
      `Bearer ${VALID_CREDENTIALS.accessToken}`
    );
    expect(results[0]).toMatchObject({ name: 'Bole', lngLat: { lat: 9.0, lng: 38.7 } });

    fetchSpy.mockRestore();
  });
});
