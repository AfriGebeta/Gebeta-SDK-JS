# GebetaMap (React)

## Import

```tsx
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

```tsx
<GebetaMap
  auth={{ accessToken, refreshToken }}
  center={[38.7685, 9.0161]}
  zoom={12}
  style={{ width: '100%', height: '500px' }}
  onLoad={({ clustering }) => {
    // clustering: ClusteringManager | null (null if clustering not enabled)
  }}
/>
```

## Accessing clustering via hook

Use `useClustering()` inside a child component rather than via `onLoad`:

```tsx
<GebetaMap auth={auth} clustering={{ enabled: true }}>
  <MarkersLayer />
</GebetaMap>
```
