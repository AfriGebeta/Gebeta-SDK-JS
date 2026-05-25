[Documentation](../../../../../../index.md) / [@gebeta/api](../../../../index.md) / [API](../../index.md) / Auth

# Auth

## Index

### Namespaces

| Namespace | Description |
| ------ | ------ |
| [Types](namespaces/Types.md) | - |

## Variables

### Constants

```ts
const Constants: object = AuthModule.Auth.Constants;
```

#### Type declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `AUTH_URL` | `"https://mapapi.gebeta.app/api/v1/external/auth"` | AUTH\_URLS.auth | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/auth.ts:15](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/namespaces/auth.ts#L15) |
| `REFRESH_URL` | `"https://mapapi.gebeta.app/api/v1/external/auth/refresh"` | AUTH\_URLS.refresh | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/auth.ts:16](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/namespaces/auth.ts#L16) |
| `TOKEN_EXPIRY_MS` | `number` | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/auth.ts:17](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/namespaces/auth.ts#L17) |
| `TOKEN_REFRESH_INTERVAL_MS` | `number` | - | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/auth.ts:18](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/namespaces/auth.ts#L18) |

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:24](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/namespaces/index.ts#L24)

***

### Enums

```ts
const Enums: object = AuthModule.Auth.Enums;
```

#### Type declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `Events` | `object` | AuthEvents | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/auth.ts:11](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/namespaces/auth.ts#L11) |
| `Events.tokenRefreshed` | `"token:refreshed"` | 'token:refreshed' | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/constants/index.ts:39](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/constants/index.ts#L39) |
| `Events.tokenRefreshFailed` | `"token:refresh_failed"` | 'token:refresh\_failed' | [\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/constants/index.ts:40](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/constants/index.ts#L40) |

#### Defined in

[\_/work/gebeta/Gebeta-SDK-JS/packages/api/src/namespaces/index.ts:23](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/9dbfe61dc9c398296be77dd50f9bf333f8a3e94d/packages/api/src/namespaces/index.ts#L23)
