# @gebeta/create

## 1.2.0

### Minor Changes

- 0d42cb0: Token setup no longer asks you to paste a key. The CLI writes an empty `GEBETA_TOKEN` variable (`VITE_GEBETA_TOKEN` / `NEXT_PUBLIC_GEBETA_TOKEN` for browser bundlers) to `.env`, asks whether you've added it, and verifies it with a live geocoding search for "Bole" (retry on a rejected token, or skip).

  Also fixes:

  - Key check always failed with 401/403 (sent `api_key` instead of `apiKey`).
  - Vite scaffolding no longer prompts or auto-installs (`create-vite@8 --no-interactive`); create-vite 9 templates crash `npm install` on npm 10.
  - `npx` no longer stops to ask "Ok to proceed?" before downloading scaffolders.
  - New Node.js projects load `.env` via `--env-file`.
  - Feature hints are no longer shown twice.

## 1.1.0

### Minor Changes

- 78a8ee9: New package: `@gebeta/create` — interactive CLI to scaffold or integrate Gebeta Maps.

  ```bash
  pnpm dlx @gebeta/create
  # or after publish:
  pnpm create @gebeta
  ```

  Detects your framework and package manager automatically, validates your API key live, installs the right `@gebeta/*` packages, writes `.env` / `.env.example`, patches `.gitignore`, and generates ready-to-run starter code for React, Next.js, Vue, Vanilla JS/TS, React Native, and Node.js.
