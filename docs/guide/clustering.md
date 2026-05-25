# Clustering

Group nearby markers into clusters that expand on zoom.

## Basic clustering

```js
const markers = [
  { id: '1', lat: 9.0161, lng: 38.7685, imageUrl: 'https://example.com/pin.png' },
  { id: '2', lat: 9.0200, lng: 38.7700, imageUrl: 'https://example.com/pin.png' },
  // ...
];

gebetaMap.clustering.setMarkers(markers);
```

## Standalone (tree-shaking)

```js
import { ClusteringManager } from '@gebeta/js/clustering';
```

## React hook

```tsx
import { useClustering } from '@gebeta/react';

function MapWithClusters() {
  const { setMarkers, clearMarkers } = useClustering(gebetaMapInstance);

  useEffect(() => {
    setMarkers([
      { id: '1', lat: 9.0161, lng: 38.7685, imageUrl: '/pin.png' },
    ]);
    return () => clearMarkers();
  }, []);
}
```
