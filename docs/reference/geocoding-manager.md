# GeocodingManager

## Import

```js
// With full SDK
import { GebetaMaps } from '@gebeta/js';
const geocoder = gebetaMap.geocodingManager;

// Standalone (tree-shakeable)
import { GeocodingManager, AuthManager } from '@gebeta/js/geocoding';
const geocoder = new GeocodingManager(new AuthManager({ accessToken, refreshToken }));
```

## Methods

### `geocode(query)`

Forward geocode a place name or address.

```ts
geocode(query: string): Promise<GeocodingResult[]>
```

### `reverseGeocode(point)`

Reverse geocode coordinates to a place name.

```ts
reverseGeocode(point: { lat: number; lng: number }): Promise<GeocodingResult[]>
```

## GeocodingResult

```ts
interface GeocodingResult {
  name: string;
  lat: number;
  lng: number;
}
```
