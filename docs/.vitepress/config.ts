import { defineConfig } from 'vitepress';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

type SidebarItem = {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
};

// docsDir is the absolute path to the docs/ folder — used as the anchor for all link paths
function buildApiSidebar(dir: string, docsDir: string): SidebarItem[] {
  if (!existsSync(dir)) return [];

  const entries = readdirSync(dir).sort();
  const items: SidebarItem[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // TypeDoc wraps everything in a "namespaces" dir — skip it and inline its children
      if (entry === 'namespaces') {
        items.push(...buildApiSidebar(fullPath, docsDir));
        continue;
      }

      const indexPath = join(fullPath, 'index.md');
      const link = existsSync(indexPath)
        ? '/' + relative(docsDir, indexPath).replace(/\.md$/, '')
        : undefined;

      const children = buildApiSidebar(fullPath, docsDir);
      items.push({
        text: entry,
        link,
        collapsed: true,
        items: children.length > 0 ? children : undefined,
      });
    } else if (entry.endsWith('.md') && entry !== 'index.md' && entry !== 'README.md') {
      const linkPath = '/' + relative(docsDir, fullPath).replace(/\.md$/, '');
      items.push({ text: entry.replace(/\.md$/, ''), link: linkPath });
    }
  }

  return items;
}

const docsDir = join(__dirname, '..');
const apiDir = join(docsDir, 'reference/api');

export default defineConfig({
  title: 'Gebeta Maps SDK',
  description: 'JavaScript, React, and Node.js SDK for Gebeta Maps',
  base: '/Gebeta-SDK-JS/',

  vite: {
    ssr: {
      noExternal: [],
      external: ['@gebeta/js', '@gebeta/react', '@gebeta/node', '@gebeta/api', '@gebeta/core'],
    },
  },

  head: [['link', { rel: 'icon', href: '/Gebeta-SDK-JS/favicon.ico' }]],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Reference', link: '/reference/gebeta-maps' },
      {
        text: 'Changelog',
        link: 'https://github.com/AfriGebeta/Gebeta-SDK-JS/blob/main/CHANGELOG.md',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Authentication', link: '/guide/authentication' },
          ],
        },
        {
          text: 'Features',
          items: [
            { text: 'Map Setup', link: '/guide/map-setup' },
            { text: 'Geocoding', link: '/guide/geocoding' },
            { text: 'Directions', link: '/guide/directions' },
            { text: 'Clustering', link: '/guide/clustering' },
            { text: 'Fencing', link: '/guide/fencing' },
            { text: 'Navigation', link: '/guide/navigation' },
          ],
        },
        {
          text: 'Server-Side',
          items: [
            { text: 'Node.js Auth', link: '/guide/node-auth' },
            { text: 'Server-Side Geocoding', link: '/guide/node-geocoding' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Tree Shaking', link: '/guide/tree-shaking' },
            { text: 'React Integration', link: '/guide/react' },
            { text: 'Migration Guide', link: '/guide/migration' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Overview',
          items: [
            { text: 'GebetaMaps', link: '/reference/gebeta-maps' },
            { text: 'GebetaMap (React)', link: '/reference/gebeta-map-component' },
            { text: 'GebetaAuth (Node)', link: '/reference/gebeta-auth' },
          ],
        },
        {
          text: 'Managers',
          items: [
            { text: 'GeocodingManager', link: '/reference/geocoding-manager' },
            { text: 'DirectionsManager', link: '/reference/directions-manager' },
            { text: 'ClusteringManager', link: '/reference/clustering-manager' },
            { text: 'FenceManager', link: '/reference/fence-manager' },
            { text: 'NavigationManager', link: '/reference/navigation-manager' },
            { text: 'useClustering', link: '/reference/use-clustering' },
          ],
        },
        {
          text: 'Auto-generated API',
          collapsed: true,
          items: [
            {
              text: '@gebeta/api',
              link: '/reference/api/@gebeta/api/',
              collapsed: true,
              items: buildApiSidebar(join(apiDir, '@gebeta/api'), docsDir),
            },
            {
              text: '@gebeta/js',
              link: '/reference/api/@gebeta/js/',
              collapsed: true,
              items: buildApiSidebar(join(apiDir, '@gebeta/js'), docsDir),
            },
            {
              text: '@gebeta/react',
              link: '/reference/api/@gebeta/react/',
              collapsed: true,
              items: buildApiSidebar(join(apiDir, '@gebeta/react'), docsDir),
            },
            {
              text: '@gebeta/node',
              link: '/reference/api/@gebeta/node/',
              collapsed: true,
              items: buildApiSidebar(join(apiDir, '@gebeta/node'), docsDir),
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/AfriGebeta/Gebeta-SDK-JS' }],

    footer: {
      copyright: 'Copyright © 2024 Gebeta Maps',
    },

    search: {
      provider: 'local',
    },
  },
});
