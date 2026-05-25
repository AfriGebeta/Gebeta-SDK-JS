# Node.js Auth

The `@gebeta/node` package provides server-side authentication. Your backend holds the long-lived server token and issues short-lived access tokens to your frontend.

## Setup

```bash
npm install @gebeta/node
```

```ts
import { GebetaAuth } from '@gebeta/node';

const auth = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });
```

## Express endpoint

Your backend receives a `clientToken` from the frontend and exchanges it (together with the secret `serverToken`) for a short-lived access/refresh token pair.

```ts
import express from 'express';
import { GebetaAuth } from '@gebeta/node';

const app = express();
app.use(express.json());

const auth = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });

app.post('/auth', async (req, res) => {
  try {
    const credentials = await auth.authenticate(req.body.clientToken);
    res.json(credentials); // { accessToken, refreshToken }
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate tokens' });
  }
});
```

## Frontend consumption

The frontend sends its `clientToken` to your backend endpoint, then initialises the map with the credentials returned.

```js
async function initMap() {
  const { accessToken, refreshToken } = await fetch('/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientToken: 'YOUR_CLIENT_TOKEN' }),
  }).then(r => r.json());

  const gebetaMap = new GebetaMaps({ auth: { accessToken, refreshToken } });
  gebetaMap.init({ container: 'map' });
}
```

::: warning
Never expose your `GEBETA_SERVER_TOKEN` to the frontend. It should only exist in your backend environment variables.
:::
