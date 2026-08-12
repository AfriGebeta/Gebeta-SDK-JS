# @gebeta/api

## 3.0.12

## 3.0.11

### Patch Changes

- 104dc71: Add React Native SDK deployment, React 19 support, and iOS setup helper

  - `@gebeta/react-native`: Add `npx @gebeta/react-native setup-ios` helper that patches consumer Podfiles for iOS builds (use_frameworks static linkage, MLRN post_install hook, Xcode 16 C++ compiler flag overrides). Add CI workflow and npm publish integration.
  - `@gebeta/react`: Update to React 19 (peerDependencies, devDependencies, @types/react). Fix children prop type.
  - Other packages: patch bumps for CI and deployment pipeline updates.

## 3.0.10

### Patch Changes

- 2907c15: Add react native sdk deployment

## 3.0.9

### Patch Changes

- 28524fb: version bump

## 3.0.8

### Patch Changes

- ef1b6f6: Expose map ref

## 3.0.7

### Patch Changes

- 2c07534: Fix api key auth, homogenize auth type decision

## 3.0.6

### Patch Changes

- a1ea578: Add Branding

## 3.0.5

### Patch Changes

- fe7d6b0: Build before publish

## 3.0.4

### Patch Changes

- 8ab28f6: fix: include dist files in npm

## 3.0.3

### Patch Changes

- 26ad048: fix deployment path

## 3.0.2

### Patch Changes

- 983fd1e: Fix unimportability issue with js package

## 3.0.1

### Patch Changes

- de1cd01: New SDK with improved consistency, validation and authentication flows
