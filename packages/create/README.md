# @gebeta/create

Interactive CLI that scaffolds a new project or adds Gebeta Maps to an existing one in seconds.

## Usage

```bash
# pnpm  (recommended)
pnpm create @gebeta          # or: pnpm dlx @gebeta/create

# npm
npm create @gebeta@latest    # or: npx @gebeta/create

# yarn
yarn create @gebeta          # or: yarn dlx @gebeta/create

# bun
bun create @gebeta           # or: bunx @gebeta/create
```

The CLI detects your framework and package manager automatically and walks you through:

| Step            | What it asks                                                          |
| --------------- | --------------------------------------------------------------------- |
| Mode            | New project or add to existing                                        |
| Framework       | React · Next.js · Vue · Vanilla · React Native · Node.js              |
| TypeScript      | Yes / No                                                              |
| Features        | Geocoding · Directions · Navigation · Clustering · Fencing · Tracking |
| Package manager | Auto-detected from lockfile / `packageManager` field                  |
| Token           | Add it to `.env`, then the CLI tests it with a live geocoding search  |

## What happens

1. Scaffolds a fresh project via Vite / `create-next-app` when requested
2. Installs the right `@gebeta/*` packages
3. Writes `.env` (with an empty `GEBETA_TOKEN` variable to fill in) and `.env.example`
4. Appends `.env` to `.gitignore`
5. Generates framework-specific starter code wired up and ready to run
6. Patches the iOS Podfile automatically for React Native

## Framework → package mapping

| Framework     | Packages installed                                  |
| ------------- | --------------------------------------------------- |
| React         | `@gebeta/react` `@gebeta/js`                        |
| Next.js       | `@gebeta/react` `@gebeta/js`                        |
| Vue           | `@gebeta/js` `@gebeta/core`                         |
| Vanilla JS/TS | `@gebeta/js`                                        |
| React Native  | `@gebeta/react-native` `@gebeta/core` `@gebeta/api` |
| Node.js       | `@gebeta/node` `@gebeta/core` `@gebeta/api`         |

## Token

Get a token at [gebeta.app/dashboard](https://gebeta.app/dashboard). The CLI never asks you to paste it:
put it in `.env` when prompted, answer **Yes**, and it runs a geocoding search for "Bole" to confirm
the token works. Answer **No** to skip and add it later.

| Framework              | Variable                   |
| ---------------------- | -------------------------- |
| React / Vue / Vanilla  | `VITE_GEBETA_TOKEN`        |
| Next.js                | `NEXT_PUBLIC_GEBETA_TOKEN` |
| Node.js / React Native | `GEBETA_TOKEN`             |

Bundlers only expose prefixed variables to browser code, hence `VITE_` / `NEXT_PUBLIC_`.
