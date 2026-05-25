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
      accessToken={accessToken}
      refreshToken={refreshToken}
      center={[38.7685, 9.0161]}
      zoom={12}
      style={{ width: '100%', height: '500px' }}
      onReady={(gebetaMap, map, platform) => {
        // Full access to GebetaMaps instance and managers
        console.log('Map ready', gebetaMap);
      }}
    />
  );
}
```

## Accessing managers via onReady

```tsx
function MapWithGeocoding() {
  const [results, setResults] = useState([]);

  return (
    <GebetaMap
      accessToken={accessToken}
      refreshToken={refreshToken}
      style={{ width: '100%', height: '500px' }}
      onReady={async (gebetaMap) => {
        const res = await gebetaMap.geocodingManager.geocode('Bole');
        setResults(res);
      }}
    />
  );
}
```

## useClustering hook

```tsx
import { GebetaMap } from '@gebeta/react';
import { useClustering } from '@gebeta/react/clustering';
import { useState } from 'react';

function ClusterMap() {
  const [gebetaMap, setGebetaMap] = useState(null);
  const { setMarkers } = useClustering(gebetaMap);

  return (
    <>
      <GebetaMap
        accessToken={accessToken}
        refreshToken={refreshToken}
        style={{ width: '100%', height: '500px' }}
        onReady={(gm) => {
          setGebetaMap(gm);
          setMarkers([
            { id: '1', lat: 9.0161, lng: 38.7685, imageUrl: '/pin.png' },
          ]);
        }}
      />
    </>
  );
}
```
