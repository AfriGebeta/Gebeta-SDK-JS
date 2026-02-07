const MAPLIBRE_CSS_URL = 'https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.css';
const STYLE_ID = 'gebeta-maps-maplibre-gl-css';

export function injectMapLibreStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = MAPLIBRE_CSS_URL;
  document.head.appendChild(link);
}
