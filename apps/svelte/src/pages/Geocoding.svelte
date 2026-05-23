<script lang="ts">
  // Geocoding.svelte — forward and reverse geocoding example.
  //
  // Imports from: @gebeta/js (GebetaMaps via Map.svelte's onready callback)
  // The GeocodingManager is accessed via gebetaMap.geocodingManager after style.load.
  // Intentionally does NOT import DirectionsManager, ClusteringManager, FenceManager, NavigationManager.

  import Map from '../lib/Map.svelte';
  import { authParam } from '../lib/config';
  import '../lib/panel.css';
  import type { GebetaMaps } from '@gebeta/js';
  import type { Platform } from '../lib/Map.svelte';

  let placeInput = $state('');
  let latInput = $state('');
  let lonInput = $state('');
  let results: Array<{ name: string; lat: number; lng: number }> = $state([]);
  let resultMarkers: API.Platform.Types.IMarker[] = [];
  let mapReady = $state(false);
  let platformRef: Platform | null = null;
  let gebetaMapRef: GebetaMaps | null = null;

  // @gebeta/api provides all the types we need — no maplibre-gl import required.
  import type { API } from '@gebeta/api';

  function handleReady(gm: GebetaMaps, _m: unknown, platform: Platform) {
    gebetaMapRef = gm;
    platformRef = platform;
    mapReady = true;
  }

  function clearResultMarkers() {
    resultMarkers.forEach((mk) => mk.remove());
    resultMarkers = [];
  }

  function showResults(items: Array<{ name?: string; lngLat?: { lat: number; lng: number } }>) {
    clearResultMarkers();
    results = items
      .filter((i) => i.lngLat != null)
      .map((i) => ({
        name: i.name ?? 'Unknown',
        lat: i.lngLat!.lat,
        lng: i.lngLat!.lng,
      }));

    if (!platformRef) return;
    results.forEach((r) => {
      const mk = platformRef!.markerFactory.createMarker({})?.setLngLat({ lat: r.lat, lng: r.lng }).addTo(platformRef!.mapAdapter);
      if (mk) resultMarkers.push(mk);
    });
    if (results[0]) {
      platformRef.mapAdapter.easeTo({ center: [results[0].lng, results[0].lat], zoom: 14 });
    }
  }

  function flyToResult(r: { lat: number; lng: number }) {
    platformRef?.mapAdapter.easeTo({ center: [r.lng, r.lat], zoom: 16 });
  }

  async function doGeocode() {
    if (!mapReady || !gebetaMapRef) return;
    if (!placeInput.trim()) { alert('Enter a place name.'); return; }
    try {
      const res = await gebetaMapRef.geocodingManager.geocode(placeInput.trim());
      showResults(res ?? []);
    } catch (err: unknown) {
      showResults([]);
      alert('Geocoding failed: ' + String(err instanceof Error ? err.message : err));
    }
  }

  async function doReverseGeocode() {
    if (!mapReady || !gebetaMapRef) return;
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);
    if (isNaN(lat) || isNaN(lon)) { alert('Enter valid latitude and longitude.'); return; }
    try {
      const res = await gebetaMapRef.geocodingManager.reverseGeocode({ lat, lng: lon });
      showResults(res ?? []);
    } catch (err: unknown) {
      showResults([]);
      alert('Reverse geocoding failed: ' + String(err instanceof Error ? err.message : err));
    }
  }
</script>

<div class="page">
  <Map auth={authParam} center={[38.7685, 9.0161]} zoom={12} onready={handleReady}>
    {#snippet children()}
      <div class="control-panel">
        <h3>Geocoding</h3>
        <h4>Forward (search by name)</h4>
        <input type="text" bind:value={placeInput} placeholder="e.g. Bole, Addis Ababa" />
        <button class="primary" onclick={doGeocode} disabled={!mapReady}>Search</button>

        <h4>Reverse (search by coordinates)</h4>
        <input type="number" bind:value={latInput} placeholder="Latitude" step="any" />
        <input type="number" bind:value={lonInput} placeholder="Longitude" step="any" />
        <button class="primary" onclick={doReverseGeocode} disabled={!mapReady}>Find address</button>

        <h4>Results</h4>
        <div class="result-list">
          {#if results.length === 0}
            <div style="padding: 8px; color: #888;">No results yet.</div>
          {:else}
            {#each results as r}
              <div
                class="result-item"
                onclick={() => flyToResult(r)}
                role="button"
                tabindex="0"
                onkeydown={(e) => e.key === 'Enter' && flyToResult(r)}
              >
                <strong>{r.name}</strong><br />
                <span style="color: #666;">{r.lat.toFixed(5)}, {r.lng.toFixed(5)}</span>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    {/snippet}
  </Map>
</div>

<style>
  .page {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
