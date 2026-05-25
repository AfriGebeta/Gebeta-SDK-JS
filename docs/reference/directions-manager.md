# DirectionsManager

## Import

```js
import { DirectionsManager } from '@gebeta/js/directions';
const directions = new DirectionsManager(auth);
```

## Methods

### `getRoute(origin, destination, options?)`

```ts
getRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  options?: DirectionsOptions
): Promise<RouteData>
```

## RouteData

```ts
interface RouteData {
  geometry: GeoJSON.LineString;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  summary: { distance: number; time: number };
  instructions: Instruction[];
}
```
