# React Integration

## Installation

```bash
npm install @gebeta/react @gebeta/js
```

## GebetaMap component

```tsx
import { GebetaMap } from '@gebeta/react';

function App() {
  return (
    <GebetaMap
      auth={{ accessToken, refreshToken }}
      center={[38.7685, 9.0161]}
      zoom={12}
      style={{ width: '100%', height: '500px' }}
      onLoad={({ clustering }) => {
        console.log('Map ready');
      }}
    />
  );
}
```

## Accessing managers via onLoad

The `onLoad` callback receives `{ clustering }`. For other operations (geocoding, directions, navigation), use `@gebeta/js` directly or the `@gebeta/js/*` standalone subpaths.

```tsx
function MapWithGeocoding() {
  return (
    <GebetaMap
      auth={{ accessToken, refreshToken }}
      style={{ width: '100%', height: '500px' }}
      onLoad={({ clustering }) => {
        // clustering is null unless clustering={{ enabled: true }} is set
      }}
    />
  );
}
```

## useClustering hook

The `useClustering()` hook must be used inside a child component of `GebetaMap`, with `clustering={{ enabled: true }}` set on the parent.

```tsx
import { GebetaMap } from '@gebeta/react';
import { useClustering } from '@gebeta/react/clustering';
import { useEffect } from 'react';

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
      auth={{ accessToken, refreshToken }}
      clustering={{ enabled: true }}
      style={{ width: '100%', height: '500px' }}
    >
      <MarkersLayer />
    </GebetaMap>
  );
}
```
