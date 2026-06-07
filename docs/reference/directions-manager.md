# DirectionsManager

Directions are accessed via the `GebetaMaps` instance methods. There is no standalone constructor for the visual `DirectionsManager`.

## Usage

```js
import { GebetaMaps } from '@gebeta/js';

const sdk = new GebetaMaps({ auth: { accessToken, refreshToken } });
sdk.init({ container: 'map' });

// Calculate a route
const route = await sdk.getDirections(origin, destination);

// Display it on the map
sdk.displayRoute(route, { showMarkers: true });

// Clear it
sdk.clearRoute();
```

## `sdk.getDirections(origin, destination, options?)`

```ts
getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  options?: DirectionsOptions
): Promise<RouteData>
```

## RouteData

```ts
interface RouteData {
  geometry: { type: 'LineString'; coordinates: [number, number][] };
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  distance?: string | number | null; // e.g. "5.2 km" or meters
  duration?: string | number | null; // e.g. "15 min" or seconds
  instructions?: RouteInstruction[];
  summary?: RouteSummary;
}
```
