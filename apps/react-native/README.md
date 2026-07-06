# Gebeta Maps RN Example

Bare React Native app demoing `@gebeta/react-native` from the monorepo workspace.

## Setup

From the monorepo root:

```bash
yarn install
yarn workspace @gebeta/api build
yarn workspace @gebeta/core build
```

Export your Gebeta API key in the environment Metro will read:

```bash
export GEBETA_API_KEY=your-key-here
```

## Run

```bash
# iOS — first time only:
cd apps/react-native/ios && bundle install && bundle exec pod install && cd -
yarn workspace gebeta-rn-example ios

# Android:
yarn workspace gebeta-rn-example android
```

## Demos

A tab bar at the top switches between feature pages (mirrors the React/Svelte example apps):

- **Home** — landing screen.
- **Directions** — tap the map to set an origin and destination, then fetch and draw a route.
  This is the end-to-end test for the declarative map store: the route line is rendered by
  driving the RN `MapAdapter`'s `addSource`/`addLayer`/`getSource().setData` (the same
  imperative calls the web SDK makes), which the store turns into `<ShapeSource>`/`<LineLayer>`
  children. A blue line on the native map means the bridge works.

## Notes

- Native MapLibre is provided by `@maplibre/maplibre-react-native@^10`; iOS needs `pod install` after first install.
- This app is intentionally not part of `yarn build` / `yarn ci` — the monorepo CI runs against packages only.
- Only API-key auth (`GEBETA_API_KEY`) is wired in so far; service-account auth is a follow-up.
