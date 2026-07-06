import { useSyncExternalStore, type ReactElement } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { Marker } from '@maplibre/maplibre-react-native';
import type { Anchor } from '@maplibre/maplibre-react-native';
import type { MarkerStore, MarkerRecord } from './MarkerStore';

/**
 * Renders visible markers from a {@link MarkerStore} as MapLibre-RN v11 `<Marker>` children.
 *
 * Read side of the marker bridge: `MarkerFactory` (driven imperatively via `IMarker`) writes
 * records; this component subscribes via `useSyncExternalStore` and renders each as a
 * `<Marker lngLat={…}>`. A record's `imageUrl` renders as an `<Image>`; otherwise a simple
 * default pin dot is shown. Taps invoke the record's `onClick`.
 *
 * Must be rendered as a child of `<Map>`.
 */
export function MarkerRenderer({ store }: { store: MarkerStore }): ReactElement {
  const markers = useSyncExternalStore(
    listener => store.subscribe(listener),
    () => store.getSnapshot()
  );

  return (
    <>
      {markers.map(marker => (
        <Marker
          key={marker.id}
          id={String(marker.id)}
          lngLat={[marker.lngLat.lng, marker.lngLat.lat]}
          anchor={toAnchor(marker.anchor)}
          offset={marker.offset}
          onPress={() => marker.onClick?.(marker)}
        >
          {renderContent(marker)}
        </Marker>
      ))}
    </>
  );
}

function renderContent(marker: MarkerRecord): ReactElement {
  // Popups (text records) render as a bubble rather than a pin/image.
  if (marker.text !== undefined) {
    return (
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{marker.text}</Text>
      </View>
    );
  }
  const [width, height] = marker.size ?? [30, 30];
  if (marker.imageUrl) {
    return (
      <Image source={{ uri: marker.imageUrl }} style={{ width, height }} resizeMode="contain" />
    );
  }
  return <View style={[styles.defaultPin, { width, height, borderRadius: width / 2 }]} />;
}

const VALID_ANCHORS: readonly Anchor[] = [
  'center',
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

/** Pass through the string anchor from MarkerFactoryOptions if it's one v11 recognizes. */
function toAnchor(anchor?: string): Anchor | undefined {
  if (!anchor) return undefined;
  return (VALID_ANCHORS as readonly string[]).includes(anchor) ? (anchor as Anchor) : undefined;
}

const styles = StyleSheet.create({
  defaultPin: {
    backgroundColor: '#007cbf',
    borderWidth: 2,
    borderColor: '#fff',
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 12,
    color: '#222',
  },
});
