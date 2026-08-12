# @gebeta/react-native

## 1.0.0

### Major Changes

- 104dc71: Add React Native SDK deployment, React 19 support, and iOS setup helper

  - `@gebeta/react-native`: Add `npx @gebeta/react-native setup-ios` helper that patches consumer Podfiles for iOS builds (use_frameworks static linkage, MLRN post_install hook, Xcode 16 C++ compiler flag overrides). Add CI workflow and npm publish integration.
  - `@gebeta/react`: Update to React 19 (peerDependencies, devDependencies, @types/react). Fix children prop type.
  - Other packages: patch bumps for CI and deployment pipeline updates.

### Patch Changes

- Updated dependencies [104dc71]
  - @gebeta/api@3.0.11
  - @gebeta/core@3.0.11

## 0.2.0

### Minor Changes

- 2907c15: Add react native sdk deployment

### Patch Changes

- Updated dependencies [2907c15]
  - @gebeta/api@3.0.10
  - @gebeta/core@3.0.10
