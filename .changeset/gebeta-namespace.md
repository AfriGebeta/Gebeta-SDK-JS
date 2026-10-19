---
'@gebeta/js': minor
'@gebeta/react': minor
'@gebeta/core': minor
'@gebeta/api': minor
'@gebeta/node': minor
---

Add Gebeta-branded map building blocks so apps never import the map engine directly:

- `gebeta` namespace (also named exports, and `window.gebeta` on CDN): `Marker`, `Popup`, `LngLat`, `LngLatBounds`, `MercatorCoordinate`, `NavigationControl`, `GeolocateControl`, `FullscreenControl`, `ScaleControl`, `AttributionControl`, `TerrainControl`, `addProtocol`, `removeProtocol`; types `GebetaMapInstance`, `GeoJSONSource`, `MapMouseEvent`.
- `sdk.addMarker({ lngLat, color | imageUrl | element, anchor, popup, draggable, onClick, onDragEnd })` and `sdk.addPopup({ lngLat, text | html | element })`.
- `import '@gebeta/js/style.css'` replaces the engine stylesheet import.
- `@gebeta/react` re-exports all of the above.
