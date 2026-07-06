import type { API } from '@gebeta/api';

export class RNLocationProvider implements API.Platform.Types.ILocationProvider {
  private static instance: RNLocationProvider | null = null;

  static getInstance(_options?: API.Platform.Types.LocationProviderOptions): RNLocationProvider {
    if (!RNLocationProvider.instance) {
      RNLocationProvider.instance = new RNLocationProvider();
    }
    return RNLocationProvider.instance;
  }

  start(): void {
    throw new Error('RNLocationProvider is not implemented yet — coming in Step 6.');
  }

  stop(): void {
    throw new Error('RNLocationProvider is not implemented yet — coming in Step 6.');
  }
}
