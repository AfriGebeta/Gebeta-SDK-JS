#!/usr/bin/env node
/**
 * Patches the nearest ios/Podfile with the changes required to build
 * @gebeta/react-native on iOS. Run once after installing the package:
 *
 *   npx @gebeta/react-native setup-ios
 *
 * What it does:
 *   1. Adds `use_frameworks! :linkage => :static` before the first `target` block
 *      (required for the native map renderer to be linked correctly).
 *   2. Adds `$MLRN.post_install(installer)` inside the `post_install` block
 *      (wires in the map framework via Swift Package Manager).
 *
 * The script is idempotent — running it twice is safe.
 */

const fs = require('fs');
const path = require('path');

const USE_FRAMEWORKS_LINE = 'use_frameworks! :linkage => :static';
const POST_INSTALL_CALL = '    $MLRN.post_install(installer)';
const XCODE_FLAGS_CALL = `    # Fix C++ compiler conflicts introduced by native map dependencies on Xcode 16+
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
        config.build_settings['CLANG_WARN_DOCUMENTATION_COMMENTS'] = 'NO'
      end
    end`;

function findPodfile() {
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, 'ios', 'Podfile');
    if (fs.existsSync(candidate)) return candidate;
    const direct = path.join(dir, 'Podfile');
    if (fs.existsSync(direct)) return direct;
    dir = path.dirname(dir);
  }
  return null;
}

function patchPodfile(podfilePath) {
  let content = fs.readFileSync(podfilePath, 'utf8');
  let changed = false;

  // 1. Add use_frameworks! before the first `target` block if not already present
  if (!content.includes(USE_FRAMEWORKS_LINE)) {
    content = content.replace(
      /^(target\s+['"])/m,
      `${USE_FRAMEWORKS_LINE}\n\n$1`
    );
    changed = true;
    console.log('  ✓ Added use_frameworks! :linkage => :static');
  } else {
    console.log('  · use_frameworks! :linkage => :static already present');
  }

  // 2. Add $MLRN.post_install and Xcode flag overrides inside post_install block
  if (!content.includes('$MLRN.post_install')) {
    content = content.replace(
      /(post_install do \|installer\|[\s\S]*?)(^\s*end)/m,
      (match, body, closing) => `${body}${POST_INSTALL_CALL}\n${closing}`
    );
    changed = true;
    console.log('  ✓ Added $MLRN.post_install(installer) to post_install block');
  } else {
    console.log('  · $MLRN.post_install already present');
  }

  // 3. Add Xcode 16 C++ compiler flag overrides if not already present
  if (!content.includes('GCC_WARN_INHIBIT_ALL_WARNINGS')) {
    content = content.replace(
      /(post_install do \|installer\|[\s\S]*?)(^\s*end)/m,
      (match, body, closing) => `${body}${XCODE_FLAGS_CALL}\n${closing}`
    );
    changed = true;
    console.log('  ✓ Added Xcode 16 C++ compiler flag overrides');
  } else {
    console.log('  · Xcode 16 C++ compiler flag overrides already present');
  }

  if (changed) {
    fs.writeFileSync(podfilePath, content, 'utf8');
  }

  return changed;
}

function main() {
  console.log('\n@gebeta/react-native iOS setup\n');

  const podfilePath = findPodfile();
  if (!podfilePath) {
    console.error(
      'Error: Could not find ios/Podfile. Run this script from your React Native project root.'
    );
    process.exit(1);
  }

  console.log(`Podfile: ${podfilePath}\n`);

  const changed = patchPodfile(podfilePath);

  if (changed) {
    console.log('\nDone. Now run:\n');
    console.log('  cd ios && pod install\n');
  } else {
    console.log('\nPodfile is already up to date. No changes made.\n');
  }
}

main();
