# Installation

## CDN (no build step)

The simplest way to get started. Add one script tag to your HTML:

```html
<!-- Always latest -->
<script src="https://tiles.gebeta.app/static/current/gebeta-maps.umd.js"></script>

<!-- Pinned to a major version (recommended) -->
<script src="https://tiles.gebeta.app/static/v3/gebeta-maps.umd.js"></script>

<!-- Pinned to an exact version -->
<script src="https://tiles.gebeta.app/static/releases/3.0.5/gebeta-maps.umd.js"></script>
```

Then use it globally:

```html
<div id="map" style="width: 100%; height: 400px;"></div>
<script>
  const gebetaMap = new GebetaMaps({ auth: { accessToken: '...', refreshToken: '...' } });
  gebetaMap.init({ container: 'map' });
</script>
```

## npm

```bash
npm install @gebeta/js
# or
yarn add @gebeta/js
```

## React

```bash
npm install @gebeta/react @gebeta/js
```

## Node.js (server-side auth)

```bash
npm install @gebeta/node
```

## TypeScript types only

`@gebeta/api` is automatically installed as a dependency of `@gebeta/js`, `@gebeta/react`, and `@gebeta/node`. You can also install it directly for type-only usage:

```bash
npm install @gebeta/api
```
