[Documentation](../../index.md) / @gebeta/js

# @gebeta/js

## Classes

### BrowserLocationProvider

#### Implements

- `ILocationProvider`

#### Methods

##### start()

```ts
start(onLocation): void
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `onLocation` | (`location`) => `void` |

###### Returns

`void`

###### Implementation of

`ILocationProvider.start`

###### Defined in

[client/js/src/adapters/LocationProvider.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/adapters/LocationProvider.ts#L36)

##### stop()

```ts
stop(): void
```

###### Returns

`void`

###### Implementation of

`ILocationProvider.stop`

###### Defined in

[client/js/src/adapters/LocationProvider.ts:70](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/adapters/LocationProvider.ts#L70)

##### getInstance()

```ts
static getInstance(options?): BrowserLocationProvider
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options`? | `LocationProviderOptions` |

###### Returns

[`BrowserLocationProvider`](globals.md#browserlocationprovider)

###### Defined in

[client/js/src/adapters/LocationProvider.ts:23](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/adapters/LocationProvider.ts#L23)

***

### ClusteringManager

Manages marker clustering on a MapLibre map.

Groups nearby markers into clusters at lower zoom levels and renders
individual markers when zoomed in. Cluster markers automatically expand
on click unless a custom `clusterOnClick` handler is provided.

Enable via the constructor: `new GebetaMaps({ clustering: { enabled: true } })`,
then access via `sdk.clustering`.

#### Constructors

##### new ClusteringManager()

```ts
new ClusteringManager(
   mapAdapter, 
   markerFactory, 
   popupFactory, 
   options): ClusteringManager
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `mapAdapter` | `IMapAdapter` |
| `markerFactory` | `IMarkerFactory` |
| `popupFactory` | `IPopupFactory` |
| `options` | `ClusteringOptions` |

###### Returns

