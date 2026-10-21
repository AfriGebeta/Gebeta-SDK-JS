#!/usr/bin/env node
/**
 * Add explicit file extensions to relative imports in tsc output so it loads in Node ESM.
 *
 * tsc (moduleResolution "bundler"/"node") emits `from './Auth/AuthManager'` and
 * `from './namespaces'` as written. Bundlers resolve those, but Node's ESM loader requires
 * `./Auth/AuthManager.js` and `./namespaces/index.js`. Rewrites `.js` and `.d.ts` files in place.
 *
 * Usage (from a package directory, after tsc):
 *   node ../../scripts/fix-esm-imports.mjs dist
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { resolve, dirname, join } from 'path';

const distDir = resolve(process.argv[2] ?? 'dist');

// Matches: from './x'   import './x'   import('./x')   export * from './x'
const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"]*)\2/g;

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function withExtension(file, spec) {
  if (/\.(m?js|cjs|json|css)$/.test(spec)) return spec;
  const target = resolve(dirname(file), spec);
  if (existsSync(`${target}.js`)) return `${spec}.js`;
  if (existsSync(join(target, 'index.js'))) return `${spec.replace(/\/$/, '')}/index.js`;
  return spec;
}

let changed = 0;
for (const file of walk(distDir)) {
  if (!file.endsWith('.js') && !file.endsWith('.d.ts')) continue;
  const source = readFileSync(file, 'utf8');
  const output = source.replace(
    SPECIFIER,
    (_, prefix, quote, spec) => `${prefix}${quote}${withExtension(file, spec)}${quote}`
  );
  if (output !== source) {
    writeFileSync(file, output);
    changed++;
  }
}

console.log(`fix-esm-imports: updated ${changed} file(s) in ${distDir}`);
