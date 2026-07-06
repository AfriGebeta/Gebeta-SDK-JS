import type { API } from '@gebeta/api';

export class MarkerFactory implements API.Platform.Types.IMarkerFactory {
  createMarker(): API.Platform.Types.IMarker | null {
    throw new Error('MarkerFactory is not implemented yet — coming in Step 2.');
  }
}
