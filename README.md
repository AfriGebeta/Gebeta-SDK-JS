# Gebeta Maps SDK

JavaScript, React, and Node.js SDK for [Gebeta Maps](https://gebetamaps.com).

## Packages

| Package | Description |
|---|---|
| `@gebeta/js` | Browser SDK — map rendering, geocoding, directions, navigation, clustering, fencing |
| `@gebeta/react` | React component and hooks |
| `@gebeta/node` | Node.js server-side authentication |
| `@gebeta/api` | Shared TypeScript types (no runtime code) |

## Documentation

**[afrigebeta.github.io/Gebeta-SDK-JS](https://afrigebeta.github.io/Gebeta-SDK-JS/)**

## Quick start

```bash
npm install @gebeta/js
```

```js
import { GebetaMaps } from '@gebeta/js';

const sdk = new GebetaMaps({ auth: { accessToken: '...', refreshToken: '...' } });
const map = sdk.init({ container: '#map', center: [38.74, 9.02], zoom: 12 });
```

Or via CDN:

```html
<script src="https://tiles.gebeta.app/static/current/gebeta-maps.umd.js"></script>
```
