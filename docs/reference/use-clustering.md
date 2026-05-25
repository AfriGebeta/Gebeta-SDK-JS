# useClustering

React hook for marker clustering.

## Import

```tsx
import { useClustering } from '@gebeta/react/clustering';
```

## Usage

```tsx
const { setMarkers, clearMarkers } = useClustering(gebetaMapInstance);
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `gebetaMap` | `GebetaMaps \| null` | The GebetaMaps instance from `onReady` |

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `setMarkers` | `(markers: MarkerData[]) => void` | Set or replace all markers |
| `clearMarkers` | `() => void` | Remove all markers |
