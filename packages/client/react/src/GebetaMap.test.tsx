import React from 'react';
import { render } from '@testing-library/react';
import { GebetaMap } from './GebetaMap';
import { ValidationError } from '@gebeta/api';
import maplibre from 'maplibre-gl';

const VALID_AUTH = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

const VALID_API_KEY = 'my-legacy-api-key';

type TransformRequestFn = (
  url: string,
  resourceType: string
) => { url: string; headers?: Record<string, string> };

/** Spy on new maplibre.Map() and capture the transformRequest option passed to it. */
function spyOnMapConstructor(): { getTransformRequest: () => TransformRequestFn | undefined } {
  let captured: TransformRequestFn | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jest.spyOn(maplibre, 'Map' as any).mockImplementation(function (options: any) {
    captured = options?.transformRequest;
    return {
      isStyleLoaded: () => true,
      once: jest.fn(),
      on: jest.fn(),
      remove: jest.fn(),
      addControl: jest.fn(),
    };
  });
  return { getTransformRequest: () => captured };
}

describe('GebetaMap', () => {
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    jest.restoreAllMocks();
  });

  describe('auth validation', () => {
    test('should render without error when only auth credentials are provided', () => {
      // GIVEN only auth credentials (accessToken 'access-token-abc', no apiKey)
      // WHEN GebetaMap is rendered with auth prop
      render(<GebetaMap auth={VALID_AUTH} />);

      // THEN no deprecation warning is logged
      expect(warnSpy).not.toHaveBeenCalled();
    });

    test('should log a deprecation warning when only a legacy apiKey is provided', () => {
      // GIVEN only legacy apiKey 'my-legacy-api-key' (no auth)
      // WHEN GebetaMap is rendered with apiKey prop
      render(<GebetaMap apiKey={VALID_API_KEY} />);

      // THEN console.warn is called once with a deprecation message
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toMatch(/deprecated/i);
    });

    test('should throw ValidationError when neither apiKey nor auth is provided', () => {
      // GIVEN no apiKey and no auth
      // WHEN GebetaMap is rendered with no auth props
      // THEN ValidationError is thrown during render
      expect(() => render(<GebetaMap />)).toThrow(ValidationError);
    });

    test('should throw ValidationError when both apiKey and auth are provided', () => {
      // GIVEN both apiKey 'my-legacy-api-key' and auth credentials
      // WHEN GebetaMap is rendered with both props
      // THEN ValidationError is thrown during render
      expect(() => render(<GebetaMap apiKey={VALID_API_KEY} auth={VALID_AUTH} />)).toThrow(
        ValidationError
      );
    });
  });

  describe('transformRequest — tile URL authorization', () => {
    test('should inject Authorization: Bearer <accessToken> for tile URLs when using auth', () => {
      // GIVEN a GebetaMap rendered with auth credentials (accessToken 'access-token-abc')
      const { getTransformRequest } = spyOnMapConstructor();
      render(<GebetaMap auth={VALID_AUTH} />);

      // WHEN a tile URL is transformed
      const result = getTransformRequest()?.(
        'https://tiles.gebeta.app/styles/standard/style.json',
        'Style'
      );

      // THEN the Authorization header contains Bearer access-token-abc
      expect(result?.headers?.['Authorization']).toBe(`Bearer ${VALID_AUTH.accessToken}`);
    });

    test('should inject Authorization: Bearer <apiKey> for tile URLs when using legacy apiKey', () => {
      // GIVEN a GebetaMap rendered with legacy apiKey 'my-legacy-api-key'
      const { getTransformRequest } = spyOnMapConstructor();
      render(<GebetaMap apiKey={VALID_API_KEY} />);

      // WHEN a tile URL is transformed
      const result = getTransformRequest()?.(
        'https://tiles.gebeta.app/styles/standard/style.json',
        'Style'
      );

      // THEN the Authorization header contains Bearer my-legacy-api-key
      expect(result?.headers?.['Authorization']).toBe(`Bearer ${VALID_API_KEY}`);
    });

    test('should not inject Authorization header for non-tile URLs', () => {
      // GIVEN a GebetaMap rendered with auth credentials
      const { getTransformRequest } = spyOnMapConstructor();
      render(<GebetaMap auth={VALID_AUTH} />);

      // WHEN a non-tile URL is transformed
      const result = getTransformRequest()?.(
        'https://mapapi.gebeta.app/api/route/direction/',
        'Other'
      );

      // THEN no Authorization header is injected
      expect(result?.headers).toBeUndefined();
    });
  });
});
