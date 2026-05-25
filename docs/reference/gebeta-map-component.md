# GebetaMap (React)

## Import

```jsx
import { GebetaMap } from '@gebeta/react';
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `auth` | `{ accessToken: string, refreshToken: string }` | Yes* | Service account credentials |
| `apiKey` | `string` | Yes* | Legacy API key (deprecated) |
| `center` | `[number, number]` | No | Initial map center `[lng, lat]` |
| `zoom` | `number` | No | Initial zoom level |
| `style` | `React.CSSProperties` | No | Container styles (passed to MapLibre) |
| `className` | `string` | No | Container class name |
| `clustering` | `{ enabled: boolean }` | No | Enable marker clustering |
| `navigationControl` | `boolean` | No | Show zoom/compass controls |
| `onLoad` | `(map: { clustering: ClusteringManager \| null }) => void` | No | Called when map style is loaded |
| `onError` | `(error: Error) => void` | No | Called on map error |
| `children` | `ReactNode` | No | Child components (rendered inside the map container) |

*Either `auth` or `apiKey` is required.

## Example

```jsx
const auth = { accessToken, refreshToken };
const mapStyle = { width: '100%', height: '500px' };
const center = [38.7685, 9.0161];

<GebetaMap
  auth={auth}
  center={center}
  zoom={12}
  style={mapStyle}
  onLoad={({ clustering }) => {
    // clustering: ClusteringManager | null
  }}
/>
```

## Accessing clustering via hook

Use `useClustering()` inside a child component rather than via `onLoad`:

```jsx
const clusteringOptions = { enabled: true };

<GebetaMap auth={auth} clustering={clusteringOptions}>
  <MarkersLayer />
</GebetaMap>
```
