import { RoutingError, API } from '@gebeta/maps-api';

/**
 * Constants for polyline decoding algorithm.
 */
const POLYLINE_CONSTANTS = {
  /** ASCII offset for polyline encoding (63 = '?') */
  ASCII_OFFSET: 63,
  /** Bits per chunk in polyline encoding */
  BITS_PER_CHUNK: 5,
  /** Mask for extracting 5-bit chunk (0x1f = 31 = 11111 in binary) */
  CHUNK_MASK: 0x1f,
  /** Continuation bit threshold (0x20 = 32 = 100000 in binary) */
  CONTINUATION_BIT: 0x20,
  /** Precision multiplier: coordinates are stored as integers multiplied by this */
  PRECISION_MULTIPLIER: 1e5,
} as const;

/**
 * Decodes a single delta value from the polyline string.
 * The polyline encoding uses variable-length encoding where:
 * - Each character represents 5 bits of data
 * - Values >= 0x20 indicate continuation to next character
 * - The value is stored as a signed integer using two's complement
 * @param encoded - The encoded polyline string
 * @param index - Current position in the string (modified by reference)
 * @returns The decoded delta value
 */
function decodeDeltaValue(encoded: string, index: { current: number }): number {
  let shift = 0;
  let result = 0;
  let byte: number;

  do {
    if (index.current >= encoded.length) {
      throw new RoutingError(
        API.Errors.Codes.ROUTING_INVALID_POLYLINE,
        'Unexpected end of polyline string',
        { position: index.current, encodedLength: encoded.length }
      );
    }

    byte = encoded.charCodeAt(index.current) - POLYLINE_CONSTANTS.ASCII_OFFSET;
    index.current += 1;

    const chunk = byte & POLYLINE_CONSTANTS.CHUNK_MASK;
    result |= chunk << shift;
    shift += POLYLINE_CONSTANTS.BITS_PER_CHUNK;
  } while (byte >= POLYLINE_CONSTANTS.CONTINUATION_BIT);

  const isNegative = (result & 1) !== 0;
  const delta = isNegative ? ~(result >> 1) : result >> 1;

  return delta;
}

/**
 * Converts an integer coordinate (stored with precision multiplier) to degrees.
 * @param coordinateInt - Coordinate as integer (multiplied by precision)
 * @returns Coordinate in degrees
 */
function integerToDegrees(coordinateInt: number): number {
  return coordinateInt / POLYLINE_CONSTANTS.PRECISION_MULTIPLIER;
}

/**
 * Decodes an encoded polyline string (Valhalla format).
 * Valhalla uses standard polyline encoding: [lat, lng] pairs.
 *
 * Algorithm:
 * 1. Decode latitude delta and add to running total
 * 2. Decode longitude delta and add to running total
 * 3. Convert integer coordinates to degrees
 * 4. Store as [lng, lat] for GebetaMaps format
 *
 * @param encoded - Encoded polyline string
 * @returns Array of [lng, lat] coordinates (GebetaMaps format)
 * @throws Error if the polyline string is invalid
 */
export function decodePolyline(encoded: string): [number, number][] {
  if (!encoded || typeof encoded !== 'string') {
    return [];
  }

  const coordinates: [number, number][] = [];
  const index = { current: 0 };
  let latAccumulator = 0;
  let lngAccumulator = 0;

  try {
    while (index.current < encoded.length) {
      const latDelta = decodeDeltaValue(encoded, index);
      const lngDelta = decodeDeltaValue(encoded, index);

      latAccumulator += latDelta;
      lngAccumulator += lngDelta;

      const latDegrees = integerToDegrees(latAccumulator);
      const lngDegrees = integerToDegrees(lngAccumulator);

      coordinates.push([lngDegrees, latDegrees]);
    }
  } catch (error) {
    if (error instanceof RoutingError) {
      throw error;
    }
    throw new RoutingError(
      API.Errors.Codes.ROUTING_INVALID_POLYLINE,
      error instanceof Error ? error.message : 'Unknown error decoding polyline',
      { originalError: error }
    );
  }

  return coordinates;
}
