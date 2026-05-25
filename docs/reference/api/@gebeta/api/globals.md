[Documentation](../../index.md) / @gebeta/api

# @gebeta/api

## Enumerations

### ErrorCode

Error codes for consistent error identification across all SDKs.
Organized by category with numeric suffixes for easy filtering.

#### Enumeration Members

| Enumeration Member | Value | Defined in |
| ------ | ------ | ------ |
| `API_BAD_REQUEST` | `"API_3001"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:33](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L33) |
| `API_FORBIDDEN` | `"API_3003"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:35](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L35) |
| `API_NOT_FOUND` | `"API_3004"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L36) |
| `API_RATE_LIMIT` | `"API_3005"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:37](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L37) |
| `API_SERVER_ERROR` | `"API_3006"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:38](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L38) |
| `API_UNAUTHORIZED` | `"API_3002"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:34](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L34) |
| `API_UNKNOWN_ERROR` | `"API_3007"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:39](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L39) |
| `GEOCODING_INVALID_COORDINATES` | `"GEOCODING_4002"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:43](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L43) |
| `GEOCODING_NOT_FOUND` | `"GEOCODING_4001"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:42](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L42) |
| `GEOCODING_REQUEST_FAILED` | `"GEOCODING_4003"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:44](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L44) |
| `NAVIGATION_NOT_STARTED` | `"NAVIGATION_6001"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:53](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L53) |
| `NAVIGATION_OFF_ROUTE` | `"NAVIGATION_6002"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:54](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L54) |
| `NAVIGATION_REQUEST_FAILED` | `"NAVIGATION_6003"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:55](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L55) |
| `NETWORK_FAILED` | `"NETWORK_2001"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:27](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L27) |
| `NETWORK_OFFLINE` | `"NETWORK_2003"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:29](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L29) |
| `NETWORK_REQUEST_FAILED` | `"NETWORK_2004"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L30) |
| `NETWORK_TIMEOUT` | `"NETWORK_2002"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:28](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L28) |
| `PLATFORM_GEOLOCATION_DENIED` | `"PLATFORM_7001"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:58](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L58) |
| `PLATFORM_GEOLOCATION_TIMEOUT` | `"PLATFORM_7003"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:60](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L60) |
| `PLATFORM_GEOLOCATION_UNAVAILABLE` | `"PLATFORM_7002"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:59](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L59) |
| `PLATFORM_NOT_INITIALIZED` | `"PLATFORM_7004"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:61](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L61) |
| `ROUTING_INVALID_POLYLINE` | `"ROUTING_5004"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:50](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L50) |
| `ROUTING_INVALID_WAYPOINTS` | `"ROUTING_5002"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:48](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L48) |
| `ROUTING_NO_ROUTE` | `"ROUTING_5001"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:47](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L47) |
| `ROUTING_REQUEST_FAILED` | `"ROUTING_5003"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:49](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L49) |
| `VALIDATION_INVALID_FORMAT` | `"VALIDATION_1002"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:22](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L22) |
| `VALIDATION_INVALID_TYPE` | `"VALIDATION_1004"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:24](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L24) |
| `VALIDATION_OUT_OF_RANGE` | `"VALIDATION_1003"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:23](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L23) |
| `VALIDATION_REQUIRED_FIELD` | `"VALIDATION_1001"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:21](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L21) |

***

### ErrorDomain

Error domain/feature area where an error occurred.

#### Enumeration Members

| Enumeration Member | Value | Defined in |
| ------ | ------ | ------ |
| `API` | `"api"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:7](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L7) |
| `GEOCODING` | `"geocoding"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:8](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L8) |
| `NAVIGATION` | `"navigation"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L10) |
| `NETWORK` | `"network"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:6](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L6) |
| `PLATFORM` | `"platform"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L12) |
| `ROUTING` | `"routing"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L9) |
| `TRACKING` | `"tracking"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L11) |
| `VALIDATION` | `"validation"` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/codes.ts:5](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/codes.ts#L5) |

## Classes

### ApiError

Base error class for API-related errors.

#### Extends

- [`GebetaError`](globals.md#gebetaerror)

#### Extended by

- [`BadRequestError`](globals.md#badrequesterror)
- [`UnauthorizedError`](globals.md#unauthorizederror)
- [`ForbiddenError`](globals.md#forbiddenerror)
- [`NotFoundError`](globals.md#notfounderror)
- [`RateLimitError`](globals.md#ratelimiterror)
- [`ServerError`](globals.md#servererror)

#### Constructors

##### new ApiError()

```ts
new ApiError(
   message, 
   statusCode, 
   code, 
   requestId?, 
   context?): ApiError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `statusCode` | `number` |
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `requestId`? | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`ApiError`](globals.md#apierror)

###### Overrides

[`GebetaError`](globals.md#gebetaerror).[`constructor`](globals.md#constructors-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L11)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`GebetaError`](globals.md#gebetaerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`GebetaError`](globals.md#gebetaerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`GebetaError`](globals.md#gebetaerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`GebetaError`](globals.md#gebetaerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`GebetaError`](globals.md#gebetaerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `statusCode` | `readonly` | `number` | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L9) |
| `timestamp` | `readonly` | `number` | [`GebetaError`](globals.md#gebetaerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`GebetaError`](globals.md#gebetaerror).[`toJSON`](globals.md#tojson-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

##### fromResponse()

```ts
static fromResponse(response, statusCode): ApiError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ApiErrorResponse`](globals.md#apierrorresponse) |
| `statusCode` | `number` |

###### Returns

[`ApiError`](globals.md#apierror)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L30)

***

### BadRequestError

Error thrown for 400 Bad Request responses.

#### Extends

- [`ApiError`](globals.md#apierror)

#### Constructors

##### new BadRequestError()

```ts
new BadRequestError(
   message, 
   requestId?, 
   context?): BadRequestError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `requestId`? | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`BadRequestError`](globals.md#badrequesterror)

###### Overrides

[`ApiError`](globals.md#apierror).[`constructor`](globals.md#constructors)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:45](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L45)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`ApiError`](globals.md#apierror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`ApiError`](globals.md#apierror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`ApiError`](globals.md#apierror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`ApiError`](globals.md#apierror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`ApiError`](globals.md#apierror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`ApiError`](globals.md#apierror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`ApiError`](globals.md#apierror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`ApiError`](globals.md#apierror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `statusCode` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`statusCode` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L9) |
| `timestamp` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`ApiError`](globals.md#apierror).[`toJSON`](globals.md#tojson)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

##### fromResponse()

```ts
static fromResponse(response, statusCode): ApiError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ApiErrorResponse`](globals.md#apierrorresponse) |
| `statusCode` | `number` |

###### Returns

[`ApiError`](globals.md#apierror)

###### Inherited from

[`ApiError`](globals.md#apierror).[`fromResponse`](globals.md#fromresponse)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L30)

***

### BusinessLogicError

Base error class for business logic errors.

#### Extends

- [`GebetaError`](globals.md#gebetaerror)

#### Extended by

- [`GeocodingError`](globals.md#geocodingerror)
- [`RoutingError`](globals.md#routingerror)
- [`NavigationError`](globals.md#navigationerror)
- [`TrackingError`](globals.md#trackingerror)

#### Constructors

##### new BusinessLogicError()

```ts
new BusinessLogicError(
   code, 
   message, 
   domain, 
   context?): BusinessLogicError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `domain` | [`ErrorDomain`](globals.md#errordomain) |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`BusinessLogicError`](globals.md#businesslogicerror)

###### Overrides

[`GebetaError`](globals.md#gebetaerror).[`constructor`](globals.md#constructors-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/business.ts:8](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/business.ts#L8)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`GebetaError`](globals.md#gebetaerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`GebetaError`](globals.md#gebetaerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`GebetaError`](globals.md#gebetaerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`GebetaError`](globals.md#gebetaerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`GebetaError`](globals.md#gebetaerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`GebetaError`](globals.md#gebetaerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`GebetaError`](globals.md#gebetaerror).[`toJSON`](globals.md#tojson-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### ForbiddenError

Error thrown for 403 Forbidden responses.

#### Extends

- [`ApiError`](globals.md#apierror)

#### Constructors

##### new ForbiddenError()

```ts
new ForbiddenError(message, requestId?): ForbiddenError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `requestId`? | `string` |

###### Returns

[`ForbiddenError`](globals.md#forbiddenerror)

###### Overrides

[`ApiError`](globals.md#apierror).[`constructor`](globals.md#constructors)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:65](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L65)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`ApiError`](globals.md#apierror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`ApiError`](globals.md#apierror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`ApiError`](globals.md#apierror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`ApiError`](globals.md#apierror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`ApiError`](globals.md#apierror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`ApiError`](globals.md#apierror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`ApiError`](globals.md#apierror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`ApiError`](globals.md#apierror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `statusCode` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`statusCode` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L9) |
| `timestamp` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`ApiError`](globals.md#apierror).[`toJSON`](globals.md#tojson)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

##### fromResponse()

```ts
static fromResponse(response, statusCode): ApiError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ApiErrorResponse`](globals.md#apierrorresponse) |
| `statusCode` | `number` |

###### Returns

[`ApiError`](globals.md#apierror)

###### Inherited from

[`ApiError`](globals.md#apierror).[`fromResponse`](globals.md#fromresponse)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L30)

***

### GebetaError

Base error class for all Gebeta SDK errors.
Provides consistent error structure across all SDKs.

#### Extends

- `Error`

#### Extended by

- [`ValidationError`](globals.md#validationerror)
- [`NetworkError`](globals.md#networkerror)
- [`ApiError`](globals.md#apierror)
- [`BusinessLogicError`](globals.md#businesslogicerror)
- [`PlatformError`](globals.md#platformerror)

#### Constructors

##### new GebetaError()

```ts
new GebetaError(details): GebetaError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details` | [`GebetaErrorDetails`](globals.md#gebetaerrordetails) |

###### Returns

[`GebetaError`](globals.md#gebetaerror)

###### Overrides

`Error.constructor`

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:16](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L16)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | `Error.message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | `Error.name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | `Error.stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### GeocodingError

Error thrown for geocoding-related failures.

#### Extends

- [`BusinessLogicError`](globals.md#businesslogicerror)

#### Constructors

##### new GeocodingError()

```ts
new GeocodingError(
   code, 
   message, 
   context?): GeocodingError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`GeocodingError`](globals.md#geocodingerror)

###### Overrides

[`BusinessLogicError`](globals.md#businesslogicerror).[`constructor`](globals.md#constructors-2)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/business.ts:29](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/business.ts#L29)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`BusinessLogicError`](globals.md#businesslogicerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`BusinessLogicError`](globals.md#businesslogicerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`BusinessLogicError`](globals.md#businesslogicerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`BusinessLogicError`](globals.md#businesslogicerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`BusinessLogicError`](globals.md#businesslogicerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`BusinessLogicError`](globals.md#businesslogicerror).[`toJSON`](globals.md#tojson-2)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### GeolocationDeniedError

Error thrown when geolocation access is denied.

#### Extends

- [`PlatformError`](globals.md#platformerror)

#### Constructors

##### new GeolocationDeniedError()

```ts
new GeolocationDeniedError(originalError?): GeolocationDeniedError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `originalError`? | `Error` |

###### Returns

[`GeolocationDeniedError`](globals.md#geolocationdeniederror)

###### Overrides

[`PlatformError`](globals.md#platformerror).[`constructor`](globals.md#constructors-14)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/platform.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/platform.ts#L30)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`PlatformError`](globals.md#platformerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`PlatformError`](globals.md#platformerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`PlatformError`](globals.md#platformerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`PlatformError`](globals.md#platformerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`PlatformError`](globals.md#platformerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`PlatformError`](globals.md#platformerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`PlatformError`](globals.md#platformerror).[`toJSON`](globals.md#tojson-14)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### GeolocationTimeoutError

Error thrown when geolocation request times out.

#### Extends

- [`PlatformError`](globals.md#platformerror)

#### Constructors

##### new GeolocationTimeoutError()

```ts
new GeolocationTimeoutError(timeoutMs?, originalError?): GeolocationTimeoutError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `timeoutMs`? | `number` |
| `originalError`? | `Error` |

###### Returns

[`GeolocationTimeoutError`](globals.md#geolocationtimeouterror)

###### Overrides

[`PlatformError`](globals.md#platformerror).[`constructor`](globals.md#constructors-14)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/platform.ts:60](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/platform.ts#L60)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`PlatformError`](globals.md#platformerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`PlatformError`](globals.md#platformerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`PlatformError`](globals.md#platformerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`PlatformError`](globals.md#platformerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`PlatformError`](globals.md#platformerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`PlatformError`](globals.md#platformerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`PlatformError`](globals.md#platformerror).[`toJSON`](globals.md#tojson-14)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### GeolocationUnavailableError

Error thrown when geolocation is unavailable.

#### Extends

- [`PlatformError`](globals.md#platformerror)

#### Constructors

##### new GeolocationUnavailableError()

```ts
new GeolocationUnavailableError(originalError?): GeolocationUnavailableError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `originalError`? | `Error` |

###### Returns

[`GeolocationUnavailableError`](globals.md#geolocationunavailableerror)

###### Overrides

[`PlatformError`](globals.md#platformerror).[`constructor`](globals.md#constructors-14)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/platform.ts:45](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/platform.ts#L45)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`PlatformError`](globals.md#platformerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`PlatformError`](globals.md#platformerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`PlatformError`](globals.md#platformerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`PlatformError`](globals.md#platformerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`PlatformError`](globals.md#platformerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`PlatformError`](globals.md#platformerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`PlatformError`](globals.md#platformerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`PlatformError`](globals.md#platformerror).[`toJSON`](globals.md#tojson-14)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### NavigationError

Error thrown for navigation-related failures.

#### Extends

- [`BusinessLogicError`](globals.md#businesslogicerror)

#### Constructors

##### new NavigationError()

```ts
new NavigationError(
   code, 
   message, 
   context?): NavigationError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`NavigationError`](globals.md#navigationerror)

###### Overrides

[`BusinessLogicError`](globals.md#businesslogicerror).[`constructor`](globals.md#constructors-2)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/business.ts:49](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/business.ts#L49)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`BusinessLogicError`](globals.md#businesslogicerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`BusinessLogicError`](globals.md#businesslogicerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`BusinessLogicError`](globals.md#businesslogicerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`BusinessLogicError`](globals.md#businesslogicerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`BusinessLogicError`](globals.md#businesslogicerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`BusinessLogicError`](globals.md#businesslogicerror).[`toJSON`](globals.md#tojson-2)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### NetworkError

Error thrown when network operations fail.

#### Extends

- [`GebetaError`](globals.md#gebetaerror)

#### Extended by

- [`NetworkTimeoutError`](globals.md#networktimeouterror)
- [`NetworkOfflineError`](globals.md#networkofflineerror)

#### Constructors

##### new NetworkError()

```ts
new NetworkError(
   message, 
   code, 
   originalError?, 
   context?): NetworkError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `originalError`? | `Error` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`NetworkError`](globals.md#networkerror)

###### Overrides

[`GebetaError`](globals.md#gebetaerror).[`constructor`](globals.md#constructors-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/network.ts:8](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/network.ts#L8)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`GebetaError`](globals.md#gebetaerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`GebetaError`](globals.md#gebetaerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`GebetaError`](globals.md#gebetaerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`GebetaError`](globals.md#gebetaerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`GebetaError`](globals.md#gebetaerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`GebetaError`](globals.md#gebetaerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`GebetaError`](globals.md#gebetaerror).[`toJSON`](globals.md#tojson-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### NetworkOfflineError

Error thrown when the device is offline.

#### Extends

- [`NetworkError`](globals.md#networkerror)

#### Constructors

##### new NetworkOfflineError()

```ts
new NetworkOfflineError(originalError?): NetworkOfflineError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `originalError`? | `Error` |

###### Returns

[`NetworkOfflineError`](globals.md#networkofflineerror)

###### Overrides

[`NetworkError`](globals.md#networkerror).[`constructor`](globals.md#constructors-10)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/network.ts:45](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/network.ts#L45)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`NetworkError`](globals.md#networkerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`NetworkError`](globals.md#networkerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`NetworkError`](globals.md#networkerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`NetworkError`](globals.md#networkerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`NetworkError`](globals.md#networkerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`NetworkError`](globals.md#networkerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`NetworkError`](globals.md#networkerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`NetworkError`](globals.md#networkerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`NetworkError`](globals.md#networkerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`NetworkError`](globals.md#networkerror).[`toJSON`](globals.md#tojson-10)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### NetworkTimeoutError

Error thrown when a network request times out.

#### Extends

- [`NetworkError`](globals.md#networkerror)

#### Constructors

##### new NetworkTimeoutError()

```ts
new NetworkTimeoutError(timeoutMs?, originalError?): NetworkTimeoutError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `timeoutMs`? | `number` |
| `originalError`? | `Error` |

###### Returns

[`NetworkTimeoutError`](globals.md#networktimeouterror)

###### Overrides

[`NetworkError`](globals.md#networkerror).[`constructor`](globals.md#constructors-10)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/network.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/network.ts#L30)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`NetworkError`](globals.md#networkerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`NetworkError`](globals.md#networkerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`NetworkError`](globals.md#networkerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`NetworkError`](globals.md#networkerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`NetworkError`](globals.md#networkerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`NetworkError`](globals.md#networkerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`NetworkError`](globals.md#networkerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`NetworkError`](globals.md#networkerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`NetworkError`](globals.md#networkerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`NetworkError`](globals.md#networkerror).[`toJSON`](globals.md#tojson-10)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### NotFoundError

Error thrown for 404 Not Found responses.

#### Extends

- [`ApiError`](globals.md#apierror)

#### Constructors

##### new NotFoundError()

```ts
new NotFoundError(message, requestId?): NotFoundError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `requestId`? | `string` |

###### Returns

[`NotFoundError`](globals.md#notfounderror)

###### Overrides

[`ApiError`](globals.md#apierror).[`constructor`](globals.md#constructors)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:75](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L75)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`ApiError`](globals.md#apierror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`ApiError`](globals.md#apierror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`ApiError`](globals.md#apierror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`ApiError`](globals.md#apierror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`ApiError`](globals.md#apierror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`ApiError`](globals.md#apierror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`ApiError`](globals.md#apierror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`ApiError`](globals.md#apierror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `statusCode` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`statusCode` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L9) |
| `timestamp` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`ApiError`](globals.md#apierror).[`toJSON`](globals.md#tojson)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

##### fromResponse()

```ts
static fromResponse(response, statusCode): ApiError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ApiErrorResponse`](globals.md#apierrorresponse) |
| `statusCode` | `number` |

###### Returns

[`ApiError`](globals.md#apierror)

###### Inherited from

[`ApiError`](globals.md#apierror).[`fromResponse`](globals.md#fromresponse)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L30)

***

### PlatformError

Error thrown for platform-specific failures (e.g., geolocation API).

#### Extends

- [`GebetaError`](globals.md#gebetaerror)

#### Extended by

- [`GeolocationDeniedError`](globals.md#geolocationdeniederror)
- [`GeolocationUnavailableError`](globals.md#geolocationunavailableerror)
- [`GeolocationTimeoutError`](globals.md#geolocationtimeouterror)

#### Constructors

##### new PlatformError()

```ts
new PlatformError(
   code, 
   message, 
   context?, 
   originalError?): PlatformError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |
| `originalError`? | `Error` |

###### Returns

[`PlatformError`](globals.md#platformerror)

###### Overrides

[`GebetaError`](globals.md#gebetaerror).[`constructor`](globals.md#constructors-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/platform.ts:8](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/platform.ts#L8)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`GebetaError`](globals.md#gebetaerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`GebetaError`](globals.md#gebetaerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`GebetaError`](globals.md#gebetaerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`GebetaError`](globals.md#gebetaerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`GebetaError`](globals.md#gebetaerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`GebetaError`](globals.md#gebetaerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`GebetaError`](globals.md#gebetaerror).[`toJSON`](globals.md#tojson-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### RateLimitError

Error thrown for 429 Rate Limit responses.

#### Extends

- [`ApiError`](globals.md#apierror)

#### Constructors

##### new RateLimitError()

```ts
new RateLimitError(
   message, 
   requestId?, 
   retryAfter?): RateLimitError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `requestId`? | `string` |
| `retryAfter`? | `number` |

###### Returns

[`RateLimitError`](globals.md#ratelimiterror)

###### Overrides

[`ApiError`](globals.md#apierror).[`constructor`](globals.md#constructors)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:85](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L85)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`ApiError`](globals.md#apierror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`ApiError`](globals.md#apierror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`ApiError`](globals.md#apierror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`ApiError`](globals.md#apierror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`ApiError`](globals.md#apierror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`ApiError`](globals.md#apierror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`ApiError`](globals.md#apierror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`ApiError`](globals.md#apierror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `statusCode` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`statusCode` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L9) |
| `timestamp` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`ApiError`](globals.md#apierror).[`toJSON`](globals.md#tojson)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

##### fromResponse()

```ts
static fromResponse(response, statusCode): ApiError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ApiErrorResponse`](globals.md#apierrorresponse) |
| `statusCode` | `number` |

###### Returns

[`ApiError`](globals.md#apierror)

###### Inherited from

[`ApiError`](globals.md#apierror).[`fromResponse`](globals.md#fromresponse)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L30)

***

### RoutingError

Error thrown for routing-related failures.

#### Extends

- [`BusinessLogicError`](globals.md#businesslogicerror)

#### Constructors

##### new RoutingError()

```ts
new RoutingError(
   code, 
   message, 
   context?): RoutingError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`RoutingError`](globals.md#routingerror)

###### Overrides

[`BusinessLogicError`](globals.md#businesslogicerror).[`constructor`](globals.md#constructors-2)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/business.ts:39](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/business.ts#L39)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`BusinessLogicError`](globals.md#businesslogicerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`BusinessLogicError`](globals.md#businesslogicerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`BusinessLogicError`](globals.md#businesslogicerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`BusinessLogicError`](globals.md#businesslogicerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`BusinessLogicError`](globals.md#businesslogicerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`BusinessLogicError`](globals.md#businesslogicerror).[`toJSON`](globals.md#tojson-2)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### ServerError

Error thrown for 5xx Server Error responses.

#### Extends

- [`ApiError`](globals.md#apierror)

#### Constructors

##### new ServerError()

```ts
new ServerError(
   message, 
   statusCode, 
   requestId?): ServerError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `statusCode` | `number` |
| `requestId`? | `string` |

###### Returns

[`ServerError`](globals.md#servererror)

###### Overrides

[`ApiError`](globals.md#apierror).[`constructor`](globals.md#constructors)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:101](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L101)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`ApiError`](globals.md#apierror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`ApiError`](globals.md#apierror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`ApiError`](globals.md#apierror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`ApiError`](globals.md#apierror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`ApiError`](globals.md#apierror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`ApiError`](globals.md#apierror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`ApiError`](globals.md#apierror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`ApiError`](globals.md#apierror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `statusCode` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`statusCode` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L9) |
| `timestamp` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`ApiError`](globals.md#apierror).[`toJSON`](globals.md#tojson)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

##### fromResponse()

```ts
static fromResponse(response, statusCode): ApiError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ApiErrorResponse`](globals.md#apierrorresponse) |
| `statusCode` | `number` |

###### Returns

[`ApiError`](globals.md#apierror)

###### Inherited from

[`ApiError`](globals.md#apierror).[`fromResponse`](globals.md#fromresponse)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L30)

***

### TrackingError

Error thrown for tracking-related failures.

#### Extends

- [`BusinessLogicError`](globals.md#businesslogicerror)

#### Constructors

##### new TrackingError()

```ts
new TrackingError(
   code, 
   message, 
   context?): TrackingError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`TrackingError`](globals.md#trackingerror)

###### Overrides

[`BusinessLogicError`](globals.md#businesslogicerror).[`constructor`](globals.md#constructors-2)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/business.ts:59](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/business.ts#L59)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`BusinessLogicError`](globals.md#businesslogicerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`BusinessLogicError`](globals.md#businesslogicerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`BusinessLogicError`](globals.md#businesslogicerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`BusinessLogicError`](globals.md#businesslogicerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`BusinessLogicError`](globals.md#businesslogicerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`BusinessLogicError`](globals.md#businesslogicerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`BusinessLogicError`](globals.md#businesslogicerror).[`toJSON`](globals.md#tojson-2)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

***

### UnauthorizedError

Error thrown for 401 Unauthorized responses.

#### Extends

- [`ApiError`](globals.md#apierror)

#### Constructors

##### new UnauthorizedError()

```ts
new UnauthorizedError(message, requestId?): UnauthorizedError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `requestId`? | `string` |

###### Returns

[`UnauthorizedError`](globals.md#unauthorizederror)

###### Overrides

[`ApiError`](globals.md#apierror).[`constructor`](globals.md#constructors)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:55](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L55)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`ApiError`](globals.md#apierror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`ApiError`](globals.md#apierror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`ApiError`](globals.md#apierror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`ApiError`](globals.md#apierror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`ApiError`](globals.md#apierror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`ApiError`](globals.md#apierror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`ApiError`](globals.md#apierror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`ApiError`](globals.md#apierror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `statusCode` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`statusCode` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L9) |
| `timestamp` | `readonly` | `number` | [`ApiError`](globals.md#apierror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`ApiError`](globals.md#apierror).[`toJSON`](globals.md#tojson)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

##### fromResponse()

```ts
static fromResponse(response, statusCode): ApiError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ApiErrorResponse`](globals.md#apierrorresponse) |
| `statusCode` | `number` |

###### Returns

[`ApiError`](globals.md#apierror)

###### Inherited from

[`ApiError`](globals.md#apierror).[`fromResponse`](globals.md#fromresponse)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/api.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/api.ts#L30)

***

### ValidationError

Error thrown when input validation fails.

#### Extends

- [`GebetaError`](globals.md#gebetaerror)

#### Constructors

##### new ValidationError()

```ts
new ValidationError(
   message, 
   field?, 
   context?): ValidationError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `field`? | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`ValidationError`](globals.md#validationerror)

###### Overrides

[`GebetaError`](globals.md#gebetaerror).[`constructor`](globals.md#constructors-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/validation.ts:8](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/validation.ts#L8)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `code` | `readonly` | [`ErrorCode`](globals.md#errorcode) | [`GebetaError`](globals.md#gebetaerror).`code` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:9](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L9) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`GebetaError`](globals.md#gebetaerror).`context` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L11) |
| `domain?` | `readonly` | [`ErrorDomain`](globals.md#errordomain) | [`GebetaError`](globals.md#gebetaerror).`domain` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L10) |
| `message` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`message` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `name` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`name` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `originalError?` | `readonly` | `Error` | [`GebetaError`](globals.md#gebetaerror).`originalError` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L12) |
| `requestId?` | `readonly` | `string` | [`GebetaError`](globals.md#gebetaerror).`requestId` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:14](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L14) |
| `stack?` | `public` | `string` | [`GebetaError`](globals.md#gebetaerror).`stack` | .yarn/berry/cache/typescript-patch-6fda4d02cf-10c0.zip/node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `timestamp` | `readonly` | `number` | [`GebetaError`](globals.md#gebetaerror).`timestamp` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:13](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): GebetaErrorDetails
```

Get error details as a plain object.

###### Returns

[`GebetaErrorDetails`](globals.md#gebetaerrordetails)

###### Inherited from

[`GebetaError`](globals.md#gebetaerror).[`toJSON`](globals.md#tojson-4)

###### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/base.ts:36](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/base.ts#L36)

## Interfaces

### ApiErrorResponse

API error response structure from backend.

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `error` | `object` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:38](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L38) |
| `error.code?` | `string` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:39](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L39) |
| `error.details?` | `Record`\<`string`, `unknown`\> | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:41](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L41) |
| `error.message` | `string` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:40](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L40) |
| `error.requestId?` | `string` | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:42](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L42) |

***

### GebetaErrorDetails

Base error details structure for all Gebeta errors.

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `code` | [`ErrorCode`](globals.md#errorcode) | Error code for programmatic error handling | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:8](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L8) |
| `context?` | `Record`\<`string`, `unknown`\> | Additional context data for debugging and error handling. Examples: - Field names that failed validation - Retry information (e.g., \{ retryAfter: 60 \}) - Request parameters that caused the error - Any other relevant debugging information | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:21](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L21) |
| `domain?` | [`ErrorDomain`](globals.md#errordomain) | Domain/feature area where the error occurred | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:12](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L12) |
| `message` | `string` | Human-readable error message | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:10](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L10) |
| `originalError?` | `Error` | Original error that was wrapped (if applicable) | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:23](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L23) |
| `requestId?` | `string` | Request ID from the API response (for API errors). Used to correlate errors with server-side logs for debugging. Typically returned in response headers (x-request-id) or error response body. | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:31](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L31) |
| `timestamp` | `number` | Timestamp when the error occurred | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/types.ts:25](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/types.ts#L25) |

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
| `response` | `string` \| [`ApiErrorResponse`](globals.md#apierrorresponse) |
| `requestId`? | `string` |

#### Returns

[`ApiError`](globals.md#apierror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:64](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L64)

***

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
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`GeocodingError`](globals.md#geocodingerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:116](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L116)

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
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`NavigationError`](globals.md#navigationerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:138](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L138)

***

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

[`NetworkError`](globals.md#networkerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:30](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L30)

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

[`NetworkOfflineError`](globals.md#networkofflineerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:55](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L55)

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

[`NetworkTimeoutError`](globals.md#networktimeouterror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:45](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L45)

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
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`RoutingError`](globals.md#routingerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:127](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L127)

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
| `code` | [`ErrorCode`](globals.md#errorcode) |
| `message` | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

#### Returns

[`TrackingError`](globals.md#trackingerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:149](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L149)

***

### createValidationError()

```ts
function createValidationError(field, reason?): ValidationError
```

Creates a validation error for a required field given a field name and a reason.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `field` | `string` |
| `reason`? | `string` |

#### Returns

[`ValidationError`](globals.md#validationerror)

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/factories.ts:20](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/factories.ts#L20)

***

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

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/utils.ts:79](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/utils.ts#L79)

***

### formatErrorForLogging()

```ts
function formatErrorForLogging(error): string
```

Formats an error for logging purposes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | [`GebetaError`](globals.md#gebetaerror) |

#### Returns

`string`

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/utils.ts:35](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/utils.ts#L35)

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

[`ErrorCode`](globals.md#errorcode) \| `null`

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/utils.ts:15](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/utils.ts#L15)

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

[`ErrorDomain`](globals.md#errordomain) \| `null`

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/utils.ts:25](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/utils.ts#L25)

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

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/utils.ts:8](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/utils.ts#L8)

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

`Promise`\<[`ApiErrorResponse`](globals.md#apierrorresponse)\>

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/errors/utils.ts:56](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/errors/utils.ts#L56)

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [API](namespaces/API/index.md) | - |
| [Clustering](namespaces/Clustering/index.md) | - |
| [Common](namespaces/Common/index.md) | - |
| [Components](namespaces/Components/index.md) | - |
| [Events](namespaces/Events/index.md) | - |
| [Fencing](namespaces/Fencing/index.md) | - |
| [Geocoding](namespaces/Geocoding/index.md) | - |
| [Map](namespaces/Map/index.md) | - |
| [Navigation](namespaces/Navigation/index.md) | - |
| [Overlay](namespaces/Overlay/index.md) | - |
| [Platform](namespaces/Platform/index.md) | - |
| [Routing](namespaces/Routing/index.md) | - |
| [Tracking](namespaces/Tracking/index.md) | - |
