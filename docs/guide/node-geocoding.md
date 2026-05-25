# Server-Side Geocoding

Use `@gebeta/js/geocoding` in Node.js for server-side geocoding — no browser APIs required.

## Setup

```bash
npm install @gebeta/js
```

```ts
import { GeocodingManager, AuthManager } from '@gebeta/js/geocoding';

const geocoder = new GeocodingManager(
  new AuthManager({
    accessToken: process.env.GEBETA_ACCESS_TOKEN!,
    refreshToken: process.env.GEBETA_REFRESH_TOKEN!,
  })
);
```

## Forward geocoding

```ts
const results = await geocoder.geocode('Bole, Addis Ababa');
// [{ name: 'Bole', lat: 9.0161, lng: 38.7685, ... }]
```

## Reverse geocoding

```ts
const results = await geocoder.reverseGeocode({ lat: 9.0161, lng: 38.7685 });
// [{ name: 'Bole Road', ... }]
```

::: tip Bundle size
Importing from `@gebeta/js/geocoding` instead of `@gebeta/js` saves ~85% bundle size since it excludes map rendering, navigation, clustering, and other visual modules.
:::
