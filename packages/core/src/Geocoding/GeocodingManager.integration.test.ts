import '../_test_utilities/consoleMock';
import { loadIntegrationConfig } from '../_test_utilities/integrationConfig';
import { GeocodingManager } from './GeocodingManager';

let config: ReturnType<typeof loadIntegrationConfig>;

beforeAll(() => {
  config = loadIntegrationConfig();
});

describe('GeocodingManager Integration Tests', () => {
  let manager: GeocodingManager;

  beforeAll(() => {
    manager = new GeocodingManager(config.apiKey);
  });

  describe('geocode', () => {
    test('should geocode a real address', async () => {
      // GIVEN a valid place name
      // WHEN geocoding the place name
      const results = await manager.geocode('Addis Ababa');
      // THEN it should return valid geocoding results
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('name');
      expect(results[0]).toHaveProperty('lngLat');
      expect(results[0].lngLat).toHaveProperty('lat');
      expect(results[0].lngLat).toHaveProperty('lng');
      expect(typeof results[0].lngLat.lat).toBe('number');
      expect(typeof results[0].lngLat.lng).toBe('number');
    });
  });

  describe('reverseGeocode', () => {
    test('should reverse geocode real coordinates', async () => {
      // GIVEN valid coordinates
      // WHEN reverse geocoding the coordinates
      const results = await manager.reverseGeocode({ lat: 9.0, lng: 38.7 });
      // THEN it should return valid geocoding results
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('name');
      expect(results[0]).toHaveProperty('lngLat');
      expect(results[0].lngLat).toHaveProperty('lat');
      expect(results[0].lngLat).toHaveProperty('lng');
    });
  });
});
