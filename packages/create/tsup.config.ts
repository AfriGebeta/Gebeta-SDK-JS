import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  splitting: false,
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
  outExtension: () => ({ js: '.js' }),
});
