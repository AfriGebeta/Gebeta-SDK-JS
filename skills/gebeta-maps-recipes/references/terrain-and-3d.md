# Terrain, hillshade, sky, 3D buildings & models (Gebeta Maps)

## Gebeta DEM

Gebeta serves terrain-RGB tiles (Mapbox encoding) at
`https://tiles.gebeta.app/tiles/terrain/{z}/{x}/{y}.png` (`tileSize: 256`, `maxzoom: 12`).
Requests are signed automatically. The ready-made terrain style already wires it:
`sdk.init({ container: 'map', styleUrl: 'https://tiles.gebeta.app/styles/standard/terrain/terrain.json', pitch: 60 })`.

## 3D terrain on any Gebeta style

```js
sdk.init({ container: 'map', center: [39.47, 9.42], zoom: 11, pitch: 70, maxPitch: 85 }); // Ethiopian highlands
map.on('load', () => {
  map.addSource('dem', {
    type: 'raster-dem',
    tiles: ['https://tiles.gebeta.app/tiles/terrain/{z}/{x}/{y}.png'],
    tileSize: 256,
    maxzoom: 12,
  });
  map.setTerrain({ source: 'dem', exaggeration: 1.5 });
  map.addControl(new gebeta.TerrainControl({ source: 'dem', exaggeration: 1.5 }));
});
```

Use a **separate** raster-dem source for hillshade and terrain (same URL, different ids) — sharing
one source causes lower-quality hillshade.

## Hillshade

```js
map.addSource('hs', {
  type: 'raster-dem',
  tiles: ['https://tiles.gebeta.app/tiles/terrain/{z}/{x}/{y}.png'],
  tileSize: 256,
  maxzoom: 12,
});
map.addLayer(
  {
    id: 'hillshade',
    type: 'hillshade',
    source: 'hs',
    paint: {
      'hillshade-shadow-color': '#473B24',
      'hillshade-exaggeration': 0.5,
    },
  },
  'water'
); // under water & roads
```

Multidirectional hillshade (`hillshade-method`) and `color-relief` layers are v5+. v4 alternative
for color relief: none native — add a pre-colored raster or skip.

## Hybrid satellite + terrain

```js
import { API } from '@gebeta/api';
sdk.init({
  container: 'map',
  styleUrl: API.Map.Constants.STYLES.satellite.url,
  pitch: 70,
  zoom: 13,
  center: [39.47, 9.42],
});
map.on('load', () => {
  map.addSource('dem', {
    type: 'raster-dem',
    tiles: ['https://tiles.gebeta.app/tiles/terrain/{z}/{x}/{y}.png'],
    tileSize: 256,
    maxzoom: 12,
  });
  map.setTerrain({ source: 'dem', exaggeration: 1.2 });
});
```

## Sky, fog, terrain

```js
map.setSky({
  'sky-color': '#199EF3',
  'sky-horizon-blend': 0.5,
  'horizon-color': '#ffffff',
  'horizon-fog-blend': 0.5,
  'fog-color': '#0000ff',
  'fog-ground-blend': 0.5,
  'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 10, 1, 12, 0],
});
```

## Contour lines (plugin)

`npm i maplibre-contour` → create a `DemSource` with the Gebeta DEM URL (`encoding: 'mapbox'`,
`maxzoom: 12`), `demSource.setupMaplibre(gebeta)` (it only needs `addProtocol`), add `demSource.contourProtocolUrl({...})`
as a vector source and style `contours` lines + `ele` labels with `'text-font': ['JakartaSans']`.
Because the plugin fetches tiles itself, pass auth: build the URL with `?apiKey=` (API-key auth) or
fetch via a backend proxy for service-account auth.

## Custom layers that follow terrain

Use `map.queryTerrainElevation(lngLat)` (meters) to lift objects, or for Three.js use the
`MercatorCoordinate.fromLngLat(lngLat, altitude)` with the elevation added.

## 3D buildings

Gebeta buildings: source `buildings`, source-layer `building`; base 2D layers are `building`,
`building-top`, `building-government`. Check which height attribute your tiles carry first:
`map.querySourceFeatures('buildings', { sourceLayer: 'building' })[0]?.properties`.

```js
map.setLayoutProperty('building-top', 'visibility', 'none'); // avoid z-fighting with the flat layer
map.addLayer(
  {
    id: 'buildings-3d',
    type: 'fill-extrusion',
    source: 'buildings',
    'source-layer': 'building',
    minzoom: 14,
    paint: {
      'fill-extrusion-color': ['interpolate', ['linear'], ['zoom'], 14, '#d6d6d6', 17, '#b8c4d6'],
      'fill-extrusion-height': [
        'coalesce',
        ['get', 'render_height'],
        ['get', 'height'],
        ['*', ['coalesce', ['get', 'building:levels'], ['get', 'levels'], 3], 3],
      ],
      'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0],
      'fill-extrusion-opacity': 0.85,
    },
  },
  map.getStyle().layers.find(l => l.type === 'symbol')?.id
);
map.easeTo({ pitch: 60, bearing: -20, zoom: 16 });
```

## Extrude polygons (indoor mapping / your own data)

```js
map.addSource('floorplan', { type: 'geojson', data: '/floorplan.geojson' }); // props: height, base_height, color
map.addLayer({
  id: 'room-extrusion',
  type: 'fill-extrusion',
  source: 'floorplan',
  paint: {
    'fill-extrusion-color': ['get', 'color'],
    'fill-extrusion-height': ['get', 'height'],
    'fill-extrusion-base': ['get', 'base_height'],
    'fill-extrusion-opacity': 0.5,
  },
});
```

Rounded extrusion corners are v5+.

## Three.js model / 3D tiles (plugin)

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const origin = [38.7578, 9.0301],
  alt = 0;
const mc = gebeta.MercatorCoordinate.fromLngLat(origin, alt);
const s = mc.meterInMercatorCoordinateUnits();
const modelLayer = {
  id: 'model',
  type: 'custom',
  renderingMode: '3d',
  onAdd(map, gl) {
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    new GLTFLoader().load('/model.glb', g => this.scene.add(g.scene));
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    this.renderer.autoClear = false;
  },
  render(gl, matrix) {
    // v4 signature
    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4()
      .makeTranslation(mc.x, mc.y, mc.z)
      .scale(new THREE.Vector3(s, -s, s))
      .multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    map.triggerRepaint();
  },
};
map.addLayer(modelLayer);
```

Babylon.js works the same way (custom layer with the v4 `matrix`). 3D Tiles: use
`3d-tiles-renderer` inside the same Three.js custom layer; raycasting uses a `THREE.Raycaster`
built from the inverse of `camera.projectionMatrix`. Quantized-mesh terrain requires v5+.

## Globe (all globe examples) — v5+

`map.setProjection({ type: 'globe' })` does not exist in the current Gebeta engine (4.7). Tell the user globe needs
a newer SDK; for a "world overview" use `zoom: 1.5`, `renderWorldCopies: false`.
