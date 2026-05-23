import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        geocoding: resolve(__dirname, 'src/entries/geocoding.ts'),
        directions: resolve(__dirname, 'src/entries/directions.ts'),
        clustering: resolve(__dirname, 'src/entries/clustering.ts'),
        navigation: resolve(__dirname, 'src/entries/navigation.ts'),
        fencing: resolve(__dirname, 'src/entries/fencing.ts'),
        umd: resolve(__dirname, 'src/umd.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['maplibre-gl'],
      output: {
        // Keep each entry as its own file (no inlining)
        preserveModules: false,
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
    outDir: 'dist',
  },
});

// Separate UMD build is handled by the `umd` entry above bundled via a
// secondary vite build step if needed, but for CDN usage the umd.ts entry
// is compiled to ES and can be used with a bundler. For a true UMD build,
// run: vite build --config vite.config.umd.ts
