import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const { version } = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8')) as {
  version: string;
};

// Used by: vite build --config vite.config.umd.ts
// Produces: dist/gebeta-maps.umd.js  (for CDN <script> tag usage)
export default defineConfig({
  define: {
    __GEBETA_VERSION__: JSON.stringify(version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/umd.ts'),
      name: 'GebetaMaps',
      fileName: () => 'gebeta-maps.umd.js',
      formats: ['umd'],
    },
    rollupOptions: {
      output: {},
    },
    outDir: 'dist',
    emptyOutDir: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
