<script lang="ts">
  // Directions.svelte — click map to set origin/destination, then display route.
  //
  // Imports from: @gebeta/js (GebetaMaps via Map.svelte context)
  // The DirectionsManager is accessed via gebetaMap.getDirections() / displayRoute() after init.
  // Intentionally does NOT import GeocodingManager, ClusteringManager, FenceManager, NavigationManager.

  import Map, { type Platform } from '../lib/Map.svelte';
  import { authParam } from '../lib/config';
  import '../lib/panel.css';
  import type { GebetaMaps } from '@gebeta/js';
  import type { API } from '@gebeta/api';

  const ORIGIN_ICON = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
  const DEST_ICON = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';

  let mode = $state<'origin' | 'destination' | null>(null);
  let originCoords = $state<{ lat: number; lng: number } | null>(null);
  let destCoords = $state<{ lat: number; lng: number } | null>(null);
  let routeDistance = $state<string | number | null | undefined>(null);
  let routeDuration = $state<string | number | null | undefined>(null);
  let showRoute = $state(false);
  let loading = $state(false);

  let gebetaMapRef: GebetaMaps | null = null;
  let platformRef: Platform | null = null;
  let originMarker: ReturnType<Platform['markerFactory']['createMarker']> = null;
  let destMarker: ReturnType<Platform['markerFactory']['createMarker']> = null;

  const canGetDirections = $derived(!!originCoords && !!destCoords && !loading);

  function addPinMarker(lng: number, lat: number, iconUrl: string) {
    return platformRef!.markerFactory.createMarker({ imageUrl: iconUrl, size: [30, 30] })
      ?.setLngLat({ lng, lat })
      .addTo(platformRef!.mapAdapter);
  }

  function handleReady(gm: GebetaMaps, _m: unknown, platform: Platform) {
    gebetaMapRef = gm;
    platformRef = platform;

    platform.mapAdapter.on('click', (...args: unknown[]) => {
      const e = args[0] as { lngLat: API.Common.Types.LngLat };
      const { lat, lng } = e.lngLat;
      if (mode === 'origin') {
        originMarker?.remove();
        originMarker = addPinMarker(lng, lat, ORIGIN_ICON);
        originCoords = { lat, lng };
        mode = null;
      } else if (mode === 'destination') {
        destMarker?.remove();
        destMarker = addPinMarker(lng, lat, DEST_ICON);
        destCoords = { lat, lng };
        mode = null;
      }
    });
  }

  async function getDirections() {
    if (!gebetaMapRef || !originCoords || !destCoords) return;
    loading = true;
    try {
      const routeData = await gebetaMapRef.getDirections(originCoords, destCoords, {});
      gebetaMapRef.displayRoute(routeData, { showMarkers: false });
      routeDistance = routeData.distance;
      routeDuration = routeData.duration;
      showRoute = true;
    } catch (err: unknown) {
      alert('Directions failed: ' + String(err instanceof Error ? err.message : err));
    } finally {
      loading = false;
    }
  }

  function clearRoute() {
    gebetaMapRef?.clearRoute();
    showRoute = false;
    routeDistance = null;
    routeDuration = null;
  }

  function clearMarkers() {
    originMarker?.remove(); originMarker = null;
    destMarker?.remove(); destMarker = null;
    originCoords = null;
    destCoords = null;
    clearRoute();
  }
</script>

<div class="page">
  <Map auth={authParam} center={[38.7685, 9.0161]} zoom={12} onready={handleReady}>
    {#snippet children()}
      <div class="control-panel">
        <h3>Directions</h3>
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          <button
            class={mode === 'origin' ? 'primary' : ''}
            style="flex: 1;"
            onclick={() => { mode = mode === 'origin' ? null : 'origin'; }}
          >Set Origin</button>
          <button
            class={mode === 'destination' ? 'primary' : ''}
            style="flex: 1;"
            onclick={() => { mode = mode === 'destination' ? null : 'destination'; }}
          >Set Destination</button>
        </div>
        <div class="coords-box">
          <div><strong>Origin:</strong> {originCoords ? `${originCoords.lat.toFixed(5)}, ${originCoords.lng.toFixed(5)}` : 'Not set'}</div>
          <div><strong>Destination:</strong> {destCoords ? `${destCoords.lat.toFixed(5)}, ${destCoords.lng.toFixed(5)}` : 'Not set'}</div>
        </div>
        <button class="primary" onclick={getDirections} disabled={!canGetDirections}>
          {loading ? 'Loading...' : 'Get Directions'}
        </button>
        <button onclick={clearRoute}>Clear Route</button>
        <button onclick={clearMarkers}>Clear Points</button>
        {#if showRoute}
          <div class="route-info">
            <strong>Route</strong>
            {#if routeDistance}<p>Distance: {routeDistance}</p>{/if}
            {#if routeDuration}<p>Duration: {routeDuration}</p>{/if}
          </div>
        {/if}
        <p class="hint">
          Click "Set Origin", then click the map.<br />
          Then "Set Destination" and click the map.<br />
          Use "Get Directions" to show the route.
        </p>
      </div>
    {/snippet}
  </Map>
</div>

<style>
  .page { width: 100%; height: 100%; position: relative; }
</style>
