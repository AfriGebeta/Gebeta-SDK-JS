# GebetaMaps

The main entry point for the JS SDK.

## Constructor

```ts
new GebetaMaps(options: ConstructorOptions)
```

| Option | Type | Description |
|--------|------|-------------|
| `auth` | `{ accessToken: string, refreshToken: string }` | Service account tokens (recommended) |
| `apiKey` | `string` | Legacy API key (deprecated) |

## Methods

### `init(options)`

Initializes and renders the map. Returns the underlying MapLibre `Map` instance.

```ts
init(options: {
  container: string | HTMLElement;
  center?: [number, number];   // [lng, lat], default: Addis Ababa
  zoom?: number;               // default: 12
  style?: string;              // map style URL
  navigationControl?: boolean; // show zoom/compass controls
}): MapLibreMap
```

### `getMap()`

Returns the underlying MapLibre GL JS map instance.

```ts
getMap(): MapLibreMap | null
```

### `getPlatform()`

Returns the platform context (adapters for map, markers, popups, etc.).

```ts
getPlatform(): PlatformContext
```

### `getDirections(origin, destination, options?)`

Calculates a route between two points.

```ts
getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  options?: DirectionsOptions
): Promise<RouteData>
```

### `displayRoute(routeData, options?)`

Renders a route on the map.

```ts
displayRoute(routeData: RouteData, options?: { showMarkers?: boolean }): void
```

### `clearRoute()`

Removes the current route from the map.

### `getRouteSummary()`

Returns distance and duration of the current route.

```ts
getRouteSummary(): { distance: number; duration: number } | null
```

### `updateRouteStyle(style)`

Updates the visual style of the displayed route.

## Managers

| Property | Type | Description |
|----------|------|-------------|
| `geocodingManager` | `GeocodingManager` | Forward and reverse geocoding |
| `clustering` | `ClusteringManager` | Marker clustering |
| `fenceManager` | `FenceManager` | Geofencing |
| `navigation` | `NavigationManager` | Turn-by-turn navigation |
