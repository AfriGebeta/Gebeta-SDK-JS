---
'@gebeta/react-native': major
'@gebeta/react': patch
'@gebeta/api': patch
'@gebeta/js': patch
'@gebeta/core': patch
'@gebeta/node': patch
---

Add React Native SDK deployment, React 19 support, and iOS setup helper

- `@gebeta/react-native`: Add `npx @gebeta/react-native setup-ios` helper that patches consumer Podfiles for iOS builds (use_frameworks static linkage, MLRN post_install hook, Xcode 16 C++ compiler flag overrides). Add CI workflow and npm publish integration.
- `@gebeta/react`: Update to React 19 (peerDependencies, devDependencies, @types/react). Fix children prop type.
- Other packages: patch bumps for CI and deployment pipeline updates.
