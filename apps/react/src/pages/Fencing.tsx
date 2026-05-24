// Fencing.tsx — draw geofences by clicking on the map.
// Accesses FenceManager via gebetaMap.fenceManager after onReady.

import { useRef, useState, useCallback } from 'react';
import Map, { type Platform } from '../Map';
import { auth } from '../config';
import type { GebetaMaps } from '@gebeta/js';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';
import '../panel.css';

type LngLat = { lat: number; lng: number };

export default function Fencing() {
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<LngLat[]>([]);
  const [fenceCount, setFenceCount] = useState(0);

  const gebetaMapRef = useRef<GebetaMaps | null>(null);
  const platformRef = useRef<Platform | null>(null);
  const drawingRef = useRef(drawing);
  const pointsRef = useRef(points);
  drawingRef.current = drawing;
  pointsRef.current = points;

  function handleReady(gm: GebetaMaps, _m: MapLibreMap, platform: Platform) {
    gebetaMapRef.current = gm;
    platformRef.current = platform;
    platform.mapAdapter.on('click', (...args: unknown[]) => {
      if (!drawingRef.current) return;
      const e = args[0] as { lngLat: API.Common.Types.LngLat };
      const pt = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      const newPoints = [...pointsRef.current, pt];
      pointsRef.current = newPoints;
      setPoints(newPoints);
    });
  }

  const startDrawing = useCallback(() => {
    setDrawing(true);
    setPoints([]);
  }, []);

  const closeFence = useCallback(() => {
    if (!gebetaMapRef.current || pointsRef.current.length < 3) {
      alert('Need at least 3 points to close a fence.');
      return;
    }
    try {
      gebetaMapRef.current.fenceManager.addFence({
        id: `fence-${Date.now()}`,
        coordinates: pointsRef.current,
      });
      setFenceCount(c => c + 1);
    } catch (err) {
      alert('Failed to add fence: ' + String(err instanceof Error ? err.message : err));
    }
    setDrawing(false);
    setPoints([]);
  }, []);

  const clearFences = useCallback(() => {
    gebetaMapRef.current?.fenceManager.clearFences();
    setFenceCount(0);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map auth={auth} center={[38.7685, 9.0161]} zoom={12} onReady={handleReady}>
        <div className="control-panel">
          <h3>Fencing</h3>
          <div style={{ marginBottom: 10, fontSize: 13 }}>
            Fences: <strong>{fenceCount}</strong>
            {drawing && <span style={{ marginLeft: 10, color: '#007cbf' }}>Points: {points.length}</span>}
          </div>
          {!drawing
            ? <button className="primary" onClick={startDrawing}>Start Drawing</button>
            : <>
                <button className="primary" onClick={closeFence} disabled={points.length < 3}>Close Fence ({points.length} pts)</button>
                <button onClick={() => { setDrawing(false); setPoints([]); }}>Cancel</button>
              </>
          }
          <button className="danger" onClick={clearFences} disabled={fenceCount === 0}>Clear All Fences</button>
          <p className="hint">Click "Start Drawing", then click on the map to add points.<br />Click "Close Fence" to complete the polygon (min 3 points).</p>
        </div>
      </Map>
    </div>
  );
}
