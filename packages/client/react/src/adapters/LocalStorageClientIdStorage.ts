import { API } from '@gebeta/api';

export class LocalStorageClientIdStorage implements API.Platform.Types.IClientIdStorage {
  getClientId(): string | null {
    try {
      return localStorage.getItem(API.Platform.Constants.CLIENT_ID_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  setClientId(id: string): void {
    try {
      localStorage.setItem(API.Platform.Constants.CLIENT_ID_STORAGE_KEY, id);
    } catch {
      // Silently ignore — private browsing may block writes
    }
  }
}
