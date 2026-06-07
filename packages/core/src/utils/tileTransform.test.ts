import { createTileTransform } from './tileTransform';
import { resolveAuth } from '../Auth/resolveAuth';

const VALID_CREDENTIALS = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

const apiKeyAuth = resolveAuth({ apiKey: 'my-api-key' });
const serviceAccountAuth = resolveAuth({ auth: VALID_CREDENTIALS });

describe('createTileTransform', () => {
  describe('with API_KEY auth', () => {
    test('should append apiKey query param to the URL', () => {
      const transform = createTileTransform(apiKeyAuth);
      const result = transform('https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf');

      expect(result.url).toBe(
        'https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf?apiKey=my-api-key'
      );
      expect(result.headers?.['Authorization']).toBeUndefined();
    });

    test('should append apiKey with & when URL already has query params', () => {
      const transform = createTileTransform(apiKeyAuth);
      const result = transform('https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf?foo=bar');

      expect(result.url).toBe(
        'https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf?foo=bar&apiKey=my-api-key'
      );
    });

    test('should include X-Device-ID header when clientId is provided', () => {
      const transform = createTileTransform(apiKeyAuth, 'device-abc');
      const result = transform('https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf');

      expect(result.url).toBe(
        'https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf?apiKey=my-api-key'
      );
      expect(result.headers?.['X-Device-ID']).toBe('device-abc');
    });

    test('should omit headers entirely when no clientId is provided', () => {
      const transform = createTileTransform(apiKeyAuth);
      const result = transform('https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf');

      expect(result.headers).toBeUndefined();
    });
  });

  describe('with SERVICE_ACCOUNT auth', () => {
    test('should inject Authorization: Bearer <accessToken> header', () => {
      const transform = createTileTransform(serviceAccountAuth);
      const result = transform('https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf');

      expect(result.url).toBe('https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf');
      expect(result.headers?.['Authorization']).toBe(`Bearer ${VALID_CREDENTIALS.accessToken}`);
    });

    test('should include X-Device-ID alongside Authorization when clientId is provided', () => {
      const transform = createTileTransform(serviceAccountAuth, 'device-abc');
      const result = transform('https://tiles.gebeta.app/tiles/l5/11/1245/972.pbf');

      expect(result.headers?.['Authorization']).toBe(`Bearer ${VALID_CREDENTIALS.accessToken}`);
      expect(result.headers?.['X-Device-ID']).toBe('device-abc');
    });
  });
});
