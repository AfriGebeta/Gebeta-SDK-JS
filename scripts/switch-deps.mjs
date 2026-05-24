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
];

/** All @gebeta/* package names used in apps */
const gebetaPackages = [
  '@gebeta/api',
  '@gebeta/core',
  '@gebeta/js',
  '@gebeta/react',
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
