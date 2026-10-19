# Layers, icons, expressions, filters, clusters, data viz (MapLibre 4.7 on Gebeta)

`const beforeId = map.getStyle().layers.find(l => l.type === 'symbol')?.id;`
Text in symbol layers: always `'text-font': ['JakartaSans']`.

## Icons & symbols

```js
// sprite icon already in the Gebeta style
map.addLayer({ id: 'cafes', type: 'symbol', source: 'cafes', layout: { 'icon-image': 'coffee_solid_24px', 'icon-size': 1 } });

// your own PNG (v4: loadImage returns a Promise)
const { data } = await map.loadImage('/marker.png');
if (!map.hasImage('my-pin')) map.addImage('my-pin', data);

// generated icon (raw pixels)
const size = 64, px = new Uint8Array(size * size * 4);
for (let i = 0; i < px.length; i += 4) { px[i] = 255; px[i + 1] = 100; px[i + 2] = 0; px[i + 3] = 255; }
map.addImage('square', { width: size, height: size, data: px });

// stretchable image (text box background)
map.addImage('popup-bg', (await map.loadImage('/popup.png')).data, {
  stretchX: [[25, 55], [85, 115]], stretchY: [[25, 100]], content: [25, 25, 115, 100], pixelRatio: 2 });
map.addLayer({ id: 'boxed', type: 'symbol', source: 'pts', layout: {
  'text-field': ['get', 'name'], 'text-font': ['JakartaSans'], 'icon-image': 'popup-bg',
  'icon-text-fit': 'both', 'icon-allow-overlap': true, 'text-allow-overlap': true } });

// remote SVG → rasterize via <img>
const img = new Image(48, 48); img.src = '/icon.svg'; await img.decode();
map.addImage('svg-icon', img);

// generate missing icons on demand
map.on('styleimagemissing', e => {
  if (!e.id.startsWith('color-')) return;
  const [r, g, b] = e.id.slice(6).split(',').map(Number);
  const w = 16, d = new Uint8Array(w * w * 4).map((_, i) => [r, g, b, 255][i % 4]);
  map.addImage(e.id, { width: w, height: w, data: d });
});

// fallback image
layout: { 'icon-image': ['coalesce', ['image', ['concat', ['get', 'type'], '_solid_24px']], ['image', 'point_solid_24px']] }
```

### Animated icon (pulsing dot, StyleImageInterface — v4 compatible)

```js
const size = 120;
const pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),
  onAdd() {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    this.ctx = c.getContext('2d');
  },
  render() {
    const t = (performance.now() % 1000) / 1000,
      r = (size / 2) * 0.3,
      outer = (size / 2) * 0.7 * t + r,
      ctx = this.ctx;
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, outer, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,124,191,${1 - t})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.fillStyle = '#007cbf';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
    this.data = ctx.getImageData(0, 0, size, size).data;
    map.triggerRepaint();
    return true;
  },
};
map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
map.addLayer({
  id: 'live',
  type: 'symbol',
  source: 'live',
  layout: { 'icon-image': 'pulsing-dot' },
});
```

GPU-rendered icons (`StyleImageWebGLData`) and `symbol-height-offset` are v5+ only.

## Layer styling

```js
map.setPaintProperty('water', 'fill-color', '#4a90e2'); // change color with buttons
map.setLayoutProperty('poi-restaurant', 'visibility', 'none'); // hide a basemap layer
map.addLayer(
  {
    id: 'flood',
    type: 'fill',
    source: 'flood',
    paint: { 'fill-color': '#06f', 'fill-opacity': 0.5 },
  },
  beforeId
); // below labels

// fill pattern
map.addImage('stripes', (await map.loadImage('/stripes.png')).data);
map.addLayer({ id: 'pattern', type: 'fill', source: 'zone', paint: { 'fill-pattern': 'stripes' } });
```

### Custom WebGL layer (v4 signature)

```js
const triangle = {
  id: 'tri',
  type: 'custom',
  onAdd(map, gl) {
    const vs = `uniform mat4 u_matrix; attribute vec2 a_pos; void main(){ gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0); }`;
    const fs = `void main(){ gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5); }`;
    const sh = (t, s) => {
      const x = gl.createShader(t);
      gl.shaderSource(x, s);
      gl.compileShader(x);
      return x;
    };
    this.program = gl.createProgram();
    gl.attachShader(this.program, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(this.program, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(this.program);
    this.aPos = gl.getAttribLocation(this.program, 'a_pos');
    const p = [
      [38.74, 9.04],
      [38.78, 9.04],
      [38.76, 9.01],
    ].map(c => maplibregl.MercatorCoordinate.fromLngLat(c));
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p.flatMap(m => [m.x, m.y])), gl.STATIC_DRAW);
  },
  render(gl, matrix) {
    // v4: matrix param (v5+ uses args.defaultProjectionData.mainMatrix)
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'u_matrix'), false, matrix);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.aPos);
    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
  },
};
map.addLayer(triangle, beforeId);
```

## Expressions

