import type { API } from '@gebeta/api';
import type { MarkerStore, MarkerRecord } from './MarkerStore';

type IMarker = API.Platform.Types.IMarker;
type IMarkerFactory = API.Platform.Types.IMarkerFactory;
type LngLatLike = API.Common.Types.LngLatLike;
type LngLat = API.Common.Types.LngLat;

/**
 * RN-specific superset of `MarkerFactoryOptions`. RN can't style markers via a DOM `element`
 * (the web escape hatch), so cluster styling is passed structurally via `clusterCount`. The
 * factory's implementation accepts this superset; callers using the plain `IMarkerFactory`
 * contract are unaffected.
 */
export type RNMarkerFactoryOptions = API.Platform.Types.MarkerFactoryOptions & {
  clusterCount?: number;
};

function toLngLat(lngLat: LngLatLike): LngLat {
  if (Array.isArray(lngLat)) return { lng: lngLat[0], lat: lngLat[1] };
  return { lng: lngLat.lng, lat: lngLat.lat };
}

function normalizeOffset(offset?: number | [number, number]): [number, number] | undefined {
  if (offset === undefined) return undefined;
  return typeof offset === 'number' ? [offset, offset] : offset;
}

/**
 * `IMarker` adapter backed by a {@link MarkerStore} record. Imperative marker operations
 * (`setLngLat`, `addTo`, `remove`) mutate the store; a `MarkerRenderer` turns visible records
 * into `<Marker>` children. `addTo(map)` only needs to flip the record visible — the renderer
 * already lives under the same `<Map>`, so the `map` argument is not otherwise used.
 */
class RNMarker implements IMarker {
  constructor(
    private store: MarkerStore,
    private id: number
  ) {}

  setLngLat(lngLat: LngLatLike): this {
    this.store.update(this.id, { lngLat: toLngLat(lngLat) });
    return this;
  }

  addTo(_map: unknown): this {
    this.store.setVisible(this.id, true);
    return this;
  }

  remove(): void {
    this.store.remove(this.id);
  }
}

export class MarkerFactory implements IMarkerFactory {
  constructor(private store: MarkerStore) {}

  createMarker(options: RNMarkerFactoryOptions): IMarker | null {
    const onClick = options.onClick;
    const record: Omit<MarkerRecord, 'id' | 'visible'> = {
      // Placeholder position; the caller sets the real coordinate via setLngLat before addTo.
      lngLat: { lng: 0, lat: 0 },
      imageUrl: options.imageUrl,
      size: options.size,
      anchor: options.anchor,
      offset: normalizeOffset(options.offset),
      clusterCount: options.clusterCount,
    };

    const id = this.store.create(record);
    const marker = new RNMarker(this.store, id);

    if (onClick) {
      // Bridge the store's click callback to the IMarker onClick signature. The web `event`
      // arg is a DOM MouseEvent, which has no RN equivalent; pass an empty object cast.
      this.store.update(id, {
        onClick: rec => onClick(rec.lngLat, marker, {} as MouseEvent),
      });
    }

    return marker;
  }
}
