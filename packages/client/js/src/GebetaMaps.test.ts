import { GebetaMaps } from './GebetaMaps';
import { ValidationError } from '@gebeta/api';

const VALID_AUTH = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

const VALID_API_KEY = 'my-legacy-api-key';

describe('GebetaMaps', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  describe('constructor', () => {
    test('should construct successfully with only auth credentials', () => {
      // GIVEN only auth credentials (no apiKey)
      // WHEN GebetaMaps is constructed with { auth: VALID_AUTH }
      const map = new GebetaMaps({ auth: VALID_AUTH });

      // THEN no error is thrown and no deprecation warning is logged
      expect(map).toBeInstanceOf(GebetaMaps);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    test('should construct successfully with only a legacy apiKey and log a deprecation warning', () => {
      // GIVEN only a legacy apiKey string 'my-legacy-api-key' (no auth)
      // WHEN GebetaMaps is constructed with { apiKey: 'my-legacy-api-key' }
      const map = new GebetaMaps({ apiKey: VALID_API_KEY });

      // THEN no error is thrown and console.warn is called once with a deprecation message
      expect(map).toBeInstanceOf(GebetaMaps);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toMatch(/deprecated/i);
    });

    test('should throw ValidationError when neither apiKey nor auth is provided', () => {
      // GIVEN no auth credentials and no apiKey
      // WHEN GebetaMaps is constructed with an empty options object
      // THEN ValidationError is thrown
      // @ts-expect-error - intentionally passing invalid options to verify the runtime guard;
      // the discriminated union in @gebeta/api forbids this at compile time.
      expect(() => new GebetaMaps({})).toThrow(ValidationError);
    });

    test('should throw ValidationError when both apiKey and auth are provided', () => {
      // GIVEN both apiKey 'my-legacy-api-key' and auth credentials
      // WHEN GebetaMaps is constructed with both options
      // THEN ValidationError is thrown
      expect(() =>
        // @ts-expect-error - intentionally passing both apiKey and auth to verify the runtime guard;
        // the discriminated union in @gebeta/api forbids this at compile time.
        new GebetaMaps({ apiKey: VALID_API_KEY, auth: VALID_AUTH })
      ).toThrow(ValidationError);
    });
  });

  describe('init() — transformRequest', () => {
    test('should include Authorization: Bearer <accessToken> in tile requests when using auth', () => {
      // GIVEN a GebetaMaps instance constructed with auth credentials (accessToken 'access-token-abc')
      const gebeta = new GebetaMaps({ auth: VALID_AUTH });
      const container = document.createElement('div');

      // WHEN init() is called and a tile URL is transformed
      gebeta.init({ container });
      const map = gebeta.getMap()!;
      // Access the transformRequest passed to the MapLibre Map constructor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformRequest = (map as any).options?.transformRequest as
        | ((url: string, resourceType: string) => { url: string; headers?: Record<string, string> })
        | undefined;
      const result = transformRequest?.(
        'https://tiles.gebeta.app/styles/standard/style.json',
        'Style'
      );

      // THEN the Authorization header contains Bearer access-token-abc
      expect(result?.headers?.['Authorization']).toBe(`Bearer ${VALID_AUTH.accessToken}`);
    });

    test('should append api_key query param in tile requests when using legacy apiKey', () => {
      // GIVEN a GebetaMaps instance constructed with legacy apiKey 'my-legacy-api-key'
      const gebeta = new GebetaMaps({ apiKey: VALID_API_KEY });
      const container = document.createElement('div');

      // WHEN init() is called and a tile URL is transformed
      gebeta.init({ container });
      const map = gebeta.getMap()!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformRequest = (map as any).options?.transformRequest as
        | ((url: string, resourceType: string) => { url: string; headers?: Record<string, string> })
        | undefined;
      const result = transformRequest?.(
        'https://tiles.gebeta.app/styles/standard/style.json',
        'Style'
      );

      // THEN the URL contains the api_key query param and no Authorization header
      expect(result?.url).toBe(
        `https://tiles.gebeta.app/styles/standard/style.json?apiKey=${VALID_API_KEY}`
      );
      expect(result?.headers?.['Authorization']).toBeUndefined();
    });

    test('should not inject Authorization header for non-tile URLs', () => {
      // GIVEN a GebetaMaps instance constructed with auth credentials
      const gebeta = new GebetaMaps({ auth: VALID_AUTH });
      const container = document.createElement('div');
      gebeta.init({ container });
      const map = gebeta.getMap()!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformRequest = (map as any).options?.transformRequest as
        | ((url: string, resourceType: string) => { url: string; headers?: Record<string, string> })
        | undefined;

      // WHEN a non-tile URL (Gebeta API) is transformed
      const result = transformRequest?.('https://mapapi.gebeta.app/api/route/direction/', 'Other');

      // THEN no Authorization header is injected
      expect(result?.headers).toBeUndefined();
    });
  });
});
