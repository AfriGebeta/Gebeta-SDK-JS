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
| `clustering` | `{ enabled: boolean, ... }` | Clustering options — must be set here; cannot be changed after `init()` |
| `enableClientId` | `boolean` | Attach a stable `X-Device-ID` header to all requests (default: `false`) |

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

Returns summary info for the current route, or `null` if no route is loaded.

```ts
getRouteSummary(): {
  distance?: string | number | null;
  duration?: string | number | null;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  waypoints?: { lat: number; lng: number }[];
} | null
```

### `updateRouteStyle(style)`

Updates the visual style of the displayed route. Style keys use MapLibre's kebab-case format.

```ts
updateRouteStyle(style: {
  'line-color'?: string;
  'line-width'?: number;
  'line-opacity'?: number;
  'line-dasharray'?: number[];
}): void
```

## Managers

All managers are initialized after the map style loads. Do not access them before `init()` completes.

| Property | Type | Description |
|----------|------|-------------|
| `geocodingManager` | `GeocodingManager` | Forward and reverse geocoding |
| `clustering` | `ClusteringManager \| null` | Marker clustering — `null` unless `clustering.enabled` was set in constructor |
| `fencing` | `FenceManager` | Geofencing |
| `navigation` | `NavigationManager` | Turn-by-turn navigation |
