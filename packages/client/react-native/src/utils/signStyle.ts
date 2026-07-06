import type { TileTransformFn } from '@gebeta/core';

/**
 * Fetch a MapLibre style.json and rewrite all tile URLs through the transform.
 *
 * `@maplibre/maplibre-react-native` does not expose a `transformRequest` hook the way
 * maplibre-gl does on the web, so we sign the style up front and feed it to MapView as
 * a `styleJSON` string. For API_KEY auth this is sufficient (the key rides on every
 * tile request as a query param). For SERVICE_ACCOUNT auth a token-refresh story has
 * to be added on top — out of scope for Step 1; tracked as a follow-up.
 */
export async function fetchSignedStyle(
  styleUrl: string,
  transform: TileTransformFn,
  signal?: AbortSignal
): Promise<string> {
  const signedStyleRequest = transform(styleUrl);
  const response = await fetch(signedStyleRequest.url, {
    headers: signedStyleRequest.headers,
    signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch style.json (${response.status} ${response.statusText})`);
  }
  const style = await response.json();
  rewriteTileUrls(style, transform);
  return JSON.stringify(style);
}

interface StyleJson {
  sources?: Record<string, StyleSource>;
  sprite?: string | Array<{ id: string; url: string }>;
  glyphs?: string;
}

interface StyleSource {
  tiles?: string[];
  url?: string;
}

function rewriteTileUrls(style: StyleJson, transform: TileTransformFn): void {
  if (style.sources) {
    for (const source of Object.values(style.sources)) {
      if (Array.isArray(source.tiles)) {
        source.tiles = source.tiles.map(tile => transform(tile).url);
      }
      if (typeof source.url === 'string') {
        source.url = transform(source.url).url;
      }
    }
  }
  if (typeof style.sprite === 'string') {
    style.sprite = transform(style.sprite).url;
  } else if (Array.isArray(style.sprite)) {
    style.sprite = style.sprite.map(entry => ({ ...entry, url: transform(entry.url).url }));
  }
  if (typeof style.glyphs === 'string') {
    style.glyphs = transform(style.glyphs).url;
  }
}
