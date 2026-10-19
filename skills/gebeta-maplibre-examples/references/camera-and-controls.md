# Map basics, camera & controls (MapLibre 4.7 on Gebeta)

`map` = `sdk.init(...)` result; run after `map.on('load')` unless noted. Init-time options go in
`sdk.init({ container: 'map', ...options })` — they are forwarded to `new maplibregl.Map`.

## Display a map / satellite / terrain style

```js
import { API } from '@gebeta/api';
sdk.init({ container: 'map', center: [38.7578, 9.0301], zoom: 12 }); // standard
sdk.init({ container: 'map', styleUrl: API.Map.Constants.STYLES.satellite.url, zoom: 15 }); // satellite
sdk.init({ container: 'map', styleUrl: API.Map.Constants.STYLES.terrain.url, pitch: 60 }); // terrain
// switch later (re-add your layers on 'style.load'):
map.setStyle(API.Map.Constants.STYLES.satellite.url);
```

## Non-interactive map

`sdk.init({ container: 'map', interactive: false })`

## Attribution position

The SDK disables the default attribution; add your own where you like:
`map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: '© Gebeta Maps' }), 'top-left')`

## Check WebGL support

```js
function webglSupported() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
if (!webglSupported())
  document.getElementById('map').textContent = 'Your browser does not support WebGL.';
else sdk.init({ container: 'map' });
```

## Fly / jump / slow fly / pitch & bearing

```js
map.flyTo({ center: [38.7469, 9.0054], zoom: 16, essential: true }); // fly to
map.flyTo({ center, zoom: 15, speed: 0.2, curve: 1, easing: t => t }); // slowly fly
map.jumpTo({ center: [38.8, 8.98] }); // instant
map.easeTo({ pitch: 60, bearing: -30, duration: 1000 }); // pitch & bearing
sdk.init({ container: 'map', pitch: 45, bearing: -17.6 }); // at init

// jump to a series of locations
const stops = [
  [38.7578, 9.0301],
  [38.7469, 9.0054],
  [38.7998, 8.9779],
];
stops.forEach((c, i) => setTimeout(() => map.jumpTo({ center: c }), i * 2000));
```

## Customize camera animations

`map.flyTo({ center, zoom: 14, duration: 6000, easing: t => t * (2 - t), essential: true })`,
`map.easeTo({ center, offset: [100, 0], duration: 800 })`, `map.panBy([200, 0])`,
`map.zoomTo(17, { duration: 2000 })`, `map.rotateTo(90, { duration: 2000 })`.

## Animate camera around a point

```js
let raf;
function rotate(ts) {
  map.rotateTo((ts / 100) % 360, { duration: 0 });
  raf = requestAnimationFrame(rotate);
}
map.on('load', () => (raf = requestAnimationFrame(rotate)));
// cleanup: cancelAnimationFrame(raf)
```

## Animate a point / a line / a point along a route

```js
// point moving on a circle
map.addSource('pt', { type: 'geojson', data: { type: 'Point', coordinates: [38.7578, 9.0301] } });
map.addLayer({
  id: 'pt',
  type: 'circle',
  source: 'pt',
  paint: { 'circle-radius': 8, 'circle-color': '#007cbf' },
});
function frame(ts) {
  const a = ts / 1000;
  map.getSource('pt').setData({
    type: 'Point',
    coordinates: [38.7578 + Math.cos(a) * 0.01, 9.0301 + Math.sin(a) * 0.01],
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// growing line
const line = { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } };
map.addSource('line', { type: 'geojson', data: line });
map.addLayer({
  id: 'line',
  type: 'line',
  source: 'line',
  paint: { 'line-color': '#ed6498', 'line-width': 5 },
});
// push a coordinate per frame then map.getSource('line').setData(line)

// point along a Gebeta route (use the route instead of a hand-made arc)
import along from '@turf/along';
import length from '@turf/length';
import bearing from '@turf/bearing';
const route = await sdk.getDirections({ lat: 9.0301, lng: 38.7578 }, { lat: 8.9779, lng: 38.7998 });
sdk.displayRoute(route, { showMarkers: false });
const feature = { type: 'Feature', geometry: route.geometry, properties: {} };
const km = length(feature);
const steps = 500;
const path = Array.from(
  { length: steps + 1 },
  (_, i) => along(feature, (km * i) / steps).geometry.coordinates
);
const img = await map.loadImage('/car.png');
map.addImage('car', img.data);
map.addSource('car', { type: 'geojson', data: { type: 'Point', coordinates: path[0] } });
map.addLayer({
  id: 'car',
  type: 'symbol',
  source: 'car',
  layout: {
    'icon-image': 'car',
    'icon-rotate': ['get', 'bearing'],
    'icon-rotation-alignment': 'map',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
  },
});
let i = 0;
(function step() {
  if (i >= steps) return;
  map.getSource('car').setData({
    type: 'Feature',
    properties: { bearing: bearing(path[i], path[i + 1]) },
    geometry: { type: 'Point', coordinates: path[i] },
  });
  i++;
  requestAnimationFrame(step);
})();
```

