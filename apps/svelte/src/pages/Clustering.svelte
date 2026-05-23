<script lang="ts">
  // Clustering.svelte — add random markers and see them cluster.
  //
  // Imports from: @gebeta/js/clustering (ClusteringManager via GebetaMaps.clustering getter)
  // Intentionally does NOT import GeocodingManager, DirectionsManager, FenceManager, NavigationManager.

  import Map from '../lib/Map.svelte';
  import { authParam } from '../lib/config';
  import '../lib/panel.css';
  import type { GebetaMaps } from '@gebeta/js';
  import type { Platform } from '../lib/Map.svelte';

  const clusteringOptions = { enabled: true, radius: 50, maxZoom: 16, showClusterCount: true };

  let markerCounter = $state(0);
  let markerCount = $state(0);
  let radius = $state(50);
  let maxZoom = $state(16);
  let showCount = $state(true);

  let gebetaMapRef: GebetaMaps | null = null;
  let platformRef: Platform | null = null;
  let ready = $state(false);

  function handleReady(gm: GebetaMaps, _m: unknown, platform: Platform) {
    gebetaMapRef = gm;
    platformRef = platform;
    ready = true;
    platform.mapAdapter.on('moveend', updateStats);
    platform.mapAdapter.on('zoomend', updateStats);
  }

  function updateStats() {
    if (!gebetaMapRef?.clustering) return;
    markerCount = gebetaMapRef.clustering.getMarkers().length;
  }

  function addRandomMarkers() {
    if (!gebetaMapRef?.clustering || !platformRef) return;
    const center = platformRef.mapAdapter.getCenter();
    for (let i = 0; i < 50; i++) {
      const lat = center.lat + (Math.random() - 0.5) * 0.1;
      const lng = center.lng + (Math.random() - 0.5) * 0.1;
      markerCounter += 1;
      const id = `marker-${markerCounter}`;
      gebetaMapRef.clustering.addMarker({
        id,
        lngLat: { lng, lat },
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        size: [30, 30],
        onClick: () => {
          alert(`Marker clicked at: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        },
        popupContent: `<div style="padding:5px;"><strong>Marker #${markerCounter}</strong><br>Location: ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>`,
      });
    }
    updateStats();
  }

  function addMarkerAtCenter() {
    if (!gebetaMapRef?.clustering || !platformRef) return;
    const center = platformRef.mapAdapter.getCenter();
    markerCounter += 1;
    const id = `marker-${markerCounter}`;
    gebetaMapRef.clustering.addMarker({
      id,
      lngLat: { lng: center.lng, lat: center.lat },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      size: [30, 30],
      onClick: () => {
        alert(`Marker at center: ${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`);
      },
      popupContent: `<div style="padding:5px;"><strong>Marker #${markerCounter}</strong></div>`,
    });
    updateStats();
  }

  function clearMarkers() {
    if (!gebetaMapRef?.clustering) return;
    gebetaMapRef.clustering.clearMarkers();
    markerCounter = 0;
    updateStats();
  }

  function applyOptions() {
    if (!gebetaMapRef?.clustering) return;
    gebetaMapRef.clustering.updateOptions({
      radius,
      maxZoom,
      showClusterCount: showCount,
    });
    updateStats();
  }
</script>

<div class="page">
  <Map
    auth={authParam}
    center={[38.7685, 9.0161]}
    zoom={12}
    clustering={clusteringOptions}
    onready={handleReady}
  >
    {#snippet children()}
      <div class="control-panel">
        <h3>Marker Clustering</h3>
        <div class="info-box">
          <div><strong>Markers:</strong> {markerCount}</div>
        </div>
        <button class="primary" onclick={addRandomMarkers} disabled={!ready}>Add 50 Random Markers</button>
        <button onclick={addMarkerAtCenter} disabled={!ready}>Add Marker at Center</button>
        <button onclick={clearMarkers} disabled={!ready}>Clear All Markers</button>
        <hr class="divider" />
        <label for="radius" style="display:block; font-size:12px; font-weight:bold; color:#333; margin-bottom:4px;">Cluster Radius:</label>
        <input
          id="radius"
          type="number"
          bind:value={radius}
          min={10} max={200} step={10}
          onchange={applyOptions}
          style="width:100%; padding:5px; border:1px solid #ddd; border-radius:4px; font-size:13px;"
        />
        <label for="maxZoom" style="display:block; font-size:12px; font-weight:bold; color:#333; margin:8px 0 4px 0;">Max Zoom:</label>
        <input
          id="maxZoom"
          type="number"
          bind:value={maxZoom}
          min={10} max={20} step={1}
          onchange={applyOptions}
          style="width:100%; padding:5px; border:1px solid #ddd; border-radius:4px; font-size:13px;"
        />
        <label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#333; margin-top:8px; cursor:pointer;">
          <input type="checkbox" bind:checked={showCount} onchange={applyOptions} />
          Show Cluster Count
        </label>
        <p class="hint">
          Click "Add Random Markers" to scatter markers around the current view.
          Zoom in/out to see clustering. Click clusters to zoom in.
        </p>
      </div>
    {/snippet}
  </Map>
</div>

<style>
  .page { width: 100%; height: 100%; position: relative; }
</style>
