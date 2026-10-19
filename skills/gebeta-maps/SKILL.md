---
name: gebeta-maps
description: Build maps and location features with the Gebeta Maps SDK (@gebeta/js, @gebeta/react, @gebeta/node, CDN). Use when adding an interactive map, geocoding/reverse geocoding, directions/routes, turn-by-turn navigation, marker clustering, or geofencing with Gebeta; when wiring Gebeta service-account auth (clientToken → backend → accessToken/refreshToken); or when a Gebeta map is blank, throws "not initialized", or tiles return 401. For general MapLibre features on top of a Gebeta map (layers, 3D, popups, animations, terrain…), also load the gebeta-maplibre-examples skill.
---

# Gebeta Maps SDK

Gebeta Maps is a MapLibre GL JS wrapper (SDK v3, bundles **maplibre-gl 4.7.x**) that adds
authenticated Gebeta tiles plus geocoding, directions, navigation, clustering and fencing.
Default map center is Addis Ababa. Coordinates are **[lng, lat]** arrays or `{ lng, lat }` objects.

Everything below was checked against the SDK source. Where the public docs disagree, trust this
file (see "Version notes" at the bottom).

## 1. Pick the package

| Situation                                | Install                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| Plain HTML, no bundler                   | `<script src="https://tiles.gebeta.app/static/v3/gebeta-maps.umd.js">` |
| Vanilla JS / Vue / Svelte with a bundler | `npm i @gebeta/js maplibre-gl@^4`                                      |
| React 19                                 | `npm i @gebeta/react @gebeta/js maplibre-gl@^4`                        |
| Backend that issues tokens               | `npm i @gebeta/node`                                                   |
| Geocoding only (browser or Node)         | `npm i @gebeta/js` and import from `@gebeta/js/geocoding`              |
| Types only                               | `@gebeta/api`                                                          |

`maplibre-gl` is external to the SDK build, so `import maplibregl from 'maplibre-gl'` in the app
is the **same instance** the SDK uses — use it for `Marker`, `Popup`, controls, `addProtocol`.

## 2. Auth (do this first)

Two modes; exactly one must be passed (`auth` XOR `apiKey`, else `ValidationError`).

- **Service account (recommended).** Backend holds `GEBETA_SERVER_TOKEN` and exchanges the
  app's public `clientToken` for `{ accessToken, refreshToken }`. Access tokens live ~7 min;
  the SDK refreshes and retries 401s automatically — fetch tokens once per page load.
- **API key (deprecated).** `new GebetaMaps({ apiKey })` — logs a deprecation warning. Fine for
  quick prototypes.

```ts
// backend (Express) — never ship the server token to the browser
import { GebetaAuth } from '@gebeta/node';
const gebeta = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });
app.post('/gebeta/auth', async (req, res) => {
  try {
    res.json(await gebeta.authenticate(req.body.clientToken)); // { accessToken, refreshToken }
  } catch {
    res.status(502).json({ error: 'Gebeta auth failed' });
  }
});
```

```js
// frontend
const auth = await fetch('/gebeta/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clientToken: import.meta.env.VITE_GEBETA_CLIENT_TOKEN }),
}).then(r => r.json());
```

Only requests to `https://tiles.gebeta.app/...` are signed (via MapLibre `transformRequest`).
Third-party sources you add are fetched untouched.

## 3. Minimal map

### CDN

```html
<div id="map" style="width:100%;height:100vh"></div>
<script src="https://tiles.gebeta.app/static/v3/gebeta-maps.umd.js"></script>
<script>
  // globals: GebetaMaps, maplibregl, GeocodingManager, BrowserLocationProvider, ...
  // maplibre CSS is injected automatically by the UMD build
  const sdk = new GebetaMaps({ apiKey: 'YOUR_KEY' }); // or { auth: { accessToken, refreshToken } }
  const map = sdk.init({
    container: 'map',
    center: [38.7578, 9.0301],
    zoom: 13,
    navigationControl: true,
  });
  map.on('load', () => {
    /* SDK managers + any MapLibre API are ready here */
  });
</script>
```

### Bundler (`@gebeta/js`)

