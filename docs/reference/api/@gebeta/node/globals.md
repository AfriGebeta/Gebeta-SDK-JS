[Documentation](../../index.md) / @gebeta/node

# @gebeta/node

## Classes

### GebetaAuth

Server-side authentication helper for Gebeta Maps service accounts.

Exchanges a client token and server token for a short-lived access/refresh
token pair. The server token is secret and must never be sent to the browser —
only the resulting `accessToken` is forwarded to the client.

#### Example

```ts
import { GebetaAuth } from '@gebeta/node';

const auth = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });

// Express endpoint
app.post('/auth', async (req, res) => {
  const credentials = await auth.authenticate(req.body.clientToken);
  res.json(credentials); // { accessToken, refreshToken }
});
```

#### Constructors

##### new GebetaAuth()

```ts
new GebetaAuth(options): GebetaAuth
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | - |
| `options.serverToken` | `string` | Secret server token from the Gebeta dashboard. Keep this on your backend; never expose it to clients. |

###### Returns

[`GebetaAuth`](globals.md#gebetaauth)

###### Defined in

[GebetaAuth.ts:32](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/server/node/src/GebetaAuth.ts#L32)

#### Methods

##### authenticate()

```ts
authenticate(clientToken): Promise<AuthCredentials>
```

Exchange a client token for an access/refresh token pair.
Call this from your backend when a client presents its client_token.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clientToken` | `string` | The public client token received from the client app |

###### Returns

`Promise`\<`AuthCredentials`\>

AuthCredentials to send back to the client

###### Throws

If the Gebeta API rejects the token exchange

###### Throws

If the request fails at the network level

###### Defined in

[GebetaAuth.ts:45](https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/099ca5713a860ecef0b5b6f5066fb0a330f44955/packages/server/node/src/GebetaAuth.ts#L45)
