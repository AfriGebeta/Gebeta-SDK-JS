// Renames dist/esm/*.js → dist/*.mjs after the ESM TypeScript build
const fs = require('fs');
const path = require('path');

const esmDir = path.join(__dirname, '..', 'dist', 'esm');
const outDir = path.join(__dirname, '..', 'dist');

for (const file of fs.readdirSync(esmDir)) {
  if (file.endsWith('.js')) {
    fs.renameSync(
      path.join(esmDir, file),
      path.join(outDir, file.replace(/\.js$/, '.mjs'))
    );
  }
}
fs.rmSync(esmDir, { recursive: true });
