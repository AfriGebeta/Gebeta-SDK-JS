[Documentation](../../index.md) / @gebeta/react

# @gebeta/react

## Interfaces

### UseClusteringResult

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `addMarker` | (`marker`: `MarkerData`) => `void` | [hooks/useClustering.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L9) |
| `clearMarkers` | () => `void` | [hooks/useClustering.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L11) |
| `getMarker` | (`markerId`: `string`) => `undefined` \| `MarkerData` | [hooks/useClustering.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L13) |
| `getMarkers` | () => `MarkerData`[] | [hooks/useClustering.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L12) |
| `getOptions` | () => `NormalizedClusteringOptions` | [hooks/useClustering.ts:15](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L15) |
| `removeMarker` | (`markerId`: `string`) => `boolean` | [hooks/useClustering.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L10) |
| `updateOptions` | (`options`: `Partial`\<`ClusteringOptions`\>) => `void` | [hooks/useClustering.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L14) |

## Type Aliases

### GebetaMapProps

```ts
type GebetaMapProps: GebetaMapProps;
```

#### Defined in

[GebetaMap.tsx:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/GebetaMap.tsx#L13)

***

### MarkerData

```ts
type MarkerData: MarkerData;
```

#### Defined in

[hooks/useClustering.ts:6](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L6)

## Functions

### GebetaMap()

```ts
function GebetaMap(__namedParameters): ReactNode
```

Main React component for rendering a Gebeta map.

Manages the MapLibre GL map lifecycle: creates the map on mount, tears it down
on unmount, and exposes a React context that child components can consume via
`useGebetaMap()`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `GebetaMapProps` |

#### Returns

`ReactNode`

#### Example

```jsx
import { GebetaMap } from '@gebeta/react';

const auth = { accessToken: '...', refreshToken: '...' };
const style = { width: '100vw', height: '100vh' };

function App() {
  return (
    <div style={style}>
      <GebetaMap
        auth={auth}
        center={[38.74, 9.02]}
        zoom={12}
        onLoad={(map) => console.log('Map ready', map)}
      />
    </div>
  );
}
```

#### Defined in

[GebetaMap.tsx:45](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/GebetaMap.tsx#L45)

***

### useClustering()

```ts
function useClustering(): UseClusteringResult
```

React hook for managing clustered markers on a Gebeta map.

Must be used inside a GebetaMap component with clustering enabled.

#### Returns

[`UseClusteringResult`](globals.md#useclusteringresult)

Object with methods to add, remove, and query clustered markers.

#### Throws

If clustering is not enabled on the parent GebetaMap component.

#### Example

```tsx
function MarkersLayer() {
  const { addMarker, removeMarker } = useClustering();

  useEffect(() => {
    addMarker({ id: '1', lngLat: [38.74, 9.02] });
    return () => removeMarker('1');
  }, []);
}

// Parent component
// Wrap with GebetaMap (clustering prop must have enabled: true)
```

#### Defined in

[hooks/useClustering.ts:41](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/react/src/hooks/useClustering.ts#L41)
