[Documentation](../../../../../../../../../index.md) / [@gebeta/api](../../../../../../../index.md) / [API](../../../../../index.md) / [Errors](../../../index.md) / [Factories](../index.md) / Business

# Business

## Functions

### createGeocodingError()

```ts
function createGeocodingError(
   code, 
   message, 
   context?): GeocodingError
```

Creates a geocoding error given a code, message and a context.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](../../../../../../../globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`GeocodingError`](../../../../../../../globals.md#geocodingerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:218](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/5a1074be69efa161565e6902958e207ebaf1b057/packages/api/src/namespaces/index.ts#L218)

***

### createNavigationError()

```ts
function createNavigationError(
   code, 
   message, 
   context?): NavigationError
```

Creates a navigation error given a code, message and a context.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](../../../../../../../globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`NavigationError`](../../../../../../../globals.md#navigationerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:221](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/5a1074be69efa161565e6902958e207ebaf1b057/packages/api/src/namespaces/index.ts#L221)

***

### createRoutingError()

```ts
function createRoutingError(
   code, 
   message, 
   context?): RoutingError
```

Creates a routing error given a code, message and a context.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](../../../../../../../globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`RoutingError`](../../../../../../../globals.md#routingerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:220](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/5a1074be69efa161565e6902958e207ebaf1b057/packages/api/src/namespaces/index.ts#L220)

***

### createTrackingError()

```ts
function createTrackingError(
   code, 
   message, 
   context?): TrackingError
```

Creates a tracking error given a code, message and a context.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](../../../../../../../globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`TrackingError`](../../../../../../../globals.md#trackingerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:223](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/5a1074be69efa161565e6902958e207ebaf1b057/packages/api/src/namespaces/index.ts#L223)