```js
import 'maplibre-gl/dist/maplibre-gl.css'; // REQUIRED with bundlers (only the CDN build injects it)
import { GebetaMaps } from '@gebeta/js';

const sdk = new GebetaMaps({ auth });
const map = sdk.init({ container: 'map', center: [38.7578, 9.0301], zoom: 13 });
map.on('load', async () => {
  const [place] = await sdk.geocodingManager.geocode('Meskel Square');
  map.flyTo({ center: [place.lngLat.lng, place.lngLat.lat], zoom: 16 });
});
```

### React → see `references/react.md` (on SDK ≤ 3.0.12 size the **parent**, never pass `style`).

## 4. Lifecycle rules (most common failure)

1. `container` string is an **element id** (`'map'`), not a selector — `'#map'` throws
   `Container '#map' not found`. An `HTMLElement` also works.
2. `init()` returns the MapLibre `Map` immediately, but `sdk.geocodingManager`, `sdk.fencing`,
   `sdk.navigation`, `sdk.getDirections()` throw `PlatformError PLATFORM_NOT_INITIALIZED` until
   the style loads. Call them inside `map.on('load')` (or React `onLoad`).
3. `clustering: { enabled: true }` must be passed to the **constructor**; `sdk.clustering` is
   `null` otherwise and cannot be enabled later.
4. Anything else in `init()` options (`pitch`, `bearing`, `maxBounds`, `hash`,
   `cooperativeGestures`, `interactive`, …) is forwarded to `new maplibregl.Map()`.
   `style` (object) or `styleUrl` (string) override the default style.
5. `map.setStyle()` wipes SDK layers (route, fences) and your own layers — re-add them on
   `style.load`.

## 5. Services cheat-sheet (verified signatures)

```js
// Styles
import { API } from '@gebeta/api';
API.Map.Constants.STYLES.standard.url; // https://tiles.gebeta.app/styles/standard/style.json (default)
API.Map.Constants.STYLES.satellite.url; // .../styles/raster/raster.json
API.Map.Constants.STYLES.terrain.url; // .../styles/standard/terrain/terrain.json (3D terrain + hillshade)
sdk.init({ container: 'map', styleUrl: API.Map.Constants.STYLES.satellite.url });

// Geocoding → Array<{ name, lngLat: { lng, lat }, ...extraApiFields }>
const results = await sdk.geocodingManager.geocode('Bole, Addis Ababa');
const places = await sdk.geocodingManager.reverseGeocode({ lat: 9.0161, lng: 38.7685 });

// Directions (origin/destination are { lat, lng } objects)
const route = await sdk.getDirections(
  { lat: 9.0161, lng: 38.7685 },
  { lat: 9.03, lng: 38.78 },
  {
    waypoints: [{ lat: 9.02, lng: 38.77 }], // optional
  }
);
sdk.displayRoute(route, { showMarkers: true }); // draws layer 'gebeta-route' and fits bounds
sdk.updateRouteStyle({ 'line-color': '#0066ff', 'line-width': 5 });
sdk.getRouteSummary(); // { distance, duration, origin, destination, waypoints } | null
sdk.clearRoute();
// route.geometry is a GeoJSON LineString; route.instructions[] has { instruction, length, time, coord }

// Navigation (needs a route)
import { BrowserLocationProvider } from '@gebeta/js';
sdk.navigation.on(
  'progress',
  e => e.remainingDistance /* m */ && e.remainingDuration && e.currentStep
);
sdk.navigation.on('stepchange', e => e.step.instruction);
sdk.navigation.on('offroute', e => e.snapped.distance);
sdk.navigation.on('arrive', () => sdk.navigation.stop());
sdk.navigation.start(
  route,
  { userId: 'driver-42', role: 'driver' },
  BrowserLocationProvider.getInstance()
);
// any { start(cb), stop() } object works as a location provider (e.g. a simulator)

// Clustering (constructor: new GebetaMaps({ auth, clustering: { enabled: true, radius: 50, maxZoom: 16, showClusterCount: true } }))
sdk.clustering.addMarker({
  id: 'a',
  lngLat: [38.76, 9.01],
  imageUrl: '/pin.png',
  size: [30, 30],
  popupContent: '<b>Shop A</b>',
  onClick: (lngLat, marker, ev) => {},
});
sdk.clustering.removeMarker('a');
sdk.clustering.clearMarkers();
sdk.clustering.getMarkers();

// Fencing (interactive polygon drawing + rendering saved fences)
sdk.fencing.startDrawing({ fillColor: '#ff6600' }); // user clicks map; clicking first point closes
sdk.fencing.on('fenceCompleted', ({ fenceId, points }) => save(fenceId, points));
sdk.fencing.renderFences([
  {
    id: 'zone-1',
    name: 'Bole',
    points: [
      [38.76, 9.01],
      [38.78, 9.01],
      [38.78, 9.03],
      [38.76, 9.03],
    ],
    color: '#22aa66',
  },
]);
sdk.fencing.getFences();
sdk.fencing.removeFence('zone-1');
sdk.fencing.clearAllFences();
```

