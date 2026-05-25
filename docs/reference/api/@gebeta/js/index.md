[Documentation](../../index.md) / @gebeta/js

# @gebeta/js

JavaScript SDK for Gebeta Maps. Works in any browser environment with a bundler (Vite, webpack, Rollup) or via CDN script tag.

## Installation

```bash
npm install @gebeta/js
```

## CDN

```html
<script src="https://tiles.gebeta.app/static/v3/gebeta-maps.umd.js"></script>
```

## Quick start

```js
import { GebetaMaps } from '@gebeta/js';

const gebetaMap = new GebetaMaps({
  auth: { accessToken: '...', refreshToken: '...' }
});

gebetaMap.init({ container: 'map', zoom: 12 });
```

## Tree shaking

Import only what you need using subpath imports:

```js
import { GeocodingManager } from '@gebeta/js/geocoding';
import { DirectionsManager } from '@gebeta/js/directions';
import { ClusteringManager } from '@gebeta/js/clustering';
import { NavigationManager } from '@gebeta/js/navigation';
import { FenceManager }       from '@gebeta/js/fencing';
```

## Features

- Interactive map (MapLibre GL)
- Geocoding and reverse geocoding
- Turn-by-turn directions
- Marker clustering
- Geofencing
- Navigation with real-time tracking

## Authentication

Service account auth is recommended. Use `@gebeta/node` on your backend to generate tokens, then pass them to the SDK:

```js
const gebetaMap = new GebetaMaps({
  auth: { accessToken, refreshToken }
});
```

## Documentation

[gebeta-sdk-js docs](https://AfriGebeta.github.io/Gebeta-SDK-JS)
