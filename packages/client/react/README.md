# @gebeta/react

React SDK for Gebeta Maps. Provides a `GebetaMaps` component and a `useClustering` hook.

## Installation

```bash
npm install @gebeta/react @gebeta/js
```

## Quick start

```tsx
import { useRef } from 'react';
import { GebetaMaps, type GebetaMapsRef } from '@gebeta/react';

function App({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  const mapRef = useRef<GebetaMapsRef>(null);

  return (
    <GebetaMaps
      ref={mapRef}
      auth={{ accessToken, refreshToken }}
      center={[38.7578, 9.0301]}
      zoom={13}
      navigationControl
      style={{ width: '100%', height: '500px' }}
      onLoad={gm => {
        // gm is the GebetaMaps instance (same as mapRef.current); all managers are ready here
        gm.getMap()?.on('click', e => console.log(e.lngLat));
      }}
    />
  );
}
```

- `style` / `className` apply to the map wrapper (it fills its parent by default).
- Use `styleUrl` (or `mapStyle` for a URL or style object) to change the map style.
- `center` and `zoom` are read on mount; move the camera with `mapRef.current?.getMap()?.flyTo(...)`.
- Other MapLibre map options (`pitch`, `bearing`, `maxBounds`, …) are forwarded to the map.

## Clustering

```tsx
import { useEffect } from 'react';
import { GebetaMaps, useClustering } from '@gebeta/react';

const clustering = { enabled: true, showClusterCount: true };

function Markers() {
  const { addMarker, clearMarkers } = useClustering(); // must be a child of <GebetaMaps clustering>
  useEffect(() => {
    addMarker({ id: '1', lngLat: [38.7685, 9.0161], imageUrl: '/pin.png' });
    return () => clearMarkers();
  }, [addMarker, clearMarkers]);
  return null;
}

<GebetaMaps auth={auth} clustering={clustering}>
  <Markers />
</GebetaMaps>;
```

## Peer dependencies

- `react` >= 19

## Documentation

[gebeta-sdk-js docs](https://AfriGebeta.github.io/Gebeta-SDK-JS)
