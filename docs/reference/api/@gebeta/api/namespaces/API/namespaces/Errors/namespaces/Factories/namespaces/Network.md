[Documentation](../../../../../../../../../index.md) / [@gebeta/api](../../../../../../../index.md) / [API](../../../../../index.md) / [Errors](../../../index.md) / [Factories](../index.md) / Network

# Network

## Functions

### createNetworkError()

```ts
function createNetworkError(originalError, context?): NetworkError
```

Creates a network error from a fetch failure given an original error and a context.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `originalError` | `Error` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`NetworkError`](../../../../../../../globals.md#networkerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:208](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L208)

***

### createNetworkOfflineError()

```ts
function createNetworkOfflineError(originalError?): NetworkOfflineError
```

Creates a network offline error.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `originalError`? | `Error` |

#### Returns

[`NetworkOfflineError`](../../../../../../../globals.md#networkofflineerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:211](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L211)

***

### createNetworkTimeoutError()

```ts
function createNetworkTimeoutError(originalError?, timeoutMs?): NetworkTimeoutError
```

Creates a network timeout error given a timeout in milliseconds and an original error.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `originalError`? | `Error` |
| `timeoutMs`? | `number` |

#### Returns

[`NetworkTimeoutError`](../../../../../../../globals.md#networktimeouterror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:209](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L209)
