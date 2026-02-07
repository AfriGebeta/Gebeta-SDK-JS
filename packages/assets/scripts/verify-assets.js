// check that all files in the manifest exist and that the manifest structure is correct
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'icons', 'maneuvers');
const manifestPath = path.join(iconsDir, 'manifest.json');

if (!fs.existsSync(iconsDir)) {
  console.error('Error: maneuvers icons directory not found');
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
  console.error('Error: manifest.json not found');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (!manifest.icons || typeof manifest.icons !== 'object') {
  console.error('Error: manifest.json missing or invalid icons object');
  process.exit(1);
}

if (!manifest.default || typeof manifest.default !== 'string') {
  console.error('Error: manifest.json missing or invalid default icon');
  process.exit(1);
}

console.log('manifest.json structure verified');
console.log('Total icons in manifest:', Object.keys(manifest.icons).length);
console.log('Default icon:', manifest.default);

const allIcons = Object.values(manifest.icons);
if (manifest.default) allIcons.push(manifest.default);
const uniqueIcons = [...new Set(allIcons)];
const missingIcons = uniqueIcons.filter((iconFile) => !fs.existsSync(path.join(iconsDir, iconFile)));

if (missingIcons.length > 0) {
  console.error('Error: Missing icon files:');
  missingIcons.forEach((icon) => console.error('  -', icon));
  process.exit(1);
}

console.log('All', uniqueIcons.length, 'icons from manifest.json verified successfully');
