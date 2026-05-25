[Documentation](../../../../../../../index.md) / [@gebeta/api](../../../../../index.md) / [API](../../../index.md) / [Errors](../index.md) / Utils

# Utils

## Functions

### extractRequestId()

```ts
function extractRequestId(response): Promise<string | undefined>
```

Extracts request ID from a Response object (from headers or body).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | `Response` |

#### Returns

`Promise`\<`string` \| `undefined`\>

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:233](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L233)

***

### formatErrorForLogging()

```ts
function formatErrorForLogging(error): string
```

Formats an error for logging purposes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | [`GebetaError`](../../../../../globals.md#gebetaerror) |

#### Returns

`string`

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:231](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L231)

***

### getErrorCode()

```ts
function getErrorCode(error): ErrorCode | null
```

Gets the error code from an error, or null if not a GebetaError.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

#### Returns

[`ErrorCode`](../../../../../globals.md#errorcode) \| `null`

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:229](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L229)

***

### getErrorDomain()

```ts
function getErrorDomain(error): ErrorDomain | null
```

Gets the error domain from an error, or null if not a GebetaError.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

#### Returns

[`ErrorDomain`](../../../../../globals.md#errordomain) \| `null`

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:230](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L230)

***

### isGebetaError()

```ts
function isGebetaError(error): error is GebetaError
```

Type guard to check if an error is a GebetaError.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

#### Returns

`error is GebetaError`

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:228](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L228)

***

### parseApiErrorResponse()

```ts
function parseApiErrorResponse(response): Promise<ApiErrorResponse>
```

Parses an API error response from a Response object.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | `Response` |

#### Returns

`Promise`\<[`ApiErrorResponse`](../../../../../globals.md#apierrorresponse)\>

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:232](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/api/src/namespaces/index.ts#L232)
