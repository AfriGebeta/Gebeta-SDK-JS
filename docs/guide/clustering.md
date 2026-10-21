# Clustering

Group nearby markers into clusters that expand on zoom.

## Enable clustering

Clustering must be enabled in the `GebetaMaps` constructor — it cannot be changed after `init()`.

```js
const sdk = new GebetaMaps({
  auth: { accessToken, refreshToken },
  clustering: { enabled: true },
});
sdk.init({ container: 'map' });

// Access the manager after map loads
sdk.clustering.addMarker({ id: '1', lngLat: [38.7685, 9.0161] });
sdk.clustering.addMarker({ id: '2', lngLat: [38.77, 9.02], imageUrl: '/pin.png' });
```

Note: `sdk.clustering` returns `null` if `clustering.enabled` was not set in the constructor.

## React hook

```jsx
import { GebetaMap } from '@gebeta/react';
import { useClustering } from '@gebeta/react/clustering';
import { useEffect } from 'react';

const auth = { accessToken, refreshToken };
const mapStyle = { width: '100%', height: '500px' };
const clusteringOptions = { enabled: true };

// Must be a child component inside GebetaMap
function MarkersLayer() {
  const { addMarker, clearMarkers } = useClustering();

  useEffect(() => {
    addMarker({ id: '1', lngLat: [38.7685, 9.0161] });
    addMarker({ id: '2', lngLat: [38.77, 9.02], imageUrl: '/pin.png' });
    return () => clearMarkers();
  }, []);

  return null;
}

function App() {
  return (
    <GebetaMap auth={auth} clustering={clusteringOptions} style={mapStyle}>
      <MarkersLayer />
    </GebetaMap>
  );
}
```
