# Geocoding

Convert place names to coordinates (forward geocoding) and coordinates to place names (reverse geocoding).

## With GebetaMaps

```js
// Forward geocode
const results = await gebetaMap.geocodingManager.geocode('Bole, Addis Ababa');
// [{ name, lat, lng, ... }, ...]

// Reverse geocode
const results = await gebetaMap.geocodingManager.reverseGeocode({ lat: 9.0161, lng: 38.7685 });
```

## Standalone (tree-shaking)

Use the subpath import to include only geocoding — no map rendering code:

```js
import { GeocodingManager, AuthManager } from '@gebeta/js/geocoding';

const geocoder = new GeocodingManager(
  new AuthManager({ accessToken, refreshToken })
);

const results = await geocoder.geocode('Bole, Addis Ababa');
const places = await geocoder.reverseGeocode({ lat: 9.0161, lng: 38.7685 });
```

## Server-side (Node.js)

```js
import { GeocodingManager, AuthManager } from '@gebeta/js/geocoding';

// Works in Node.js too — no browser APIs required
const geocoder = new GeocodingManager(
  new AuthManager({
    accessToken: process.env.GEBETA_ACCESS_TOKEN,
    refreshToken: process.env.GEBETA_REFRESH_TOKEN,
  })
);
const results = await geocoder.geocode('Meskel Square');
```

::: tip Tree Shaking
`@gebeta/js/geocoding` bundles only ~45 kB vs ~300 kB for the full SDK. Use it when you don't need map rendering.
:::
