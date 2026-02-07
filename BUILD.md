# Build and Development Guide

## Setup

Install dependencies for all packages:

```bash
npm install
```

## Building

### Build all packages

```bash
npm run build
```

### Build only the API package

```bash
npm run build:api
```

The API package outputs:

- JavaScript files: `packages/api/dist/*.js`
- TypeScript declarations: `packages/api/dist/*.d.ts`

## Linking Workspace Packages

After building the API package, other packages in the monorepo can reference it via workspace linking:

```bash
npm run link
```

This builds the API package and ensures all workspace dependencies are properly linked.

## Linting

### Lint all packages

```bash
npm run lint
```

### Fix linting issues automatically

```bash
npm run lint:fix
```

### Lint only the API package

```bash
cd packages/api
npm run lint
```

## Formatting

### Format all files

```bash
npm run format
```

### Check formatting (without fixing)

```bash
npm run format:check
```

## Type Checking

### Type check all packages

```bash
npm run typecheck
```

## CI Checks

Run all CI checks locally:

```bash
npm run ci
```

This runs:

1. ESLint
2. Prettier format check
3. TypeScript type checking

## Clean Build Artifacts

```bash
npm run clean
```
