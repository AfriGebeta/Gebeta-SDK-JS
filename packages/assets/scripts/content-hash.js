// compute hash of all the icons in the maneuvers directory, as well as the manifest file itself, to be used for cache busting in the build process
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const iconsDir = path.join(__dirname, '..', 'icons', 'maneuvers');
const manifestPath = path.join(iconsDir, 'manifest.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const allIcons = Object.values(manifest.icons || {});
if (manifest.default) allIcons.push(manifest.default);
const uniqueIcons = [...new Set(allIcons)].sort();

const hasher = crypto.createHash('md5');
hasher.update(fs.readFileSync(manifestPath, 'utf8'));
for (const iconFile of uniqueIcons) {
  hasher.update(iconFile);
  hasher.update(fs.readFileSync(path.join(iconsDir, iconFile), 'utf8'));
}

console.log(hasher.digest('hex'));
