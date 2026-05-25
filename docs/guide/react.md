# React Integration

## Installation

```bash
npm install @gebeta/react @gebeta/js
```

## GebetaMap component

```jsx
import { GebetaMap } from '@gebeta/react';

const auth = { accessToken, refreshToken };
const mapStyle = { width: '100%', height: '500px' };
const center = [38.7685, 9.0161];

function App() {
  return (
    <GebetaMap
      auth={auth}
      center={center}
      zoom={12}
      style={mapStyle}
      onLoad={({ clustering }) => {
        console.log('Map ready');
      }}
    />
  );
}
```

## Accessing managers via onLoad

The `onLoad` callback receives `{ clustering }`. For other operations (geocoding, directions, navigation), use `@gebeta/js` directly or the `@gebeta/js/*` standalone subpaths.

```jsx
const auth = { accessToken, refreshToken };
const mapStyle = { width: '100%', height: '500px' };

function MapWithGeocoding() {
  return (
    <GebetaMap
      auth={auth}
      style={mapStyle}
      onLoad={({ clustering }) => {
        // clustering is null unless clustering.enabled is set
      }}
    />
  );
}
```

## useClustering hook

The `useClustering()` hook must be used inside a child component of `GebetaMap`, with `clustering` enabled on the parent.

```jsx
import { GebetaMap } from '@gebeta/react';
import { useClustering } from '@gebeta/react/clustering';
import { useEffect } from 'react';

const auth = { accessToken, refreshToken };
const mapStyle = { width: '100%', height: '500px' };
const clusteringOptions = { enabled: true };

function MarkersLayer() {
  const { addMarker, clearMarkers } = useClustering();

  useEffect(() => {
    addMarker({ id: '1', lngLat: [38.7685, 9.0161], imageUrl: '/pin.png' });
    return () => clearMarkers();
  }, []);

  return null;
}

function ClusterMap() {
  return (
    <GebetaMap
      auth={auth}
      clustering={clusteringOptions}
      style={mapStyle}
    >
      <MarkersLayer />
    </GebetaMap>
  );
}
```
