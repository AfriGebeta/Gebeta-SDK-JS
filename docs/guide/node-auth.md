# Node.js Auth

The `@gebeta/node` package provides server-side authentication. Your backend holds the long-lived server token and issues short-lived access tokens to your frontend.

## Setup

```bash
npm install @gebeta/node
```

```ts
import { GebetaAuth } from '@gebeta/node';

const auth = new GebetaAuth(process.env.GEBETA_SERVER_TOKEN);
```

## Express endpoint

```ts
import express from 'express';
import { GebetaAuth } from '@gebeta/node';

const app = express();
const auth = new GebetaAuth(process.env.GEBETA_SERVER_TOKEN);

app.post('/auth', async (req, res) => {
  try {
    const tokens = await auth.getTokens();
    res.json(tokens); // { accessToken, refreshToken }
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate tokens' });
  }
});
```

## Frontend consumption

```js
async function initMap() {
  const { accessToken, refreshToken } = await fetch('/auth', {
    method: 'POST'
  }).then(r => r.json());

  const gebetaMap = new GebetaMaps({ auth: { accessToken, refreshToken } });
  gebetaMap.init({ container: 'map' });
}
```

::: warning
Never expose your `GEBETA_SERVER_TOKEN` to the frontend. It should only exist in your backend environment variables.
:::
