# GebetaMap (React)

## Import

```tsx
import { GebetaMap } from '@gebeta/react';
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `accessToken` | `string` | Yes* | Service account access token |
| `refreshToken` | `string` | Yes* | Service account refresh token |
| `apiKey` | `string` | Yes* | Legacy API key (deprecated) |
| `center` | `[number, number]` | No | Initial map center `[lng, lat]` |
| `zoom` | `number` | No | Initial zoom level |
| `style` | `React.CSSProperties` | No | Container styles |
| `className` | `string` | No | Container class name |
| `onReady` | `(gebetaMap, map, platform) => void` | No | Called when map is initialized |

*Either `accessToken`+`refreshToken` or `apiKey` is required.

## Example

```tsx
<GebetaMap
  accessToken={accessToken}
  refreshToken={refreshToken}
  center={[38.7685, 9.0161]}
  zoom={12}
  style={{ width: '100%', height: '500px' }}
  onReady={(gebetaMap, map, platform) => {
    // gebetaMap: GebetaMaps instance
    // map: MapLibre Map instance
    // platform: PlatformContext
  }}
/>
```
