import type { GebetaMapsInitOptions, ClusteringOptions } from './options';
import type { ServiceAccountAuth } from './auth';

/**
 * Props for the main GebetaMap component (React/React Native/Vue...).
 *
 * This combines constructor options (`apiKey`, `clustering`) and init options
 * (`container`, `styleUrl`, etc.) into a single props interface for component-based APIs.
 *
 * Usage:
 * - React: `<GebetaMap apiKey="..." container={ref} styleUrl="..." />`
 * - React Native: `<GebetaMap apiKey="..." styleUrl="..." />`
 * - Vue: `<GebetaMap :api-key="..." :style-url="..." />`
 *
 * For the imperative JS API, use `GebetaMapsConstructorOptions` + `GebetaMapsInitOptions` separately:
 * ```js
 * const map = new GebetaMaps({ apiKey: '...', clustering: {...} });
 * map.init({ container: '#map', styleUrl: '...' });
 * ```
 */
export interface GebetaMapProps extends GebetaMapsInitOptions {
  /** @deprecated Use `auth` instead. API key authentication is insecure — the key is visible in browser devtools. */
  apiKey?: string;
  /** Service account authentication credentials (access + refresh token pair) */
  auth?: ServiceAccountAuth;
  /** Clustering configuration options */
  clustering?: ClusteringOptions;
  /** Callback when map is loaded and ready */
  onLoad?: (map: any) => void;
  /** Callback when map encounters an error */
  onError?: (error: Error) => void;
  /** Child components (platform-specific) */
  children?: any;
}

/**
 * Props for the NavigationUI component.
 */
export interface NavigationUIProps {
  /**
   * Position of the navigation UI on the map.
   * Valid values: 'top', 'bottom', 'center'
   * Default: 'top'
   */
  position?: 'top' | 'bottom' | 'center';
  /**
   * UI theme.
   * Valid values: 'light', 'dark'
   * Default: 'light'
   */
  theme?: 'light' | 'dark';
  /** Callback when stop button is clicked */
  onStop?: () => void;
}
