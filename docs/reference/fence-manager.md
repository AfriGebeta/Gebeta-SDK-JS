# FenceManager

## Import

```js
import { FenceManager } from '@gebeta/js/fencing';
```

## Methods

### `addFence(fence)`

```ts
addFence(fence: { id: string; coordinates: [number, number][] }): void
```

### `removeFence(id)`

```ts
removeFence(id: string): void
```

### `clearFences()`

```ts
clearFences(): void
```

### `isInsideFence(id, point)`

```ts
isInsideFence(id: string, point: { lat: number; lng: number }): boolean
```
