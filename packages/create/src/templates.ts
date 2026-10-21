import type { Framework } from './utils.js';

export type Feature =
  | 'geocoding'
  | 'directions'
  | 'navigation'
  | 'clustering'
  | 'fencing'
  | 'tracking';

export interface TemplateConfig {
  framework: Framework;
  typescript: boolean;
  features: Feature[];
  projectName: string;
}

// ─── Env files ────────────────────────────────────────────────────────────────

/**
 * Name of the token variable in .env. Bundlers only expose prefixed variables to browser code
 * (Vite: VITE_, Next.js: NEXT_PUBLIC_); Node and React Native read GEBETA_TOKEN directly.
 */
export function tokenEnvVar(framework: Framework): string {
  if (framework === 'next') return 'NEXT_PUBLIC_GEBETA_TOKEN';
  if (framework === 'node' || framework === 'react-native') return 'GEBETA_TOKEN';
  return 'VITE_GEBETA_TOKEN';
}

/** .env with an empty token for the user to fill in. */
export function envTemplate(cfg: TemplateConfig): string {
  return `# Gebeta Maps token — get yours at https://gebeta.app/dashboard\n${tokenEnvVar(cfg.framework)}=\n`;
}

export function envExampleTemplate(cfg: TemplateConfig): string {
  return `# Gebeta Maps token — get yours at https://gebeta.app/dashboard\n${tokenEnvVar(cfg.framework)}=your_token_here\n`;
}

// ─── React ────────────────────────────────────────────────────────────────────

export function reactAppTemplate(cfg: TemplateConfig): string {
  const geocoding = cfg.features.includes('geocoding');
  const onLoad = geocoding
    ? `\n        onLoad={async gebeta => {\n          const results = await gebeta.geocodingManager.geocode('Bole');\n          console.log('Geocoding results:', results);\n        }}`
    : '';
  return `import { GebetaMap } from '@gebeta/react';
import '@gebeta/js/style.css';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GebetaMap
        apiKey={import.meta.env.VITE_GEBETA_TOKEN}
        style={{ width: '100%', height: '100%' }}
        center={[38.7469, 9.0227]}
        zoom={12}${onLoad}
      />
    </div>
  );
}
`;
}

// ─── Next.js ──────────────────────────────────────────────────────────────────

export function nextPageTemplate(_cfg: TemplateConfig): string {
  return `'use client';

import { GebetaMap } from '@gebeta/react';
import '@gebeta/js/style.css';

export default function MapPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GebetaMap
        apiKey={process.env.NEXT_PUBLIC_GEBETA_TOKEN!}
        style={{ width: '100%', height: '100%' }}
        center={[38.7469, 9.0227]}
        zoom={12}
      />
    </div>
  );
}
`;
}

// ─── Vanilla ──────────────────────────────────────────────────────────────────

export function vanillaMainTemplate(_cfg: TemplateConfig): string {
  return `import { GebetaMaps } from '@gebeta/js';
import '@gebeta/js/style.css';

const gebeta = new GebetaMaps({ apiKey: import.meta.env.VITE_GEBETA_TOKEN });

const map = gebeta.init({
  container: 'map',
  center: [38.7469, 9.0227],
  zoom: 12,
});

map.on('load', () => {
  console.log('Gebeta map ready');
});
`;
}

export function vanillaHtmlTemplate(_cfg: TemplateConfig): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gebeta Maps</title>
    <style>
      body, html { margin: 0; padding: 0; height: 100%; }
      #map { width: 100vw; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script type="module" src="./src/main${_cfg.typescript ? '.ts' : '.js'}"></script>
  </body>
</html>
`;
}

// ─── Vue ──────────────────────────────────────────────────────────────────────

export function vueAppTemplate(cfg: TemplateConfig): string {
  return `<template>
  <div id="map" />
</template>

<script setup${cfg.typescript ? ' lang="ts"' : ''}>
import { onMounted, onUnmounted } from 'vue';
import { GebetaMaps } from '@gebeta/js';
import '@gebeta/js/style.css';

let gebeta${cfg.typescript ? ': GebetaMaps | null' : ''} = null;

onMounted(() => {
  gebeta = new GebetaMaps({ apiKey: import.meta.env.VITE_GEBETA_TOKEN });
  gebeta.init({
    container: 'map',
    center: [38.7469, 9.0227],
    zoom: 12,
  });
});

