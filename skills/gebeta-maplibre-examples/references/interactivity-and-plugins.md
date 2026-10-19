# Events, queries & plugins (MapLibre 4.7 on Gebeta)

## Features under the mouse / polygon info on click

```js
map.on('mousemove', e => {
  const feats = map.queryRenderedFeatures(e.point); // or { layers: ['zone-fill'] }
  pre.textContent = JSON.stringify(
    feats.map(f => ({ layer: f.layer.id, props: f.properties })),
    null,
    2
  );
});
map.on('click', 'zone-fill', e =>
  new maplibregl.Popup().setLngLat(e.lngLat).setText(e.features[0].properties.name).addTo(map)
);
```

## Mouse coordinates

`map.on('mousemove', e => (coords.textContent = `${e.lngLat.lat.toFixed(5)}, ${e.lngLat.lng.toFixed(5)}`))`

## Hover effect (feature-state)

```js
map.addSource('zones', { type: 'geojson', data: '/zones.geojson', promoteId: 'zone_id' }); // or generateId: true
map.addLayer({
  id: 'zones',
  type: 'fill',
  source: 'zones',
  paint: {
    'fill-color': '#627BC1',
    'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.9, 0.4],
  },
});
let hoveredId = null;
map.on('mousemove', 'zones', e => {
  if (hoveredId !== null) map.setFeatureState({ source: 'zones', id: hoveredId }, { hover: false });
  hoveredId = e.features[0].id;
  map.setFeatureState({ source: 'zones', id: hoveredId }, { hover: true });
});
map.on('mouseleave', 'zones', () => {
  if (hoveredId !== null) map.setFeatureState({ source: 'zones', id: hoveredId }, { hover: false });
  hoveredId = null;
});
```

`setFeatureState` on a basemap vector source also needs `sourceLayer` and feature ids; Gebeta
tiles may not carry stable ids — prefer your own GeoJSON with `promoteId`.

## Symbol follows mouse / center on clicked symbol

```js
map.on('mousemove', e =>
  map.getSource('cursor').setData({ type: 'Point', coordinates: [e.lngLat.lng, e.lngLat.lat] })
);
map.on('click', 'places', e => map.flyTo({ center: e.features[0].geometry.coordinates }));
```

## Box selection (shift + drag)

```js
sdk.init({ container: 'map', boxZoom: false });
// track shift+mousedown → draw a div box → on mouseup:
const feats = map.queryRenderedFeatures([startPoint, endPoint], { layers: ['places'] });
map.setFilter('places-highlight', [
  'in',
  ['get', 'id'],
  ['literal', feats.map(f => f.properties.id)],
]);
```

## Performance metrics

```js
const t0 = performance.now();
let frames = 0;
map.on('load', () => console.log('load ms', performance.now() - t0));
map.once('idle', () => console.log('idle ms', performance.now() - t0));
map.on('render', () => frames++);
setInterval(() => {
  console.log('fps', frames);
  frames = 0;
}, 1000);
```

## Geocoding — use Gebeta, not Nominatim

```js
const results = await sdk.geocodingManager.geocode(query); // [{ name, lngLat: { lng, lat } }]
const fc = {
  type: 'FeatureCollection',
  features: results.map(r => ({
    type: 'Feature',
    properties: { name: r.name },
    geometry: { type: 'Point', coordinates: [r.lngLat.lng, r.lngLat.lat] },
  })),
};
map.getSource('search')
  ? map.getSource('search').setData(fc)
  : map.addSource('search', { type: 'geojson', data: fc });
```

If the user wants `@maplibre/maplibre-gl-geocoder`, plug Gebeta in as `forwardGeocode`:

```js
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
map.addControl(
  new MaplibreGeocoder(
    {
      forwardGeocode: async ({ query }) => ({
        features: (await sdk.geocodingManager.geocode(query)).map(r => ({
          type: 'Feature',
          place_name: r.name,
          text: r.name,
          center: [r.lngLat.lng, r.lngLat.lat],
          geometry: { type: 'Point', coordinates: [r.lngLat.lng, r.lngLat.lat] },
          properties: r,
        })),
      }),
    },
    { maplibregl }
  ),
  'top-left'
);
```

## PMTiles

```js
import { Protocol } from 'pmtiles';
const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);
map.addSource('pm', { type: 'vector', url: 'pmtiles://https://example.com/data.pmtiles' });
// cleanup: maplibregl.removeProtocol('pmtiles')
```

## addProtocol to transform feature properties

`maplibregl.addProtocol('custom', async (params, abort) => { const r = await fetch(params.url.replace('custom://', 'https://'), { signal: abort.signal }); return { data: await r.arrayBuffer() }; })`
(v4 handler returns a Promise `{ data }`). Do **not** register a protocol for `tiles.gebeta.app`
URLs — that bypasses the SDK's auth signing.

## deck.gl (REST data, toggle layer)

```js
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';
const overlay = new MapboxOverlay({ interleaved: true, layers: [] });
map.addControl(overlay);
const data = await fetch('/api/points').then(r => r.json());
let visible = true;
const layer = () =>
  new ScatterplotLayer({
    id: 'pts',
    data,
    visible,
    getPosition: d => [d.lng, d.lat],
    getRadius: 50,
    getFillColor: [255, 99, 71],
  });
overlay.setProps({ layers: [layer()] });
toggle.onclick = () => {
  visible = !visible;
  overlay.setProps({ layers: [layer()] });
};
```

## Drawing tools

- **Gebeta built-in**: polygons/geofences → `sdk.fencing.startDrawing()` (see gebeta-maps skill).
- **terra-draw** (points, lines, polygons, circles, rectangles, select/edit):

```js
import {
  TerraDraw,
  TerraDrawPolygonMode,
  TerraDrawLineStringMode,
  TerraDrawPointMode,
  TerraDrawSelectMode,
} from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
const draw = new TerraDraw({
  adapter: new TerraDrawMapLibreGLAdapter({ map }),
  modes: [
    new TerraDrawPolygonMode(),
    new TerraDrawLineStringMode(),
    new TerraDrawPointMode(),
    new TerraDrawSelectMode(),
  ],
});
draw.start();
draw.setMode('polygon');
draw.on('finish', id => console.log(draw.getSnapshot().find(f => f.id === id)));
```

- **mapbox-gl-draw** works with a CSS-class shim:
  `MapboxDraw.constants.classes.CONTROL_BASE = 'maplibregl-ctrl'; ...CONTROL_PREFIX = 'maplibregl-ctrl-'; ...CONTROL_GROUP = 'maplibregl-ctrl-group';`
  then `map.addControl(new MapboxDraw({...}))`. If you add custom draw styles with text, use
  `'text-font': ['JakartaSans']`.

## Sync movement of multiple maps

```js
const a = sdkA.init({ container: 'left' }),
  b = sdkB.init({ container: 'right', styleUrl: SAT_URL });
let syncing = false;
function sync(src, dst) {
  src.on('move', () => {
    if (syncing) return;
    syncing = true;
    dst.jumpTo({
      center: src.getCenter(),
      zoom: src.getZoom(),
      bearing: src.getBearing(),
      pitch: src.getPitch(),
    });
    syncing = false;
  });
}
sync(a, b);
sync(b, a);
```

(Each map needs its own `GebetaMaps` instance; reuse the same auth tokens.)