## Fit bounds / fit a LineString

```js
map.fitBounds(
  [
    [38.68, 8.95],
    [38.85, 9.08],
  ],
  { padding: 40 }
); // [[west,south],[east,north]]
const coords = route.geometry.coordinates;
const b = coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]));
map.fitBounds(b, { padding: 60, maxZoom: 16 });
```

## Fly to location on scroll (story map)

```js
const chapters = {
  bole: { center: [38.788, 8.9906], zoom: 15 },
  piassa: { center: [38.7525, 9.0352], zoom: 16, pitch: 45 },
};
let active = 'bole';
document.getElementById('features').addEventListener('scroll', () => {
  for (const id of Object.keys(chapters)) {
    const r = document.getElementById(id).getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0 && id !== active) {
      map.flyTo(chapters[id]);
      active = id;
      break;
    }
  }
});
```

## Hash routing

`sdk.init({ container: 'map', hash: true })` (or `hash: 'map'` for a named param).

## Offset vanishing point with padding

`map.easeTo({ padding: { left: 300, top: 0, right: 0, bottom: 0 }, duration: 1000 })` — use when a
sidebar covers part of the map. `map.setPadding({...})` sets it without animation.

## Render world copies / restrict panning

```js
sdk.init({ container: 'map', renderWorldCopies: false });
sdk.init({
  container: 'map',
  maxBounds: [
    [33.0, 3.4],
    [48.0, 14.9],
  ],
}); // roughly Ethiopia
map.setMaxBounds([
  [38.6, 8.83],
  [38.92, 9.12],
]); // Addis Ababa later
```

## Transform constrain (v5+ `transformConstrain`) → v4 alternative

```js
sdk.init({
  container: 'map',
  // return only what you change; center must be a maplibregl.LngLat
  transformCameraUpdate: ({ center }) => ({
    center: new maplibregl.LngLat(
      Math.min(Math.max(center.lng, 38.6), 38.92),
      Math.min(Math.max(center.lat, 8.83), 9.12)
    ),
  }),
});
```

## First-person walk / 360° photosphere / center above ground / LOD control / MLT

Need MapLibre v5+. Closest v4: `sdk.init({ maxPitch: 85 })` + keyboard handler calling
`map.jumpTo({ center, bearing, pitch: 80, zoom: 19 })`; for photospheres use a separate viewer
(e.g. Pannellum) opened from a marker popup.

## Controls

```js
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right'); // or init({ navigationControl: true })
map.addControl(new maplibregl.FullscreenControl(), 'top-right');
map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
const geolocate = new maplibregl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: true,
});
map.addControl(geolocate);
map.on('load', () => geolocate.trigger()); // locate the user
```

## Interaction toggles

```js
sdk.init({ container: 'map', cooperativeGestures: true }); // ctrl/2-finger to zoom
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();
map.keyboard.disableRotation(); // disable rotation
map.scrollZoom.disable(); // disable scroll zoom
// toggle any of: scrollZoom, boxZoom, dragRotate, dragPan, keyboard, doubleClickZoom, touchZoomRotate
map[handler].isEnabled() ? map[handler].disable() : map[handler].enable();
```

## Game-like controls

```js
map.keyboard.disable();
map.getCanvas().focus();
map.getCanvas().addEventListener('keydown', e => {
  e.preventDefault();
  if (e.key === 'ArrowUp') map.panBy([0, -100], { easing: t => t });
  else if (e.key === 'ArrowDown') map.panBy([0, 100], { easing: t => t });
  else if (e.key === 'ArrowLeft') map.easeTo({ bearing: map.getBearing() - 25, easing: t => t });
  else if (e.key === 'ArrowRight') map.easeTo({ bearing: map.getBearing() + 25, easing: t => t });
});
```
