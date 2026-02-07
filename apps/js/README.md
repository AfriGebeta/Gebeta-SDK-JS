# Gebeta Maps SDK - JS Examples

Static HTML examples for the Gebeta Maps JavaScript SDK.

## Prerequisites

- Node 18+ and Yarn
- Build the SDK from the monorepo root: `yarn build` (or at least `yarn workspace @gebeta/maps-js build`)
- Set your API key in `config.js`: assign `GEBETA_API_KEY` (or override `loadConfig()` to read from env)

## Running the examples

Serve the repository root with a static server so that:

- `http://localhost:<port>/apps/js/` serves this folder
- `http://localhost:<port>/packages/js/dist/gebeta-maps.umd.js` serves the built SDK

From the repo root:

```bash
npx serve .
```

Then open:

- `http://localhost:3000/apps/js/` for the examples index
- `http://localhost:3000/apps/js/directions.html` for the directions example
- `http://localhost:3000/apps/js/geocoding.html` for the geocoding example

Alternatively, use any static server (e.g. `python -m http.server 8080`) from the repo root and replace the port/host as needed.

## Examples

- **index.html** – Overview and links to each example
- **directions.html** – Directions API: set origin and destination on the map, get route, display with markers
- **geocoding.html** – Forward geocoding (search by name) and reverse geocoding (coordinates to address), results on map

The SDK is loaded from `../../packages/js/dist/gebeta-maps.umd.js`; MapLibre GL is loaded from the unpkg CDN.
