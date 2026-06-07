# @gebeta/react

React SDK for Gebeta Maps. Provides a `GebetaMap` component and a `useClustering` hook.

## Installation

```bash
npm install @gebeta/react @gebeta/js
```

## Quick start

```tsx
import { GebetaMap } from '@gebeta/react';

function App() {
  return (
    <GebetaMap
      accessToken={accessToken}
      refreshToken={refreshToken}
      style={{ width: '100%', height: '500px' }}
      onReady={(gebetaMap, map, platform) => {
        // Full access to GebetaMaps, MapLibre map, and platform adapters
      }}
    />
  );
}
```

## Clustering

```tsx
import { useClustering } from '@gebeta/react/clustering';

const { setMarkers, clearMarkers } = useClustering(gebetaMapInstance);

setMarkers([{ id: '1', lat: 9.0161, lng: 38.7685, imageUrl: '/pin.png' }]);
```

## Peer dependencies

- `react` >= 18

## Documentation

[gebeta-sdk-js docs](https://AfriGebeta.github.io/Gebeta-SDK-JS)
