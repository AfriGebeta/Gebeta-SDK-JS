<script lang="ts">
  // FenceStyling.svelte — draw fences with live color/opacity controls.
  //
  // Imports from: @gebeta/js/fencing (FenceManager via GebetaMaps.fencing getter)
  // Intentionally does NOT import GeocodingManager, DirectionsManager, ClusteringManager, NavigationManager.

  import Map from '../lib/Map.svelte';
  import { authParam } from '../lib/config';
  import '../lib/panel.css';
  import type { GebetaMaps } from '@gebeta/js';

  let ready = $state(false);
  let gebetaMapRef: GebetaMaps | null = null;

  // Style state
  let fillColor = $state('#ff0000');
  let fillOpacity = $state(0.3);
  let lineColor = $state('#ff0000');
  let lineWidth = $state(2);
  let borderColor = $state('#ff0000');
  let borderWidth = $state(1);

  function handleReady(gm: GebetaMaps) {
    gebetaMapRef = gm;
    ready = true;
    applyStyle();
  }

  function applyStyle() {
    if (!gebetaMapRef) return;
    try {
      gebetaMapRef.fencing.updateCurrentFenceStyle({
        fillColor,
        fillOpacity,
        lineColor,
        lineWidth,
        borderColor,
        borderWidth,
      });
    } catch {
      // fencing not ready yet — fine
    }
  }

  function startDrawing() {
    if (!gebetaMapRef) return;
    gebetaMapRef.fencing.startDrawing();
    applyStyle();
  }

  function clearCurrent() {
    if (!gebetaMapRef) return;
    gebetaMapRef.fencing.clearCurrentFence();
  }

  function clearAll() {
    if (!gebetaMapRef) return;
    gebetaMapRef.fencing.clearAllFences();
  }
</script>

<div class="page">
  <Map auth={authParam} center={[38.7685, 9.0161]} zoom={15} onready={handleReady}>
    {#snippet children()}
      <div class="control-panel" style="max-width: 280px;">
        <h3>Fence Styling</h3>
        <button class="primary" onclick={startDrawing} disabled={!ready}>Start Drawing</button>
        <button class="danger" onclick={clearCurrent} disabled={!ready}>Clear Current</button>
        <button class="danger" onclick={clearAll} disabled={!ready}>Clear All</button>

        <div class="style-controls">
          <label for="fill-color">Fill Color:</label>
          <input id="fill-color" type="color" bind:value={fillColor} oninput={applyStyle} />

          <label for="fill-opacity">
            Fill Opacity:
            <span class="range-value">{fillOpacity.toFixed(1)}</span>
          </label>
          <input id="fill-opacity" type="range" min="0" max="1" step="0.1" bind:value={fillOpacity} oninput={applyStyle} />

          <label for="line-color">Line Color:</label>
          <input id="line-color" type="color" bind:value={lineColor} oninput={applyStyle} />

          <label for="line-width">
            Line Width:
            <span class="range-value">{lineWidth}</span>
          </label>
          <input id="line-width" type="range" min="1" max="10" step="1" bind:value={lineWidth} oninput={applyStyle} />

          <label for="border-color">Border Color:</label>
          <input id="border-color" type="color" bind:value={borderColor} oninput={applyStyle} />

          <label for="border-width">
            Border Width:
            <span class="range-value">{borderWidth}</span>
          </label>
          <input id="border-width" type="range" min="0" max="5" step="0.5" bind:value={borderWidth} oninput={applyStyle} />
        </div>

        <div class="info-box">
          <strong>Instructions:</strong><br />
          1. Click "Start Drawing"<br />
          2. Click on the map to add points<br />
          3. Adjust style controls<br />
          4. Click near first point to close fence
        </div>
      </div>
    {/snippet}
  </Map>
</div>

<style>
  .page { width: 100%; height: 100%; position: relative; }
</style>
