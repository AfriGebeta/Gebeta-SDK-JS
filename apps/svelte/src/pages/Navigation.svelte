<script lang="ts">
  // Navigation.svelte — real GPS turn-by-turn navigation using BrowserLocationProvider.
  //
  // Imports from: @gebeta/js/navigation (NavigationManager, BrowserLocationProvider via GebetaMaps.navigation getter)
  // Intentionally does NOT import GeocodingManager, DirectionsManager standalone, ClusteringManager, FenceManager.

  import { onDestroy } from 'svelte';
  import { BrowserLocationProvider } from '@gebeta/js/navigation';
  import Map from '../lib/Map.svelte';
  import { authParam } from '../lib/config';
  import '../lib/panel.css';
  import type { GebetaMaps } from '@gebeta/js';
  import type { Platform } from '../lib/Map.svelte';
  import type { API } from '@gebeta/api';

  const ORIGIN_ICON = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
  const DEST_ICON = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';

  let mode = $state<'origin' | 'destination' | null>(null);
  let originCoords = $state<{ lat: number; lng: number } | null>(null);
  let destCoords = $state<{ lat: number; lng: number } | null>(null);
  let routeReady = $state(false);
  let isNavigating = $state(false);
  let navStatus = $state<'inactive' | 'active' | 'warning'>('inactive');
  let remainingDistance = $state<number | undefined>(undefined);
  let remainingDuration = $state<number | undefined>(undefined);
  let instruction = $state<string | undefined>(undefined);
  let progress = $state<number | undefined>(undefined);
  let loadingRoute = $state(false);
  let ready = $state(false);

  let gebetaMapRef: GebetaMaps | null = null;
  let platformRef: Platform | null = null;
  let originMarker: API.Platform.Types.IMarker | null = null;
  let destMarker: API.Platform.Types.IMarker | null = null;
  let routeData: unknown = null;
  let locationProvider: InstanceType<typeof BrowserLocationProvider> | null = null;

  const canGetRoute = $derived(!!originCoords && !!destCoords && !loadingRoute && !isNavigating);
  const canStart = $derived(routeReady && !isNavigating);

  function addPinMarker(lng: number, lat: number, iconUrl: string): API.Platform.Types.IMarker | null {
    return platformRef!.markerFactory.createMarker({ imageUrl: iconUrl, size: [30, 30] })
      ?.setLngLat({ lng, lat })
      .addTo(platformRef!.mapAdapter) ?? null;
  }

  function handleReady(gm: GebetaMaps, _m: unknown, platform: Platform) {
    gebetaMapRef = gm;
    platformRef = platform;
    ready = true;

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

    setupNavigationEvents(gm);
  }

  function setupNavigationEvents(gm: GebetaMaps) {
    gm.navigation.on('start', () => {
      isNavigating = true;
      navStatus = 'active';
    });

    gm.navigation.on('stop', () => {
      isNavigating = false;
      navStatus = 'inactive';
      locationProvider?.stop();
      locationProvider = null;
    });

    gm.navigation.on('progress', (event: Record<string, unknown>) => {
      remainingDistance = event.remainingDistance as number | undefined;
      remainingDuration = event.remainingDuration as number | undefined;
      progress = event.progress as number | undefined;
      if (event.currentStep) {
        const step = event.currentStep as Record<string, unknown>;
        instruction = step.instruction as string | undefined;
      }
    });

    gm.navigation.on('stepchange', (event: Record<string, unknown>) => {
      if (event.currentStep) {
        const step = event.currentStep as Record<string, unknown>;
        instruction = step.instruction as string | undefined;
      }
    });

    gm.navigation.on('offroute', () => {
      navStatus = 'warning';
    });

    gm.navigation.on('arrive', () => {
      alert('You have arrived at your destination!');
      stopNavigation();
    });

    gm.navigation.on('error', (err: unknown) => {
      console.error('Navigation error:', err);
      alert('Navigation error: ' + String(err instanceof Error ? err.message : err));
    });
  }

  async function getRoute() {
    if (!gebetaMapRef || !originCoords || !destCoords) return;
    loadingRoute = true;
    try {
      const data = await gebetaMapRef.getDirections(originCoords, destCoords, {});
      routeData = data;
      gebetaMapRef.displayRoute(data, { showMarkers: false });
      routeReady = true;
    } catch (err: unknown) {
      alert('Route failed: ' + String(err instanceof Error ? err.message : err));
    } finally {
      loadingRoute = false;
    }
  }

  function startNavigation() {
    if (!gebetaMapRef?.navigation || !routeData) return;
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    locationProvider = BrowserLocationProvider.getInstance({ enableHighAccuracy: true });
    gebetaMapRef.navigation.start(
      routeData as Parameters<typeof gebetaMapRef.navigation.start>[0],
      { userId: `demo-user-${Date.now()}`, role: 'driver', precision: 'high' },
      locationProvider
    );
  }

  function stopNavigation() {
    gebetaMapRef?.navigation?.stop();
  }

  function clearAll() {
    if (isNavigating) stopNavigation();
    originMarker?.remove(); originMarker = null;
    destMarker?.remove(); destMarker = null;
    originCoords = null;
    destCoords = null;
    routeData = null;
    routeReady = false;
    gebetaMapRef?.clearRoute();
    remainingDistance = undefined;
    remainingDuration = undefined;
    instruction = undefined;
    progress = undefined;
  }

  onDestroy(() => {
    if (isNavigating) {
      try { gebetaMapRef?.navigation?.stop(); } catch { /* ignore */ }
    }
  });
