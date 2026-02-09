# React example app

Example app for the Gebeta Maps React SDK. Uses only `GebetaMap` and `useClustering`; no Maplibre or react-map-gl in the app.

## Prerequisites

- Node 18+ and Yarn
- From monorepo root, build the SDK: `yarn build` (or build api, core, and react packages)

## Run

From monorepo root:

```bash
yarn install
yarn dev:react
```

Or from this directory: `yarn dev`. Then open http://localhost:5174.

## API key

Set `VITE_GEBETA_API_KEY` in a `.env` file in this directory (or in the repo root) so the map can load Gebeta tiles. If unset, the map may still load with a default style but tile requests may fail.

## What it does

- Renders a full-screen map via `<GebetaMap apiKey="..." styleUrl="..." clustering={{ enabled: true, showClusterCount: true }}>`.
- A control panel (child of GebetaMap) uses `useClustering()` to add/clear markers. Clusters appear when zoomed out; click clusters to zoom in.
