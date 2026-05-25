[Documentation](../../../../../../../../../index.md) / [@gebeta/api](../../../../../../../index.md) / [API](../../../../../index.md) / [Errors](../../../index.md) / [Factories](../index.md) / Api

# Api

## Functions

### createApiError()

```ts
function createApiError(
   statusCode, 
   response, 
   requestId?): ApiError
```

Creates an API error from an HTTP response.
Uses getErrorCodeForStatusCode (from api.ts) as the single source of truth
for status code → error code mapping, then instantiates the appropriate error class.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |
| `response` | `string` \| [`ApiErrorResponse`](../../../../../../../globals.md#apierrorresponse) |
| `requestId`? | `string` |

#### Returns

[`ApiError`](../../../../../../../globals.md#apierror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:215](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/namespaces/index.ts#L215)
