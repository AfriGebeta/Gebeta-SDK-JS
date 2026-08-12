import type { GebetaMapsInitOptions, ClusteringOptions } from './options';
import type { AuthOptions } from './auth';

/**
 * Props for the main GebetaMap component (React/React Native/Vue...).
 *
 * Combines constructor options (auth, clustering) and init options
 * (`container`, `styleUrl`, etc.) into a single props interface.
 *
 * Auth is enforced as a compile-time discriminated union via `AuthOptions`:
 * exactly one of `apiKey` (deprecated) or `auth` (service account) must be passed.
 *
 * Usage:
 * - React: `<GebetaMap auth={{ accessToken, refreshToken }} styleUrl="..." />`
 * - React Native: `<GebetaMap auth={{ accessToken, refreshToken }} styleUrl="..." />`
 * - Vue: `<GebetaMap :auth="{ accessToken, refreshToken }" :style-url="..." />`
 *
 * For the imperative JS API, use `GebetaMapsConstructorOptions` + `GebetaMapsInitOptions` separately:
 * ```js
 * const map = new GebetaMaps({ auth: {...}, clustering: {...} });
 * map.init({ container: '#map', styleUrl: '...' });
 * ```
 */
export type GebetaMapProps<TInstance = unknown> = AuthOptions &
  GebetaMapsInitOptions & {
    /** Clustering configuration options */
    clustering?: ClusteringOptions;
    /**
     * Callback when map is loaded and ready.
     * The argument's concrete type is set by the platform client
     * (e.g. `GebetaMaps` in `@gebeta/js`). When unspecified, the callback
     * receives `unknown` and consumers must narrow before use — but in
     * practice every client wires `TInstance` to its concrete SDK class.
     */
    onLoad?: (instance: TInstance) => void;
    /** Callback when map encounters an error */
    onError?: (error: Error) => void;
    /** Child components (platform-specific) */
    children?: unknown;
  };

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
