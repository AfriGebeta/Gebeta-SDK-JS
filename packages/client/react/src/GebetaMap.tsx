import type { ReactNode, Ref, MutableRefObject, ForwardRefRenderFunction } from 'react';
import { useRef, useState, useEffect, useMemo, forwardRef } from 'react';
import type { API } from '@gebeta/api';
import { GebetaMaps } from '@gebeta/js';
import { GebetaMapContext } from './context/MapContext';

import 'maplibre-gl/dist/maplibre-gl.css';

export type GebetaMapProps = Omit<API.Components.Types.GebetaMapProps<GebetaMaps>, 'children'> & {
  children?: ReactNode;
};
export type GebetaMapRef = GebetaMaps;

/**
 * Main React component for rendering a Gebeta map.
 *
 * Constructs a `GebetaMaps` instance, mounts the map, and surfaces the instance
 * to consumers in two ways:
 *  - `ref` — read `ref.current` anywhere after `onLoad` has fired.
 *  - `onLoad(gm)` — called once the map style is loaded, with the instance.
 *
 * Children may also call `useGebetaMap()` to access the instance from context.
 *
 * @example
 * ```tsx
 * <GebetaMap auth={auth} onLoad={(gm) => gm.geocodingManager.geocode('Bole')} />
 * ```
 */
function GebetaMapImpl(
  {
    apiKey,
    auth: authProp,
    styleUrl,
    clustering,
    onLoad,
    onError,
    children,
    navigationControl = false,
    navigationControlPosition = 'top-right',
    center,
    zoom,
    ...rest
  }: GebetaMapProps,
  ref: Ref<GebetaMapRef>
): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gebetaMaps, setGebetaMaps] = useState<GebetaMaps | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  function assignRef(value: GebetaMaps | null) {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      (ref as MutableRefObject<GebetaMaps | null>).current = value;
    }
  }

  const authKey = useMemo(
    () => (authProp ? `${authProp.accessToken}|${authProp.refreshToken}` : (apiKey ?? '')),
    [apiKey, authProp?.accessToken, authProp?.refreshToken]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoadError(null);

    const gm = new GebetaMaps({
      ...(authProp ? { auth: authProp } : { apiKey: apiKey as string }),
      ...(clustering ? { clustering } : {}),
    });

    const map = gm.init({
      container,
      center,
      zoom,
      styleUrl,
      navigationControl,
      navigationControlPosition,
      ...rest,
    });

    assignRef(gm);

    const onStyleLoad = () => {
      setGebetaMaps(gm);
      onLoad?.(gm);
    };

    if (map.isStyleLoaded()) {
      onStyleLoad();
    } else {
      map.once('style.load', onStyleLoad);
    }

    map.on('error', (...args: unknown[]) => {
      const e = args[0] as { error?: Error };
      const err = e?.error ?? new Error('Map error');
      setLoadError(err.message);
      onError?.(err);
    });

    return () => {
      map.remove();
      assignRef(null);
      setGebetaMaps(null);
    };
  }, [authKey]);

  return (
    <GebetaMapContext.Provider value={gebetaMaps}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
        {!gebetaMaps ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f0f0f0',
              pointerEvents: 'none',
              padding: 20,
            }}
          >
            {loadError ? (
              <>
                <span style={{ color: '#c00', marginBottom: 8 }}>Error: {loadError}</span>
                <span style={{ fontSize: 12, color: '#666' }}>
                  Set VITE_GEBETA_API_KEY in .env for Gebeta tiles.
                </span>
              </>
            ) : (
              'Loading map...'
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </GebetaMapContext.Provider>
  );
}

// `forwardRef`'s `Omit<P, 'ref'>` distributes over discriminated unions; the
// resulting `props` type widens and stops being assignable to `GebetaMapProps`.
// Cast the impl to a non-union shape for forwardRef's sake, then cast the
// result back to a component that takes the original discriminated-union props.
export const GebetaMap = forwardRef(
  GebetaMapImpl as ForwardRefRenderFunction<GebetaMapRef, never>
) as unknown as (props: GebetaMapProps & { ref?: Ref<GebetaMapRef> }) => ReactNode;
