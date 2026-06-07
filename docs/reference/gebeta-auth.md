# GebetaAuth

Server-side authentication for Node.js backends.

## Import

```ts
import { GebetaAuth } from '@gebeta/node';
```

## Constructor

```ts
new GebetaAuth(options: { serverToken: string })
```

| Parameter             | Type     | Description                                          |
| --------------------- | -------- | ---------------------------------------------------- |
| `options.serverToken` | `string` | Your Gebeta server token (keep secret, backend only) |

## Methods

### `authenticate(clientToken)`

Exchanges a client token and server token for a short-lived access/refresh token pair.

```ts
authenticate(clientToken: string): Promise<{ accessToken: string; refreshToken: string }>
```

| Parameter     | Type     | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `clientToken` | `string` | The public client token received from the client app |

## Example

```ts
const auth = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });

app.post('/auth', async (req, res) => {
  const credentials = await auth.authenticate(req.body.clientToken);
  res.json(credentials); // { accessToken, refreshToken }
});
```
