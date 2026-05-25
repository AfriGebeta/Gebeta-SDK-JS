# @gebeta/node

Node.js server SDK for Gebeta Maps. Provides server-side authentication — your backend generates short-lived tokens and serves them to your frontend.

## Installation

```bash
npm install @gebeta/node
```

## Quick start

```ts
import { GebetaAuth } from '@gebeta/node';

const auth = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });

// Express endpoint — receives clientToken from the frontend
app.post('/auth', async (req, res) => {
  const credentials = await auth.authenticate(req.body.clientToken);
  res.json(credentials); // { accessToken, refreshToken }
});
```

## Why server-side auth?

Service account tokens expire automatically and are revocable. Your server token never reaches the browser — only the short-lived access token does.

## Documentation

[gebeta-sdk-js docs](https://AfriGebeta.github.io/Gebeta-SDK-JS)
