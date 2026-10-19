# Gebeta Maps in React (`@gebeta/react`, React 19)

## Rules that differ from what you'd guess

1. `<GebetaMap>` fills its **parent** (`width:100%; height:100%`). After 3.0.12, `style` /
   `className` style the wrapper and `mapStyle` (URL or object) / `styleUrl` set the map style.
   On **3.0.12 and earlier** do **not** pass `style={{...}}` — it is forwarded as the map
   style (broken map); size the parent instead.
2. The map is created once per auth value. Changing `center` / `zoom` props after mount does
   nothing — move the camera imperatively (`ref.current.getMap().flyTo(...)`).
3. `onLoad(gm)` receives the `GebetaMaps` instance (same as `ref.current`). All managers are ready
   there. `children` render only after load, inside a `position:relative` overlay box — good
   for absolutely-positioned panels.
4. `useGebetaMap()` exists internally but is **not exported** — use `ref` / `onLoad` and pass the
   instance down (or keep it in your own context).
5. Keep `auth` stable (memoize / state). A new token pair object with different strings
   re-creates the map.
6. The map stylesheet is imported by the component already (no CSS import needed).
7. TypeScript on 3.0.12: the `onLoad` parameter is not inferred (implicit `any`) — annotate it:
   `onLoad={(gm: GebetaMapRef) => ...}`. Later versions infer it.

## Props

`auth` | `apiKey` (exactly one), `center`, `zoom`, `styleUrl`, `mapStyle` (after 3.0.12),
`style` / `className` (wrapper, after 3.0.12), `clustering`,
`navigationControl`, `navigationControlPosition`, `onLoad(gm)`, `onError(err)`, `children`,
`ref` (→ `GebetaMaps`), plus any map option (`pitch`, `bearing`, `maxBounds`, …).

## Template

```tsx
import { useEffect, useRef, useState, type RefObject } from 'react';
import { GebetaMap, type GebetaMapRef } from '@gebeta/react';

type Auth = { accessToken: string; refreshToken: string };

function useGebetaAuth() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch('/gebeta/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientToken: import.meta.env.VITE_GEBETA_CLIENT_TOKEN }),
    })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`auth ${r.status}`))))
      .then(setAuth, e => setError(String(e)));
  }, []);
  return { auth, error };
}

export function MapPage() {
  const { auth, error } = useGebetaAuth();
  const mapRef = useRef<GebetaMapRef>(null);

  if (error) return <p>Map unavailable: {error}</p>;
  if (!auth) return <p>Loading…</p>;

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <GebetaMap
        ref={mapRef}
        auth={auth}
        center={[38.7578, 9.0301]}
        zoom={13}
        navigationControl
        onLoad={(gm: GebetaMapRef) => {
          const map = gm.getMap()!;
          map.on('click', e => console.log(e.lngLat));
        }}
        onError={err => console.error(err)}
      >
        <SearchPanel mapRef={mapRef} />
      </GebetaMap>
    </div>
  );
}

function SearchPanel({ mapRef }: { mapRef: RefObject<GebetaMapRef | null> }) {
  const [q, setQ] = useState('');
  async function search() {
    const gm = mapRef.current;
    if (!gm || !q.trim()) return;
    const [hit] = await gm.geocodingManager.geocode(q.trim());
    if (hit) gm.getMap()?.flyTo({ center: [hit.lngLat.lng, hit.lngLat.lat], zoom: 16 });
  }
  return (
    <div style={{ position: 'absolute', top: 12, left: 12, background: '#fff', padding: 8 }}>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && search()}
      />
    </div>
  );
}
```

## Clustering hook

```tsx
import { useClustering } from '@gebeta/react'; // also '@gebeta/react/clustering'

const clustering = { enabled: true, showClusterCount: true }; // module-level or useMemo

function Shops({ shops }: { shops: { id: string; lng: number; lat: number; name: string }[] }) {
  const { addMarker, clearMarkers } = useClustering(); // throws if clustering not enabled
  useEffect(() => {
    shops.forEach(s => addMarker({ id: s.id, lngLat: [s.lng, s.lat], popupContent: s.name }));
    return () => clearMarkers();
  }, [shops, addMarker, clearMarkers]);
  return null;
}

<GebetaMap auth={auth} clustering={clustering}>
  <Shops shops={shops} />
</GebetaMap>;
```

## Adding layers and markers in React

Add sources/layers in `onLoad`, keep data updates in effects that call
`map.getSource(id).setData(data)`. Don't add the same layer twice
on re-render — guard with `map.getLayer(id)`.

```tsx
import type { GeoJSONSource } from '@gebeta/react';

useEffect(() => {
  const map = mapRef.current?.getMap();
  const src = map?.getSource('vehicles') as GeoJSONSource | undefined;
  src?.setData(vehiclesGeoJson);
}, [vehiclesGeoJson]);

// markers tied to React state: add in an effect, remove in its cleanup
useEffect(() => {
  const gm = mapRef.current;
  if (!gm) return;
  const markers = shops.map(s => gm.addMarker({ lngLat: [s.lng, s.lat], popup: s.name }));
  return () => markers.forEach(m => m.remove());
}, [shops]);
```

## Directions / navigation from React

Use the instance: `await mapRef.current!.getDirections(o, d)`, `displayRoute`, `navigation.start(...)`.
`BrowserLocationProvider` is re-exported from `@gebeta/react`. Stop navigation in the unmount
cleanup (`return () => mapRef.current?.navigation.stop()`).

## Next.js / SSR

The map needs `window`. Render the map client-only:
`const MapPage = dynamic(() => import('./MapPage'), { ssr: false })` in a `'use client'` file.
Token exchange belongs in a Route Handler (`app/api/gebeta/auth/route.ts`) using `@gebeta/node`.
