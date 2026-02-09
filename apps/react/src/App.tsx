import { useCallback, useState } from 'react';
import { GebetaMap, useClustering } from '@gebeta/maps-react';

const ADDIS_ABABA_CENTER: [number, number] = [38.7685, 9.0161];
const INITIAL_CENTER = { lng: ADDIS_ABABA_CENTER[0], lat: ADDIS_ABABA_CENTER[1] };

function ClusteringPanel() {
  const clustering = useClustering();
  const [counter, setCounter] = useState(0);

  const addRandom = useCallback(() => {
    for (let i = 0; i < 20; i++) {
      const id = `m-${counter + i}`;
      clustering.addMarker({
        id,
        lngLat: {
          lng: INITIAL_CENTER.lng + (Math.random() - 0.5) * 0.08,
          lat: INITIAL_CENTER.lat + (Math.random() - 0.5) * 0.08,
        },
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        size: [30, 30],
        popupContent: `<div style="padding:6px;"><strong>Marker ${counter + i + 1}</strong></div>`,
      });
    }
    setCounter(c => c + 20);
  }, [clustering, counter]);

  const addOne = useCallback(() => {
    const id = `m-${counter}`;
    clustering.addMarker({
      id,
      lngLat: { lng: INITIAL_CENTER.lng, lat: INITIAL_CENTER.lat },
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

  const markers = clustering.getMarkers();

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: 16 }}>Clustering</h3>
      <div style={{ marginBottom: 10, fontSize: 13 }}>
        Markers: <strong>{markers.length}</strong>
      </div>
      <button type="button" style={buttonStyle} onClick={addRandom}>
        Add 20 random markers
      </button>
      <button type="button" style={buttonStyle} onClick={addOne}>
        Add marker at center
      </button>
      <button type="button" style={{ ...buttonStyle, background: '#e0e0e0' }} onClick={clear}>
        Clear all
      </button>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 10,
  left: 10,
  background: 'white',
  padding: 15,
  borderRadius: 8,
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  zIndex: 1000,
  maxWidth: 280,
};

const buttonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  margin: '6px 0',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: 4,
  background: '#f8f9fa',
  cursor: 'pointer',
  fontSize: 14,
};

const apiKey = import.meta.env.VITE_GEBETA_API_KEY ?? '';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <GebetaMap
        apiKey={apiKey}
        center={ADDIS_ABABA_CENTER}
        zoom={12}
        clustering={{ enabled: true, showClusterCount: false }}
      >
        <ClusteringPanel />
      </GebetaMap>
    </div>
  );
}
