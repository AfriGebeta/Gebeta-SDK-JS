module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Bare React Native does not inline shell env vars into the JS bundle. This replaces
    // `process.env.GEBETA_API_KEY` with the literal string at bundle time so the example can
    // read the key exported before Metro starts. Scoped to just GEBETA_API_KEY via `include`
    // so the rest of the shell environment does not leak into the bundle. Restart Metro with
    // `--reset-cache` after changing the value.
    ['transform-inline-environment-variables', { include: ['GEBETA_API_KEY'] }],
    // The @gebeta/api / @gebeta/core dist builds emit `export * as X from '...'` (TS
    // `module: ESNext`). Metro's default preset does not transform that syntax, so bundling
    // their dist output fails. This plugin lowers it to a form Metro accepts.
    '@babel/plugin-transform-export-namespace-from',
  ],
};
