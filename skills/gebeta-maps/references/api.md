# Gebeta JS SDK — API reference (verified against @gebeta/js 3.0.12 source)

## `new GebetaMaps(options)`

| Option           | Type                            | Notes                                                                                                        |
| ---------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `auth`           | `{ accessToken, refreshToken }` | Service account. XOR with `apiKey`.                                                                          |
| `apiKey`         | `string`                        | Deprecated. Trimmed automatically.                                                                           |
| `clustering`     | `ClusteringOptions`             | Constructor-only. `{ enabled, radius=50, maxZoom=16, clusterImage, clusterOnClick, showClusterCount=false }` |
| `enableClientId` | `boolean` (default `false`)     | Sends a stable `X-Device-ID` header (stored in localStorage).                                                |

## `sdk.init(options): GebetaMapInstance`

| Option                      | Default        | Notes                                                                                                                                  |
| --------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `container`                 | —              | Element **id** string (no `#`) or `HTMLElement`.                                                                                       |
| `center`                    | engine default | `[lng, lat]`. Addis Ababa ≈ `[38.7578, 9.0301]`.                                                                                       |
| `zoom`                      | engine default |                                                                                                                                        |
| `styleUrl`                  | standard style | Style JSON URL.                                                                                                                        |
| `style`                     | —              | Style URL or object; wins over `styleUrl`.                                                                                             |
| `navigationControl`         | `false`        | Adds `gebeta.NavigationControl`.                                                                                                       |
| `navigationControlPosition` | `'top-right'`  |                                                                                                                                        |
| _anything else_             |                | Forwarded to `new gebeta.Map(...)` (pitch, bearing, maxBounds, minZoom, hash, interactive, cooperativeGestures, renderWorldCopies, …). |

`attributionControl` is forced to `false` by the SDK; add one yourself if you need it:
`map.addControl(new gebeta.AttributionControl({ compact: true }), 'bottom-left')`.

Other instance members:

| Member                                                     | Notes                                                                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `getMap()`                                                 | `GebetaMapInstance \| null`                                                                |
| `getPlatform()`                                            | `{ mapAdapter, markerFactory, popupFactory, ... }` — throws before `init()`                |
| `addNavigationControls(position?)`                         | Same as `navigationControl: true`                                                          |
| `geocodingManager`                                         | Throws until style loaded                                                                  |
| `getDirections(origin, dest, opts?)`                       | Throws until style loaded                                                                  |
| `displayRoute(route, opts?)`                               | `{ showMarkers=true, originIcon, destinationIcon, waypointIcon, routeStyle }`; fits bounds |
| `clearRoute()` / `getCurrentRoute()` / `getRouteSummary()` |                                                                                            |
| `updateRouteStyle(style)`                                  | `'line-color' (#007cbf) / 'line-width' (4) / 'line-opacity' (0.8) / 'line-dasharray'`      |
| `clustering`                                               | `ClusteringManager \| null`                                                                |
| `fencing`                                                  | `FenceManager` — throws until style loaded                                                 |
| `navigation`                                               | `NavigationManager` — throws until style loaded                                            |

SDK-owned map ids (useful as `beforeId`, or to restyle): source+layer `gebeta-route`;
fences `gebeta-fence-<id>` / `gebeta-fence-layer-<id>` / `gebeta-fence-border-layer-<id>`;
drawing preview `gebeta-fence-source`, `gebeta-fence-layer`, `gebeta-fence-dynamic-polyline-layer`.
Clustered markers are DOM markers (not layers) — for >1–2k points prefer a native
GeoJSON cluster source (see gebeta-maps-recipes → layers).

## Markers & popups (`sdk.addMarker` / `sdk.addPopup`, after 3.0.12)

Both work right after `init()` (no need to wait for `load`) and return objects with `.remove()`.

| `addMarker` option      | Notes                                                                   |
| ----------------------- | ----------------------------------------------------------------------- |
| `lngLat`                | `[lng, lat]` or `{ lng, lat }` (required)                               |
| `element`               | Custom HTML pin; wins over `imageUrl` / `color`                         |
| `imageUrl`, `size`      | Image pin (default size `[30, 30]`, anchored at the bottom)             |
| `color`                 | Color of the default pin                                                |
| `anchor`, `offset`      | `'center'`, `'top'`, `'bottom'`, `'left'`, `'right'`, corners; `[x, y]` |
| `draggable`             | With `onDragEnd(({ lng, lat }, marker) => …)`                           |
| `rotation`, `className` |                                                                         |
| `popup`                 | Text (XSS-safe) or `HTMLElement`, opened on click                       |
| `onClick`               | `(marker, event) => …`                                                  |

