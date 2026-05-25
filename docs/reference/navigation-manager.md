# NavigationManager

## Import

```js
import { NavigationManager } from '@gebeta/js/navigation';
```

## Methods

### `start(route, options, locationProvider)`

```ts
start(
  route: RouteData,
  options: { userId: string; role: string },
  locationProvider: ILocationProvider
): void
```

### `stop()`

```ts
stop(): void
```

### `isNavigating()`

```ts
isNavigating(): boolean
```

### `getCurrentStepIndex()`

```ts
getCurrentStepIndex(): number
```

### `on(event, callback)` / `off(event, callback)`

```ts
on(event: 'progress' | 'offRoute' | 'arrived', callback: Function): void
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `progress` | `ProgressEvent` | Fired on each location update |
| `offRoute` | — | User has deviated from the route |
| `arrived` | — | User has reached the destination |
