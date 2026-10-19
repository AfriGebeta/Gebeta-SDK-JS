# @gebeta/api

Shared TypeScript types, interfaces, and constants for the Gebeta Maps SDK. No runtime code — types only.

## Installation

```bash
npm install @gebeta/api
```

This package is automatically installed as a dependency of `@gebeta/js`, `@gebeta/react`, and `@gebeta/node`. Install it directly only if you need types without the full SDK.

## Usage

```ts
import { API } from '@gebeta/api';

// Map styles
const styleUrl = API.Map.Constants.STYLES.standard.url; // also .satellite, .terrain

// Types
type RouteData = API.Routing.Types.RouteData;
type LocationData = API.Platform.Types.LocationData;
```

## Documentation

[gebeta-sdk-js docs](https://AfriGebeta.github.io/Gebeta-SDK-JS)
