import type { API } from '@gebeta/api';

export class PopupFactory implements API.Platform.Types.IPopupFactory {
  createPopup(): API.Platform.Types.IPopup | null {
    throw new Error('PopupFactory is not implemented yet — coming in Step 2.');
  }
}