</script>

<div class="page">
  <Map auth={authParam} center={[38.7685, 9.0161]} zoom={12} onready={handleReady}>
    {#snippet children()}
      <div class="control-panel">
        <h3>Navigation (GPS)</h3>
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          <button
            class={mode === 'origin' ? 'primary' : ''}
            style="flex: 1;"
            onclick={() => { mode = mode === 'origin' ? null : 'origin'; }}
            disabled={isNavigating}
          >Set Origin</button>
          <button
            class={mode === 'destination' ? 'primary' : ''}
            style="flex: 1;"
            onclick={() => { mode = mode === 'destination' ? null : 'destination'; }}
            disabled={isNavigating}
          >Set Destination</button>
        </div>
        <div class="coords-box">
          <div><strong>Origin:</strong> {originCoords ? `${originCoords.lat.toFixed(5)}, ${originCoords.lng.toFixed(5)}` : 'Not set'}</div>
          <div><strong>Destination:</strong> {destCoords ? `${destCoords.lat.toFixed(5)}, ${destCoords.lng.toFixed(5)}` : 'Not set'}</div>
        </div>
        <button class="primary" onclick={getRoute} disabled={!canGetRoute}>
          {loadingRoute ? 'Loading...' : 'Get Route'}
        </button>
        <button class="primary" onclick={startNavigation} disabled={!canStart}>Start Navigation</button>
        <button onclick={stopNavigation} disabled={!isNavigating}>Stop Navigation</button>
        <button onclick={clearAll} disabled={!ready}>Clear All</button>

        {#if isNavigating || navStatus !== 'inactive'}
          <div class="nav-info" class:active={navStatus === 'active'} class:warning={navStatus === 'warning'}>
            <div>
              <strong>Status:</strong>
              <span class="status-indicator" class:active={navStatus === 'active'} class:warning={navStatus === 'warning'}></span>
              {navStatus === 'active' ? 'Navigating' : navStatus === 'warning' ? 'Off route' : 'Inactive'}
            </div>
            {#if remainingDistance !== undefined}
              <div><strong>Remaining:</strong> {(remainingDistance / 1000).toFixed(2)} km</div>
            {/if}
            {#if remainingDuration !== undefined}
              <div><strong>ETA:</strong> {Math.round(remainingDuration / 60)} min</div>
            {/if}
            {#if instruction}
              <div><strong>Instruction:</strong> {instruction}</div>
            {/if}
            {#if progress !== undefined}
              <div><strong>Progress:</strong> {progress.toFixed(1)}%</div>
            {/if}
          </div>
        {/if}

        <p class="hint">
          1. Set origin and destination<br />
          2. Get route<br />
          3. Start navigation (requires location permission)<br />
          <strong>High Precision:</strong> Uses WebSocket for real-time tracking
        </p>
      </div>
    {/snippet}
  </Map>
</div>

<style>
  .page { width: 100%; height: 100%; position: relative; }
</style>
