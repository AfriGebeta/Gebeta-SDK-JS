#!/usr/bin/env node
/**
 * Switch @gebeta/* dependencies in all example apps between:
 *   --local  workspace:*   (local development, default)
 *   --npm    latest        (test against published npm packages)
 *
 * Usage:
 *   node scripts/switch-deps.js --local
 *   node scripts/switch-deps.js --npm
 *   USE_LOCAL=true node scripts/switch-deps.js   (env var form)
 *
 * After switching, run `yarn install` to apply changes.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const args = process.argv.slice(2);
const useLocal =
  args.includes('--local') ||
  (process.env.USE_LOCAL === 'true' && !args.includes('--npm'));

if (!args.includes('--local') && !args.includes('--npm') && process.env.USE_LOCAL === undefined) {
  console.error('Usage: node scripts/switch-deps.js --local | --npm');
  console.error('   or: USE_LOCAL=true|false node scripts/switch-deps.js');
  process.exit(1);
}

const mode = useLocal ? 'local (workspace:*)' : 'npm (latest)';
console.log(`Switching @gebeta/* dependencies to: ${mode}`);

/** App package.json paths relative to repo root */
const appPackageJsonPaths = [
  'apps/svelte/package.json',
  'apps/react/package.json',
  'apps/node-geocoding/package.json',
  'apps/node-auth/package.json',
  'apps/react-native/package.json',
];

/** All @gebeta/* package names used in apps */
const gebetaPackages = [
  '@gebeta/api',
  '@gebeta/core',
  '@gebeta/js',
  '@gebeta/react',
  '@gebeta/react-native',
  '@gebeta/node',
];

let changed = 0;

for (const relPath of appPackageJsonPaths) {
  const fullPath = resolve(root, relPath);
  const pkg = JSON.parse(readFileSync(fullPath, 'utf8'));
  let modified = false;

  for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (!pkg[section]) continue;
    for (const name of gebetaPackages) {
      if (name in pkg[section]) {
        const newVersion = useLocal ? 'workspace:*' : 'latest';
        if (pkg[section][name] !== newVersion) {
          console.log(`  ${relPath}: ${name} ${pkg[section][name]} → ${newVersion}`);
          pkg[section][name] = newVersion;
          modified = true;
        }
      }
    }
  }

  if (modified) {
    writeFileSync(fullPath, JSON.stringify(pkg, null, 2) + '\n');
    changed++;
  }
}

if (changed === 0) {
  console.log('  No changes needed — already in the requested mode.');
} else {
  console.log(`\nUpdated ${changed} file(s). Run \`yarn install\` to apply.`);
}

// Switch the <script src> in plain-HTML JS examples between local build and CDN.
const CDN_URL = 'https://tiles.gebeta.app/static/current/gebeta-maps.umd.js';
const LOCAL_PATH = '../../packages/client/js/dist/gebeta-maps.umd.js';

const jsExampleHtmls = [
  'apps/js/directions.html',
  'apps/js/geocoding.html',
  'apps/js/fencing.html',
  'apps/js/fence-styling.html',
  'apps/js/clustering.html',
  'apps/js/navigation.html',
  'apps/js/navigation-http.html',
  'apps/js/navigation-simulation.html',
];

const from = useLocal ? CDN_URL : LOCAL_PATH;
const to = useLocal ? LOCAL_PATH : CDN_URL;

let htmlChanged = 0;

for (const relPath of jsExampleHtmls) {
  const fullPath = resolve(root, relPath);
  const original = readFileSync(fullPath, 'utf8');
  if (original.includes(from)) {
    const updated = original.replaceAll(from, to);
    writeFileSync(fullPath, updated);
    console.log(`  ${relPath}: script src → ${useLocal ? 'local build' : 'CDN'}`);
    htmlChanged++;
  }
}

if (htmlChanged > 0) {
  console.log(`\nUpdated ${htmlChanged} HTML file(s) in apps/js/.`);
}
