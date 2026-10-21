import {
  envTemplate,
  envExampleTemplate,
  reactAppTemplate,
  nextPageTemplate,
  vanillaMainTemplate,
  vanillaHtmlTemplate,
  vueAppTemplate,
  reactNativeAppTemplate,
  nodeIndexTemplate,
  FRAMEWORK_PACKAGES,
  type TemplateConfig,
} from './templates.js';

function cfg(overrides: Partial<TemplateConfig> = {}): TemplateConfig {
  return {
    framework: 'react',
    typescript: true,
    features: [],
    projectName: 'my-app',
    ...overrides,
  };
}

// ─── Env ──────────────────────────────────────────────────────────────────────

describe('envTemplate', () => {
  it('uses VITE_ prefix for react', () => {
    expect(envTemplate(cfg())).toContain('VITE_GEBETA_TOKEN=\n');
  });

  it('uses NEXT_PUBLIC_ prefix for next', () => {
    expect(envTemplate(cfg({ framework: 'next' }))).toContain('NEXT_PUBLIC_GEBETA_TOKEN=\n');
  });

  it('uses plain GEBETA_TOKEN for node and react-native', () => {
    expect(envTemplate(cfg({ framework: 'node' }))).toMatch(/^GEBETA_TOKEN=$/m);
    expect(envTemplate(cfg({ framework: 'react-native' }))).toMatch(/^GEBETA_TOKEN=$/m);
  });

  it('example template has a placeholder token', () => {
    expect(envExampleTemplate(cfg())).toContain('VITE_GEBETA_TOKEN=your_token_here');
  });
});

// ─── React ────────────────────────────────────────────────────────────────────

describe('reactAppTemplate', () => {
  it('imports GebetaMap from @gebeta/react', () => {
    expect(reactAppTemplate(cfg())).toContain("from '@gebeta/react'");
  });

  it('geocodes on load when geocoding feature is selected', () => {
    expect(reactAppTemplate(cfg({ features: ['geocoding'] }))).toContain(
      'geocodingManager.geocode'
    );
  });

  it('does NOT geocode when feature is absent', () => {
    expect(reactAppTemplate(cfg({ features: [] }))).not.toContain('geocodingManager');
  });

  it('imports the CSS file', () => {
    expect(reactAppTemplate(cfg())).toContain("'@gebeta/js/style.css'");
  });
});

// ─── Next.js ──────────────────────────────────────────────────────────────────

describe('nextPageTemplate', () => {
  it('has use client directive', () => {
    expect(nextPageTemplate(cfg({ framework: 'next' }))).toContain("'use client'");
  });

  it('uses NEXT_PUBLIC_ env var', () => {
    expect(nextPageTemplate(cfg({ framework: 'next' }))).toContain('NEXT_PUBLIC_GEBETA_TOKEN');
  });
});

// ─── Vanilla ──────────────────────────────────────────────────────────────────

describe('vanillaMainTemplate', () => {
  it('imports GebetaMaps from @gebeta/js', () => {
    expect(vanillaMainTemplate(cfg({ framework: 'vanilla' }))).toContain("from '@gebeta/js'");
  });

  it('uses VITE_ env var', () => {
    expect(vanillaMainTemplate(cfg({ framework: 'vanilla' }))).toContain('VITE_GEBETA_TOKEN');
  });
});

describe('vanillaHtmlTemplate', () => {
  it('references the right script extension for TS', () => {
    expect(vanillaHtmlTemplate(cfg({ framework: 'vanilla', typescript: true }))).toContain(
      'main.ts'
    );
  });

  it('references .js for non-TS', () => {
    expect(vanillaHtmlTemplate(cfg({ framework: 'vanilla', typescript: false }))).toContain(
      'main.js'
    );
  });

  it('has a #map div', () => {
    expect(vanillaHtmlTemplate(cfg({ framework: 'vanilla' }))).toContain('id="map"');
  });
});

// ─── Vue ──────────────────────────────────────────────────────────────────────

describe('vueAppTemplate', () => {
  it('adds lang="ts" for TypeScript', () => {
    expect(vueAppTemplate(cfg({ framework: 'vue', typescript: true }))).toContain('lang="ts"');
  });

  it('omits lang="ts" for JavaScript', () => {
    expect(vueAppTemplate(cfg({ framework: 'vue', typescript: false }))).not.toContain('lang="ts"');
  });

  it('imports GebetaMaps from @gebeta/js', () => {
    expect(vueAppTemplate(cfg({ framework: 'vue' }))).toContain("from '@gebeta/js'");
  });
});

// ─── React Native ─────────────────────────────────────────────────────────────

describe('reactNativeAppTemplate', () => {
  it('imports GebetaMap (not GebetaMaps) from @gebeta/react-native', () => {
    const out = reactNativeAppTemplate(cfg({ framework: 'react-native' }));
    expect(out).toContain("GebetaMap } from '@gebeta/react-native'");
    expect(out).not.toContain('GebetaMaps');
  });

  it('uses process.env.GEBETA_TOKEN', () => {
    expect(reactNativeAppTemplate(cfg({ framework: 'react-native' }))).toContain(
      'process.env.GEBETA_TOKEN'
    );
  });
});

// ─── Node ─────────────────────────────────────────────────────────────────────

describe('nodeIndexTemplate', () => {
  it('includes geocoding code when feature selected', () => {
    const out = nodeIndexTemplate(cfg({ framework: 'node', features: ['geocoding'] }));
    expect(out).toContain('GeocodingManager');
    expect(out).toContain('geocoding.geocode');
  });

  it('includes directions code when feature selected', () => {
    const out = nodeIndexTemplate(cfg({ framework: 'node', features: ['directions'] }));
    expect(out).toContain('DirectionsManager');
    expect(out).toContain('directions.getDirections');
  });

  it('includes tracking code when feature selected', () => {
    const out = nodeIndexTemplate(cfg({ framework: 'node', features: ['tracking'] }));
    expect(out).toContain('HttpTrackingManager');
  });

  it('falls back to a helpful comment when no features selected', () => {
    const out = nodeIndexTemplate(cfg({ framework: 'node', features: [] }));
    expect(out).toContain('Token:');
  });
});

// ─── Package mappings ─────────────────────────────────────────────────────────

describe('FRAMEWORK_PACKAGES', () => {
  it('react includes @gebeta/react and @gebeta/js', () => {
    expect(FRAMEWORK_PACKAGES.react).toEqual(
      expect.arrayContaining(['@gebeta/react', '@gebeta/js'])
    );
  });

  it('react-native includes @gebeta/react-native', () => {
    expect(FRAMEWORK_PACKAGES['react-native']).toContain('@gebeta/react-native');
  });

  it('node includes @gebeta/node', () => {
    expect(FRAMEWORK_PACKAGES.node).toContain('@gebeta/node');
  });

  it('all frameworks have at least one package', () => {
    for (const pkgs of Object.values(FRAMEWORK_PACKAGES)) {
      expect(pkgs.length).toBeGreaterThan(0);
    }
  });
});
