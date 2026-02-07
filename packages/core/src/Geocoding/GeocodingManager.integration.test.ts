// mock chatty console methods to keep test output clean
import '../_test_utilities/consoleMock';
import { GeocodingManager } from './GeocodingManager';
import path from 'path';
import fs from 'fs';

let config: { apiKey: string };

beforeAll(() => {
  const configPath = path.join(__dirname, '../../config.js');
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Integration test config file not found at ${configPath}. ` +
        'Please copy config.example.js to config.js and add your API key.'
    );
  }
  config = require(configPath);
  if (!config.apiKey || config.apiKey === 'your-api-key-here') {
    throw new Error('Please set a valid API key in config.js');
  }
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
