# Navigation

Turn-by-turn navigation with real-time location tracking, off-route detection, and rerouting.

## Start navigation

```js
import { BrowserLocationProvider } from '@gebeta/js';

const route = await gebetaMap.getDirections(origin, destination);

gebetaMap.navigation.start(
  route,
  {
    userId: 'driver-123',
    role: 'driver',
  },
  new BrowserLocationProvider()
);
```

## Listen to navigation events

```js
gebetaMap.navigation.on('progress', event => {
  console.log(event.currentStep); // current instruction
  console.log(event.remainingDistance); // meters
  console.log(event.remainingTime); // seconds
});

gebetaMap.navigation.on('offroute', () => {
  console.log('Off route — rerouting...');
});

gebetaMap.navigation.on('arrive', () => {
  console.log('Arrived at destination');
});
```

## Stop navigation

```js
gebetaMap.navigation.stop();
```

## Standalone (tree-shaking)

```js
import { NavigationManager } from '@gebeta/js/navigation';
```
