import type { ReactNode } from 'react';
import { useRef, useState, useEffect, useMemo } from 'react';
import maplibre from 'maplibre-gl';
import type { API } from '@gebeta/api';
import { ValidationError } from '@gebeta/api';
import { AuthManager } from '@gebeta/core';
import { GebetaMapContext } from './context/MapContext';
import { createPlatform } from './adapters';
import { ClusteringManager } from './Clustering/ClusteringManager';

import 'maplibre-gl/dist/maplibre-gl.css';

export type GebetaMapProps = API.Components.Types.GebetaMapProps;

const DEFAULT_STYLE_URL = 'https://tiles.gebeta.app/styles/standard/style.json';

export function GebetaMap({
  apiKey,
  auth: authProp,
  styleUrl,
  style: styleProp,
  clustering,
  onLoad,
  onError,
  children,
  navigationControl = false,
  navigationControlPosition = 'top-right',
  ...rest
}: GebetaMapProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextValue, setContextValue] = useState<{
    platform: import('./adapters/createPlatform').PlatformContext;
    clusteringManager: ClusteringManager | null;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const authManager = useMemo(() => {
    const hasApiKey = !!apiKey;
    const hasAuth = !!authProp;

    if (!hasApiKey && !hasAuth) {
      throw new ValidationError('Either apiKey or auth is required', 'auth');
    }
    if (hasApiKey && hasAuth) {
      throw new ValidationError('Provide either apiKey or auth, not both', 'auth');
    }
    if (hasApiKey) {
      console.warn(
        '[Gebeta] apiKey auth is deprecated and will be removed in a future release. ' +
          'Use service account auth instead: https://docs.gebeta.app/auth'
      );
      return null; // legacy path — token is the apiKey string directly
    }
    return new AuthManager(authProp!);
  }, [apiKey, authProp?.accessToken, authProp?.refreshToken]);

  const getToken = (): string => {
    if (authManager) return authManager.getAccessToken();
    return apiKey!;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoadError(null);
    const resolvedStyle = styleProp || styleUrl || DEFAULT_STYLE_URL;

    const map = new maplibre.Map({
      container,
      style: resolvedStyle,
      attributionControl: false,
      ...rest,
      transformRequest: (url: string, _resourceType: string) => {
        if (url.startsWith('https://tiles.gebeta.app')) {
          return {
            url,
            headers: { Authorization: `Bearer ${getToken()}` },
          };
        }
        return { url };
      },
    });

    const platform = createPlatform(map);

    if (navigationControl && platform.mapAdapter.addControl) {
      platform.mapAdapter.addControl(new maplibre.NavigationControl(), navigationControlPosition);
    }

    const onStyleLoad = () => {
      let clusteringManager: ClusteringManager | null = null;
      if (clustering?.enabled) {
        clusteringManager = new ClusteringManager(
          platform.mapAdapter,
          platform.markerFactory,
          platform.popupFactory,
          clustering
        );
      }
      setContextValue({ platform, clusteringManager });
      onLoad?.({ clustering: clusteringManager });
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
      setContextValue(null);
    };
  }, [apiKey, authManager]);

  return (
    <GebetaMapContext.Provider value={contextValue}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
        {!contextValue ? (
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
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>{children}</div>
          </div>
        )}
      </div>
    </GebetaMapContext.Provider>
  );
}
