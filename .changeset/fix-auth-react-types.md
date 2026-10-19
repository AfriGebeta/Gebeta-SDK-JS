---
'@gebeta/core': patch
'@gebeta/js': patch
'@gebeta/react': patch
'@gebeta/api': patch
---

Fix standalone managers and React typings:

- Geocoding: accept the API's `"Ok"` success message case-insensitively (forward and reverse geocoding failed with "Geocoding failed: Ok").
- `GeocodingManager`, `DirectionsManager` and `NavigationManager` now accept an `AuthManager` instance or a legacy API key string (previously only an internal resolved-auth object worked, so `new GeocodingManager(new AuthManager(...))` crashed).
- `GebetaMap` (React): `style` and `className` now apply to the map wrapper instead of being passed to MapLibre as the map style; new `mapStyle` prop sets the map style; passing both `apiKey` and `auth` now throws a `ValidationError`.
- `GebetaMap` props are fully typed (previously collapsed to `any`), so `onLoad` infers the `GebetaMaps` instance.
- `sdk.navigation.on()` / `off()` infer the event payload type from the event name.
- Container docs: `container` is an element id (`'map'`), not a CSS selector.
