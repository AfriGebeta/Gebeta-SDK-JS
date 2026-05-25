# GebetaAuth

Server-side authentication for Node.js backends.

## Import

```ts
import { GebetaAuth } from '@gebeta/node';
```

## Constructor

```ts
new GebetaAuth(serverToken: string)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `serverToken` | `string` | Your Gebeta server token (keep secret, backend only) |

## Methods

### `getTokens()`

Exchanges the server token for a short-lived access/refresh token pair.

```ts
getTokens(): Promise<{ accessToken: string; refreshToken: string }>
```

## Example

```ts
const auth = new GebetaAuth(process.env.GEBETA_SERVER_TOKEN);
const { accessToken, refreshToken } = await auth.getTokens();
```
