#!/usr/bin/env node
/**
 * Bundle analyzer — generates an interactive HTML treemap showing what's
 * included in a workspace's built output.
 *
 * Usage:
 *   yarn bundle:audit <workspace-name>
 *   yarn bundle:audit node-geocoding-example
 *   yarn bundle:audit svelte-example
 *
 * The report opens automatically at <workspace>/dist/bundle-report.html
 */

import { build } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const workspaceName = process.argv[2];
if (!workspaceName) {
  console.error('Usage: yarn bundle:audit <workspace-name>');
  console.error('Example: yarn bundle:audit node-geocoding-example');
  process.exit(1);
}

function findWorkspace(name) {
  const searchDirs = [
    resolve(root, 'apps'),
    resolve(root, 'packages'),
    resolve(root, 'packages/client'),
    resolve(root, 'packages/server'),
  ];
  for (const dir of searchDirs) {
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const pkgPath = resolve(dir, entry.name, 'package.json');
      if (!existsSync(pkgPath)) continue;
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      if (pkg.name === name || entry.name === name) {
        return { dir: resolve(dir, entry.name), pkg };
      }
    }
  }
  return null;
}

const workspace = findWorkspace(workspaceName);
if (!workspace) {
  console.error(`Workspace "${workspaceName}" not found.`);
  process.exit(1);
}

const { dir: wsDir, pkg } = workspace;
console.log(`\nBundle audit: ${pkg.name}\n`);

const candidates = [
  'src/index.ts',
  'src/index.tsx',
  'src/main.ts',
  'src/main.tsx',
  'src/server.ts',
];
const entry = candidates.map(c => resolve(wsDir, c)).find(existsSync);
if (!entry) {
  console.error(`Could not find entry point. Tried: ${candidates.join(', ')}`);
  process.exit(1);
}

console.log(`Entry:  ${entry.replace(root + '/', '')}`);

const reportPath = resolve(wsDir, 'dist/bundle-report.html');

await build({
  root: wsDir,
  logLevel: 'warn',
  build: {
    lib: {
      entry,
      formats: ['es'],
      fileName: '_audit',
    },
    outDir: resolve(wsDir, 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      external: [
        /^node:/,
        'fs', 'path', 'url', 'http', 'https', 'crypto', 'os', 'stream', 'events',
      ],
      plugins: [
        visualizer({
          filename: reportPath,
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap',
          title: `Bundle audit — ${pkg.name}`,
        }),
      ],
    },
  },
});

console.log(`Report: ${reportPath}\n`);

const opener = process.platform === 'darwin' ? 'open'
  : process.platform === 'win32' ? 'start'
  : 'xdg-open';
try { execSync(`${opener} "${reportPath}"`); } catch {}
