<script lang="ts">
  // Fencing.svelte — draw geofences by clicking on the map.
  //
  // Imports from: @gebeta/js/fencing (FenceManager via GebetaMaps.fencing getter)
  // Intentionally does NOT import GeocodingManager, DirectionsManager, ClusteringManager, NavigationManager.

  import Map from '../lib/Map.svelte';
  import { authParam } from '../lib/config';
  import '../lib/panel.css';
  import type { GebetaMaps } from '@gebeta/js';

  let isDrawing = $state(false);
  let pointCount = $state(0);
  let fenceCount = $state(0);
  let ready = $state(false);

  let gebetaMapRef: GebetaMaps | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function handleReady(gm: GebetaMaps) {
    gebetaMapRef = gm;
    ready = true;

    gm.fencing.on('fenceCompleted', () => {
      updateUI();
    });

    // Poll for drawing state and point count (FenceManager events may not cover all changes).
    intervalId = setInterval(updateUI, 400);
    updateUI();
  }

  function updateUI() {
    if (!gebetaMapRef) return;
    try {
      const fencing = gebetaMapRef.fencing;
      isDrawing = fencing.isDrawingFence();
      pointCount = fencing.getCurrentFencePoints().length;
      fenceCount = fencing.getFences().length;
    } catch {
      // fencing not ready yet
    }
  }

  function startDrawing() {
    if (!gebetaMapRef) return;
    gebetaMapRef.fencing.startDrawing();
    updateUI();
  }

  function stopDrawing() {
    if (!gebetaMapRef) return;
    gebetaMapRef.fencing.stopDrawing();
    updateUI();
  }

  function closeFence() {
    if (!gebetaMapRef) return;
    const fence = gebetaMapRef.fencing.closeFence();
    if (fence) console.log('Fence completed:', fence);
    updateUI();
  }

  function clearCurrent() {
    if (!gebetaMapRef) return;
    gebetaMapRef.fencing.clearCurrentFence();
    updateUI();
  }

  function clearAll() {
    if (!gebetaMapRef) return;
    gebetaMapRef.fencing.clearAllFences();
    updateUI();
  }

  // Cleanup interval when component is destroyed (Svelte 5 effect cleanup).
  $effect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  });
</script>

<div class="page">
  <Map auth={authParam} center={[38.7636, 9.0054]} zoom={13} onready={handleReady}>
    {#snippet children()}
      <div class="control-panel">
        <h3>Fence Drawing</h3>
        <button class="primary" onclick={startDrawing} disabled={!ready || isDrawing}>Start Drawing</button>
        <button onclick={stopDrawing} disabled={!isDrawing}>Stop Drawing</button>
        <button onclick={closeFence} disabled={!isDrawing || pointCount < 3}>Close Fence</button>
        <button onclick={clearCurrent} disabled={!isDrawing}>Clear Current</button>
        <hr class="divider" />
        <h3 style="margin-top: 0;">Fence Management</h3>
        <button onclick={clearAll} disabled={!ready}>Clear All Fences</button>
        <div class="info-box">
          <strong>Status:</strong><br />
          {isDrawing ? 'Drawing' : 'Not drawing'}<br />
          <strong>Points:</strong> {pointCount}<br />
          <strong>Fences:</strong> {fenceCount}
        </div>
        <div class="info-box">
          <strong>Instructions:</strong><br />
          1. Click "Start Drawing"<br />
          2. Click on the map to add points<br />
          3. Click near the first point or "Close Fence" to complete
        </div>
      </div>
    {/snippet}
  </Map>
</div>

<style>
  .page { width: 100%; height: 100%; position: relative; }
</style>
