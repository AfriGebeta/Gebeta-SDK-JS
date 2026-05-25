# Fencing

Draw geofences on the map and detect when points enter or exit them.

## Add a fence

```js
gebetaMap.fenceManager.addFence({
  id: 'zone-1',
  coordinates: [
    [38.760, 9.010],
    [38.780, 9.010],
    [38.780, 9.030],
    [38.760, 9.030],
    [38.760, 9.010], // close the polygon
  ],
});
```

## Check if a point is inside a fence

```js
const inside = gebetaMap.fenceManager.isInsideFence('zone-1', { lat: 9.020, lng: 38.770 });
```

## Clear fences

```js
gebetaMap.fenceManager.clearFences();
```

## Standalone (tree-shaking)

```js
import { FenceManager } from '@gebeta/js/fencing';
```