onUnmounted(() => gebeta?.getMap()?.remove());
</script>

<style scoped>
#map { width: 100vw; height: 100vh; }
</style>
`;
}

// ─── React Native ─────────────────────────────────────────────────────────────

export function reactNativeAppTemplate(_cfg: TemplateConfig): string {
  return `import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GebetaMap } from '@gebeta/react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <GebetaMap
        apiKey={process.env.GEBETA_TOKEN ?? ''}
        style={styles.map}
        center={[38.7469, 9.0227]}
        zoom={12}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
`;
}

// ─── Node.js ──────────────────────────────────────────────────────────────────

export function nodeIndexTemplate(cfg: TemplateConfig): string {
  const hasGeocoding = cfg.features.includes('geocoding');
  const hasDirections = cfg.features.includes('directions');
  const hasTracking = cfg.features.includes('tracking');

  const imports: string[] = [];
  if (hasGeocoding) imports.push(`import { GeocodingManager } from '@gebeta/core';`);
  if (hasDirections) imports.push(`import { DirectionsManager } from '@gebeta/core';`);
  if (hasTracking)
    imports.push(`import { HttpTrackingManager, normalizeAuth } from '@gebeta/core';`);

  const body: string[] = [`const TOKEN = process.env.GEBETA_TOKEN ?? '';`, ''];

  if (hasGeocoding) {
    body.push(
      `const geocoding = new GeocodingManager(TOKEN);`,
      `const results = await geocoding.geocode('Bole');`,
      `console.log('Geocoding results:', results);`,
      ''
    );
  }

  if (hasDirections) {
    body.push(
      `const directions = new DirectionsManager(TOKEN);`,
      `const route = await directions.getDirections(`,
      `  { lng: 38.7469, lat: 9.0227 },`,
      `  { lng: 38.7969, lat: 9.0527 }`,
      `);`,
      `console.log('Route distance:', route.distance);`,
      ''
    );
  }

  if (hasTracking) {
    body.push(
      `const tracking = new HttpTrackingManager({ auth: normalizeAuth(TOKEN), userId: 'driver-1' });`,
      `// tracking.updateLocation({ latitude: 9.0227, longitude: 38.7469 });`,
      ''
    );
  }

  if (imports.length === 0) {
    body.push(`// Add features during init to get starter code for each one.`);
    body.push(`console.log('Gebeta Node.js SDK ready. Token:', TOKEN ? '✓' : '✗ missing');`);
  }

  return `${imports.join('\n')}${imports.length ? '\n\n' : ''}${body.join('\n')}`;
}

// ─── tsconfig for new Node projects ──────────────────────────────────────────

export function nodeTsConfigTemplate(): string {
  return (
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          esModuleInterop: true,
        },
        include: ['src'],
      },
      null,
      2
    ) + '\n'
  );
}

// ─── Package mappings ─────────────────────────────────────────────────────────

export const FRAMEWORK_PACKAGES: Record<Framework, string[]> = {
  react: ['@gebeta/react', '@gebeta/js'],
  next: ['@gebeta/react', '@gebeta/js'],
  vue: ['@gebeta/js', '@gebeta/core'],
  vanilla: ['@gebeta/js'],
  'react-native': ['@gebeta/react-native', '@gebeta/core', '@gebeta/api'],
  node: ['@gebeta/node', '@gebeta/core', '@gebeta/api'],
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: 'React',
  next: 'Next.js',
  vue: 'Vue',
  vanilla: 'Vanilla JS / TypeScript',
  'react-native': 'React Native',
  node: 'Node.js',
};

export const ALL_FEATURES: Array<{ value: Feature; label: string; hint: string }> = [
  { value: 'geocoding', label: 'Geocoding', hint: 'search & place lookup' },
  { value: 'directions', label: 'Directions', hint: 'routing between points' },
  { value: 'navigation', label: 'Navigation', hint: 'turn-by-turn guidance' },
  { value: 'clustering', label: 'Clustering', hint: 'group nearby markers' },
  { value: 'fencing', label: 'Fencing', hint: 'geo-fence zones' },
  { value: 'tracking', label: 'Tracking', hint: 'live driver location' },
];

export const NODE_FEATURES: Feature[] = ['geocoding', 'directions', 'tracking'];
