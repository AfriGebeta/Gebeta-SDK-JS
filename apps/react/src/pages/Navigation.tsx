// Navigation.tsx — set origin/destination, get a route, then start turn-by-turn
// navigation using either the browser's GPS or a simulated location provider.

import { useRef, useState, useCallback, useEffect } from 'react';
import Map, { type Platform } from '../Map';
import type { Auth } from '../config';
import { GebetaMaps, BrowserLocationProvider } from '@gebeta/js';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';
import '../panel.css';

const ORIGIN_ICON = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
const DEST_ICON = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';

type Marker = ReturnType<Platform['markerFactory']['createMarker']>;
type LngLat = { lat: number; lng: number };
type Source = 'gps' | 'simulation';
type NavStatus = 'inactive' | 'navigating' | 'offroute';

type LocationCallback = (loc: {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  heading: number;
}) => void;

interface SimulatedProvider {
  start: (cb: LocationCallback) => void;
  stop: () => void;
}

// Walks the route geometry segment-by-segment, emitting positions to the
// callback at a cadence controlled by `speedRef`. Used in place of the
// browser geolocation API for demos that need a moving "user".
function createSimulatedLocationProvider(
  coords: [number, number][],
  speedRef: { current: number }
): SimulatedProvider {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let segmentIndex = 0;
  let position: [number, number] | null = null;
  let running = false;

  function bearing(from: [number, number], to: [number, number]): number {
    const lat1 = (from[1] * Math.PI) / 180;
    const lat2 = (to[1] * Math.PI) / 180;
    const dLng = ((to[0] - from[0]) * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
  }

  return {
    start(callback) {
      if (!coords.length) return;
      segmentIndex = 0;
      position = [coords[0][0], coords[0][1]];
      running = true;

      function tick() {
        if (!running || !position) return;

        if (segmentIndex >= coords.length - 1) {
          const final = coords[coords.length - 1];
          callback({
            lat: final[1],
            lng: final[0],
            accuracy: 10,
            timestamp: Date.now(),
            heading: 0,
          });
          return;
        }

        const end = coords[segmentIndex + 1];
        const step = 0.0001 * speedRef.current;
        const dx = end[0] - position[0];
        const dy = end[1] - position[1];
        const distToEnd = Math.sqrt(dx * dx + dy * dy);

        if (distToEnd <= step) {
          position = [end[0], end[1]];
          segmentIndex++;
        } else {
          const r = step / distToEnd;
          position = [position[0] + dx * r, position[1] + dy * r];
        }

        const next =
          segmentIndex < coords.length - 1 ? coords[segmentIndex + 1] : coords[coords.length - 1];
        callback({
          lat: position[1],
          lng: position[0],
          accuracy: 10,
          timestamp: Date.now(),
          heading: bearing(position, next),
        });

        if (running && segmentIndex < coords.length - 1) {
          timeoutId = setTimeout(tick, 100 / speedRef.current);
        }
      }

      tick();
    },
    stop() {
      running = false;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = null;
    },
  };
}

export default function Navigation({ auth }: { auth: Auth }) {
  const [mode, setMode] = useState<'origin' | 'destination' | null>(null);
  const [origin, setOrigin] = useState<LngLat | null>(null);
  const [dest, setDest] = useState<LngLat | null>(null);
  const [hasRoute, setHasRoute] = useState(false);
  const [status, setStatus] = useState<NavStatus>('inactive');
  const [source, setSource] = useState<Source>('simulation');
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<{
    remainingDistance?: number;
    remainingDuration?: number;
    progress?: number;
    instruction?: string;
  }>({});

  const gebetaMapRef = useRef<GebetaMaps | null>(null);
  const platformRef = useRef<Platform | null>(null);
  const originMarkerRef = useRef<Marker>(null);
  const destMarkerRef = useRef<Marker>(null);
  const routeDataRef = useRef<API.Routing.Types.RouteData | null>(null);
  const locationProviderRef = useRef<SimulatedProvider | BrowserLocationProvider | null>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  function addPinMarker(platform: Platform, lng: number, lat: number, iconUrl: string): Marker {
    return (
      platform.markerFactory
        .createMarker({ imageUrl: iconUrl, size: [30, 30] })
        ?.setLngLat({ lng, lat })
        .addTo(platform.mapAdapter) ?? null
    );
  }

  function handleReady(gm: GebetaMaps, _m: MapLibreMap, platform: Platform) {
    gebetaMapRef.current = gm;
    platformRef.current = platform;

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

    const nav = gm.navigation;
    nav.on('start', () => setStatus('navigating'));
    nav.on('stop', () => {
      setStatus('inactive');
      locationProviderRef.current?.stop();
      locationProviderRef.current = null;
    });
    nav.on('progress', (event: API.Navigation.Events.ProgressEvent) => {
      setDetails({
        remainingDistance: event.remainingDistance,
        remainingDuration:
          typeof event.remainingDuration === 'number' ? event.remainingDuration : undefined,
        progress: event.progress,
        instruction: event.currentStep?.instruction,
      });
    });
    nav.on('stepchange', (event: API.Navigation.Events.StepChangeEvent) => {
      setDetails(d => ({ ...d, instruction: event.currentStep?.instruction }));
    });
    nav.on('offroute', () => setStatus('offroute'));
    nav.on('arrive', () => {
      alert('You have arrived at your destination!');
      gm.navigation.stop();
    });
    nav.on('error', (error: unknown) => {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Navigation error:', error);
      alert('Navigation error: ' + msg);
    });
  }

  const getRoute = useCallback(async () => {
    if (!gebetaMapRef.current || !origin || !dest) return;
    setLoading(true);
    try {
      const data = await gebetaMapRef.current.getDirections(origin, dest, {});
      routeDataRef.current = data;
      gebetaMapRef.current.displayRoute(data, { showMarkers: false });
      setHasRoute(true);
    } catch (err) {
      alert('Route failed: ' + String(err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  }, [origin, dest]);

  const startNavigation = useCallback(() => {
    const gm = gebetaMapRef.current;
    const route = routeDataRef.current;
    if (!gm || !route) return;

    if (source === 'simulation') {
      const coords = route.geometry?.coordinates;
      if (!coords?.length) {
        alert('Route has no geometry to simulate');
        return;
      }
      locationProviderRef.current = createSimulatedLocationProvider(coords, speedRef);
    } else {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
      }
      locationProviderRef.current = BrowserLocationProvider.getInstance({
        enableHighAccuracy: true,
      });
    }

    gm.navigation.start(
      route,
      { userId: `demo-user-${Date.now()}` },
      locationProviderRef.current
    );
  }, [source]);

  const stopNavigation = useCallback(() => {
    gebetaMapRef.current?.navigation.stop();
  }, []);

  const clearAll = useCallback(() => {
    if (status !== 'inactive') stopNavigation();
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    destMarkerRef.current?.remove();
    destMarkerRef.current = null;
    setOrigin(null);
    setDest(null);
    setHasRoute(false);
    setDetails({});
    routeDataRef.current = null;
    gebetaMapRef.current?.clearRoute();
  }, [status, stopNavigation]);

  useEffect(() => {
    return () => {
      locationProviderRef.current?.stop();
    };
  }, []);

  const formatDistance = (m?: number) =>
    m == null ? '—' : m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(2)} km`;
  const formatDuration = (s?: number) =>
    s == null ? '—' : s < 60 ? `${Math.round(s)} s` : `${Math.round(s / 60)} min`;

  const navInfoClass =
    status === 'navigating' ? 'route-info active' : status === 'offroute' ? 'route-info warning' : 'route-info';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map auth={auth} center={[38.7685, 9.0161]} zoom={12} onReady={handleReady}>
        <div className="control-panel">
          <h3>Navigation</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              className={mode === 'origin' ? 'primary' : ''}
              style={{ flex: 1 }}
              onClick={() => setMode(m => (m === 'origin' ? null : 'origin'))}
              disabled={status !== 'inactive'}
            >
              Set Origin
            </button>
            <button
              className={mode === 'destination' ? 'primary' : ''}
              style={{ flex: 1 }}
              onClick={() => setMode(m => (m === 'destination' ? null : 'destination'))}
              disabled={status !== 'inactive'}
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

          <h4>Location Source</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              className={source === 'simulation' ? 'primary' : ''}
              style={{ flex: 1 }}
              onClick={() => setSource('simulation')}
              disabled={status !== 'inactive'}
            >
              Simulation
            </button>
            <button
              className={source === 'gps' ? 'primary' : ''}
              style={{ flex: 1 }}
              onClick={() => setSource('gps')}
              disabled={status !== 'inactive'}
            >
              Real GPS
            </button>
          </div>

          {source === 'simulation' && (
            <div className="coords-box">
              <label style={{ display: 'block', marginBottom: 4 }}>
                <strong>Speed:</strong> {speed}x
              </label>
              <input
                type="range"
                min={0.5}
                max={5}
                step={0.5}
                value={speed}
                onChange={e => setSpeed(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <button
            className="primary"
            onClick={getRoute}
            disabled={!origin || !dest || loading || status !== 'inactive'}
          >
            {loading ? 'Loading...' : 'Get Route'}
          </button>
          <button
            className="primary"
            onClick={startNavigation}
            disabled={!hasRoute || status !== 'inactive'}
          >
            Start Navigation
          </button>
          <button onClick={stopNavigation} disabled={status === 'inactive'}>
            Stop Navigation
          </button>
          <button onClick={clearAll}>Clear All</button>

          {status !== 'inactive' && (
            <div className={navInfoClass}>
              <strong>
                {status === 'navigating' ? 'Navigating' : 'Off Route'} ·{' '}
                {source === 'simulation' ? `${speed}x sim` : 'GPS'}
              </strong>
              <p>Remaining: {formatDistance(details.remainingDistance)}</p>
              <p>ETA: {formatDuration(details.remainingDuration)}</p>
              {details.progress != null && <p>Progress: {details.progress.toFixed(1)}%</p>}
              {details.instruction && <p>Instruction: {details.instruction}</p>}
            </div>
          )}

          <p className="hint">
            1. Set origin and destination by clicking the map.
            <br />
            2. Get a route.
            <br />
            3. Pick a location source and start navigation.
            <br />
            <br />
            <strong>Simulation</strong> walks the route at the chosen speed — no GPS required.
            <br />
            <strong>Real GPS</strong> uses your device location (requires permission).
          </p>
        </div>
      </Map>
    </div>
  );
}
