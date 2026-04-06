import { API } from '@gebeta/api';
import type { NormalizedClusteringOptions } from './types';

type ClusteringOptions = API.Clustering.Types.Options;

/**
 * Normalize clustering options by merging user options with defaults.
 * @param options - User-provided clustering options
 * @returns Normalized options with all required fields filled
 */
export function normalizeClusteringOptions(
  options: ClusteringOptions = {}
): NormalizedClusteringOptions {
  const defaults = API.Clustering.Constants.DEFAULT_OPTIONS;

  return {
    radius: options.radius ?? defaults.radius ?? 50,
    maxZoom: options.maxZoom ?? defaults.maxZoom ?? 16,
    clusterImage: options.clusterImage ?? null,
    clusterOnClick: options.clusterOnClick ?? null,
    showClusterCount: options.showClusterCount ?? defaults.showClusterCount ?? false,
  };
}
