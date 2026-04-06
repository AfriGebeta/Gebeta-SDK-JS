import { DirectionsManager } from './DirectionsManager';
import { API } from '@gebeta/api';
import { ValidationError, NetworkError, RoutingError, BadRequestError } from '@gebeta/api';
import { getRandomString } from '../_test_utilities/specialCharacters';
import { setupFetchSpy } from '../_test_utilities/fetchSpy';
import { EMPTY_VALUES } from '../_test_utilities/commonTestValues';
import { encodePolyline } from '../_test_utilities/polylineEncoder';

describe('DirectionsManager', () => {
  const apiKey = getRandomString(10);
  let manager: DirectionsManager;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    manager = new DirectionsManager(apiKey);
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (fetchSpy) {
      fetchSpy.mockRestore();
    }
  });

  describe('constructor', () => {
    test('should create instance with valid API key', () => {
      expect(manager).toBeInstanceOf(DirectionsManager);
      // @ts-expect-error - Accessing private property for test verification
      expect(manager.apiKey).toBe(apiKey);
    });

    test.each(EMPTY_VALUES)(
      'should throw error if API key is missing (%s)',
      (_description, givenApiKey?: string | null) => {
        //@ts-expect-error - Testing constructor with invalid API key
        expect(() => new DirectionsManager(givenApiKey)).toThrow(ValidationError);
      }
    );

    test('should use API constant for base URL', () => {
      expect(manager).toBeInstanceOf(DirectionsManager);
      expect(API.Routing.Constants.API_URL).toBeDefined();
    });
  });

  describe('getDirections', () => {
    test.each([
      ['null origin', null, { lat: 9.0, lng: 38.7 }],
      ['undefined origin', undefined, { lat: 9.0, lng: 38.7 }],
      ['origin with null lat', { lat: null, lng: 38.7 }, { lat: 9.0, lng: 38.7 }],
      ['origin with null lng', { lat: 9.0, lng: null }, { lat: 9.0, lng: 38.7 }],
      ['null destination', { lat: 9.0, lng: 38.7 }, null],
      ['undefined destination', { lat: 9.0, lng: 38.7 }, undefined],
      ['destination with null lat', { lat: 9.0, lng: 38.7 }, { lat: null, lng: 38.7 }],
      ['destination with null lng', { lat: 9.0, lng: 38.7 }, { lat: 9.0, lng: null }],
    ])(
      'should throw ValidationError for invalid input (%s)',
      async (_description, origin, destination) => {
        await expect(
          manager.getDirections(
            origin as API.Common.Types.LngLat,
            destination as API.Common.Types.LngLat
          )
        ).rejects.toThrow(ValidationError);
      }
    );

    test('should make fetch request with correct URL and params', async () => {
      const validPolyline = encodePolyline([
        [9.0, 38.7],
        [9.1, 38.8],
      ]);
      const mockApiResponse = {
        trip: {
          legs: [
            {
              shape: validPolyline,
              maneuvers: [],
              summary: { length: 5.2, time: 600 },
            },
          ],
          locations: [
            { lat: 9.0, lon: 38.7 },
            { lat: 9.1, lon: 38.8 },
          ],
        },
      };

      fetchSpy = setupFetchSpy(200, mockApiResponse, 'application/json;charset=UTF-8');

      await manager.getDirections({ lat: 9.0, lng: 38.7 }, { lat: 9.1, lng: 38.8 });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain(API.Routing.Constants.API_URL);
      const url = new URL(callUrl);
      expect(url.searchParams.get('origin')).toBe('9,38.7');
      expect(url.searchParams.get('destination')).toBe('9.1,38.8');
      expect(url.searchParams.get('instruction')).toBe('1');
      expect(url.searchParams.get('format')).toBe('valhalla');
      expect(url.searchParams.get('apiKey')).toBe(apiKey);
    });

    test('should include waypoints in request when provided', async () => {
      const validPolyline = encodePolyline([
        [9.0, 38.7],
        [9.05, 38.75],
        [9.1, 38.8],
      ]);
      const mockApiResponse = {
        trip: {
          legs: [
            {
              shape: validPolyline,
              maneuvers: [],
              summary: { length: 5.2, time: 600 },
            },
          ],
          locations: [
            { lat: 9.0, lon: 38.7 },
            { lat: 9.05, lon: 38.75 },
            { lat: 9.1, lon: 38.8 },
          ],
        },
      };

      fetchSpy = setupFetchSpy(200, mockApiResponse, 'application/json;charset=UTF-8');

      await manager.getDirections(
        { lat: 9.0, lng: 38.7 },
        { lat: 9.1, lng: 38.8 },
        { waypoints: [{ lat: 9.05, lng: 38.75 }] }
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const callUrl = fetchSpy.mock.calls[0][0];
      const url = new URL(callUrl);
      expect(url.searchParams.get('waypoints')).toContain('9.05');
      expect(url.searchParams.get('waypoints')).toContain('38.75');
    });

    test('should return RouteData on success', async () => {
      const validPolyline = encodePolyline([
        [9.0, 38.7],
        [9.05, 38.75],
        [9.1, 38.8],
      ]);
      const mockApiResponse = {
        trip: {
          legs: [
            {
              shape: validPolyline,
              maneuvers: [
                {
                  type: 1,
                  instruction: 'Start',
                  time: 0,
                  length: 0,
                  begin_shape_index: 0,
                },
                {
                  type: 10,
                  instruction: 'Turn right',
                  time: 300,
                  length: 1000,
                  begin_shape_index: 1,
                },
              ],
              summary: { length: 5.2, time: 600 },
            },
          ],
          locations: [
            { lat: 9.0, lon: 38.7 },
            { lat: 9.1, lon: 38.8 },
          ],
        },
      };

      fetchSpy = setupFetchSpy(200, mockApiResponse, 'application/json;charset=UTF-8');

      const result = await manager.getDirections({ lat: 9.0, lng: 38.7 }, { lat: 9.1, lng: 38.8 });

      expect(result).toHaveProperty('geometry');
      expect(result.geometry.type).toBe('LineString');
      expect(Array.isArray(result.geometry.coordinates)).toBe(true);
      expect(result.geometry.coordinates.length).toBeGreaterThan(0);
      expect(result).toHaveProperty('origin');
      expect(result).toHaveProperty('destination');
      expect(result.origin).toEqual({ lat: 9.0, lng: 38.7 });
      expect(result.destination).toEqual({ lat: 9.1, lng: 38.8 });
      expect(result.instructions).toBeDefined();
      expect(Array.isArray(result.instructions)).toBe(true);
    });

    test('should throw BadRequestError on API failure', async () => {
      fetchSpy = setupFetchSpy(
        400,
        { error: { message: 'Invalid waypoints' } },
        'application/json;charset=UTF-8'
      );

      await expect(
        manager.getDirections({ lat: 9.0, lng: 38.7 }, { lat: 9.1, lng: 38.8 })
      ).rejects.toThrow(BadRequestError);
    });

    test('should throw RoutingError on error response', async () => {
      fetchSpy = setupFetchSpy(
        200,
        { msg: 'error', error: { message: 'No route found' } },
        'application/json;charset=UTF-8'
      );

      await expect(
        manager.getDirections({ lat: 9.0, lng: 38.7 }, { lat: 9.1, lng: 38.8 })
      ).rejects.toThrow(RoutingError);
    });

    test('should handle network errors', async () => {
      fetchSpy = setupFetchSpy(200, {}, 'application/json;charset=UTF-8');
      fetchSpy.mockRejectedValue(new Error('Network error'));

      await expect(
        manager.getDirections({ lat: 9.0, lng: 38.7 }, { lat: 9.1, lng: 38.8 })
      ).rejects.toThrow(NetworkError);
    });
  });
});
