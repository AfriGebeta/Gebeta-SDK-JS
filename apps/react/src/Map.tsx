// Map.tsx — reusable map container using GebetaMaps directly (same pattern as svelte Map.svelte).
// Gives pages full access to the GebetaMaps instance and all managers.

import { useEffect, useRef, type ReactNode } from 'react';
import { GebetaMaps } from '@gebeta/js';
import type { Map as MapLibreMap } from 'maplibre-gl';

export type Platform = ReturnType<GebetaMaps['getPlatform']>;

interface ClusteringOptions {
  enabled?: boolean;
  radius?: number;
  maxZoom?: number;
  showClusterCount?: boolean;
}

interface MapProps {
  auth: { accessToken: string; refreshToken: string };
  center?: [number, number];
  zoom?: number;
  clustering?: ClusteringOptions;
  onReady?: (gebetaMap: GebetaMaps, map: MapLibreMap, platform: Platform) => void;
  children?: ReactNode;
}

export default function Map({
  auth,
  center = [38.7685, 9.0161],
  zoom = 12,
  clustering,
  onReady,
  children,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    if (!containerRef.current) return;

    const gm = new GebetaMaps({ auth, ...(clustering ? { clustering } : {}) });
    const m = gm.init({ container: containerRef.current, center, zoom, navigationControl: true });

    function handleStyleLoad() {
      onReadyRef.current?.(gm, m, gm.getPlatform());
    }

    if (m.isStyleLoaded()) {
      handleStyleLoad();
    } else {
      m.once('style.load', handleStyleLoad);
    }

    return () => {
      m.remove();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      {children}
    </div>
  );
}
