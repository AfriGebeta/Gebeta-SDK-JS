# useClustering

React hook for managing clustered markers. Must be used inside a `GebetaMap` component that has `clustering={{ enabled: true }}`.

## Import

```tsx
import { useClustering } from '@gebeta/react/clustering';
```

## Usage

```tsx
function MarkersLayer() {
  const { addMarker, removeMarker, clearMarkers } = useClustering();

  useEffect(() => {
    addMarker({ id: '1', lngLat: [38.7685, 9.0161] });
    return () => clearMarkers();
  }, []);

  return null;
}
```

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `addMarker` | `(marker: MarkerData) => void` | Add a marker to the cluster |
| `removeMarker` | `(markerId: string) => boolean` | Remove a marker by ID |
| `clearMarkers` | `() => void` | Remove all markers |
| `getMarkers` | `() => MarkerData[]` | Get all current markers |
| `getMarker` | `(markerId: string) => MarkerData \| undefined` | Get a single marker by ID |
| `updateOptions` | `(options: Partial<ClusteringOptions>) => void` | Update clustering options |
| `getOptions` | `() => ClusteringOptions` | Get current clustering options |
