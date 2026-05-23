<script lang="ts">
  // Home.svelte — landing page with links to all examples.
  // No SDK imports — this is a pure navigation page.

  const examples = [
    {
      route: '/geocoding',
      title: 'Geocoding',
      import: "import { GeocodingManager } from '@gebeta/js/geocoding'",
      description:
        'Forward and reverse geocoding. Search by place name or look up an address from coordinates.',
    },
    {
      route: '/directions',
      title: 'Directions',
      import: "import { DirectionsManager } from '@gebeta/js/directions'",
      description:
        'Click the map to set origin and destination, then get and display a route.',
    },
    {
      route: '/clustering',
      title: 'Marker Clustering',
      import: "import { ClusteringManager } from '@gebeta/js/clustering'",
      description:
        'Add random markers and see them cluster. Controls for radius and max zoom.',
    },
    {
      route: '/fencing',
      title: 'Fencing',
      import: "import { FenceManager } from '@gebeta/js/fencing'",
      description:
        'Draw geofences by clicking on the map. Close the fence to complete a polygon.',
    },
    {
      route: '/fence-styling',
      title: 'Fence Styling',
      import: "import { FenceManager } from '@gebeta/js/fencing'",
      description:
        'Draw fences with live color, opacity, and border controls.',
    },
    {
      route: '/navigation',
      title: 'Navigation (GPS)',
      import: "import { NavigationManager, BrowserLocationProvider } from '@gebeta/js/navigation'",
      description:
        'Turn-by-turn navigation using real device GPS. Requires location permission.',
    },
    {
      route: '/navigation-simulation',
      title: 'Navigation Simulation',
      import: "import { NavigationManager } from '@gebeta/js/navigation'",
      description:
        'Simulated navigation with configurable speed. No GPS required — great for testing.',
    },
  ];
</script>

<div class="home">
  <div class="container">
    <h1>Gebeta Maps SDK</h1>
    <p class="subtitle">
      Svelte 5 examples using <code>@gebeta/js</code>. Each card shows the subpath import
      for standalone use (without the full map). In these demos, managers are accessed
      via <code>GebetaMaps</code> after <code>onready</code>.
    </p>

    <div class="grid">
      {#each examples as ex}
        <a href={`#${ex.route}`} class="card">
          <h3>{ex.title}</h3>
          <code class="import-tag">{ex.import}</code>
          <p>{ex.description}</p>
        </a>
      {/each}
    </div>

    <div class="note">
      <strong>Auth setup:</strong> Create a <code>.env</code> file in
      <code>apps/svelte/</code> with your credentials:
      <pre>VITE_GEBETA_ACCESS_TOKEN=your_access_token
VITE_GEBETA_REFRESH_TOKEN=your_refresh_token
# or legacy:
# VITE_GEBETA_API_KEY=your_api_key</pre>
      Build the SDK first with <code>yarn build</code> from the repo root, then run
      <code>yarn workspace svelte-example dev</code>.
    </div>
  </div>
</div>

<style>
  .home {
    width: 100%;
    min-height: 100%;
    background: #f8f9fa;
    overflow-y: auto;
    padding: 20px;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: #333;
    text-align: center;
    margin: 0 0 10px 0;
    font-size: 28px;
  }

  .subtitle {
    text-align: center;
    color: #666;
    margin: 0 0 30px 0;
    font-size: 15px;
  }

  .subtitle code {
    background: #f0f4f8;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: #007cbf;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
    margin-bottom: 30px;
  }

  .card {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 18px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-color: #007cbf;
  }

  .card h3 {
    margin: 0;
    color: #007cbf;
    font-size: 16px;
  }

  .import-tag {
    font-size: 11px;
    background: #f0f4f8;
    color: #555;
    padding: 4px 6px;
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .card p {
    margin: 0;
    color: #666;
    font-size: 13px;
    line-height: 1.5;
  }

  .note {
    background: #fff3cd;
    border-radius: 8px;
    border-left: 4px solid #ffc107;
    padding: 16px 20px;
    font-size: 13px;
    color: #333;
    line-height: 1.6;
  }

  .note code {
    background: #eee;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
  }

  .note pre {
    background: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    overflow-x: auto;
    margin: 8px 0;
  }
</style>
