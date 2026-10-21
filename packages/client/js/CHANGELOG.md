# @gebeta/js

## 3.3.0

### Patch Changes

- Updated dependencies [353b471]
  - @gebeta/api@3.3.0
  - @gebeta/core@3.3.0

## 3.2.0

### Patch Changes

- Updated dependencies [78a8ee9]
  - @gebeta/api@3.2.0
  - @gebeta/core@3.2.0

## 3.1.0

### Minor Changes

- 5c4deee: Add Gebeta-branded map building blocks so apps never import the map engine directly:

  - `gebeta` namespace (also named exports, and `window.gebeta` on CDN): `Marker`, `Popup`, `LngLat`, `LngLatBounds`, `MercatorCoordinate`, `NavigationControl`, `GeolocateControl`, `FullscreenControl`, `ScaleControl`, `AttributionControl`, `TerrainControl`, `addProtocol`, `removeProtocol`; types `GebetaMapInstance`, `GeoJSONSource`, `MapMouseEvent`.
  - `sdk.addMarker({ lngLat, color | imageUrl | element, anchor, popup, draggable, onClick, onDragEnd })` and `sdk.addPopup({ lngLat, text | html | element })`.
  - `import '@gebeta/js/style.css'` replaces the engine stylesheet import.
  - `@gebeta/react` re-exports all of the above.

### Patch Changes

- 7830e03: Fix standalone managers and React typings:

  - Geocoding: accept the API's `"Ok"` success message case-insensitively (forward and reverse geocoding failed with "Geocoding failed: Ok").
  - `GeocodingManager`, `DirectionsManager` and `NavigationManager` now accept an `AuthManager` instance or a legacy API key string (previously only an internal resolved-auth object worked, so `new GeocodingManager(new AuthManager(...))` crashed).
  - `GebetaMaps` (React): `style` and `className` now apply to the map wrapper instead of being passed to MapLibre as the map style; new `mapStyle` prop sets the map style; passing both `apiKey` and `auth` now throws a `ValidationError`.
  - `GebetaMaps` props are fully typed (previously collapsed to `any`), so `onLoad` infers the `GebetaMaps` instance.
  - `sdk.navigation.on()` / `off()` infer the event payload type from the event name.
  - Container docs: `container` is an element id (`'map'`), not a CSS selector.

- Updated dependencies [7830e03]
- Updated dependencies [5c4deee]
  - @gebeta/core@3.1.0
  - @gebeta/api@3.1.0

## 3.0.12

### Patch Changes

- e6a2301: fix CDN deployment to new server
  - @gebeta/api@3.0.12
  - @gebeta/core@3.0.12

## 3.0.11

### Patch Changes

- 104dc71: Add React Native SDK deployment, React 19 support, and iOS setup helper

  - `@gebeta/react-native`: Add `npx @gebeta/react-native setup-ios` helper that patches consumer Podfiles for iOS builds (use_frameworks static linkage, MLRN post_install hook, Xcode 16 C++ compiler flag overrides). Add CI workflow and npm publish integration.
  - `@gebeta/react`: Update to React 19 (peerDependencies, devDependencies, @types/react). Fix children prop type.
  - Other packages: patch bumps for CI and deployment pipeline updates.

- Updated dependencies [104dc71]
  - @gebeta/api@3.0.11
  - @gebeta/core@3.0.11

## 3.0.10

### Patch Changes

- 2907c15: Add react native sdk deployment
- Updated dependencies [2907c15]
  - @gebeta/api@3.0.10
  - @gebeta/core@3.0.10

## 3.0.9

### Patch Changes

- 28524fb: version bump
- Updated dependencies [28524fb]
  - @gebeta/api@3.0.9
  - @gebeta/core@3.0.9

## 3.0.8

### Patch Changes

- ef1b6f6: Expose map ref
- Updated dependencies [ef1b6f6]
  - @gebeta/core@3.0.8
  - @gebeta/api@3.0.8

## 3.0.7

### Patch Changes

- 2c07534: Fix api key auth, homogenize auth type decision
- Updated dependencies [2c07534]
  - @gebeta/api@3.0.7
  - @gebeta/core@3.0.7

## 3.0.6

### Patch Changes

- a1ea578: Add Branding
- Updated dependencies [a1ea578]
  - @gebeta/api@3.0.6
  - @gebeta/core@3.0.6

## 3.0.5

### Patch Changes

- fe7d6b0: Build before publish
- Updated dependencies [fe7d6b0]
  - @gebeta/core@3.0.5
  - @gebeta/api@3.0.5

## 3.0.4

### Patch Changes

- 8ab28f6: fix: include dist files in npm
- Updated dependencies [8ab28f6]
  - @gebeta/core@3.0.4
  - @gebeta/api@3.0.4

## 3.0.3

### Patch Changes

- 26ad048: fix deployment path
- Updated dependencies [26ad048]
  - @gebeta/api@3.0.3
  - @gebeta/core@3.0.3

## 3.0.2

### Patch Changes

- 983fd1e: Fix unimportability issue with js package
- Updated dependencies [983fd1e]
  - @gebeta/api@3.0.2
  - @gebeta/core@3.0.2

## 3.0.1

### Patch Changes

- de1cd01: New SDK with improved consistency, validation and authentication flows
- Updated dependencies [de1cd01]
  - @gebeta/api@3.0.1
  - @gebeta/core@3.0.1
