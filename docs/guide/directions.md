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
  'line-color': '#0066ff',
  'line-width': 4,
  'line-opacity': 0.8,
});
```

::: tip
Directions are accessed via the `GebetaMaps` instance (`sdk.getDirections()`, `sdk.displayRoute()`). The `@gebeta/js/directions` subpath is available for advanced use cases where you need direct access to the visual `DirectionsManager` with a map adapter.
:::
