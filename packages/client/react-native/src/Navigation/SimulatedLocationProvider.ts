import type { API } from '@gebeta/api';

type ILocationProvider = API.Platform.Types.ILocationProvider;
type LocationData = API.Platform.Types.LocationData;

/**
 * An `ILocationProvider` that walks a route's coordinates instead of reading the device GPS.
 * Useful for demoing/testing navigation where a real moving fix isn't available (e.g. an
 * emulator). Emits a location every ~100ms/speed with a computed heading toward the next point.
 *
 * @param coords route coordinates as `[lng, lat]` pairs (e.g. `route.geometry.coordinates`)
 * @param getSpeed returns the current speed multiplier (1 = baseline); read fresh each tick so
 *                 the speed can change live.
 */
export function createSimulatedLocationProvider(
  coords: [number, number][],
  getSpeed: () => number = () => 1
): ILocationProvider {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let segmentIndex = 0;
  let position: [number, number] | null = null;
  let running = false;

  return {
    start(callback: (location: LocationData) => void): void {
      if (!coords.length) return;
      segmentIndex = 0;
      position = [coords[0][0], coords[0][1]];
      running = true;

      const tick = () => {
        if (!running || !position) return;
        const speed = Math.max(getSpeed(), 0.01);

        if (segmentIndex >= coords.length - 1) {
          const final = coords[coords.length - 1];
          callback({
            lat: final[1],
            lng: final[0],
            accuracy: 10,
            timestamp: Date.now(),
            heading: 0,
          });
          return;
        }

        const end = coords[segmentIndex + 1];
        const step = 0.0001 * speed;
        const dx = end[0] - position[0];
        const dy = end[1] - position[1];
        const distToEnd = Math.sqrt(dx * dx + dy * dy);

        if (distToEnd <= step) {
          position = [end[0], end[1]];
          segmentIndex++;
        } else {
          const r = step / distToEnd;
          position = [position[0] + dx * r, position[1] + dy * r];
        }

        const next =
          segmentIndex < coords.length - 1 ? coords[segmentIndex + 1] : coords[coords.length - 1];
        callback({
          lat: position[1],
          lng: position[0],
          accuracy: 10,
          timestamp: Date.now(),
          heading: bearing(position, next),
        });

        if (running && segmentIndex < coords.length - 1) {
          timeoutId = setTimeout(tick, 100 / speed);
        }
      };

      tick();
    },
    stop(): void {
      running = false;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = null;
    },
  };
}

function bearing(from: [number, number], to: [number, number]): number {
  const lat1 = (from[1] * Math.PI) / 180;
  const lat2 = (to[1] * Math.PI) / 180;
  const dLng = ((to[0] - from[0]) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
