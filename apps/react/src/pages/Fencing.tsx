// Fencing.tsx — draw geofences by clicking on the map.

import { useRef, useState, useCallback } from 'react';
import { GebetaMap, type GebetaMapRef } from '@gebeta/react';
import { authProps, type Auth } from '../config';
import '../panel.css';

export default function Fencing({ auth }: { auth: Auth }) {
  const [drawing, setDrawing] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const [fenceCount, setFenceCount] = useState(0);

  const gebetaMapRef = useRef<GebetaMapRef>(null);

  function refreshState() {
    const fencing = gebetaMapRef.current?.fencing;
    if (!fencing) return;
    setDrawing(fencing.isDrawingFence());
    setPointCount(fencing.getCurrentFencePoints().length);
    setFenceCount(fencing.getFences().length);
  }

  function handleLoad(gm: GebetaMapRef) {
    gm.fencing.on('fenceCompleted', refreshState);
    refreshState();
  }

  const startDrawing = useCallback(() => {
    gebetaMapRef.current?.fencing.startDrawing();
    refreshState();
  }, []);

  const stopDrawing = useCallback(() => {
    gebetaMapRef.current?.fencing.stopDrawing();
    refreshState();
  }, []);

  const closeFence = useCallback(() => {
    gebetaMapRef.current?.fencing.closeFence();
    refreshState();
  }, []);

  const clearFences = useCallback(() => {
    gebetaMapRef.current?.fencing.clearAllFences();
    refreshState();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GebetaMap
        ref={gebetaMapRef}
        {...authProps(auth)}
        center={[38.7685, 9.0161]}
        zoom={12}
        navigationControl
        onLoad={handleLoad}
      >
        <div className="control-panel">
          <h3>Fencing</h3>
          <div style={{ marginBottom: 10, fontSize: 13 }}>
            Fences: <strong>{fenceCount}</strong>
            {drawing && (
              <span style={{ marginLeft: 10, color: '#007cbf' }}>Points: {pointCount}</span>
            )}
          </div>
          {!drawing ? (
            <button className="primary" onClick={startDrawing}>
              Start Drawing
            </button>
          ) : (
            <>
              <button className="primary" onClick={closeFence} disabled={pointCount < 3}>
                Close Fence ({pointCount} pts)
              </button>
              <button onClick={stopDrawing}>Cancel</button>
            </>
          )}
          <button className="danger" onClick={clearFences} disabled={fenceCount === 0}>
            Clear All Fences
          </button>
          <p className="hint">
            Click "Start Drawing", then click on the map to add points.
            <br />
            Click "Close Fence" to complete the polygon (min 3 points), or click the first point on
            the map.
          </p>
        </div>
      </GebetaMap>
    </div>
  );
}
