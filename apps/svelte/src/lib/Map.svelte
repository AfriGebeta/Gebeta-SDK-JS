<script lang="ts">
  // Map.svelte — reusable map container that initializes GebetaMaps and exposes
  // the map instance and platform via Svelte context.
  //
  // Imports: @gebeta/js (GebetaMaps orchestrator)
  // Does NOT import subpath managers — pages do that individually.

  import { setContext } from 'svelte';
  import { GebetaMaps } from '@gebeta/js';
  import type { Map as MapLibreMap } from 'maplibre-gl';
  import type { AuthOptions } from './config';
  import 'maplibre-gl/dist/maplibre-gl.css';

  export type Platform = ReturnType<GebetaMaps['getPlatform']>;

  interface ClusteringOptions {
    enabled?: boolean;
    radius?: number;
    maxZoom?: number;
    showClusterCount?: boolean;
  }

  interface Props {
    auth: AuthOptions;
    center?: [number, number];
    zoom?: number;
    clustering?: ClusteringOptions;
    onready?: (gebetaMap: GebetaMaps, map: MapLibreMap, platform: Platform) => void;
    children?: import('svelte').Snippet;
  }

  let {
    auth,
    center = [38.7685, 9.0161],
    zoom = 12,
    clustering,
    onready,
    children,
  }: Props = $props();

  let mapContainer: HTMLDivElement | undefined = $state();
  let gebetaMapInstance: GebetaMaps | null = $state(null);
  let mapInstance: MapLibreMap | null = $state(null);

  // Expose gebetaMap and map via context so page components can access them.
  setContext('gebeta', {
    get gebetaMap() { return gebetaMapInstance; },
    get map() { return mapInstance; },
  });

  $effect(() => {
    if (!mapContainer) return;

    const constructorOptions = {
      ...auth,
      ...(clustering ? { clustering } : {}),
    };

    const gm = new GebetaMaps(constructorOptions);
    const m = gm.init({
      container: mapContainer,
      center,
      zoom,
      navigationControl: true,
    });

    gebetaMapInstance = gm;
    mapInstance = m;

    function handleStyleLoad() {
      if (onready) onready(gm, m, gm.getPlatform());
    }

    if (m.isStyleLoaded()) {
      handleStyleLoad();
    } else {
      m.once('style.load', handleStyleLoad);
    }

    return () => {
      m.remove();
      gebetaMapInstance = null;
      mapInstance = null;
    };
  });
</script>

<div class="map-wrapper">
  <div bind:this={mapContainer} class="map-div"></div>
  {#if gebetaMapInstance && mapInstance}
    {@render children?.()}
  {/if}
</div>

<style>
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .map-div {
    position: absolute;
    inset: 0;
  }
</style>
