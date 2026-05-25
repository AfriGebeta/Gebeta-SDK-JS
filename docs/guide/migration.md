# Migration Guide

## API Key → Service Account Auth

API key auth still works but is deprecated. Here's how to migrate:

**Before:**
```js
const gebetaMap = new GebetaMaps({ apiKey: 'your-api-key' });
```

**After:**

1. Create a service account in the Gebeta dashboard and get your server token
2. Set up a backend auth endpoint (see [Node.js Auth](/guide/node-auth))
3. Update your frontend:

```js
const { accessToken, refreshToken } = await fetch('/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clientToken: 'YOUR_CLIENT_TOKEN' }),
}).then(r => r.json());

const gebetaMap = new GebetaMaps({ auth: { accessToken, refreshToken } });
```

## Benefits of migrating
- Tokens expire automatically — no long-lived credentials in your frontend
- Revocable — invalidate a token without changing your API key
- Scoped — tokens can be issued with specific permissions
