# ClusteringManager

## Import

```js
import { ClusteringManager } from '@gebeta/js/clustering';
```

## Methods

### `setMarkers(markers)`

```ts
setMarkers(markers: MarkerData[]): void
```

### `clearMarkers()`

```ts
clearMarkers(): void
```

## MarkerData

```ts
interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}
```
