import type { LayerSpec } from './MapSpecStore';

/**
 * Translate a MapLibre GL Style Spec layer's `paint` + `layout` into MapLibre-RN's single
 * camelCase `style` object.
 *
 * The managers emit kebab-cased, split paint/layout props (`{ paint: { 'line-color': … },
 * layout: { 'line-cap': … } }`) — the web MapLibre convention. MapLibre-RN merges both into
 * one `style` prop with camelCased keys (`{ lineColor: …, lineCap: … }`). This is a straight
 * mechanical rename; the values (including data-driven expressions) pass through untouched.
 */
export function layerStyleToRN(layer: LayerSpec): Record<string, unknown> {
  const style: Record<string, unknown> = {};
  const merge = (props: Record<string, unknown> | undefined) => {
    if (!props) return;
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined) continue;
      style[kebabToCamel(key)] = value;
    }
  };
  merge(layer.layout);
  merge(layer.paint);
  return style;
}

function kebabToCamel(key: string): string {
  return key.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());
}
