import { API } from '@gebeta/maps-api';

/**
 * Icon filename mapping for Valhalla maneuver types.
 * Valhalla maneuver types: https://github.com/valhalla/valhalla/blob/master/valhalla/proto/directions.proto
 */
const MANEUVER_ICON_FILENAMES: Record<number, string> = {
  0: 'none.svg',
  1: 'start.svg',
  2: 'start-right.svg',
  3: 'start-left.svg',
  4: 'destination.svg',
  5: 'destination-right.svg',
  6: 'destination-left.svg',
  7: 'becomes.svg',
  8: 'continue.svg',
  9: 'slight-right.svg',
  10: 'right.svg',
  11: 'sharp-right.svg',
  12: 'uturn-right.svg',
  13: 'uturn-left.svg',
  14: 'sharp-left.svg',
  15: 'left.svg',
  16: 'slight-left.svg',
  17: 'ramp-straight.svg',
  18: 'ramp-right.svg',
  19: 'ramp-left.svg',
  20: 'exit-right.svg',
  21: 'exit-left.svg',
  22: 'stay-straight.svg',
  23: 'stay-right.svg',
  24: 'stay-left.svg',
  25: 'merge.svg',
  26: 'roundabout-enter.svg',
  27: 'roundabout-exit.svg',
  28: 'ferry-enter.svg',
  29: 'ferry-exit.svg',
  30: 'transit.svg',
  31: 'transit-connection.svg',
  32: 'post-transit-connection.svg',
} as const;

const DEFAULT_ICON_FILENAME = 'straight.svg';

/**
 * Gets icon URL for a Valhalla maneuver type.
 * Returns a URL pointing to the static icon asset served from the CDN.
 * @param type - Maneuver type code
 * @returns Icon URL string
 */
export function getManeuverIcon(type: number): string {
  const iconFilename = MANEUVER_ICON_FILENAMES[type] ?? DEFAULT_ICON_FILENAME;
  return `${API.Routing.Constants.MANEUVER_ICONS_BASE_URL}/${iconFilename}`;
}
