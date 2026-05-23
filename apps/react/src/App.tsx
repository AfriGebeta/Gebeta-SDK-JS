import { useCallback, useRef, useState } from 'react';

// Core map component — always needed
import { GebetaMap } from '@gebeta/react';

// Subpath import: only loads clustering code, not directions/fencing/navigation
import { useClustering } from '@gebeta/react/clustering';

// Subpath import: only loads geocoding code, not the whole @gebeta/js bundle
import { GeocodingManager } from '@gebeta/js/geocoding';

const ADDIS_ABABA_CENTER: [number, number] = [38.7685, 9.0161];
const INITIAL_CENTER = { lng: ADDIS_ABABA_CENTER[0], lat: ADDIS_ABABA_CENTER[1] };

const accessToken = import.meta.env.VITE_GEBETA_ACCESS_TOKEN ?? '';
const refreshToken = import.meta.env.VITE_GEBETA_REFRESH_TOKEN ?? '';
const auth =
  accessToken && refreshToken ? { accessToken, refreshToken } : undefined;
const apiKey = auth ? undefined : (import.meta.env.VITE_GEBETA_API_KEY ?? '');
const authParam = auth ?? apiKey;

// ---------------------------------------------------------------------------
// Clustering panel — uses useClustering from @gebeta/react/clustering
// ---------------------------------------------------------------------------

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
    clustering.addMarker({
      id: `m-${counter}`,
      lngLat: INITIAL_CENTER,
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
    <div style={panelStyle}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: 16 }}>Clustering</h3>
      <div style={{ marginBottom: 10, fontSize: 13 }}>
        Markers: <strong>{clustering.getMarkers().length}</strong>
      </div>
      <button type="button" style={buttonStyle} onClick={addRandom}>Add 20 random markers</button>
      <button type="button" style={buttonStyle} onClick={addOne}>Add marker at center</button>
      <button type="button" style={{ ...buttonStyle, background: '#e0e0e0' }} onClick={clear}>Clear all</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Geocoding panel — uses GeocodingManager from @gebeta/js/geocoding
// Directions, fencing, navigation are NOT imported — zero cost in the bundle.
// ---------------------------------------------------------------------------

function GeocodingPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const managerRef = useRef<GeocodingManager | null>(null);

  if (!managerRef.current && authParam) {
    managerRef.current = new GeocodingManager(authParam);
  }

  const search = useCallback(async () => {
    if (!query.trim() || !managerRef.current) return;
    setLoading(true);
    try {
      const items = await managerRef.current.geocode(query.trim());
      setResults(
        items.map(r => ({
          name: r.name ?? 'Unknown',
          lat: r.lngLat?.lat ?? 0,
          lng: r.lngLat?.lng ?? 0,
        }))
      );
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div style={{ ...panelStyle, top: 10, left: 300 }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: 16 }}>Geocoding</h3>
      <input
        style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box', fontSize: 13 }}
        placeholder="Search a place…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && search()}
      />
      <button type="button" style={{ ...buttonStyle, marginTop: 6 }} onClick={search} disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>
      {results.length > 0 && (
        <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', fontSize: 12 }}>
          {results.map(r => (
            <li key={`${r.lat},${r.lng}`} style={{ padding: '4px 0', borderBottom: '1px solid #eee' }}>
              <strong>{r.name}</strong>
              <br />
              <span style={{ color: '#888' }}>{r.lat.toFixed(5)}, {r.lng.toFixed(5)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <GebetaMap
        {...(auth ? { auth } : { apiKey })}
        center={ADDIS_ABABA_CENTER}
        zoom={12}
        clustering={{ enabled: true, showClusterCount: false }}
      >
        <ClusteringPanel />
        <GeocodingPanel />
      </GebetaMap>
    </div>
  );
}
