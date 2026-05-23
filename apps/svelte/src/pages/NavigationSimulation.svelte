<script lang="ts">
  // NavigationSimulation.svelte — simulated navigation with configurable speed.
  //
  // Imports from: @gebeta/js/navigation (NavigationManager via GebetaMaps.navigation getter)
  // Uses a custom SimulatedLocationProvider (walks route coordinates at configurable speed).
  // Intentionally does NOT import GeocodingManager, DirectionsManager standalone, ClusteringManager, FenceManager, BrowserLocationProvider.

  import { onDestroy } from 'svelte';
  import Map from '../lib/Map.svelte';
  import { authParam } from '../lib/config';
  import '../lib/panel.css';
  import type { GebetaMaps } from '@gebeta/js';
  import type { Platform } from '../lib/Map.svelte';
  import type { API } from '@gebeta/api';

  // ---------------------------------------------------------------------------
  // SimulatedLocationProvider — walks along route coordinates at a given speed.
  // Implements the ILocationProvider interface expected by NavigationManager.start().
  // ---------------------------------------------------------------------------

  interface LocationPosition {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: number;
    heading?: number;
  }

  type LocationCallback = (pos: LocationPosition) => void;

  interface SimulatedLocationProvider {
    start: (callback: LocationCallback) => void;
    stop: () => void;
  }

  function calculateBearing(from: [number, number], to: [number, number]): number {
    const lat1 = (from[1] * Math.PI) / 180;
    const lat2 = (to[1] * Math.PI) / 180;
    const dLng = ((to[0] - from[0]) * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }

  function createSimulatedLocationProvider(
    routeCoordinates: [number, number][],
    getSpeed: () => number
  ): SimulatedLocationProvider {
    let intervalId: ReturnType<typeof setTimeout> | null = null;
    let segmentIndex = 0;
    let currentPos: [number, number] = [routeCoordinates[0][0], routeCoordinates[0][1]];
    let running = false;

    return {
      start(callback: LocationCallback) {
        if (!routeCoordinates.length) return;
        segmentIndex = 0;
        currentPos = [routeCoordinates[0][0], routeCoordinates[0][1]];
        running = true;

        function step() {
          if (!running || segmentIndex >= routeCoordinates.length - 1) {
            // Emit final position
            const last = routeCoordinates[routeCoordinates.length - 1];
            callback({ lat: last[1], lng: last[0], accuracy: 10, timestamp: Date.now(), heading: 0 });
            return;
          }

          const speed = getSpeed();
          const segEnd = routeCoordinates[segmentIndex + 1];
          const dx = segEnd[0] - currentPos[0];
          const dy = segEnd[1] - currentPos[1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          const stepSize = 0.0001 * speed;

          if (dist === 0) {
            segmentIndex++;
            intervalId = setTimeout(step, 100 / speed);
            return;
          }

          if (dist <= stepSize) {
            currentPos = [segEnd[0], segEnd[1]];
            segmentIndex++;
          } else {
            const ratio = stepSize / dist;
            currentPos = [
              currentPos[0] + dx * ratio,
              currentPos[1] + dy * ratio,
            ];
          }

          const nextPoint =
            segmentIndex < routeCoordinates.length - 1
              ? routeCoordinates[segmentIndex + 1]
              : routeCoordinates[routeCoordinates.length - 1];

          const heading = calculateBearing(currentPos, nextPoint);

          callback({
            lat: currentPos[1],
            lng: currentPos[0],
            accuracy: 10,
            timestamp: Date.now(),
            heading,
          });

          if (running && segmentIndex < routeCoordinates.length - 1) {
            intervalId = setTimeout(step, 100 / speed);
          }
        }

        step();
      },
      stop() {
        running = false;
        if (intervalId !== null) {
          clearTimeout(intervalId);
          intervalId = null;
        }
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Component state
  // ---------------------------------------------------------------------------

  const ORIGIN_ICON = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
  const DEST_ICON = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';

  const instructionIcons: Record<number, string> = {
    1: '→', 2: '↗', 3: '→', 4: '↘', 5: '↓',
    6: '↙', 7: '←', 8: '↖', 9: '↑', 14: '↺', 15: '↻',
  };

  let mode = $state<'origin' | 'destination' | null>(null);
  let originCoords = $state<{ lat: number; lng: number } | null>(null);
  let destCoords = $state<{ lat: number; lng: number } | null>(null);
  let routeReady = $state(false);
  let isNavigating = $state(false);
  let navStatus = $state<'inactive' | 'active' | 'warning'>('inactive');
  let simulationSpeed = $state(1);
  let remainingDistance = $state<number | undefined>(undefined);
  let remainingDuration = $state<number | undefined>(undefined);
  let progress = $state<number | undefined>(undefined);
  let instructionIcon = $state('→');
  let instructionText = $state('Continue straight');
  let instructionDistance = $state('');
  let showInstruction = $state(false);
  let loadingRoute = $state(false);
  let ready = $state(false);

  let gebetaMapRef: GebetaMaps | null = null;
  let platformRef: Platform | null = null;
  let originMarker: API.Platform.Types.IMarker | null = null;
  let destMarker: API.Platform.Types.IMarker | null = null;
  let routeData: Record<string, unknown> | null = null;
  let fullRouteCoords: [number, number][] | null = null;
  let simProvider: SimulatedLocationProvider | null = null;

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

    gm.navigation.on('start', () => {
      isNavigating = true;
      navStatus = 'active';
      showInstruction = true;
    });

    gm.navigation.on('stop', () => {
      isNavigating = false;
      navStatus = 'inactive';
      showInstruction = false;
      simProvider?.stop();
      simProvider = null;
    });

    gm.navigation.on('progress', (event: Record<string, unknown>) => {
      remainingDistance = event.remainingDistance as number | undefined;
      remainingDuration = event.remainingDuration as number | undefined;
      progress = event.progress as number | undefined;
      updateInstructionFromEvent(event);
      updateRouteProgress(event);
    });

    gm.navigation.on('stepchange', (event: Record<string, unknown>) => {
      updateInstructionFromEvent(event);
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

  function updateInstructionFromEvent(event: Record<string, unknown>) {
    const step = event.currentStep as Record<string, unknown> | undefined;
    if (step && step.type !== 4) {
      const type = step.type as number;
      instructionIcon = instructionIcons[type] ?? '→';
      instructionText = (step.instruction as string) || 'Continue straight';
    } else if (step && step.type === 4) {
      instructionIcon = '✓';
      instructionText = 'You have arrived at your destination';
    } else {
      instructionIcon = '→';
      instructionText = 'Continue straight';
    }

    const dist = event.remainingDistance as number | undefined;
    if (dist !== undefined && !(step && (step.type as number) === 4)) {
      instructionDistance = dist < 1000 ? `${Math.round(dist)} m` : `${(dist / 1000).toFixed(1)} km`;
    } else {
      instructionDistance = '';
    }
  }

  function updateRouteProgress(event: Record<string, unknown>) {
    if (!gebetaMapRef || !routeData || !fullRouteCoords) return;
    const pct = event.progress as number | undefined;
    if (pct === undefined || pct >= 100) {
      gebetaMapRef.clearRoute();
      return;
    }
    const total = fullRouteCoords.length;
    if (total === 0) return;
    let idx = Math.floor((Math.max(0, Math.min(99, pct)) / 100) * total);
    if (idx >= total - 1) idx = Math.max(0, total - 2);
    const remaining = fullRouteCoords.slice(idx);
    if (remaining.length > 1) {
      gebetaMapRef.displayRoute(
        {
          ...routeData,
          geometry: { ...(routeData.geometry as object), coordinates: remaining },
        } as Parameters<typeof gebetaMapRef.displayRoute>[0],
        { showMarkers: false }
      );
    }
  }

  async function getRoute() {
    if (!gebetaMapRef || !originCoords || !destCoords) return;
    loadingRoute = true;
    try {
      const data = await gebetaMapRef.getDirections(originCoords, destCoords, {});
      routeData = data as unknown as Record<string, unknown>;
      const geom = (data as Record<string, unknown>).geometry as { coordinates?: [number, number][] } | undefined;
      fullRouteCoords = geom?.coordinates ?? null;
      gebetaMapRef.displayRoute(data, { showMarkers: false });
      routeReady = true;
    } catch (err: unknown) {
      alert('Route failed: ' + String(err instanceof Error ? err.message : err));
    } finally {
      loadingRoute = false;
    }
  }

  function startNavigation() {
    if (!gebetaMapRef?.navigation || !routeData || !fullRouteCoords) return;
    simProvider = createSimulatedLocationProvider(fullRouteCoords, () => simulationSpeed);
    gebetaMapRef.navigation.start(
      routeData as Parameters<typeof gebetaMapRef.navigation.start>[0],
      { userId: `demo-user-sim-${Date.now()}`, role: 'driver', precision: 'high' },
      simProvider
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
    fullRouteCoords = null;
    routeReady = false;
    gebetaMapRef?.clearRoute();
    remainingDistance = undefined;
    remainingDuration = undefined;
    progress = undefined;
    showInstruction = false;
  }

  onDestroy(() => {
    try { if (isNavigating) gebetaMapRef?.navigation?.stop(); } catch { /* ignore */ }
  });
</script>

<div class="page">
  <Map auth={authParam} center={[38.7685, 9.0161]} zoom={12} onready={handleReady}>
    {#snippet children()}
      <!-- Control panel -->
      <div class="control-panel">
        <h3>Navigation Simulation</h3>
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
        <button class="primary" onclick={startNavigation} disabled={!canStart}>Start Simulation</button>
        <button onclick={stopNavigation} disabled={!isNavigating}>Stop Simulation</button>

        <div class="speed-control">
          <label for="speed">Simulation Speed: {simulationSpeed}x</label>
          <input
            id="speed"
            type="range"
            min="0.5" max="5" step="0.5"
            bind:value={simulationSpeed}
          />
          <div class="speed-display">{simulationSpeed}x</div>
        </div>

        <button onclick={clearAll} disabled={!ready}>Clear All</button>

        {#if isNavigating || navStatus !== 'inactive'}
          <div class="nav-info" class:active={navStatus === 'active'} class:warning={navStatus === 'warning'}>
            <div>
              <strong>Status:</strong>
              <span class="status-indicator" class:active={navStatus === 'active'} class:warning={navStatus === 'warning'}></span>
              {navStatus === 'active' ? 'Simulating' : navStatus === 'warning' ? 'Off route' : 'Inactive'}
            </div>
            {#if remainingDistance !== undefined}
              <div><strong>Remaining:</strong> {(remainingDistance / 1000).toFixed(2)} km</div>
            {/if}
            {#if remainingDuration !== undefined}
              <div><strong>ETA:</strong> {Math.round(remainingDuration / 60)} min</div>
            {/if}
            {#if progress !== undefined}
              <div><strong>Progress:</strong> {progress.toFixed(1)}%</div>
            {/if}
          </div>
        {/if}

        <p class="hint">Simulated navigation with speed control. No GPS required!</p>
      </div>

      <!-- Instruction overlay (bottom center) -->
      {#if showInstruction}
        <div class="nav-instruction">
          <div class="instruction-icon">{instructionIcon}</div>
          <div class="instruction-text">{instructionText}</div>
          {#if instructionDistance}
            <div class="instruction-distance">{instructionDistance}</div>
          {/if}
        </div>
      {/if}
    {/snippet}
  </Map>
</div>

<style>
  .page { width: 100%; height: 100%; position: relative; }

  .nav-instruction {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    min-width: 200px;
    text-align: center;
  }

  .instruction-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .instruction-text {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }

  .instruction-distance {
    font-size: 14px;
    color: #666;
  }
</style>
