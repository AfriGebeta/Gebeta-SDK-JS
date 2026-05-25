# Authentication

The SDK supports two authentication methods. **Service account auth is strongly recommended** for all new projects.

## Service Account Auth (recommended)

Service account auth uses short-lived access tokens that are automatically refreshed. Your backend generates and serves these tokens — they are never hardcoded.

### How it works

1. Your backend calls the Gebeta Auth API with your server token
2. It receives an `accessToken` (short-lived) and `refreshToken`
3. Your frontend receives these tokens and passes them to the SDK
4. The SDK automatically refreshes the access token before it expires

### Backend: generate tokens with `@gebeta/node`

```ts
import { GebetaAuth } from '@gebeta/node';

const auth = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });

app.post('/auth', async (req, res) => {
  const credentials = await auth.authenticate(req.body.clientToken);
  res.json(credentials); // { accessToken, refreshToken }
});
```

### Frontend: initialize with tokens

```js
const { accessToken, refreshToken } = await fetch('/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clientToken: 'YOUR_CLIENT_TOKEN' }),
}).then(r => r.json());

const gebetaMap = new GebetaMaps({
  auth: { accessToken, refreshToken }
});
```

::: tip
The SDK handles token refresh automatically. You only need to fetch tokens once on page load.
:::

## API Key Auth (legacy)

::: warning Deprecated
API key auth is supported for backwards compatibility but is not recommended for new projects. Migrate to service account auth.
:::

```js
const gebetaMap = new GebetaMaps({
  apiKey: 'your-api-key'
});
```

## Environment variables

Never hardcode tokens or API keys in your source code. Use environment variables:

```bash
# .env (backend)
GEBETA_SERVER_TOKEN=your-server-token
```

```js
// Load with dotenv
import 'dotenv/config';
const auth = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN });
```