Point-in-fence checks are **not** in the SDK — use `@turf/boolean-point-in-polygon` on
`sdk.fencing.getFence(id).points`.

Full details, types, and standalone/tree-shaken usage: `references/api.md`.
Backend + Node geocoding: `references/server.md`. React: `references/react.md`.

## 6. Using raw MapLibre

`sdk.getMap()` (or the return of `init()`) is a normal `maplibregl.Map`. Anything from
https://maplibre.org/maplibre-gl-js/docs/examples/ works on it, with Gebeta-specific
adjustments (fonts, sprite icons, layer ids, v4 vs v5) — load the **gebeta-maplibre-examples**
skill for those recipes.

## 7. Troubleshooting

| Symptom                                          | Cause / fix                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| Grey/blank map, 401 on `tiles.gebeta.app`        | Expired/invalid tokens or wrong apiKey; re-fetch tokens from backend |
| `Container 'xyz' not found`                      | Pass element id without `#`, and make sure the element exists first  |
| Map has 0 height                                 | Give the container (React: its parent) an explicit height            |
| `... manager not initialized. Call init() first` | Called before style load; move into `map.on('load')` / `onLoad`      |
| `sdk.clustering` is `null`                       | Enable clustering in the constructor (React: `clustering` prop)      |
| Controls/popups unstyled, markers mispositioned  | Missing `import 'maplibre-gl/dist/maplibre-gl.css'`                  |
| Custom labels don't render                       | Use `"text-font": ["JakartaSans"]` (see examples skill)              |
| Route/fences vanish after switching style        | `setStyle` clears layers; re-add on `style.load`                     |

## Version notes

Old docs (pre-GebetaDocs) were wrong in places; trust this skill:

- Geocode results are `{ name, lngLat: { lng, lat } }`, not `{ name, lat, lng }`.
- Fencing has no `addFence` / `isInsideFence` / `clearFences`; use `renderFences`,
  `startDrawing`, `clearAllFences` (above).
- Map styles live at `API.Map.Constants.STYLES`, not `MAP_STYLES`.
- React `onLoad` receives the `GebetaMaps` instance, not `{ clustering }`.
- Navigation progress field is `remainingDuration`, not `remainingTime`.
- `BrowserLocationProvider` has a private constructor in TS; use `BrowserLocationProvider.getInstance()`.

Fixed after 3.0.12 (check the installed `@gebeta/*` version; on 3.0.12 apply the workaround):

| Issue on 3.0.12                                                    | Workaround on 3.0.12                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `new GeocodingManager(new AuthManager(...))` / `(apiKey)` crashes  | `new GeocodingManager({ type: 'SERVICE_ACCOUNT', manager: new AuthManager(tokens) })` |
| `<GebetaMap style={{...}}>` is passed to MapLibre as the map style | Size the parent element; don't pass `style`                                           |
| `onLoad` / navigation `on()` callbacks are untyped (`any`)         | Annotate: `(gm: GebetaMapRef)`, `(e: API.Navigation.Events.ProgressEvent)`            |
| `<GebetaMap apiKey auth>` silently ignores `apiKey`                | Pass only one                                                                         |