```js
// data-driven line color
paint: { 'line-color': ['match', ['get', 'status'], 'jam', '#d00', 'slow', '#f90', /* default */ '#2a2'], 'line-width': 4 }

// building color by zoom (Gebeta layer id 'building')
map.setPaintProperty('building', 'fill-color', ['interpolate', ['exponential', 0.5], ['zoom'], 15, '#e2714b', 22, '#eee695']);
map.setPaintProperty('building', 'fill-opacity', ['interpolate', ['linear'], ['zoom'], 15, 0, 22, 1]);

// gradient line (source must have lineMetrics: true)
map.addSource('grad', { type: 'geojson', lineMetrics: true, data: route.geometry });
map.addLayer({ id: 'grad', type: 'line', source: 'grad', layout: { 'line-cap': 'round' }, paint: {
  'line-width': 8, 'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, 'blue', 0.5, 'lime', 1, 'red'] } });
// "gradient dashed": put a white dashed line ('line-dasharray': [2, 2]) on top of the gradient line.
```

## Filtering

```js
map.setFilter('places', ['==', ['get', 'type'], 'cafe']); // filter within a layer
input.oninput = () =>
  map.setFilter('places', ['in', input.value.toLowerCase(), ['downcase', ['get', 'name']]]); // by text
// toggle list: one layer per category, toggle with setLayoutProperty(id, 'visibility', 'visible'|'none')
// "global state" filters are v5+: emulate by rebuilding the filter with setFilter when your state changes
```

## Heatmap

```js
map.addSource('incidents', { type: 'geojson', data: '/incidents.geojson' });
map.addLayer(
  {
    id: 'heat',
    type: 'heatmap',
    source: 'incidents',
    maxzoom: 16,
    paint: {
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'severity'], 0, 0, 5, 1],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 16, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(103,169,207)',
        0.4,
        'rgb(209,229,240)',
        0.6,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        1,
        'rgb(178,24,43)',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 16, 20],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 14, 1, 16, 0],
    },
  },
  beforeId
);
map.addLayer(
  {
    id: 'incident-pts',
    type: 'circle',
    source: 'incidents',
    minzoom: 14,
    paint: { 'circle-radius': 5, 'circle-color': '#b2182b' },
  },
  beforeId
);
```

## Native clusters (use for large datasets; SDK clustering uses DOM markers)

```js
map.addSource('shops', {
  type: 'geojson',
  data: '/shops.geojson',
  cluster: true,
  clusterMaxZoom: 15,
  clusterRadius: 50,
  clusterProperties: { open: ['+', ['case', ['get', 'isOpen'], 1, 0]] },
}); // custom cluster props
map.addLayer({
  id: 'clusters',
  type: 'circle',
  source: 'shops',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
  },
});
map.addLayer({
  id: 'cluster-count',
  type: 'symbol',
  source: 'shops',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['JakartaSans'],
    'text-size': 12,
  },
});
map.addLayer({
  id: 'unclustered',
  type: 'circle',
  source: 'shops',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': 5,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
});
map.on('click', 'clusters', async e => {
  const f = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0];
  const zoom = await map.getSource('shops').getClusterExpansionZoom(f.properties.cluster_id); // v4: Promise
  map.easeTo({ center: f.geometry.coordinates, zoom });
});
map.on('mouseenter', 'clusters', () => (map.getCanvas().style.cursor = 'pointer'));
map.on('mouseleave', 'clusters', () => (map.getCanvas().style.cursor = ''));
```

HTML clusters with custom properties: keep the clustered source, hide its layers
(`circle-opacity: 0`), and on `render` create/update `maplibregl.Marker({ element })` for each
`map.querySourceFeatures('shops')` cluster (cache markers by `cluster_id`, add/remove on each render).

## Data visualization

```js
// choropleth / population density
paint: { 'fill-color': ['interpolate', ['linear'], ['get', 'density'], 0, '#F2F12D', 500, '#EED322', 1000, '#E6B71E', 5000, '#B86B25', 10000, '#723122'], 'fill-opacity': 0.7 }

// time slider
slider.oninput = e => map.setFilter('quakes', ['==', ['get', 'month'], Number(e.target.value)]);

// draw a circle (geodesic) — turf
import circle from '@turf/circle';
map.addSource('radius', { type: 'geojson', data: circle([38.7578, 9.0301], 2, { steps: 64, units: 'kilometers' }) });
map.addLayer({ id: 'radius', type: 'fill', source: 'radius', paint: { 'fill-color': '#007cbf', 'fill-opacity': 0.2 } }, beforeId);

// measure distances: collect clicked points into a LineString source, show turf length
import length from '@turf/length';
const pts = { type: 'FeatureCollection', features: [] };
map.addSource('measure', { type: 'geojson', data: pts });
map.addLayer({ id: 'measure-pts', type: 'circle', source: 'measure', filter: ['==', ['geometry-type'], 'Point'], paint: { 'circle-radius': 5, 'circle-color': '#000' } });
map.addLayer({ id: 'measure-line', type: 'line', source: 'measure', filter: ['==', ['geometry-type'], 'LineString'], paint: { 'line-color': '#000', 'line-width': 2.5 } });
map.on('click', e => {
  const coords = pts.features.filter(f => f.geometry.type === 'Point').map(f => f.geometry.coordinates).concat([[e.lngLat.lng, e.lngLat.lat]]);
  pts.features = coords.map(c => ({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: c } }));
  if (coords.length > 1) { const line = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }; pts.features.push(line); out.textContent = `${length(line).toFixed(2)} km`; }
  map.getSource('measure').setData(pts);
});
```

For "distance by road" use `sdk.getDirections` + `getRouteSummary()` instead of straight-line turf.