`addPopup({ lngLat, text | html | element, closeButton = true, closeOnClick = true, anchor, offset, maxWidth, className })`
— `text` is XSS-safe; use `html` only with trusted markup.

```js
const a = sdk.addMarker({ lngLat: origin, element: pinEl('A'), anchor: 'bottom' });
const b = sdk.addMarker({ lngLat: destination, element: pinEl('B'), anchor: 'bottom' });
const popup = sdk.addPopup({ lngLat: origin, text: 'Start here' });
[a, b, popup].forEach(x => x.remove());
```

For lower-level control use the namespace: `new gebeta.Marker({ … }).setLngLat(ll).addTo(map)`.
(`sdk.getPlatform().markerFactory` is internal plumbing; don't use it in app code.)

## Types (`@gebeta/api`)

```ts
import type { API } from '@gebeta/api';
type LngLat = API.Common.Types.LngLat; // { lng, lat }
type RouteData = API.Routing.Types.RouteData; // { geometry: LineString, origin, destination, distance?, duration?, instructions?, summary? }
type RouteInstruction = API.Routing.Types.RouteInstruction; // { instruction?, type?, length? (m), time? (s), coord? [lng,lat], icon?, turn? }
type GeocodeResult = API.Geocoding.Types.Result; // { name?, lngLat: { lng, lat }, [k]: any }
type MarkerData = API.Overlay.Types.MarkerData; // { id, lngLat, imageUrl?, size?, onClick?, zIndex?, popupContent? }
```

Errors (`import { ValidationError, NetworkError, GeocodingError, PlatformError } from '@gebeta/api'`)
carry a `code` from `API.Errors.Codes` (e.g. `PLATFORM_NOT_INITIALIZED`, `NETWORK_REQUEST_FAILED`,
`GEOCODING_REQUEST_FAILED`).

## Geocoding

`geocode(name: string)` → `GET https://mapapi.gebeta.app/api/v1/route/geocoding?name=...`
`reverseGeocode({ lat, lng })` → `.../revgeocoding?lat=..&lon=..`
Both resolve to `Array<{ name, lngLat: { lng, lat }, ...rawFields }>` (empty array when nothing found).

Debounce autocomplete input (≥300 ms) and ignore stale responses:

```js
let seq = 0;
input.addEventListener(
  'input',
  debounce(async () => {
    const q = input.value.trim();
    if (q.length < 2) return;
    const id = ++seq;
    const results = await sdk.geocodingManager.geocode(q);
    if (id === seq) render(results);
  }, 300)
);
```

## Directions

```js
const route = await sdk.getDirections(origin, destination, { waypoints, avgSpeedKmh: 30 });
```

`distance` / `duration` may be a number (meters / seconds) **or** a preformatted string — format
defensively: `typeof d === 'number' ? (d / 1000).toFixed(1) + ' km' : d`.

## Navigation

```ts
sdk.navigation.start(route, { userId: string, role?: string = 'driver', precision?: 'low' | 'high' = 'high' }, locationProvider);
sdk.navigation.stop(); sdk.navigation.isNavigating(); sdk.navigation.getCurrentStepIndex(); sdk.navigation.getCurrentRoute();
sdk.navigation.on(event, cb); sdk.navigation.off(event, cb);
```

| Event        | Payload                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `start`      | `{ route }`                                                                                               |
| `progress`   | `{ remainingDistance (m), remainingDuration (s or string), currentStep?, stepIndex?, progress? (0–100) }` |
| `stepchange` | `{ step, stepIndex, previousStep? }`                                                                      |
| `offroute`   | `{ location, snapped: { distance, point, index, t, along } }`                                             |
| `arrive`     | `{ location }`                                                                                            |
| `stop`       | `{ route? }`                                                                                              |
| `error`      | `NavigationError`                                                                                         |

TypeScript: payloads are inferred from the event name after 3.0.12. On 3.0.12, annotate with
`API.Navigation.Events.ProgressEvent | StepChangeEvent | OffRouteEvent | ArriveEvent | StartEvent | StopEvent`
(`import type { API } from '@gebeta/api'`).

Defaults: off-route threshold 40 m, arrive threshold 25 m. Navigation also streams the user's
position to Gebeta tracking (`userId`/`role`), and the browser manager adds a location marker
and camera follow.

Location providers implement `{ start(onLocation: (loc: { lat, lng, heading?, speed?, accuracy?, timestamp? }) => void), stop() }`.
`BrowserLocationProvider.getInstance({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })`
wraps `navigator.geolocation.watchPosition` (needs HTTPS / localhost). For demos, write a simulated
provider that walks `route.geometry.coordinates` on a timer.

## Clustering manager

`addMarker(MarkerData)`, `removeMarker(id): boolean`, `clearMarkers()`, `getMarkers()`,
`getMarker(id)`, `updateOptions(partialOptions)`, `getOptions()`.
Default cluster click zooms in; override with `clustering.clusterOnClick(cluster, event)`.

## Fence manager

| Method                                                             | Notes                                                                                                                          |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `startDrawing(style?)` / `stopDrawing()`                           | Map clicks add points; clicking the first point (≥3 points) closes                                                             |
| `addPoint(lngLat, opts?)`                                          | Programmatic point while drawing                                                                                               |
| `closeFence(): FenceDefinition \| null`                            | Needs ≥3 points (`canCloseFence()`)                                                                                            |
| `clearCurrentFence()`                                              | Abort current drawing                                                                                                          |
| `renderFences(defs, { clearExisting=true, persistent=false })`     | `defs: { id, name?, points: LngLatLike[], color?, borderColor?, overlayContent?, overlayOptions? }[]` — ring is closed for you |
| `getFences()` / `getFence(id)` / `getFenceByName(name)`            |                                                                                                                                |
| `removeFence(id)` / `removeFenceByName(name)` / `clearAllFences()` |                                                                                                                                |
| `getFenceCentroid(fenceOrId)`                                      | `{ lng, lat }`                                                                                                                 |
| `setDefaultStyle(style)` / `updateCurrentFenceStyle(style)`        | `{ fillColor, fillOpacity, lineColor, lineWidth, lineDashArray, borderColor, ... }`                                            |
| `isDrawingFence()` / `getCurrentFencePoints()`                     |                                                                                                                                |
| `on('fenceCompleted', cb)` / `off(...)`                            | `cb({ fenceId, points, name? })`                                                                                               |

Point-in-polygon (geofence check):

```js
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { polygon, point } from '@turf/helpers';
const f = sdk.fencing.getFence('zone-1');
const ring = f.points.map(p => (Array.isArray(p) ? p : [p.lng, p.lat]));
const inside = booleanPointInPolygon(point([lng, lat]), polygon([[...ring, ring[0]]]));
```

## Standalone / tree-shaken imports

| Import                  | Exports                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| `@gebeta/js`            | everything                                                           |
| `@gebeta/js/geocoding`  | `GeocodingManager`, `AuthManager` (~45 kB)                           |
| `@gebeta/js/directions` | `DirectionsManager` (needs map adapter — prefer `sdk.getDirections`) |
| `@gebeta/js/clustering` | `ClusteringManager`                                                  |
| `@gebeta/js/fencing`    | `FenceManager`                                                       |
| `@gebeta/js/navigation` | `NavigationManager`, `BrowserLocationProvider`                       |

Standalone `GeocodingManager`:

```js
import { GeocodingManager, AuthManager } from '@gebeta/js/geocoding';

// after 3.0.12: pass an AuthManager (or a legacy API key string) directly
const geocoder = new GeocodingManager(new AuthManager({ accessToken, refreshToken })); // 401 → refresh → retry

// 3.0.12 and earlier: wrap it in a resolved auth object (also works on later versions)
const geocoder312 = new GeocodingManager({
  type: 'SERVICE_ACCOUNT',
  manager: new AuthManager({ accessToken, refreshToken }),
});

const hits = await geocoder.geocode('Piassa');
```

## CDN globals

`window.GebetaMaps`, `window.gebeta` (Marker, Popup, controls…), `GeocodingManager`, `DirectionsManager`,
`ClusteringManager`, `FenceManager`, `NavigationManager`, `BrowserLocationProvider`,
`GebetaMaps.VERSION`. URLs: `/static/current/` (latest), `/static/v3/` (major, recommended),
`/static/releases/<x.y.z>/` (exact) under `https://tiles.gebeta.app`.
