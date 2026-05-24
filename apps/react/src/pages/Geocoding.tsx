// Geocoding.tsx — forward and reverse geocoding example.
// Accesses GeocodingManager via gebetaMap.geocodingManager after onReady.

import { useRef, useState, useCallback } from 'react';
import Map, { type Platform } from '../Map';
import { auth } from '../config';
import type { GebetaMaps } from '@gebeta/js';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';
import '../panel.css';

type Marker = API.Platform.Types.IMarker;
type Result = { name: string; lat: number; lng: number };

export default function Geocoding() {
  const [placeInput, setPlaceInput] = useState('');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [ready, setReady] = useState(false);

  const gebetaMapRef = useRef<GebetaMaps | null>(null);
  const platformRef = useRef<Platform | null>(null);
  const markersRef = useRef<Marker[]>([]);

  function handleReady(gm: GebetaMaps, _m: MapLibreMap, platform: Platform) {
    gebetaMapRef.current = gm;
    platformRef.current = platform;
    setReady(true);
  }

  function clearResultMarkers() {
    markersRef.current.forEach(mk => mk.remove());
    markersRef.current = [];
  }

  function showResults(items: Array<{ name?: string; lngLat?: { lat: number; lng: number } }>) {
    clearResultMarkers();
    const mapped = items
      .filter(i => i.lngLat != null)
      .map(i => ({ name: i.name ?? 'Unknown', lat: i.lngLat!.lat, lng: i.lngLat!.lng }));
    setResults(mapped);
    const platform = platformRef.current;
    if (!platform) return;
    mapped.forEach(r => {
      const mk = platform.markerFactory.createMarker({})?.setLngLat({ lat: r.lat, lng: r.lng }).addTo(platform.mapAdapter);
      if (mk) markersRef.current.push(mk);
    });
    if (mapped[0]) {
      platform.mapAdapter.easeTo({ center: [mapped[0].lng, mapped[0].lat], zoom: 14 });
    }
  }

  const doGeocode = useCallback(async () => {
    if (!ready || !gebetaMapRef.current || !placeInput.trim()) return;
    try {
      const res = await gebetaMapRef.current.geocodingManager.geocode(placeInput.trim());
      showResults(res ?? []);
    } catch (err) {
      setResults([]);
      alert('Geocoding failed: ' + String(err instanceof Error ? err.message : err));
    }
  }, [ready, placeInput]);

  const doReverseGeocode = useCallback(async () => {
    if (!ready || !gebetaMapRef.current) return;
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || isNaN(lng)) { alert('Enter valid latitude and longitude.'); return; }
    try {
      const res = await gebetaMapRef.current.geocodingManager.reverseGeocode({ lat, lng });
      showResults(res ?? []);
    } catch (err) {
      setResults([]);
      alert('Reverse geocoding failed: ' + String(err instanceof Error ? err.message : err));
    }
  }, [ready, latInput, lngInput]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map auth={auth} center={[38.7685, 9.0161]} zoom={12} onReady={handleReady}>
        <div className="control-panel">
          <h3>Geocoding</h3>
          <h4>Forward (search by name)</h4>
          <input type="text" value={placeInput} onChange={e => setPlaceInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && doGeocode()} placeholder="e.g. Bole, Addis Ababa" />
          <button className="primary" onClick={doGeocode} disabled={!ready}>Search</button>
          <h4>Reverse (search by coordinates)</h4>
          <input type="number" value={latInput} onChange={e => setLatInput(e.target.value)} placeholder="Latitude" />
          <input type="number" value={lngInput} onChange={e => setLngInput(e.target.value)} placeholder="Longitude" />
          <button className="primary" onClick={doReverseGeocode} disabled={!ready}>Find address</button>
          <h4>Results</h4>
          <div className="result-list">
            {results.length === 0
              ? <div style={{ padding: 8, color: '#888' }}>No results yet.</div>
              : results.map(r => (
                <div key={`${r.lat},${r.lng}`} className="result-item" onClick={() => platformRef.current?.mapAdapter.easeTo({ center: [r.lng, r.lat], zoom: 16 })}>
                  <strong>{r.name}</strong><br />
                  <span style={{ color: '#666' }}>{r.lat.toFixed(5)}, {r.lng.toFixed(5)}</span>
                </div>
              ))
            }
          </div>
        </div>
      </Map>
    </div>
  );
}
