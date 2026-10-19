# Server side: token issuing and Node geocoding

## Token flow

```
browser ──clientToken──▶ your backend ──clientToken + GEBETA_SERVER_TOKEN──▶ mapapi.gebeta.app/api/v1/external/auth
browser ◀─{accessToken, refreshToken}── your backend ◀──────────────────────────────┘
browser → SDK refreshes accessToken itself via /api/v1/external/auth/refresh
```

- `GEBETA_SERVER_TOKEN` — secret, backend env only. Never in a `VITE_*` / `NEXT_PUBLIC_*` var.
- `clientToken` — public identifier of the app; safe in frontend env.
- Access token lifetime ≈ 7 minutes; the browser SDK refreshes proactively and on 401.

## Express

```ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GebetaAuth } from '@gebeta/node';

const app = express();
app.use(cors({ origin: process.env.APP_ORIGIN }));
app.use(express.json());

const gebeta = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });

app.post('/gebeta/auth', async (req, res) => {
  const { clientToken } = req.body ?? {};
  if (typeof clientToken !== 'string')
    return res.status(400).json({ error: 'clientToken required' });
  try {
    res.json(await gebeta.authenticate(clientToken));
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Gebeta auth failed' });
  }
});

app.listen(3001);
```

Put your own app authentication/rate-limiting in front of this endpoint — anyone who can call it
gets map tokens billed to you.

## Next.js Route Handler

```ts
// app/api/gebeta/auth/route.ts
import { GebetaAuth } from '@gebeta/node';

const gebeta = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });

export async function POST(req: Request) {
  const { clientToken } = await req.json();
  try {
    return Response.json(await gebeta.authenticate(clientToken));
  } catch {
    return Response.json({ error: 'Gebeta auth failed' }, { status: 502 });
  }
}
```

## Geocoding from Node (no DOM required)

```ts
import { GeocodingManager, AuthManager } from '@gebeta/js/geocoding';
import { GebetaAuth } from '@gebeta/node';

const tokens = await new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! }).authenticate(
  process.env.GEBETA_CLIENT_TOKEN!
);

const geocoder = new GeocodingManager({
  type: 'SERVICE_ACCOUNT',
  manager: new AuthManager(tokens),
});

const results = await geocoder.geocode('Meskel Square'); // [{ name, lngLat: { lng, lat }, ... }]
const near = await geocoder.reverseGeocode({ lat: 9.0108, lng: 38.7613 });
```

Batch jobs: run requests with bounded concurrency (e.g. 5 at a time) and cache results by query
string; geocoding the same address repeatedly costs quota.
