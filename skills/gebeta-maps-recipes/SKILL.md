---
name: gebeta-maps-recipes
description: Recipes for any interactive-map feature on a Gebeta map — everything in the MapLibre GL JS examples gallery, written with Gebeta names only (camera animation, fly-to, GeoJSON lines/polygons/points, raster/vector/WMS/video/image sources, realtime data, icons and symbols, data-driven styling, expressions, filters, heatmaps, native clusters, 3D buildings/extrusions, terrain, hillshade, sky, markers, popups, labels, Amharic/English language switching, hover/click queries, draw/measure tools, deck.gl, PMTiles, synced maps) on top of a Gebeta map. Use whenever a Gebeta Maps app (@gebeta/js, @gebeta/react, or the Gebeta CDN script) needs a map feature beyond geocoding/directions/navigation/clustering/fencing, or when porting a MapLibre/Mapbox example to Gebeta. Load together with the gebeta-maps skill.
---

# Gebeta Maps recipes

Every feature from the map-examples gallery
(https://maplibre.org/maplibre-gl-js/docs/examples/), written the Gebeta way. The map engine is
MapLibre GL JS 4.7.x — that's for you to know which API/style-spec docs apply — but **user code
only ever says Gebeta**:

- `map` is what `sdk.init()` returns; layers, sources, camera and events are methods on it.
- Classes and controls come from the `gebeta` namespace: `import { gebeta } from '@gebeta/js'`
  (or `@gebeta/react`; `window.gebeta` on CDN). Markers/popups: prefer `sdk.addMarker` / `sdk.addPopup`.
- Never write `maplibregl`, `import … from 'maplibre-gl'` or its CSS path. When porting a gallery
  example, rename `maplibregl.X` → `gebeta.X` (Marker, Popup, LngLat, LngLatBounds,
  MercatorCoordinate, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl,
  AttributionControl, TerrainControl, addProtocol, removeProtocol).
- Requires `@gebeta/js` newer than 3.0.12 (that's when the `gebeta` namespace and `addMarker` landed).

## Get the map

```js
// bundler
import '@gebeta/js/style.css';
import { GebetaMaps, gebeta } from '@gebeta/js';
const sdk = new GebetaMaps({ auth }); // or { apiKey }
const map = sdk.init({ container: 'map', center: [38.7578, 9.0301], zoom: 13 });
map.on('load', () => {
  /* recipes go here */
});

// CDN: window.GebetaMaps and window.gebeta are globals; CSS is auto-injected.
// React: <GebetaMap onLoad={gm => { const map = gm.getMap(); ... }} />
```

In every recipe, `map` is that instance and code runs after `load`.

## Gebeta adjustments (apply to every ported example)

1. **Don't replace the basemap.** Gallery examples start with
   `new maplibregl.Map({ style: 'https://demotiles...' })`. Replace that with the
   `sdk.init(...)` above. Keep the example's `center` only if it is meant to show a specific
   place; otherwise use Addis Ababa `[38.7578, 9.0301]`.
2. **Fonts.** For any `symbol` layer you add, use `"text-font": ["JakartaSans"]` — the only
   Gebeta glyph stack verified to serve (Latin + Ethiopic). Example fonts like
   `"Open Sans Semibold"` or `"Noto Sans Regular"` will 404 and labels won't draw.
3. **Icons.** The Gebeta sprite has `<name>_solid_16px|_solid_24px|_outline_24px` icons, e.g.
   `restaurant_solid_24px`, `hospital-cross_solid_24px`, `bus_solid_24px`, `parking_solid_24px`,
   `petrol-station_solid_24px`, `point_solid_24px`, `coffee_solid_24px`, `hotel_solid_24px`,
   `atm_solid_24px`, `police_solid_24px`, `taxi_solid_24px`, `mosque_solid_24px`,
   `church_solid_24px`. Maki names from examples (`"airport-15"`, `"rocket-15"`) don't exist —
   use these or `map.loadImage` + `map.addImage`.
4. **Insert below labels.** `const beforeId = map.getStyle().layers.find(l => l.type === 'symbol')?.id;`
   then `map.addLayer(layer, beforeId)`.
5. **Basemap data you can query/restyle** (standard style). Source → source-layers:
   `roads` → `transportation`, `transportation_name`, `aeroway`; `buildings` → `building`;
   `water` → `water`, `waterway`, `water_name`; `landuse` → `landuse`, `landcover`, `park`;
   `pois` → `poi`, `place`, `aerodrome_label`; `boundaries` → `boundary`.
   Names: `name`, `name:latin`, `name:am` (Amharic). Layer ids e.g. `building`, `water`,
   `highway-primary`, `highway-name-major`, `poi-restaurant`, `place-town`.
6. **Styles.** standard `https://tiles.gebeta.app/styles/standard/style.json`, satellite
   `.../styles/raster/raster.json` (raster source `satellite`), terrain
   `.../styles/standard/terrain/terrain.json` (has `raster-dem` sources `TerrainSource` /
   `HillshadeSource`, `terrain: { source: 'TerrainSource' }`).
7. **Auth is automatic** only for `https://tiles.gebeta.app/...` URLs. Any Gebeta tile URL you add
   by hand (e.g. the satellite raster or DEM tiles) is signed for you; third-party URLs are not touched.
8. **setStyle clears everything you added** (and SDK routes/fences). Re-add on `style.load`, or use
   `map.setStyle(url, { transformStyle: (prev, next) => ({ ...next, sources: {...next.sources, ...mySources}, layers: [...next.layers, ...myLayers] }) })`.
9. **Version.** The engine is 4.7.x, but the examples gallery runs v6. Before
   porting, confirm each API/property exists in 4.7 (`typeof map.someMethod === 'function'`; style
   properties missing in v4 fail validation with an error in the console). Examples marked **v5+** below (globe, color-relief,
   multidirectional hillshade, MLT tiles, global-state filters, custom projections,
   center-above-ground…) are **not available** — tell the user, and offer the closest v4
   alternative listed. Never install the engine package yourself next to the SDK.
10. **Plugins** (deck.gl, terra-draw, PMTiles, turf, COG protocol) are installed with npm/CDN
    as usual and attached to `map`. Some third-party plugin package names contain "maplibre";
    that's unavoidable for those plugins — pass them `gebeta` / `map`, never a separate engine import.

## Example index → recipe file

Legend: ✅ works as-is with the adjustments · 🔌 needs a plugin · **v5+** not supported on SDK v3.

**Map basics, camera & controls** → `references/camera-and-controls.md`
✅ Display a map · ✅ Display a satellite map · ✅ Non-interactive map · ✅ Attribution position ·
✅ Check WebGL support · **v5+** Display a map with MLT · ✅ Fly to · ✅ Jump to series ·
✅ Pitch & bearing · ✅ Slowly fly · ✅ Animate a line · ✅ Animate a point · ✅ Point along a route ·
✅ Rotate camera around a point · ✅ Custom camera animations · **v5+** Transform constrain
(use `transformCameraUpdate` / `maxBounds`) · **v5+** 360° photosphere (approximate with high pitch) · ✅ Fit bounding box ·
✅ Fit LineString bounds · ✅ Fly on scroll · ✅ Hash routing · **v5+** Level-of-detail control ·
✅ Vanishing point padding · ✅ Render world copies · ✅ Restrict panning · **v5+** Center above ground ·
**v5+** First-person walk (approximate with keyboard + `jumpTo` pitch 80) · ✅ Navigation controls ·
✅ Locate the user · ✅ Cooperative gestures · ✅ Disable rotation · ✅ Disable scroll zoom ·
✅ Game-like controls · ✅ Toggle interactions · ✅ Fullscreen

**Sources & data** → `references/sources-and-data.md`
✅ Vector tile source · ✅ GeoJSON line · ✅ GeoJSON polygon · ✅ GeoJSON points ·
✅ Multiple geometries one source · **v5+** Polar stereographic (GeoJSON & map) · ✅ Line crossing 180° ·
✅ View local GeoJSON (+ experimental File System Access variant) · ✅ Raster tile source ·
✅ WMS source · ✅ Canvas source · 🔌 COG raster · ✅ Video · ✅ Animated image series ·
**v5+** UTM zone 32N · **v5+** Identity projection · ✅ Live realtime data · ✅ Update feature in realtime ·
✅ Update GeoJSON polygons

**Layers, styling, expressions, filters, data viz** → `references/layers-and-styling.md`
✅ Icon · ✅ Generated icon · ✅ Stretchable image · ✅ Animated icon (StyleImageInterface) ·
**v5+** Animate icon on GPU (use the CPU animated icon) · ✅ Remote SVG symbol ·
**v5+** Elevate symbols above terrain (`symbol-height-offset`; use a 3D marker or fill-extrusion) · ✅ Generate missing icon · ✅ Fallback image (`coalesce` image) ·
✅ Change layer color with buttons · ✅ Layer below labels · ✅ Custom style layer (v4 `render(gl, matrix)`) ·
✅ Fill pattern · ✅ Data-driven lines · ✅ Building color by zoom · ✅ Gradient dashed line
(approximate: `line-gradient` + overlay dash) · ✅ Gradient line · ✅ Filter within layer ·
✅ Filter symbols by text · **v5+** Filter with global state (use `setFilter`) · ✅ Toggle list filter ·
✅ Heatmap · ✅ Create & style clusters · ✅ HTML clusters with custom properties ·
✅ Population density · ✅ Measure distances · ✅ Time slider · ✅ Draw a circle

**Terrain, 3D, globe** → `references/terrain-and-3d.md`
✅ 3D terrain · ✅ Hillshade · 🔌 Quantized-mesh terrain (**v5+**) · **v5+** Color relief ·
**v5+** Multidirectional hillshade · 🔌 Contour lines (maplibre-contour) ·
✅ Custom layers following terrain · ✅ Hybrid satellite + terrain · ✅ Sky, fog, terrain ·
✅ 3D buildings · 🔌 Three.js 3D tiles/models · 🔌 Babylon.js model · ✅ Extrude indoor polygons ·
**v5+** Rounded fill-extrusion corners · 🔌 Raycast 3D tiles (Three.js) ·
**v5+** all Globe examples (vector globe, atmosphere, custom layer on globe, heatmap on globe,
fill-extrusion on globe, zoom/planet size)

**Markers, popups, labels, i18n** → `references/markers-popups-labels.md`
✅ Default marker · ✅ Custom icon markers · ✅ Draggable marker · ✅ Animate marker ·
✅ Draggable point (GeoJSON) · ✅ Popup · ✅ Popup on click · ✅ Popup on hover · ✅ Popup on marker ·
✅ Rich text labels (`format`) · ✅ Web fonts (HTML markers) / glyph fonts limited to JakartaSans ·
**v5+** Font faces · ✅ Label case · ✅ Local fonts (`localIdeographFontFamily`) ·
✅ Variable label placement · ✅ Variable placement with offset · ✅ Change map language
(`name:am` / `name:latin`) · ✅ Locale switching · ✅ Locally generated ideographs

**Events, queries, plugins** → `references/interactivity-and-plugins.md`
✅ Features under mouse · ✅ Hover effect (feature-state) · ✅ Symbol follows mouse ·
✅ Center on clicked symbol · ✅ Performance metrics · ✅ Mouse coordinates ·
✅ Box-zoom selection · ✅ Polygon info on click · ✅ Geocode (use **Gebeta geocoding**, not Nominatim) ·
🔌 PMTiles · 🔌 deck.gl REST layer · 🔌 terra-draw · 🔌 mapbox-gl-draw · ✅ Sync multiple maps ·
🔌 Toggle deck.gl layer · ✅ `addProtocol` transform

## Always

- Run the snippet after `load`; for React, in `onLoad` and with cleanup on unmount.
- Give every added source/layer a unique id and guard with `map.getSource(id)` / `map.getLayer(id)`.
- Remove listeners/animation frames when the component unmounts (`cancelAnimationFrame`, `map.off`).
- Prefer Gebeta services over third-party ones in examples: geocoding → `sdk.geocodingManager`,
  routes → `sdk.getDirections` (returns a GeoJSON LineString in `route.geometry`).
