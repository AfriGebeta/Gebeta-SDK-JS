const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const monorepoRoot = path.resolve(__dirname, '../..');
const packages = path.resolve(monorepoRoot, 'packages');

/**
 * Metro configuration — monorepo-aware so it resolves @gebeta/* from packages/.
 * https://reactnative.dev/docs/metro
 *
 * The @gebeta/* imports are pinned to exact entry files via `resolveRequest`, bypassing
 * Metro's default handling of the workspace symlinks. Left to Metro, the symlinked
 * @gebeta/react-native resolved inconsistently between its `src` TypeScript and `dist` build,
 * intermittently yielding `undefined` module exports. Pinning removes that ambiguity:
 *
 * - @gebeta/react-native -> its TypeScript `src/index.ts` (local SDK edits picked up live).
 * - @gebeta/core / @gebeta/api -> their built `dist/index.js` (plain JS; build them first with
 *   `yarn workspace @gebeta/api build && yarn workspace @gebeta/core build`).
 *
 * Only the exact bare specifier is remapped; deep imports and everything else fall through to
 * Metro's default resolver.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const gebetaEntries = {
  '@gebeta/react-native': path.resolve(packages, 'client/react-native/src/index.ts'),
  '@gebeta/core': path.resolve(packages, 'core/dist/index.js'),
  '@gebeta/api': path.resolve(packages, 'api/dist/index.js'),
};

// The monorepo root has its OWN react (18.3.1) + react-native (0.74.7), dragged in by the
// @gebeta/react-native package's dev/peer deps, distinct from the app's react 19 / RN 0.86.
// When Metro bundles @gebeta/react-native's `src`, its `import 'react-native'` could resolve
// to the root's 0.74 copy — a second React Native in the bundle. That mismatched RN talks to a
// different TurboModuleRegistry than the native runtime, so `Modules loaded: []` and
// getEnforcing('PlatformConstants') throws. Force these singletons to the app's copy always.
const appNodeModules = path.resolve(__dirname, 'node_modules');
const forcedSingletons = ['react', 'react-native', 'react/jsx-runtime', 'react/jsx-dev-runtime'];
const singletonDir = {
  react: path.resolve(appNodeModules, 'react'),
  'react-native': path.resolve(appNodeModules, 'react-native'),
};

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      appNodeModules,
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    disableHierarchicalLookup: false,
    // Force react / react-native to a single copy so any package in the graph shares them.
    extraNodeModules: new Proxy(singletonDir, {
      get: (target, name) =>
        target[name] ? target[name] : path.resolve(appNodeModules, name),
    }),
    resolveRequest: (context, moduleName, platform) => {
      const pinned = gebetaEntries[moduleName];
      if (pinned) {
        return { type: 'sourceFile', filePath: pinned };
      }
      // Redirect react / react-native (and their subpaths) to the app's single copy.
      if (forcedSingletons.includes(moduleName)) {
        return context.resolveRequest(
          { ...context, originModulePath: path.join(appNodeModules, '_.js') },
          moduleName,
          platform
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
