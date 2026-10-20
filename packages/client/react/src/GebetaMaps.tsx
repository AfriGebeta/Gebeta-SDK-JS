import type {
  CSSProperties,
  ReactNode,
  Ref,
  MutableRefObject,
  ForwardRefRenderFunction,
} from 'react';
import { useRef, useState, useEffect, useMemo, forwardRef } from 'react';
import type { API } from '@gebeta/api';
import { GebetaMaps as GebetaMapsClass } from '@gebeta/js';
import { GebetaMapContext } from './context/MapContext';

import 'maplibre-gl/dist/maplibre-gl.css';

/**
 * Extra MapLibre map options forwarded to `new maplibregl.Map()`.
 * `container`, `style`, `center` and `zoom` are managed by the component.
 */
type ForwardedMapOptions = {
  pitch?: number;
  bearing?: number;
  minZoom?: number;
  maxZoom?: number;
  minPitch?: number;
  maxPitch?: number;
  maxBounds?: [[number, number], [number, number]];
  interactive?: boolean;
  hash?: boolean | string;
  cooperativeGestures?: boolean;
  renderWorldCopies?: boolean;
  /** Any other MapLibre `MapOptions` key. */
  [option: string]: unknown;
};

// Declared explicitly (instead of `Omit<API.Components.Types.GebetaMapsProps>`) because that type
// has a `[key: string]: any` index signature, and `Omit` over it collapses every prop to `any`.
export type GebetaMapsProps = API.Auth.Types.AuthOptions &
  ForwardedMapOptions & {
    /** Initial center `[lng, lat]`. Only read on mount. */
    center?: [number, number];
    /** Initial zoom. Only read on mount. */
    zoom?: number;
    /** Map style JSON URL (defaults to the Gebeta standard style). */
    styleUrl?: string;
    /** Map style URL or style object; takes precedence over `styleUrl`. */
    mapStyle?: string | object;
    /** Clustering configuration (read on mount). */
    clustering?: API.Clustering.Types.Options;
    /** Show zoom/compass controls (default: false). */
    navigationControl?: boolean;
    /** Corner for navigation controls (default: 'top-right'). */
    navigationControlPosition?: string;
    /** Called once the map style has loaded, with the GebetaMaps instance. */
    onLoad?: (instance: GebetaMapsClass) => void;
    /** Called on map errors. */
    onError?: (error: Error) => void;
    /** CSS styles for the map wrapper element (defaults to filling the parent). */
    style?: CSSProperties;
    /** CSS class for the map wrapper element. */
    className?: string;
    /** Rendered over the map once it has loaded. */
    children?: ReactNode;
  };
export type GebetaMapsRef = GebetaMapsClass;

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
 * <GebetaMaps auth={auth} onLoad={(gm) => gm.geocodingManager.geocode('Bole')} />
 * ```
 */
function GebetaMapImpl(
  {
    apiKey,
    auth: authProp,
    styleUrl,
    mapStyle,
    clustering,
    onLoad,
    onError,
    children,
    style,
    className,
    navigationControl = false,
    navigationControlPosition = 'top-right',
    center,
    zoom,
    ...rest
  }: GebetaMapsProps,
  ref: Ref<GebetaMapsRef>
): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gebetaMaps, setGebetaMaps] = useState<GebetaMapsClass | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  function assignRef(value: GebetaMapsClass | null) {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      (ref as MutableRefObject<GebetaMapsClass | null>).current = value;
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

    // Pass both through so GebetaMaps rejects "neither" and "both" with a ValidationError.
    const gm = new GebetaMapsClass({
      auth: authProp,
      apiKey,
      ...(clustering ? { clustering } : {}),
    } as ConstructorParameters<typeof GebetaMapsClass>[0]);

    const map = gm.init({
      container,
      center,
      zoom,
      styleUrl: typeof mapStyle === 'string' ? mapStyle : styleUrl,
      ...(mapStyle && typeof mapStyle === 'object' ? { style: mapStyle } : {}),
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
      <div
        className={className}
        style={{ position: 'relative', width: '100%', height: '100%', ...style }}
      >
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
// resulting `props` type widens and stops being assignable to `GebetaMapsProps`.
// Cast the impl to a non-union shape for forwardRef's sake, then cast the
// result back to a component that takes the original discriminated-union props.
export const GebetaMaps = forwardRef(
  GebetaMapImpl as ForwardRefRenderFunction<GebetaMapsRef, never>
) as unknown as (props: GebetaMapsProps & { ref?: Ref<GebetaMapsRef> }) => ReactNode;
