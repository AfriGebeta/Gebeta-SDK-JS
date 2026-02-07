import { GeocodingManager } from './GeocodingManager';
import { API } from '@gebeta/maps-api';
import { getRandomString } from '../_test_utilities/specialCharacters';
import { setupFetchSpy } from '../_test_utilities/fetchSpy';
import { EMPTY_VALUES } from '../_test_utilities/commonTestValues';

describe('GeocodingManager', () => {
  const apiKey = getRandomString(10);
  let manager: GeocodingManager;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    manager = new GeocodingManager(apiKey);
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (fetchSpy) {
      fetchSpy.mockRestore();
    }
  });

  describe('constructor', () => {
    test('should create instance with valid API key', () => {
      // GIVEN a valid API key
      // WHEN creating a GeocodingManager instance
      // THEN test should create the instance successfully
      expect(manager).toBeInstanceOf(GeocodingManager);
      // AND the API key should be set correctly
      // @ts-expect-error - Accessing private property for test verification
      expect(manager.apiKey).toBe(apiKey);
    });

    test.each(EMPTY_VALUES)(
      'should throw error if API key is missing (%s)',
      (_description, givenApiKey?: string | null) => {
        // GIVEN an invalid API key
        // WHEN creating a GeocodingManager instance
        // THEN test should throw an error about missing API key
        //@ts-expect-error - Testing constructor with invalid API key
        expect(() => new GeocodingManager(givenApiKey)).toThrow(
          'API key is required for GeocodingManager'
        );
      }
    );

    test('should use API constant for base URL', () => {
      // GIVEN a GeocodingManager instance
      expect(manager).toBeInstanceOf(GeocodingManager);
      // THEN it should use the API constant for the base URL
      expect(API.Geocoding.Constants.API_URL).toBeDefined();
    });
  });

  describe('geocode', () => {
    test.each(EMPTY_VALUES)(
      'should throw error if name is missing',
      async (_description: string, givenName?: string | null) => {
        // GIVEN an invalid name
        // WHEN calling geocode method
        // THEN test should throw an error about missing name
        //@ts-expect-error - Testing geocode method with invalid name
        await expect(manager.geocode(givenName)).rejects.toThrow('Name is required for geocoding');
      }
    );

    test('should make fetch request with correct URL and params', async () => {
      // GIVEN a valid name and API response
      const givenAPIResponse = {
        msg: 'ok',
        data: [
          {
            name: 'Addis Ababa',
            lat: 9.0,
            lng: 38.7,
          },
        ],
      };

      fetchSpy = setupFetchSpy(200, givenAPIResponse, 'application/json;charset=UTF-8');

      // WHEN calling geocode method
      await manager.geocode('Addis Ababa');

      // THEN it should make a fetch request with the correct URL and parameters
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain('/geocoding');
      expect(callUrl).toMatch(/name=Addis[+%]Ababa/);
      const url = new URL(callUrl);
      expect(url.searchParams.get('apiKey')).toBe(apiKey);
    });

    test('should return geocoding results on success', async () => {
      // GIVEN a valid name and API response
      const givenAPIResponse: API.Geocoding.Types.Result[] = [
        {
          name: 'Addis Ababa',
          lngLat: {
            lng: 38.7,
            lat: 9.0,
          },
        },
      ];

      fetchSpy = setupFetchSpy(
        200,
        { msg: 'ok', data: givenAPIResponse },
        'application/json;charset=UTF-8'
      );

      // WHEN calling geocode method
      const result = await manager.geocode('Addis Ababa');

      // THEN it should return the geocoding results
      expect(result).toEqual(givenAPIResponse);
    });

    test('should throw error on API failure', async () => {
      // GIVEN a failed API response
      const givenAPIResponse = {
        msg: 'error',
        error: { message: 'Geocoding failed' },
      };

      fetchSpy = setupFetchSpy(400, givenAPIResponse, 'application/json;charset=UTF-8');

      // WHEN calling geocode method
      // THEN it should throw an error about geocoding failure
      await expect(manager.geocode('foo')).rejects.toThrow('Geocoding failed');
    });

    test('should handle network errors', async () => {
      // GIVEN a network error
      fetchSpy = setupFetchSpy(200, {}, 'application/json;charset=UTF-8');
      // AND the fetch request is rejected
      fetchSpy.mockRejectedValue(new Error('Network error'));

      // WHEN calling geocode method
      // THEN it should throw an error about network error=
      await expect(manager.geocode('foo')).rejects.toThrow('Network error');
    });
  });

  describe('reverseGeocode', () => {
    test.each([
      ['null object', null],
      ['undefined object', undefined],
      ['both undefined', { lat: undefined, lng: undefined }],
      ['both null', { lat: null, lng: null }],
      ['lat undefined, lng null', { lat: undefined, lng: null }],
      ['lat null, lng undefined', { lat: null, lng: undefined }],
      ['valid lat, undefined lng', { lat: 9.0, lng: undefined }],
      ['valid lat, null lng', { lat: 9.0, lng: null }],
      ['null lat, valid lng', { lat: null, lng: 38.7 }],
    ])(
      'should throw error if lat or lng is missing (%s)',
      async (_description: string, givenLngLat?: unknown) => {
        // GIVEN an invalid latitude or longitude
        // WHEN calling reverseGeocode method
        // THEN it should throw an error about missing latitude or longitude
        await expect(
          manager.reverseGeocode(givenLngLat as API.Common.Types.LngLat)
        ).rejects.toThrow('Latitude and longitude are required for reverse geocoding');
      }
    );

    test('should make fetch request with correct URL and params', async () => {
      // GIVEN a valid latitude and longitude and API response
      const givenAPIResponse = {
        msg: 'ok',
        data: [
          {
            name: 'Addis Ababa',
            lat: 9.0,
            lng: 38.7,
          },
        ],
      };

      fetchSpy = setupFetchSpy(200, givenAPIResponse, 'application/json;charset=UTF-8');

      // WHEN calling reverseGeocode method
      await manager.reverseGeocode({ lat: 9.0, lng: 38.7 });

      // THEN it should make a fetch request with the correct URL and parameters
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const callUrl = fetchSpy.mock.calls[0][0];
      expect(callUrl).toContain('/revgeocoding');
      const url = new URL(callUrl);
      expect(url.searchParams.get('lat')).toBe('9');
      expect(url.searchParams.get('lon')).toBe('38.7');
      expect(url.searchParams.get('apiKey')).toBe(apiKey);
    });

    test('should return reverse geocoding results on success', async () => {
      // GIVEN a valid latitude and longitude and API response
      const mockApiResponse = {
        msg: 'ok',
        data: [
          {
            name: 'Addis Ababa',
            lat: 9.0,
            lng: 38.7,
          },
        ],
      };

      const expectedResult: API.Geocoding.Types.Result[] = [
        {
          name: 'Addis Ababa',
          lngLat: {
            lng: 38.7,
            lat: 9.0,
          },
        },
      ];

      fetchSpy = setupFetchSpy(200, mockApiResponse, 'application/json;charset=UTF-8');

      // WHEN calling reverseGeocode method
      const result = await manager.reverseGeocode({ lat: 9.0, lng: 38.7 });
      // THEN it should return the reverse geocoding results
      expect(result).toEqual(expectedResult);
    });

    test('should throw error on API failure', async () => {
      // GIVEN a failed API response
      fetchSpy = setupFetchSpy(
        400,
        { msg: 'error', error: { message: 'Reverse geocoding failed' } },
        'application/json;charset=UTF-8'
      );

      // WHEN calling reverseGeocode method
      // THEN it should throw an error about reverse geocoding failure
      await expect(manager.reverseGeocode({ lat: 9.0, lng: 38.7 })).rejects.toThrow(
        'Reverse geocoding failed'
      );
    });
  });
});
