# Introduction

Gebeta Maps SDK is a set of JavaScript libraries for embedding interactive maps, geocoding, directions, clustering, fencing, and navigation into your applications.

## Packages

| Package         | Description                | Target                   |
| --------------- | -------------------------- | ------------------------ |
| `@gebeta/js`    | Full-featured browser SDK  | Browser (bundler or CDN) |
| `@gebeta/react` | React components and hooks | React apps               |
| `@gebeta/node`  | Server-side authentication | Node.js backends         |
| `@gebeta/api`   | Shared TypeScript types    | TypeScript consumers     |
| `@gebeta/core`  | Platform-agnostic logic    | Internal                 |

## Choosing the right package

**I'm building a web app with a bundler (Vite, webpack):**
Use `@gebeta/js` or `@gebeta/react`

**I'm adding a map to a plain HTML page:**
Use the CDN script tag (see [Installation](/guide/installation))

**I need to verify tokens or make API calls from my backend:**
Use `@gebeta/node`

**I'm using TypeScript and need types only:**
Use `@gebeta/api`

## Architecture

The SDK is built in layers:

```
@gebeta/api       # TypeScript types, interfaces, constants (no runtime)
@gebeta/core      # Platform-agnostic business logic
@gebeta/js        # Browser adapters + visual rendering (MapLibre GL)
@gebeta/react     # React components built on @gebeta/js
@gebeta/node      # Node.js server SDK (auth only)
```
