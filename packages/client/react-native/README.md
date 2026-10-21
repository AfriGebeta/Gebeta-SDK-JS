# @gebeta/react-native

React Native SDK for Gebeta Maps. Provides a `GebetaMap` component and hooks for directions, navigation, clustering, fencing, and user location.

## Installation

```bash
npm install @gebeta/react-native @maplibre/maplibre-react-native
```

### iOS setup

After installing, run the setup helper once to patch your Podfile:

```bash
npx @gebeta/react-native setup-ios
cd ios && pod install
```

## Quick start

```tsx
import { GebetaMap } from '@gebeta/react-native';

export default function App() {
  return (
    <GebetaMap
      accessToken="your-access-token"
      refreshToken="your-refresh-token"
      style={{ flex: 1 }}
      initialCenter={[38.7685, 9.0161]}
      initialZoom={12}
    />
  );
}
```

## Hooks

### Directions

```tsx
import { useDirections } from '@gebeta/react-native';

const { getRoute, clearRoute } = useDirections(gebetaMap);

await getRoute({ start: [38.76, 9.01], end: [38.80, 9.03] });
```

### Navigation

```tsx
import { useNavigation } from '@gebeta/react-native';

const { startNavigation, stopNavigation, progress } = useNavigation(gebetaMap);

await startNavigation({ start: [38.76, 9.01], end: [38.80, 9.03] });
```

### Clustering

```tsx
import { useClustering } from '@gebeta/react-native';

const { setMarkers, clearMarkers } = useClustering(gebetaMap);

setMarkers([{ id: '1', lat: 9.0161, lng: 38.7685, imageUrl: require('./pin.png') }]);
```

### User location

```tsx
import { useUserLocation } from '@gebeta/react-native';

const { startTracking, stopTracking, location } = useUserLocation();
```

## Peer dependencies

- `react` >= 19.1.0
- `react-native` >= 0.80.0
- `@maplibre/maplibre-react-native` >= 11.0.0

## Documentation

[gebeta-sdk-js docs](https://AfriGebeta.github.io/Gebeta-SDK-JS)

## Repository

[github.com/AfriGebeta/Gebeta-SDK-JS](https://github.com/AfriGebeta/Gebeta-SDK-JS)
