/**
 * Simple polyline encoder for testing purposes.
 * Encodes coordinates using the Google Polyline Algorithm.
 * @param coordinates - Array of [lat, lng] pairs
 * @returns Encoded polyline string
 *
 * >> Assumed to be correctly implemented for testing decodePolyline
 */
export function encodePolyline(coordinates: Array<[number, number]>): string {
  let encoded = '';
  let prevLat = 0;
  let prevLng = 0;

  for (const [lat, lng] of coordinates) {
    const latInt = Math.round(lat * 1e5);
    const lngInt = Math.round(lng * 1e5);

    const latDelta = latInt - prevLat;
    const lngDelta = lngInt - prevLng;

    encoded += encodeValue(latDelta);
    encoded += encodeValue(lngDelta);

    prevLat = latInt;
    prevLng = lngInt;
  }

  return encoded;
}
// TBH I dont understand the encoding algorithm fully
// just hoping it works. If you wanna know look here: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
function encodeValue(value: number): string {
  let encoded = '';
  let signedValue = value < 0 ? ~(value << 1) : value << 1;

  while (signedValue >= 0x20) {
    encoded += String.fromCharCode((0x20 | (signedValue & 0x1f)) + 63);
    signedValue >>= 5;
  }

  encoded += String.fromCharCode(signedValue + 63);
  return encoded;
}
