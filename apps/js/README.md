# Gebeta Maps SDK - JS Examples

Static HTML examples for the Gebeta Maps JavaScript SDK.

## Prerequisites

- Node 18+ and Yarn
- Build the SDK from the monorepo root: `yarn build` (or at least `yarn workspace @gebeta/js build`)
- Set your API key in `config.js` (copy from `config.example.js`)

## Running the examples

The examples must be served from the **repo root** so the relative path to the SDK dist resolves correctly.

From the repo root:

```bash
npx serve .
```

Then open `http://localhost:3000/apps/js/` for the examples index.

> **Note:** Do not serve from inside `apps/js/` — the SDK is loaded via
> `../../packages/client/js/dist/gebeta-maps.umd.js` relative to the repo root.

## Switching between local build and CDN

By default (after `yarn examples:local`) the examples load the local build. To toggle:

```bash
# Use local build (default — for development)
yarn examples:local

# Use published CDN version (to test against released SDK)
yarn examples:npm
```

This updates both the `package.json` deps in bundled apps **and** the `<script src>` in these HTML files.

## Examples

- **index.html** – Overview and links to each example
- **directions.html** – Directions API: set origin/destination on the map, get route, display with markers
- **geocoding.html** – Forward geocoding (search by name) and reverse geocoding (coordinates → address)
- **clustering.html** – Marker clustering with configurable radius and zoom
- **fencing.html** – Geofencing: draw polygons and detect point-in-fence
- **fence-styling.html** – Custom fence styles and fill colors
- **navigation.html** – Turn-by-turn navigation with live location tracking
- **navigation-http.html** – Navigation using HTTP-based location polling
- **navigation-simulation.html** – Navigation with simulated route playback
