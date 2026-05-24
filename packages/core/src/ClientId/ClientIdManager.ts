import type { API } from '@gebeta/api';

type IClientIdStorage = API.Platform.Types.IClientIdStorage;

export class ClientIdManager {
  private readonly clientId: string;

  constructor(storage?: IClientIdStorage) {
    const stored = storage?.getClientId();
    if (stored) {
      this.clientId = stored;
    } else {
      this.clientId = ClientIdManager.generateUUID();
      storage?.setClientId(this.clientId);
    }
  }

  getId(): string {
    return this.clientId;
  }

  private static generateUUID(): string {
    if (typeof globalThis.crypto?.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }
    // Fallback for environments where crypto.randomUUID is unavailable (e.g. older React Native)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
