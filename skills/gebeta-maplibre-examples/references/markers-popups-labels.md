# Markers, popups, labels & language (MapLibre 4.7 on Gebeta)

Markers/popups need the MapLibre CSS (auto with CDN/React; `import 'maplibre-gl/dist/maplibre-gl.css'` with `@gebeta/js`).
For hundreds+ of points use a GeoJSON `symbol`/`circle` layer instead of DOM markers.

## Markers

```js
new maplibregl.Marker({ color: '#e63946' }).setLngLat([38.7578, 9.0301]).addTo(map); // default

const el = document.createElement('div'); // custom icon
el.className = 'shop-marker'; // CSS: width/height/background-image/border-radius
el.style.backgroundImage = 'url(/logo.png)';
new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([38.76, 9.02]).addTo(map);

const drag = new maplibregl.Marker({ draggable: true }).setLngLat([38.7578, 9.0301]).addTo(map); // draggable
drag.on('dragend', async () => {
  const { lng, lat } = drag.getLngLat();
  const [place] = await sdk.geocodingManager.reverseGeocode({ lat, lng }); // Gebeta reverse geocode
  info.textContent = place?.name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
});

// animate a marker
const m = new maplibregl.Marker().setLngLat([38.7578, 9.0301]).addTo(map);
(function tick(ts) {
  const a = ts / 1000;
  m.setLngLat([38.7578 + Math.cos(a) * 0.01, 9.0301 + Math.sin(a) * 0.01]);
  requestAnimationFrame(tick);
})(0);
```

SDK-native alternative (same look as SDK markers):
`sdk.getPlatform().markerFactory.createMarker({ imageUrl, size: [32, 32] })?.setLngLat(ll).addTo(sdk.getPlatform().mapAdapter)`.

## Draggable point (GeoJSON, many points friendly)

```js
const pt = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [38.7578, 9.0301] },
    },
  ],
};
map.addSource('drag', { type: 'geojson', data: pt });
map.addLayer({
  id: 'drag',
  type: 'circle',
  source: 'drag',
  paint: { 'circle-radius': 10, 'circle-color': '#3887be' },
});
const onMove = e => {
  pt.features[0].geometry.coordinates = [e.lngLat.lng, e.lngLat.lat];
  map.getSource('drag').setData(pt);
};
map.on('mousedown', 'drag', e => {
  e.preventDefault();
  map.getCanvas().style.cursor = 'grab';
  map.on('mousemove', onMove);
  map.once('mouseup', () => map.off('mousemove', onMove));
});
map.on('touchstart', 'drag', e => {
  if (e.points.length !== 1) return;
  e.preventDefault();
  map.on('touchmove', onMove);
  map.once('touchend', () => map.off('touchmove', onMove));
});
```

## Popups

```js
new maplibregl.Popup({ closeOnClick: false })
  .setLngLat([38.7578, 9.0301])
  .setHTML('<h3>Meskel Square</h3>')
  .addTo(map); // static

map.on('click', 'places', e => {
  // on click
  const f = e.features[0];
  new maplibregl.Popup()
    .setLngLat(f.geometry.coordinates.slice())
    .setHTML(`<b>${escapeHtml(f.properties.name)}</b>`)
    .addTo(map);
});
map.on('mouseenter', 'places', () => (map.getCanvas().style.cursor = 'pointer'));
map.on('mouseleave', 'places', () => (map.getCanvas().style.cursor = ''));

const hover = new maplibregl.Popup({ closeButton: false, closeOnClick: false }); // on hover
map.on('mousemove', 'places', e =>
  hover.setLngLat(e.lngLat).setText(e.features[0].properties.name).addTo(map)
);
map.on('mouseleave', 'places', () => hover.remove());

new maplibregl.Marker()
  .setLngLat([38.76, 9.02])
  .setPopup(new maplibregl.Popup({ offset: 25 }).setText('Bole'))
  .addTo(map); // on marker
```

Use `setText` or escape user data before `setHTML` (XSS).

Click on Gebeta POIs from the basemap: layer ids like `poi-restaurant`, `poi-hotel`, `poi-bank`,
`poi-hospital` etc. — `map.on('click', 'poi-restaurant', e => ...)`.

## Labels

Only `["JakartaSans"]` is a verified Gebeta glyph stack (covers Latin + Ethiopic/Amharic).

```js
// rich text with format
layout: { 'text-font': ['JakartaSans'], 'text-field': ['format',
  ['upcase', ['get', 'name']], { 'font-scale': 1.1 }, '\n', {},
  ['get', 'name:am'], { 'font-scale': 0.85, 'text-color': '#555' }] }

// change case
layout: { 'text-field': ['upcase', ['get', 'name']] }   // or ['downcase', ...]

// variable placement (+ offset variant)
layout: { 'text-field': ['get', 'name'], 'text-font': ['JakartaSans'],
  'text-variable-anchor': ['top', 'bottom', 'left', 'right'], 'text-radial-offset': 0.5, 'text-justify': 'auto' }
layout: { 'text-variable-anchor-offset': ['top', [0, 1], 'bottom', [0, -1], 'left', [1, 0], 'right', [-1, 0]] }
```

Web fonts / font faces: GL labels can't use CSS web fonts; v5+ `font-faces` isn't available.
Options: use HTML markers styled with the web font, or host your own glyph PBFs
(e.g. generated with `font-maker`) and add a source-specific style with a custom `glyphs` URL.
CJK local glyphs: `sdk.init({ container: 'map', localIdeographFontFamily: "'Noto Sans', sans-serif" })`.

## Change map language (Amharic ↔ English)

Gebeta tiles carry `name`, `name:latin`, `name:am`. Rewrite `text-field` on every symbol layer:

```js
function setLanguage(lang /* 'am' | 'en' */) {
  const field =
    lang === 'am'
      ? ['coalesce', ['get', 'name:am'], ['get', 'name'], ['get', 'name:latin']]
      : ['coalesce', ['get', 'name:latin'], ['get', 'name:en'], ['get', 'name']];
  for (const layer of map.getStyle().layers) {
    if (layer.type !== 'symbol') continue;
    const tf = map.getLayoutProperty(layer.id, 'text-field');
    if (tf == null || tf === '' || (typeof tf === 'string' && tf.includes('{ref}'))) continue; // skip shields/empty
    map.setLayoutProperty(layer.id, 'text-field', field);
  }
}
```

Locale switching of UI strings (control tooltips):
`sdk.init({ container: 'map', locale: { 'NavigationControl.ZoomIn': 'አጉላ', 'NavigationControl.ZoomOut': 'አሳንስ' } })`.
