// Clustering.tsx — add random markers and see them cluster.
// Uses useClustering from @gebeta/react/clustering via GebetaMap.

import { useCallback, useState } from 'react';
import { GebetaMap } from '@gebeta/react';
import { useClustering } from '@gebeta/react/clustering';
import { auth } from '../config';
import '../panel.css';

const CENTER: [number, number] = [38.7685, 9.0161];

function ClusteringPanel() {
  const clustering = useClustering();
  const [counter, setCounter] = useState(0);

  const addRandom = useCallback(() => {
    for (let i = 0; i < 50; i++) {
      const id = `m-${counter + i}`;
      clustering.addMarker({
        id,
        lngLat: {
          lng: CENTER[0] + (Math.random() - 0.5) * 0.1,
          lat: CENTER[1] + (Math.random() - 0.5) * 0.1,
        },
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        size: [30, 30],
        popupContent: `<div style="padding:6px;"><strong>Marker ${counter + i + 1}</strong></div>`,
      });
    }
    setCounter(c => c + 50);
  }, [clustering, counter]);

  const addOne = useCallback(() => {
    clustering.addMarker({
      id: `m-${counter}`,
      lngLat: { lng: CENTER[0], lat: CENTER[1] },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      size: [30, 30],
      popupContent: `<div style="padding:6px;"><strong>Marker ${counter + 1}</strong></div>`,
    });
    setCounter(c => c + 1);
  }, [clustering, counter]);

  const clear = useCallback(() => {
    clustering.clearMarkers();
    setCounter(0);
  }, [clustering]);

  return (
    <div className="control-panel">
      <h3>Marker Clustering</h3>
      <div style={{ marginBottom: 10, fontSize: 13 }}>
        Markers: <strong>{clustering.getMarkers().length}</strong>
      </div>
      <button className="primary" onClick={addRandom}>
        Add 50 random markers
      </button>
      <button onClick={addOne}>Add marker at center</button>
      <button className="danger" onClick={clear}>
        Clear all
      </button>
      <p className="hint">Zoom in/out to see clusters expand and collapse.</p>
    </div>
  );
}

export default function Clustering() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GebetaMap
        auth={auth}
        center={CENTER}
        zoom={12}
        clustering={{ enabled: true, radius: 50, maxZoom: 16, showClusterCount: true }}
        navigationControl
      >
        <ClusteringPanel />
      </GebetaMap>
    </div>
  );
}
