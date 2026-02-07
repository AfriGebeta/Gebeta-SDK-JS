import { DEFAULT_CLUSTERING_OPTIONS } from '../constants';

export namespace Clustering {
  export namespace Types {
    export type Options = import('../types/options').ClusteringOptions;
  }

  export const Constants = {
    DEFAULT_OPTIONS: DEFAULT_CLUSTERING_OPTIONS,
  } as const;
}
