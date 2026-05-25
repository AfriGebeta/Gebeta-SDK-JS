# Map Setup

## Basic map

```js
import { GebetaMaps } from '@gebeta/js';

const gebetaMap = new GebetaMaps({
  auth: { accessToken, refreshToken }
});

const map = gebetaMap.init({
  container: 'map',           // DOM element ID or HTMLElement
  center: [38.7685, 9.0161],  // [lng, lat] — defaults to Addis Ababa
  zoom: 12,
  navigationControl: true,    // adds zoom/compass controls
});
```

## Map styles

```js
import { API } from '@gebeta/api';

gebetaMap.init({
  container: 'map',
  style: API.Map.Constants.MAP_STYLES.STANDARD, // default
  // style: API.Map.Constants.MAP_STYLES.SATELLITE,
  // style: API.Map.Constants.MAP_STYLES.TERRAIN,
});
```

## Accessing the underlying MapLibre instance

```js
const map = gebetaMap.getMap();

// Now you can use any MapLibre GL JS API directly
map.on('click', (e) => {
  console.log(e.lngLat);
});
```

## React

```tsx
import { GebetaMap } from '@gebeta/react';

function App() {
  return (
    <GebetaMap
      accessToken={accessToken}
      refreshToken={refreshToken}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

::: tip
The `GebetaMap` React component manages the map lifecycle automatically. Use the `onReady` callback to access the `GebetaMaps` instance and managers.
:::
