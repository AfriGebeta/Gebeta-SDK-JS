# ClusteringManager

## Import

```js
// Access via GebetaMaps instance (clustering must be enabled in constructor)
const clustering = sdk.clustering; // null if not enabled
```

## Methods

### `addMarker(marker)`

```ts
addMarker(marker: MarkerData): void
```

### `removeMarker(markerId)`

```ts
removeMarker(markerId: string): boolean
```

### `clearMarkers()`

```ts
clearMarkers(): void
```

### `getMarkers()`

```ts
getMarkers(): MarkerData[]
```

### `getMarker(markerId)`

```ts
getMarker(markerId: string): MarkerData | undefined
```

## MarkerData

```ts
interface MarkerData {
  id: string;
  lngLat: [number, number] | { lng: number; lat: number }; // [lng, lat] or object
  imageUrl?: string;
  size?: [number, number]; // [width, height] in pixels, default: [30, 30]
  onClick?: (lngLat, marker, event) => void;
}
```
