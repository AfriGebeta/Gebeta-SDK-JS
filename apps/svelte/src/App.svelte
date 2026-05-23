<script lang="ts">
  // App.svelte — root component with hash-based client-side routing.
  // No external router library needed — pure $derived on window.location.hash.

  import { onMount } from 'svelte';
  import Home from './pages/Home.svelte';
  import Geocoding from './pages/Geocoding.svelte';
  import Directions from './pages/Directions.svelte';
  import Clustering from './pages/Clustering.svelte';
  import Fencing from './pages/Fencing.svelte';
  import FenceStyling from './pages/FenceStyling.svelte';
  import Navigation from './pages/Navigation.svelte';
  import NavigationSimulation from './pages/NavigationSimulation.svelte';

  let hash = $state(window.location.hash);

  onMount(() => {
    function onHashChange() {
      hash = window.location.hash;
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  });

  const route = $derived(hash.replace(/^#/, '') || '/');

  const pageMap: Record<string, typeof Home> = {
    '/': Home,
    '/geocoding': Geocoding,
    '/directions': Directions,
    '/clustering': Clustering,
    '/fencing': Fencing,
    '/fence-styling': FenceStyling,
    '/navigation': Navigation,
    '/navigation-simulation': NavigationSimulation,
  };

  const CurrentPage = $derived(pageMap[route] ?? Home);
</script>

<div class="app">
  {#if route !== '/'}
    <a href="#/" class="back-link">← Back to examples</a>
  {/if}
  <CurrentPage />
</div>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  :global(#app) {
    width: 100%;
    height: 100%;
  }

  .app {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .back-link {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 2000;
    background: white;
    color: #007cbf;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: 1px solid #e9ecef;
  }

  .back-link:hover {
    background: #f0f8ff;
    border-color: #007cbf;
  }
</style>
