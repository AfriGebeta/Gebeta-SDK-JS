import '../_test_utilities/consoleMock';
import { loadIntegrationConfig } from '../_test_utilities/integrationConfig';
import { DirectionsManager } from './DirectionsManager';
import { resolveAuth } from '../Auth/resolveAuth';

let config: ReturnType<typeof loadIntegrationConfig>;

beforeAll(() => {
  config = loadIntegrationConfig();
});

describe('DirectionsManager Integration Tests', () => {
  let manager: DirectionsManager;

  beforeAll(() => {
    manager = new DirectionsManager(resolveAuth({ apiKey: config.apiKey }));
  });

  describe('getDirections', () => {
    test('should return route between two points', async () => {
      // GIVEN origin and destination coordinates
      const origin = { lat: 9.0, lng: 38.7 };
      const destination = { lat: 9.02, lng: 38.75 };
      // WHEN requesting directions between the points
      const route = await manager.getDirections(origin, destination);
      // THEN it should return valid route data with geometry and summary
      expect(route).toHaveProperty('geometry');
      expect(route.geometry).toHaveProperty('type', 'LineString');
      expect(Array.isArray(route.geometry.coordinates)).toBe(true);
      expect(route.geometry.coordinates.length).toBeGreaterThan(0);
      expect(route.origin).toEqual(origin);
      expect(route.destination).toEqual(destination);
      expect(route.distance).toBeDefined();
      expect(route.duration).toBeDefined();
    });

    test('should return instructions when route has multiple segments', async () => {
      // GIVEN origin and destination that require multiple segments
      const origin = { lat: 9.0, lng: 38.7 };
      const destination = { lat: 9.05, lng: 38.78 };
      // WHEN requesting directions between the points
      const route = await manager.getDirections(origin, destination);
      // THEN it should return a route with multiple coordinates and optional instructions
      expect(route.geometry.coordinates.length).toBeGreaterThan(1);
      if (route.instructions && route.instructions.length > 0) {
        expect(route.instructions[0]).toHaveProperty('instruction');
        expect(route.instructions[0]).toHaveProperty('length');
      }
    });
  });
});
