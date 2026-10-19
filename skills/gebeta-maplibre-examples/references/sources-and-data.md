# Sources & data (MapLibre 4.7 on Gebeta)

Insert data layers below Gebeta labels:
`const beforeId = map.getStyle().layers.find(l => l.type === 'symbol')?.id;`

## Vector tile source

Gebeta's own vector sources are already in the style (`roads`, `buildings`, `water`, `landuse`,
`pois`, `boundaries`). Reuse them instead of adding tiles:

```js
map.addLayer(
  {
    id: 'my-roads',
    type: 'line',
    source: 'roads',
    'source-layer': 'transportation',
    filter: ['==', ['get', 'class'], 'primary'],
    paint: { 'line-color': '#ff0066', 'line-width': 3 },
  },
  beforeId
);
```

Third-party vector tiles:
`map.addSource('ext', { type: 'vector', tiles: ['https://example.com/{z}/{x}/{y}.pbf'], maxzoom: 14 })`
(or `url: 'https://example.com/tiles.json'`) then add layers with the right `source-layer`.

## GeoJSON line / polygon / points / mixed

```js
map.addSource('trip', {
  type: 'geojson',
  data: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [38.7578, 9.0301],
        [38.7633, 9.019],
        [38.788, 8.9906],
      ],
    },
  },
});
map.addLayer(
  {
    id: 'trip',
    type: 'line',
    source: 'trip',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#888', 'line-width': 6 },
  },
  beforeId
);

map.addSource('zone', {
  type: 'geojson',
  data: {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [38.74, 9.0],
          [38.78, 9.0],
          [38.78, 9.03],
          [38.74, 9.03],
          [38.74, 9.0],
        ],
      ],
    },
  },
});
map.addLayer(
  {
    id: 'zone-fill',
    type: 'fill',
    source: 'zone',
    paint: { 'fill-color': '#088', 'fill-opacity': 0.4 },
  },
  beforeId
);
map.addLayer(
  {
    id: 'zone-line',
    type: 'line',
    source: 'zone',
    paint: { 'line-color': '#044', 'line-width': 2 },
  },
  beforeId
);

map.addSource('places', { type: 'geojson', data: '/places.geojson' }); // URL or object
map.addLayer({
  id: 'places',
  type: 'symbol',
  source: 'places',
  layout: {
    'icon-image': 'point_solid_24px',
    'text-field': ['get', 'title'],
    'text-font': ['JakartaSans'],
    'text-offset': [0, 1.25],
    'text-anchor': 'top',
  },
});

// one source, many geometry types: add one layer per type with a $type / geometry-type filter
map.addLayer({
  id: 'm-poly',
  type: 'fill',
  source: 'mixed',
  filter: ['==', ['geometry-type'], 'Polygon'],
  paint: { 'fill-color': '#888', 'fill-opacity': 0.4 },
});
map.addLayer({
  id: 'm-pt',
  type: 'circle',
  source: 'mixed',
  filter: ['==', ['geometry-type'], 'Point'],
  paint: { 'circle-radius': 6, 'circle-color': '#B42222' },
});
```

Prefer a Gebeta route over a hand-drawn line when the user means "the road path":
`const route = await sdk.getDirections(a, b); map.addSource('r', { type: 'geojson', data: route.geometry })`
(or simply `sdk.displayRoute(route)`).

## Line crossing the 180° meridian

Use longitudes beyond ±180 (e.g. `[179, 0], [181, 0]`) — not relevant to Ethiopia but works.

## Load a local GeoJSON file

```js
input.addEventListener('change', async () => {
  const data = JSON.parse(await input.files[0].text());
  map.getSource('local')
    ? map.getSource('local').setData(data)
    : map.addSource('local', { type: 'geojson', data });
  if (!map.getLayer('local'))
    map.addLayer({
      id: 'local',
      type: 'circle',
      source: 'local',
      paint: { 'circle-color': '#e55e5e' },
    });
});
// "experimental": same idea with window.showOpenFilePicker() (Chromium only)
```

## Raster tiles / WMS / Gebeta satellite as overlay

```js
// Gebeta satellite as a layer on top of the standard style (auth added automatically)
map.addSource('gebeta-sat', {
  type: 'raster',
  tiles: ['https://tiles.gebeta.app/tiles/raster/{z}/{x}/{y}.png'],
  tileSize: 256,
  maxzoom: 18,
});
map.addLayer(
  { id: 'gebeta-sat', type: 'raster', source: 'gebeta-sat', paint: { 'raster-opacity': 0.7 } },
  beforeId
);

// WMS
map.addSource('wms', {
  type: 'raster',
  tileSize: 256,
  tiles: [
    'https://example.com/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=LAYER',
  ],
});
map.addLayer({ id: 'wms', type: 'raster', source: 'wms' }, beforeId);
```

## COG raster (plugin)

`npm i @geomatico/maplibre-cog-protocol` →
`maplibregl.addProtocol('cog', cogProtocol)` then
`map.addSource('cog', { type: 'raster', url: 'cog://https://example.com/file.tif', tileSize: 256 })`.
Check the plugin's supported MapLibre range; pin a version that supports 4.x.

## Image, video, canvas, animated image series

```js
const corners = [
  [38.74, 9.04],
  [38.78, 9.04],
  [38.78, 9.01],
  [38.74, 9.01],
]; // TL, TR, BR, BL
map.addSource('img', { type: 'image', url: '/overlay.png', coordinates: corners });
map.addLayer({ id: 'img', type: 'raster', source: 'img', paint: { 'raster-opacity': 0.85 } });

map.addSource('vid', { type: 'video', urls: ['/clip.mp4', '/clip.webm'], coordinates: corners });
map.addLayer({ id: 'vid', type: 'raster', source: 'vid' });
// map.getSource('vid').pause() / .play()

map.addSource('cnv', { type: 'canvas', canvas: 'myCanvasId', coordinates: corners, animate: true });
map.addLayer({ id: 'cnv', type: 'raster', source: 'cnv' });

// animated series (e.g. radar frames)
let f = 0;
setInterval(() => {
  f = (f + 1) % frames.length;
  map.getSource('img').updateImage({ url: frames[f], coordinates: corners });
}, 300);
```

## Live realtime data / update a feature / update polygons

```js
map.addSource('vehicles', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
map.addLayer({
  id: 'vehicles',
  type: 'symbol',
  source: 'vehicles',
  layout: {
    'icon-image': 'taxi_solid_24px',
    'icon-allow-overlap': true,
    'text-field': ['get', 'plate'],
    'text-font': ['JakartaSans'],
    'text-offset': [0, 1.2],
    'text-size': 11,
  },
});

const timer = setInterval(async () => {
  const fc = await fetch('/api/vehicles.geojson').then(r => r.json());
  map.getSource('vehicles').setData(fc);
}, 2000);
// cleanup: clearInterval(timer)
```

For many moving points, `GeoJSONSource.updateData({ update: [...] , add: [...], remove: [...] })`
(v4 supports it when the source has `promoteId` or feature `id`s) avoids re-sending everything.

## Not available on v4 (v5+)

Polar stereographic / UTM / identity projections, MLT-encoded tiles. Explain the limitation;
for local CRS data reproject to WGS84 (e.g. `proj4`) before adding it as GeoJSON.
