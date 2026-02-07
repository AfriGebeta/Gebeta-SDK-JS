import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'GebetaMaps',
      fileName: format => `gebeta-maps.${format}.js`,
      formats: ['umd'],
    },
    rollupOptions: {
      output: {
        globals: {},
      },
    },
    outDir: 'dist',
  },
});
