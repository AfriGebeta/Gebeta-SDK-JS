# Directions

Calculate and display routes between two points.

## Get and display a route

```js
const origin = { lat: 9.0161, lng: 38.7685 };
const destination = { lat: 9.0300, lng: 38.7800 };

const route = await gebetaMap.getDirections(origin, destination);
gebetaMap.displayRoute(route, { showMarkers: true });
```

## Route summary

```js
const summary = gebetaMap.getRouteSummary();
console.log(summary.distance); // meters
console.log(summary.duration); // seconds
```

## Clear route

```js
gebetaMap.clearRoute();
```

## Custom route styling

```js
gebetaMap.updateRouteStyle({
  lineColor: '#0066ff',
  lineWidth: 4,
  lineOpacity: 0.8,
});
```

## Standalone (tree-shaking)

```js
import { DirectionsManager } from '@gebeta/js/directions';

const directions = new DirectionsManager({ accessToken, refreshToken });
const route = await directions.getRoute(origin, destination);
```
