# @gebeta/react

React SDK for Gebeta Maps. The SDK owns the map internally; you never use Maplibre or react-map-gl directly. Use the `GebetaMap` component and hooks such as `useClustering`.

## Usage

```tsx
import { GebetaMap, useClustering } from '@gebeta/react';

function MapWithClustering() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <GebetaMap
        apiKey="YOUR_API_KEY"
        styleUrl="https://tiles.gebeta.app/styles/standard/style.json"
        clustering={{ enabled: true, showClusterCount: true }}
      >
        <ClusteringPanel />
      </GebetaMap>
    </div>
  );
}

function ClusteringPanel() {
  const clustering = useClustering();
  return (
    <div>
      <button
        onClick={() =>
          clustering.addMarker({ id: '1', lngLat: { lng: 38.7, lat: 9 }, popupContent: 'Hello' })
        }
      >
        Add marker
      </button>
      <button onClick={() => clustering.clearMarkers()}>Clear</button>
    </div>
  );
}
```

## API

- **GebetaMap** – Renders the map. Props: `apiKey`, `styleUrl` or `style`, `clustering` (optional), `onLoad`, `onError`, `navigationControl`, and other map options. Children are rendered as an overlay on top of the map.
- **useClustering()** – Returns clustering API (`addMarker`, `removeMarker`, `clearMarkers`, `getMarkers`, `getMarker`, `updateOptions`, `getOptions`). Must be used inside `GebetaMap` with `clustering={{ enabled: true }}`.

## Peer dependencies

- `react` ^18.0.0
