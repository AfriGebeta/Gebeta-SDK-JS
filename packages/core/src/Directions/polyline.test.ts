import { decodePolyline } from './polyline';
import { encodePolyline } from '../_test_utilities/polylineEncoder';
import { RoutingError, API } from '@gebeta/maps-api';
import { EMPTY_VALUES } from '../_test_utilities/commonTestValues';

describe('decodePolyline', () => {
  describe('basic functionality', () => {
    test('should decode a simple two-point polyline', () => {
      // GIVEN a simple encoded polyline string representing two coordinates
      const coordinates: Array<[number, number]> = [
        [9.0, 38.7],
        [9.1, 38.8],
      ];
      const encoded = encodePolyline(coordinates);
      // WHEN decoding the polyline string
      const decoded = decodePolyline(encoded);

      // THEN it should return the original coordinates in [lng, lat] format
      expect(decoded).toHaveLength(2);
      expect(decoded[0][0]).toBeCloseTo(38.7, 5);
      expect(decoded[0][1]).toBeCloseTo(9.0, 5);
      expect(decoded[1][0]).toBeCloseTo(38.8, 5);
      expect(decoded[1][1]).toBeCloseTo(9.1, 5);
    });

    test('should decode multiple coordinates', () => {
      // GIVEN an encoded polyline string representing multiple coordinates
      const coordinates: Array<[number, number]> = [
        [9.0, 38.7],
        [9.05, 38.75],
        [9.1, 38.8],
        [9.15, 38.85],
      ];
      const encoded = encodePolyline(coordinates);
      // WHEN decoding the polyline string
      const decoded = decodePolyline(encoded);

      // THEN it should return all the original coordinates in [lng, lat] format
      expect(decoded).toHaveLength(4);
      coordinates.forEach((coord, index) => {
        expect(decoded[index][0]).toBeCloseTo(coord[1], 5);
        expect(decoded[index][1]).toBeCloseTo(coord[0], 5);
      });
    });

    test('should handle coordinates with high precision and round to 5 decimal places', () => {
      // GIVEN an encoded polyline string with 7 decimal place precision coordinates
      const coordinates: Array<[number, number]> = [
        [9.1234567, 38.6789012],
        [9.1234568, 38.6789013],
      ];
      const encoded = encodePolyline(coordinates);
      // WHEN decoding the polyline string
      const decoded = decodePolyline(encoded);

      // THEN it should return coordinates rounded to 5 decimal places (polyline precision limit)
      expect(decoded).toHaveLength(2);
      expect(decoded[0][0]).toBeCloseTo(38.67890, 5);
      expect(decoded[0][1]).toBeCloseTo(9.12346, 5); // rounded to 5 so 9.1234567 becomes 9.12346
      expect(decoded[1][0]).toBeCloseTo(38.67890, 5);
      expect(decoded[1][1]).toBeCloseTo(9.12346, 5); // rounded to 5 so 9.1234568 becomes 9.12346
    });

    test('should return coordinates in [lng, lat] format', () => {
      // GIVEN an encoded polyline string representing coordinates in [lat, lng] format
      const coordinates: Array<[number, number]> = [
        [9.0, 38.7],
        [9.1, 38.8],
      ];
      const encoded = encodePolyline(coordinates);
      // WHEN decoding the polyline string
      const decoded = decodePolyline(encoded);

      // THEN it should return the coordinates in [lng, lat] format
      expect(decoded).toHaveLength(2);
      decoded.forEach((coord, index) => {
        expect(coord[0]).toBeCloseTo(coordinates[index][1], 5);
        expect(coord[1]).toBeCloseTo(coordinates[index][0], 5);
      });
    });

    test('should handle large coordinate values', () => {
      // GIVEN an encoded polyline string with large coordinate values (near the limits of valid lat/lng)
      const coordinates: Array<[number, number]> = [
        [90.0, 180.0],
        [-90.0, -180.0],
      ];
      const encoded = encodePolyline(coordinates);
      // WHEN decoding the polyline string
      const decoded = decodePolyline(encoded);

      // THEN it should return the correct coordinates in [lng, lat] format
      expect(decoded).toHaveLength(2);
      expect(decoded[0][0]).toBeCloseTo(180.0, 5);
      expect(decoded[0][1]).toBeCloseTo(90.0, 5);
      expect(decoded[1][0]).toBeCloseTo(-180.0, 5);
      expect(decoded[1][1]).toBeCloseTo(-90.0, 5);
    });
  });

  describe('edge cases', () => {
    // GIVEN empty or invalid input values
    test.each([...EMPTY_VALUES, ["non string input", 123]])('should return empty array for %s', (_description: string, givenValue?: string | number | null) => {
      // WHEN decoding the polyline string
      //@ts-expect-error - testing non-string input
      const result = decodePolyline(givenValue);
      // THEN it should return an empty array
      expect(result).toEqual([]);
    });
  });

  describe('error handling', () => {
    test('should throw RoutingError for truncated polyline string', () => {
      // GIVEN an encoded polyline string
      const coordinates: Array<[number, number]> = [[9.0, 38.7]];
      const encoded = encodePolyline(coordinates);
      // AND the encoded string is truncated (missing characters)
      const truncated = encoded.slice(0, -1);
      // WHEN decoding the truncated polyline string
      // THEN it should throw a RoutingError with code ROUTING_INVALID_POLYLINE
      expect(() => decodePolyline(truncated)).toThrow(RoutingError);
      try {
        decodePolyline(truncated);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(RoutingError);
        if (error instanceof RoutingError) {
          expect(error.code).toBe(API.Errors.Codes.ROUTING_INVALID_POLYLINE);
        }
      }
    });

    test('should throw RoutingError for invalid polyline characters', () => {
      // GIVEN an invalid encoded polyline string with non-polyline characters
      const invalidPolyline = 'invalid!@#$%';
      // WHEN decoding the invalid polyline string
      // THEN it should throw a RoutingError with code ROUTING_INVALID_POLYLINE
      expect(() => decodePolyline(invalidPolyline)).toThrow(RoutingError);
      try {
        decodePolyline(invalidPolyline);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(RoutingError);
        if (error instanceof RoutingError) {
          expect(error.code).toBe(API.Errors.Codes.ROUTING_INVALID_POLYLINE);
        }
      }
    });

    test('should throw RoutingError for incomplete coordinate pair', () => {
      // GIVEN an encoded polyline string that ends in the middle of a coordinate pair
      const coordinates: Array<[number, number]> = [[9.0, 38.7]];
      const encoded = encodePolyline(coordinates);
      const incomplete = encoded.slice(0, Math.floor(encoded.length / 2));

      // WHEN decoding the incomplete polyline string
      expect(() => decodePolyline(incomplete)).toThrow(RoutingError);

      // THEN it should throw a RoutingError with code ROUTING_INVALID_POLYLINE
      expect(() => decodePolyline(incomplete)).toThrow(RoutingError);
      try {
        decodePolyline(incomplete);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(RoutingError);
        if (error instanceof RoutingError) {
          expect(error.code).toBe(API.Errors.Codes.ROUTING_INVALID_POLYLINE);
        }
      }
    });
  });

  describe('known polyline examples', () => {
    test('should decode a known valid polyline from google example (just in case my encoding util is fu*ked)', () => {
      // GIVEN a known valid encoded polyline string from Google's polyline encoding example
      // The full polyline encodes the path: (38.5, -120.2), (40.7, -120.95), (43.252, -126.453)
      const encodedString = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
      
      // WHEN decoding the polyline string
      const decoded = decodePolyline(encodedString);

      // THEN it should return the expected coordinates in [lng, lat] format
      expect(decoded).toHaveLength(3);
      expect(decoded[0][0]).toBeCloseTo(-120.2, 5);
      expect(decoded[0][1]).toBeCloseTo(38.5, 5);
      expect(decoded[1][0]).toBeCloseTo(-120.95, 5);
      expect(decoded[1][1]).toBeCloseTo(40.7, 5);
      expect(decoded[2][0]).toBeCloseTo(-126.453, 5);
      expect(decoded[2][1]).toBeCloseTo(43.252, 5);
    });

    test('should handle polyline with single coordinate', () => {
      // GIVEN an encoded polyline string that represents a single coordinate
      const coordinates: Array<[number, number]> = [[9.0, 38.7]];
      const encoded = encodePolyline(coordinates);
      // WHEN decoding the polyline string
      const decoded = decodePolyline(encoded);

      // THEN it should return an array with one coordinate in [lng, lat] format
      expect(decoded).toHaveLength(1);
      expect(decoded[0][0]).toBeCloseTo(38.7, 5);
      expect(decoded[0][1]).toBeCloseTo(9.0, 5);
    });
  });
});

test.todo("check performance of decodePolyline with very long polylines (e.g. 1000+ coordinates) to ensure it doesn't degrade significantly");