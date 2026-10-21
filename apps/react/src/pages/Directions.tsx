// Directions.tsx — click map to set origin/destination, then display route.

import { useRef, useState, useCallback } from 'react';
import { GebetaMap, type GebetaMapRef } from '@gebeta/react';
import { authProps, type Auth } from '../config';
import type { API } from '@gebeta/api';
import '../panel.css';

const ORIGIN_ICON = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
const DEST_ICON = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';

type Platform = ReturnType<GebetaMapRef['getPlatform']>;
type Marker = ReturnType<Platform['markerFactory']['createMarker']>;
type LngLat = { lat: number; lng: number };

function addPinMarker(platform: Platform, lng: number, lat: number, iconUrl: string): Marker {
  return (
    platform.markerFactory
      .createMarker({ imageUrl: iconUrl, size: [30, 30] })
      ?.setLngLat({ lng, lat })
      .addTo(platform.mapAdapter) ?? null
  );
}

export default function Directions({ auth }: { auth: Auth }) {
  const [mode, setMode] = useState<'origin' | 'destination' | null>(null);
  const [origin, setOrigin] = useState<LngLat | null>(null);
  const [dest, setDest] = useState<LngLat | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance?: string | number;
    duration?: string | number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const gebetaMapRef = useRef<GebetaMapRef>(null);
  const originMarkerRef = useRef<Marker>(null);
  const destMarkerRef = useRef<Marker>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  function handleLoad(gm: GebetaMapRef) {
    const platform = gm.getPlatform();
    platform.mapAdapter.on('click', (...args: unknown[]) => {
      const e = args[0] as { lngLat: API.Common.Types.LngLat };
      const { lat, lng } = e.lngLat;
      if (modeRef.current === 'origin') {
        originMarkerRef.current?.remove();
        originMarkerRef.current = addPinMarker(platform, lng, lat, ORIGIN_ICON);
        setOrigin({ lat, lng });
        setMode(null);
      } else if (modeRef.current === 'destination') {
        destMarkerRef.current?.remove();
        destMarkerRef.current = addPinMarker(platform, lng, lat, DEST_ICON);
        setDest({ lat, lng });
        setMode(null);
      }
    });
  }

  const getDirections = useCallback(async () => {
    if (!gebetaMapRef.current || !origin || !dest) return;
    setLoading(true);
    try {
      const routeData = await gebetaMapRef.current.getDirections(origin, dest, {});
      gebetaMapRef.current.displayRoute(routeData, { showMarkers: false });
      setRouteInfo({
        distance: routeData.distance ?? undefined,
        duration: routeData.duration ?? undefined,
      });
    } catch (err) {
      alert('Directions failed: ' + String(err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  }, [origin, dest]);

  const clearRoute = useCallback(() => {
    gebetaMapRef.current?.clearRoute();
    setRouteInfo(null);
  }, []);

  const clearAll = useCallback(() => {
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    destMarkerRef.current?.remove();
    destMarkerRef.current = null;
    setOrigin(null);
    setDest(null);
    clearRoute();
  }, [clearRoute]);

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
          <h3>Directions</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              className={mode === 'origin' ? 'primary' : ''}
              style={{ flex: 1 }}
              onClick={() => setMode(m => (m === 'origin' ? null : 'origin'))}
            >
              Set Origin
            </button>
            <button
              className={mode === 'destination' ? 'primary' : ''}
              style={{ flex: 1 }}
              onClick={() => setMode(m => (m === 'destination' ? null : 'destination'))}
            >
              Set Destination
            </button>
          </div>
          <div className="coords-box">
            <div>
              <strong>Origin:</strong>{' '}
              {origin ? `${origin.lat.toFixed(5)}, ${origin.lng.toFixed(5)}` : 'Not set'}
            </div>
            <div>
              <strong>Destination:</strong>{' '}
              {dest ? `${dest.lat.toFixed(5)}, ${dest.lng.toFixed(5)}` : 'Not set'}
            </div>
          </div>
          <button
            className="primary"
            onClick={getDirections}
            disabled={!origin || !dest || loading}
          >
            {loading ? 'Loading...' : 'Get Directions'}
          </button>
          <button onClick={clearRoute}>Clear Route</button>
          <button onClick={clearAll}>Clear Points</button>
          {routeInfo && (
            <div className="route-info">
              <strong>Route</strong>
              {routeInfo.distance != null && <p>Distance: {routeInfo.distance}</p>}
              {routeInfo.duration != null && <p>Duration: {routeInfo.duration}</p>}
            </div>
          )}
          <p className="hint">
            Click "Set Origin", then click the map.
            <br />
            Then "Set Destination" and click the map.
            <br />
            Use "Get Directions" to show the route.
          </p>
        </div>
      </GebetaMap>
    </div>
  );
}
