import { useSyncExternalStore, type ReactElement } from 'react';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { MapSpecStore, LayerSpec, GeoJsonSourceSpec } from './MapSpecStore';
import { layerStyleToRN } from './styleSpecToRN';

/**
 * Renders the declarative source/layer specs held in a {@link MapSpecStore} as MapLibre-RN
 * (v11) children.
 *
 * This is the read side of the store bridge: `MapAdapter.addSource`/`addLayer` (driven by the
 * platform-agnostic managers) write specs; this component subscribes via `useSyncExternalStore`
 * and re-renders `<GeoJSONSource>` / `<Layer>` children whenever they change.
 *
 * MapLibre-RN v11 replaced v10's per-type components (`ShapeSource`, `LineLayer`, `FillLayer`…)
 * with a generic `<Layer type=… style=…>` nested under `<GeoJSONSource data=…>`. Layers are
 * rendered inside their owning source so MapLibre infers `source` from the parent. Layers whose
 * `source` has no matching source spec are skipped.
 *
 * Must be rendered as a child of `<Map>`.
 */
export function MapSpecRenderer({ store }: { store: MapSpecStore }): ReactElement {
  const snapshot = useSyncExternalStore(
    listener => store.subscribe(listener),
    () => store.getSnapshot()
  );

  const layersBySource = new Map<string, LayerSpec[]>();
  for (const layer of snapshot.layers) {
    const list = layersBySource.get(layer.source);
    if (list) {
      list.push(layer);
    } else {
      layersBySource.set(layer.source, [layer]);
    }
  }

  return (
    <>
      {Array.from(snapshot.sources.entries()).map(([sourceId, source]) => (
        <GeoJSONSource
          key={sourceId}
          id={sourceId}
          data={toData(source)}
          cluster={source.cluster}
          clusterRadius={source.clusterRadius}
          clusterMaxZoom={source.clusterMaxZoom}
        >
          {(layersBySource.get(sourceId) ?? []).map(layer => renderLayer(sourceId, layer))}
        </GeoJSONSource>
      ))}
    </>
  );
}

const EMPTY_GEOJSON: GeoJSON.GeoJSON = { type: 'FeatureCollection', features: [] };

/**
 * MapLibre native rejects degenerate geometries (a LineString with <2 points, a Polygon with an
 * empty ring). Managers seed sources with such placeholders before real data arrives, so sanitize
 * them to an empty FeatureCollection (which renders nothing without erroring).
 */
function toData(source: GeoJsonSourceSpec): GeoJSON.GeoJSON {
  const data = source.data as GeoJSON.GeoJSON;
  const geometry = data && data.type === 'Feature' ? (data as GeoJSON.Feature).geometry : undefined;
  if (geometry) {
    if (geometry.type === 'LineString' && geometry.coordinates.length < 2) return EMPTY_GEOJSON;
    if (
      geometry.type === 'Polygon' &&
      (geometry.coordinates.length === 0 || geometry.coordinates[0].length < 4)
    ) {
      return EMPTY_GEOJSON;
    }
  }
  return data;
}

const SUPPORTED_LAYER_TYPES = new Set(['line', 'fill', 'circle', 'symbol']);

function renderLayer(sourceId: string, layer: LayerSpec): ReactElement | null {
  if (!SUPPORTED_LAYER_TYPES.has(layer.type)) {
    // Unsupported layer type on RN; skip rather than crash the map.
    return null;
  }
  return (
    <Layer
      key={layer.id}
      id={layer.id}
      // `type` is a discriminated union in v11; the store only ever holds the supported set,
      // but TS can't prove that from `string`, so narrow via cast.
      type={layer.type as 'line' | 'fill' | 'circle' | 'symbol'}
      source={sourceId}
      style={layerStyleToRN(layer)}
    />
  );
}