[`ClusteringManager`](globals.md#clusteringmanager)

###### Defined in

[client/js/src/Clustering/ClusteringManager.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Clustering/ClusteringManager.ts#L30)

#### Methods

##### addMarker()

```ts
addMarker(marker): void
```

Add a marker to clustering.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `marker` | `MarkerData` | Marker data to add |

###### Returns

`void`

###### Defined in

[client/js/src/Clustering/ClusteringManager.ts:59](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Clustering/ClusteringManager.ts#L59)

##### clearMarkers()

```ts
clearMarkers(): void
```

Clear all markers.

###### Returns

`void`

###### Defined in

[client/js/src/Clustering/ClusteringManager.ts:85](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Clustering/ClusteringManager.ts#L85)

##### getMarker()

```ts
getMarker(markerId): undefined | MarkerData
```

Get marker by ID.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `markerId` | `string` | ID of marker to find |

###### Returns

`undefined` \| `MarkerData`

Marker data or undefined if not found

###### Defined in

[client/js/src/Clustering/ClusteringManager.ts:103](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Clustering/ClusteringManager.ts#L103)

##### getMarkers()

```ts
getMarkers(): MarkerData[]
```

Get all markers.

###### Returns

`MarkerData`[]

Array of all markers

###### Defined in

[client/js/src/Clustering/ClusteringManager.ts:94](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Clustering/ClusteringManager.ts#L94)

##### getOptions()

```ts
getOptions(): NormalizedClusteringOptions
```

Get clustering options.

###### Returns

`NormalizedClusteringOptions`

Current clustering options

###### Defined in

[client/js/src/Clustering/ClusteringManager.ts:124](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Clustering/ClusteringManager.ts#L124)

##### removeMarker()

```ts
removeMarker(markerId): boolean
```

Remove a marker by ID.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `markerId` | `string` | ID of marker to remove |

###### Returns

`boolean`

True if marker was removed, false if not found

###### Defined in

[client/js/src/Clustering/ClusteringManager.ts:69](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Clustering/ClusteringManager.ts#L69)

##### updateOptions()

```ts
updateOptions(options): void
```

Update clustering options.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `Partial`\<`ClusteringOptions`\> | Partial options to update |

###### Returns

`void`

###### Defined in

[client/js/src/Clustering/ClusteringManager.ts:111](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Clustering/ClusteringManager.ts#L111)

***

### DirectionsManager

Manages route display on the map.

Wraps the core DirectionsManager and adds MapLibre GL rendering:
draws the route line and places origin/destination/waypoint markers.

Use via `sdk.getDirections()` and `sdk.displayRoute()`, or access
directly for advanced use cases.

#### Constructors

##### new DirectionsManager()

```ts
new DirectionsManager(
   mapAdapter, 
   markerFactory, 
   auth, 
   clientId?): DirectionsManager
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `mapAdapter` | `IMapAdapter` |
| `markerFactory` | `IMarkerFactory` |
| `auth` | `AuthParam` |
| `clientId`? | `string` |

###### Returns

[`DirectionsManager`](globals.md#directionsmanager)

###### Defined in

[client/js/src/Directions/DirectionsManager.ts:40](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Directions/DirectionsManager.ts#L40)

#### Methods

##### clearRoute()

```ts
clearRoute(): void
```

###### Returns

`void`

###### Defined in

[client/js/src/Directions/DirectionsManager.ts:112](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Directions/DirectionsManager.ts#L112)

##### displayRoute()

```ts
displayRoute(routeData, options): void
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `routeData` | `RouteData` |
| `options` | `DisplayRouteOptions` & `object` |

###### Returns

`void`

###### Defined in

[client/js/src/Directions/DirectionsManager.ts:71](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Directions/DirectionsManager.ts#L71)

##### getCurrentRoute()

```ts
getCurrentRoute(): null | RouteData
```

###### Returns

`null` \| `RouteData`

###### Defined in

[client/js/src/Directions/DirectionsManager.ts:119](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Directions/DirectionsManager.ts#L119)

##### getDirections()

```ts
getDirections(
   origin, 
   destination, 
options): Promise<RouteData>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `origin` | `LngLat` |
| `destination` | `LngLat` |
| `options` | `DirectionsOptions` |

###### Returns

`Promise`\<`RouteData`\>

###### Defined in

[client/js/src/Directions/DirectionsManager.ts:61](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Directions/DirectionsManager.ts#L61)

##### getRouteSummary()

```ts
getRouteSummary(): null | object
```

###### Returns

`null` \| `object`

###### Defined in

[client/js/src/Directions/DirectionsManager.ts:123](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Directions/DirectionsManager.ts#L123)

##### updateRouteStyle()

```ts
updateRouteStyle(style): void
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `style` | `RouteStyleOptions` |

###### Returns

`void`

###### Defined in

[client/js/src/Directions/DirectionsManager.ts:141](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Directions/DirectionsManager.ts#L141)

***

### FenceManager

Manages geofences (polygons) on the map.

Supports interactive fence drawing, rendering pre-defined fences,
and attaching overlays (HTML labels) at fence centroids.

Access via `sdk.fencing` after calling `sdk.init()`.

#### Constructors

##### new FenceManager()

```ts
new FenceManager(
   mapAdapter, 
   markerFactory, 
   popupFactory, 
   options): FenceManager
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `mapAdapter` | `IMapAdapter` |
| `markerFactory` | `IMarkerFactory` |
| `popupFactory` | `IPopupFactory` |
| `options` | `FenceManagerOptions` |

###### Returns

[`FenceManager`](globals.md#fencemanager)

###### Defined in

[client/js/src/Fencing/FenceManager.ts:61](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L61)

#### Methods

##### addPoint()

```ts
addPoint(point, options?): void
```

Add a point to the current fence.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | `LngLatLike` | Point to add |
| `options`? | `FencePointOptions` & `object` | Optional point options |

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:130](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L130)

##### canCloseFence()

```ts
canCloseFence(): boolean
```

Check if current fence can be closed (has at least 3 points).

###### Returns

`boolean`

True if fence can be closed

###### Defined in

[client/js/src/Fencing/FenceManager.ts:343](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L343)

##### clearAllFences()

```ts
clearAllFences(): void
```

Clear all stored fences.

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:260](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L260)

##### clearCurrentFence()

```ts
clearCurrentFence(): void
```

Clear the current fence being drawn.

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:198](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L198)

##### closeFence()

```ts
closeFence(): null | FenceDefinition
```

Close the current fence.

###### Returns

`null` \| `FenceDefinition`

Fence definition if closed successfully, null otherwise

###### Defined in

[client/js/src/Fencing/FenceManager.ts:182](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L182)

##### getCurrentFencePoints()

```ts
getCurrentFencePoints(): LngLatLike[]
```

Get the current fence points.

###### Returns

`LngLatLike`[]

Array of points or empty array if not drawing

###### Defined in

[client/js/src/Fencing/FenceManager.ts:335](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L335)

##### getCurrentStyle()

```ts
getCurrentStyle(): FenceStyleOptions
```

Get current fence style (if drawing).

###### Returns

`FenceStyleOptions`

Current fence style or default style

###### Defined in

[client/js/src/Fencing/FenceManager.ts:303](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L303)

##### getDefaultStyle()

```ts
getDefaultStyle(): FenceStyleOptions
```

Get current default style.

###### Returns

`FenceStyleOptions`

Copy of default style

###### Defined in

[client/js/src/Fencing/FenceManager.ts:295](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L295)

##### getFence()

```ts
getFence(fenceId): undefined | FenceDefinition
```

Get a fence by ID.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fenceId` | `string` \| `number` | Fence ID |

###### Returns

`undefined` \| `FenceDefinition`

Fence definition or undefined if not found

###### Defined in

[client/js/src/Fencing/FenceManager.ts:220](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L220)

##### getFenceByName()

```ts
getFenceByName(name): undefined | FenceDefinition
```

Get a fence by name.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Fence name |

###### Returns

`undefined` \| `FenceDefinition`

Fence definition or undefined if not found

###### Defined in

[client/js/src/Fencing/FenceManager.ts:229](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L229)

##### getFenceCentroid()

```ts
getFenceCentroid(fence): LngLat
```

Get fence centroid.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fence` | `string` \| `number` \| `FenceDefinition` | Fence definition or fence ID |

###### Returns

`LngLat`

Centroid coordinates

###### Defined in

[client/js/src/Fencing/FenceManager.ts:352](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L352)

##### getFences()

```ts
getFences(): FenceDefinition[]
```

Get all stored fences.

###### Returns

`FenceDefinition`[]

Array of fence definitions

###### Defined in

[client/js/src/Fencing/FenceManager.ts:211](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L211)

##### getProximityThreshold()

```ts
getProximityThreshold(): number
```

Get proximity threshold.

###### Returns

`number`

Threshold in meters

###### Defined in

[client/js/src/Fencing/FenceManager.ts:319](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L319)

##### isDrawingFence()

```ts
isDrawingFence(): boolean
```

Check if currently drawing a fence.

###### Returns

`boolean`

True if drawing is active

###### Defined in

[client/js/src/Fencing/FenceManager.ts:327](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L327)

##### off()

```ts
off(event, callback): void
```

Remove event listener for fence events.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `"fenceCompleted"` | Event name |
| `callback` | (`event`) => `void` | Callback function to remove |

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:387](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L387)

##### on()

```ts
on(event, callback): void
```

Add event listener for fence events.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `"fenceCompleted"` | Event name |
| `callback` | (`event`) => `void` | Callback function |

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:378](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L378)

##### removeFence()

```ts
removeFence(fenceId): boolean
```

Remove a fence by ID.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fenceId` | `string` \| `number` | Fence ID |

###### Returns

`boolean`

True if fence was removed

###### Defined in

[client/js/src/Fencing/FenceManager.ts:238](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L238)

##### removeFenceByName()

```ts
removeFenceByName(name): boolean
```

Remove a fence by name.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Fence name |

###### Returns

`boolean`

True if fence was removed

###### Defined in

[client/js/src/Fencing/FenceManager.ts:251](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L251)

##### renderFences()

```ts
renderFences(fences, options?): void
```

Render multiple fences from an array of definitions.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fences` | `FenceDefinition`[] | Array of fence definitions |
| `options`? | `object` | Render options |
| `options.clearExisting`? | `boolean` | - |
| `options.persistent`? | `boolean` | - |

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:361](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L361)

##### setDefaultStyle()

```ts
setDefaultStyle(style): void
```

Set default fence style for future fences.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `style` | `FenceStyleOptions` | Style options |

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:287](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L287)

##### setProximityThreshold()

```ts
setProximityThreshold(meters): void
```

Set proximity threshold for auto-closing fences.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `meters` | `number` | Threshold distance in meters |

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:311](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L311)

##### startDrawing()

```ts
startDrawing(style?): void
```

Start drawing a new fence.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `style`? | `FenceStyleOptions` | Optional style options for this fence |

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:104](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L104)

##### stopDrawing()

```ts
stopDrawing(): void
```

Stop drawing the current fence.

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:118](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L118)

##### updateCurrentFenceStyle()

```ts
updateCurrentFenceStyle(style): void
```

Update the style for the current fence being drawn.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `style` | `Partial`\<`FenceStyleOptions`\> | Style options to update |

###### Returns

`void`

###### Defined in

[client/js/src/Fencing/FenceManager.ts:274](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Fencing/FenceManager.ts#L274)

***

### GebetaMaps

Main entry point for the Gebeta Maps JavaScript SDK.

#### Example

```ts
// Service account auth (recommended)
const sdk = new GebetaMaps({
  auth: { accessToken: '...', refreshToken: '...' }
});
const map = sdk.init({ container: '#map', center: [38.74, 9.02], zoom: 12 });

// Legacy API key (deprecated)
const sdk = new GebetaMaps({ apiKey: 'your-api-key' });
```

#### Constructors

##### new GebetaMaps()

```ts
new GebetaMaps(options): GebetaMaps
```

Creates a new GebetaMaps instance.

Provide either `apiKey` (deprecated) or `auth` (service account) — not both.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `GebetaMapsConstructorOptions` & `object` | Constructor options |

###### Returns

[`GebetaMaps`](globals.md#gebetamaps)

###### Throws

If neither `apiKey` nor `auth` is provided, or if both are provided.

###### Defined in

[client/js/src/GebetaMaps.ts:68](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L68)

#### Accessors

##### clustering

###### Get Signature

```ts
get clustering(): null | ClusteringManager
```

Access clustering functionality for grouping nearby markers.
Returns `null` if clustering was not enabled in the constructor options.

###### Returns

`null` \| [`ClusteringManager`](globals.md#clusteringmanager)

###### Defined in

[client/js/src/GebetaMaps.ts:331](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L331)

##### fencing

###### Get Signature

```ts
get fencing(): FenceManager
```

Access geofencing functionality for drawing and managing polygon fences.

###### Throws

If called before `init()` completes map style loading.

###### Returns

[`FenceManager`](globals.md#fencemanager)

###### Defined in

[client/js/src/GebetaMaps.ts:339](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L339)

##### geocodingManager

###### Get Signature

```ts
get geocodingManager(): GeocodingManager
```

Access geocoding functionality (forward and reverse).

###### Throws

If called before `init()` completes map style loading.

###### Returns

[`GeocodingManager`](globals.md#geocodingmanager-1)

###### Defined in

[client/js/src/GebetaMaps.ts:45](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L45)

##### navigation

###### Get Signature

```ts
get navigation(): NavigationManager
```

Access turn-by-turn navigation with real-time tracking.

###### Throws

If called before `init()` completes map style loading.

###### Returns

[`NavigationManager`](globals.md#navigationmanager)

###### Defined in

[client/js/src/GebetaMaps.ts:359](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L359)

#### Methods

##### addNavigationControls()

```ts
addNavigationControls(position): void
```

Add zoom +/- navigation controls to the map.
Alternatively, pass `navigationControl: true` in `init()` options.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `position` | `string` | `API.Common.Enums.CornerPosition.TOP_RIGHT` | Corner position (default: 'top-right') |

###### Returns

`void`

###### Defined in

[client/js/src/GebetaMaps.ts:231](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L231)

##### clearRoute()

```ts
clearRoute(): void
```

Remove the currently displayed route line and markers from the map.

###### Returns

`void`

###### Defined in

[client/js/src/GebetaMaps.ts:295](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L295)

##### displayRoute()

```ts
displayRoute(routeData, options?): void
```

Render a route on the map as a colored line with optional origin/destination markers.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeData` | `RouteData` | Route returned from `getDirections()` |
| `options`? | `DisplayRouteOptions` & `object` | Display options (showMarkers, originIcon, destinationIcon, routeStyle) |

###### Returns

`void`

###### Defined in

[client/js/src/GebetaMaps.ts:284](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L284)

##### getCurrentRoute()

```ts
getCurrentRoute(): null | RouteData
```

Returns the currently active route, or `null` if no route is loaded.

###### Returns

`null` \| `RouteData`

###### Defined in

[client/js/src/GebetaMaps.ts:301](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L301)

##### getDirections()

```ts
getDirections(
   origin, 
   destination, 
options?): Promise<RouteData>
```

Calculate a route between two points.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `origin` | `LngLat` | Starting point `{ lng, lat }` |
| `destination` | `LngLat` | Ending point `{ lng, lat }` |
| `options`? | `DirectionsOptions` | Optional waypoints and average speed |

###### Returns

`Promise`\<`RouteData`\>

RouteData with geometry, instructions, and summary

###### Throws

If called before `init()` completes map style loading.

###### Throws

If origin or destination coordinates are missing.

###### Throws

If the directions API request fails.

###### Example

```ts
const route = await sdk.getDirections(
  { lng: 38.74, lat: 9.02 },
  { lng: 38.78, lat: 9.05 }
);
sdk.displayRoute(route);
```

###### Defined in

[client/js/src/GebetaMaps.ts:264](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L264)

##### getMap()

```ts
getMap(): null | Map
```

Returns the underlying MapLibre GL `Map` instance, or `null` before `init()`.

###### Returns

`null` \| `Map`

###### Defined in

[client/js/src/GebetaMaps.ts:351](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L351)

##### getPlatform()

```ts
getPlatform(): PlatformContext
```

Returns the platform context (map adapter, marker/popup factories).
Useful for advanced use cases that need direct access to the underlying adapters.

###### Returns

`PlatformContext`

###### Throws

If called before `init()`.

###### Defined in

[client/js/src/GebetaMaps.ts:215](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L215)

##### getRouteSummary()

```ts
getRouteSummary(): null | object
```

Returns distance, duration, origin, destination, and waypoints for the current route.

###### Returns

`null` \| `object`

###### Defined in

[client/js/src/GebetaMaps.ts:307](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L307)

##### init()

```ts
init(options): Map
```

Initialize the map and mount it to a DOM element.

All SDK managers (geocoding, directions, fencing, clustering, navigation) are
created after the map style finishes loading. Do not call manager methods until
the map `style.load` event fires.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `GebetaMapsInitOptions` | Initialization options |

###### Returns

`Map`

The underlying MapLibre GL `Map` instance

###### Defined in

[client/js/src/GebetaMaps.ts:155](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L155)

##### updateRouteStyle()

```ts
updateRouteStyle(style): void
```

Update the visual style of the displayed route line.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `style` | `RouteStyleOptions` | Style properties (`line-color`, `line-width`, `line-opacity`, `line-dasharray`) |

###### Returns

`void`

###### Defined in

[client/js/src/GebetaMaps.ts:322](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/GebetaMaps.ts#L322)

***

### GeocodingManager

GeocodingManager handles forward and reverse geocoding operations.
Platform-agnostic: uses fetch API which is available in all JS environments.

#### Constructors

##### new GeocodingManager()

```ts
new GeocodingManager(auth, clientId?): GeocodingManager
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `auth` | `AuthParam` |
| `clientId`? | `string` |

###### Returns

[`GeocodingManager`](globals.md#geocodingmanager-1)

###### Defined in

core/dist/Geocoding/GeocodingManager.d.ts:11

#### Methods

##### geocode()

```ts
geocode(name): Promise<GeocodeResult[]>
```

Forward geocoding: search by name/address.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Place name or address to search for |

###### Returns

`Promise`\<`GeocodeResult`[]\>

Promise resolving to array of geocoding results

###### Defined in

core/dist/Geocoding/GeocodingManager.d.ts:17

##### reverseGeocode()

```ts
reverseGeocode(latlng): Promise<GeocodeResult[]>
```

Reverse geocoding: search by coordinates.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `latlng` | `LngLat` |

###### Returns

`Promise`\<`GeocodeResult`[]\>

Promise resolving to array of geocoding results

###### Defined in

core/dist/Geocoding/GeocodingManager.d.ts:23

***

### NavigationManager

Browser navigation manager — wraps the core NavigationManager and adds
map rendering: a live location marker and a camera that follows the driver.

Access via `sdk.navigation` after calling `sdk.init()`.

#### Example

```ts
const route = await sdk.getDirections(origin, destination);
sdk.displayRoute(route);

sdk.navigation.on('progress', e => console.log('remaining:', e.remainingDistance));
sdk.navigation.on('arrive', () => console.log('Arrived!'));

sdk.navigation.start(route, { userId: 'user-123' }, new BrowserLocationProvider());
```

#### Constructors

##### new NavigationManager()

```ts
new NavigationManager(
   auth, 
   mapAdapter, 
   markerFactory, 
   options, 
   clientId?): NavigationManager
```

Creates a new NavigationManager instance.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `auth` | `AuthParam` | API key or service key authentication input |
| `mapAdapter` | `IMapAdapter` | Map adapter for camera control |
| `markerFactory` | `IMarkerFactory` | Marker factory for location marker |
| `options` | `NavigationManagerOptions` | Configuration options for navigation behavior |
| `clientId`? | `string` | - |

###### Returns

[`NavigationManager`](globals.md#navigationmanager)

###### Throws

If apiKey, mapAdapter, or markerFactory is missing

###### Defined in

[client/js/src/Navigation/NavigationManager.ts:48](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Navigation/NavigationManager.ts#L48)

#### Methods

##### getCurrentRoute()

```ts
getCurrentRoute(): null | RouteData
```

Gets the current route being navigated.

###### Returns

`null` \| `RouteData`

Current route data or null if not navigating

###### Defined in

[client/js/src/Navigation/NavigationManager.ts:247](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Navigation/NavigationManager.ts#L247)

##### getCurrentStepIndex()

```ts
getCurrentStepIndex(): number
```

Gets the current step index in the route instructions.

###### Returns

`number`

Current step index

###### Defined in

[client/js/src/Navigation/NavigationManager.ts:255](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Navigation/NavigationManager.ts#L255)

##### isNavigating()

```ts
isNavigating(): boolean
```

Checks if navigation is currently active.

###### Returns

`boolean`

True if navigating, false otherwise

###### Defined in

[client/js/src/Navigation/NavigationManager.ts:263](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Navigation/NavigationManager.ts#L263)

##### off()

```ts
off<K>(event, callback): void
```

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `NavigationEventMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `callback` | \| (`event`) => `void` \| (`error`) => `void` \| (`event`) => `void` \| (`event`) => `void` \| (`event`) => `void` \| (`event`) => `void` \| (`event`) => `void` |

###### Returns

`void`

###### Defined in

[client/js/src/Navigation/NavigationManager.ts:274](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Navigation/NavigationManager.ts#L274)

##### on()

```ts
on<K>(event, callback): void
```

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `NavigationEventMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `callback` | \| (`event`) => `void` \| (`error`) => `void` \| (`event`) => `void` \| (`event`) => `void` \| (`event`) => `void` \| (`event`) => `void` \| (`event`) => `void` |

###### Returns

`void`

###### Defined in

[client/js/src/Navigation/NavigationManager.ts:267](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Navigation/NavigationManager.ts#L267)

##### start()

```ts
start(
   route, 
   startOptions, 
   locationProvider): void
```

Starts navigation along the provided route.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `route` | `RouteData` | Route data containing geometry and instructions |
| `startOptions` | `NavigationStartOptions` | Options for starting navigation (userId, role, precision) |
| `locationProvider` | `ILocationProvider` | Provider that supplies location data |

###### Returns

`void`

###### Defined in

[client/js/src/Navigation/NavigationManager.ts:78](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Navigation/NavigationManager.ts#L78)

##### stop()

```ts
stop(): void
```

Stops navigation and removes location marker.

###### Returns

`void`

###### Defined in

[client/js/src/Navigation/NavigationManager.ts:115](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/client/js/src/Navigation/NavigationManager.ts#L115)
