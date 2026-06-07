# Fencing

Draw geofences on the map and detect when points enter or exit them.

## Add a fence

```js
gebetaMap.fencing.addFence({
  id: 'zone-1',
  coordinates: [
    [38.76, 9.01],
    [38.78, 9.01],
    [38.78, 9.03],
    [38.76, 9.03],
    [38.76, 9.01], // close the polygon
  ],
});
```

## Check if a point is inside a fence

```js
const inside = gebetaMap.fencing.isInsideFence('zone-1', { lat: 9.02, lng: 38.77 });
```

## Clear fences

```js
gebetaMap.fencing.clearFences();
```

## Standalone (tree-shaking)

```js
import { FenceManager } from '@gebeta/js/fencing';
```
