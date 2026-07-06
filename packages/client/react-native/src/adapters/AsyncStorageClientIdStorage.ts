import type { API } from '@gebeta/api';

/**
 * In-memory client-id storage for React Native.
 *
 * A persistent implementation backed by @react-native-async-storage/async-storage is
 * planned for a later step. For now this keeps the id in memory for the app lifetime.
 */
export class AsyncStorageClientIdStorage implements API.Platform.Types.IClientIdStorage {
  private clientId: string | null = null;

  getClientId(): string | null {
    return this.clientId;
  }

  setClientId(id: string): void {
    this.clientId = id;
  }
}
