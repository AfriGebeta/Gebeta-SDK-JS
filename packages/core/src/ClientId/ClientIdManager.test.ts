import { ClientIdManager } from './ClientIdManager';
import type { API } from '@gebeta/api';

type IClientIdStorage = API.Platform.Types.IClientIdStorage;

function makeStorage(
  initial: string | null = null
): IClientIdStorage & { store: Record<string, string | null> } {
  const store: Record<string, string | null> = { id: initial };
  return {
    store,
    getClientId: () => store.id,
    setClientId: (id: string) => {
      store.id = id;
    },
  };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('ClientIdManager', () => {
  describe('when no storage is provided', () => {
    test('should generate a valid UUID v4', () => {
      // GIVEN no storage adapter
      // WHEN ClientIdManager is constructed
      const manager = new ClientIdManager();

      // THEN getId() returns a valid UUID v4
      expect(manager.getId()).toMatch(UUID_REGEX);
    });

    test('should generate a different ID on each construction', () => {
      // GIVEN two ClientIdManager instances with no storage
      // WHEN both are constructed
      const a = new ClientIdManager();
      const b = new ClientIdManager();

      // THEN their IDs are different
      expect(a.getId()).not.toBe(b.getId());
    });
  });

  describe('when storage has no existing ID', () => {
    test('should generate a new UUID and persist it to storage', () => {
      // GIVEN storage with no existing client ID
      const storage = makeStorage(null);

      // WHEN ClientIdManager is constructed
      const manager = new ClientIdManager(storage);

      // THEN a new UUID is generated and written to storage
      expect(manager.getId()).toMatch(UUID_REGEX);
      expect(storage.store.id).toBe(manager.getId());
    });

    test('should call setClientId exactly once on first construction', () => {
      // GIVEN storage with no existing ID and a spy on setClientId
      const storage = makeStorage(null);
      const setSpy = jest.spyOn(storage, 'setClientId');

      // WHEN ClientIdManager is constructed
      new ClientIdManager(storage);

      // THEN setClientId was called once with the generated ID
      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(setSpy.mock.calls[0][0]).toMatch(UUID_REGEX);
    });
  });

  describe('when storage has an existing ID', () => {
    test('should reuse the stored ID instead of generating a new one', () => {
      // GIVEN storage with a pre-existing client ID
      const existingId = '12345678-1234-4234-8234-123456789abc';
      const storage = makeStorage(existingId);

      // WHEN ClientIdManager is constructed
      const manager = new ClientIdManager(storage);

      // THEN getId() returns the stored ID, not a newly generated one
      expect(manager.getId()).toBe(existingId);
    });

    test('should not call setClientId when an existing ID is found', () => {
      // GIVEN storage with a pre-existing client ID
      const storage = makeStorage('12345678-1234-4234-8234-123456789abc');
      const setSpy = jest.spyOn(storage, 'setClientId');

      // WHEN ClientIdManager is constructed
      new ClientIdManager(storage);

      // THEN setClientId is never called
      expect(setSpy).not.toHaveBeenCalled();
    });

    test('should return the same ID on repeated getId() calls', () => {
      // GIVEN a ClientIdManager constructed with a stored ID
      const storage = makeStorage('12345678-1234-4234-8234-123456789abc');
      const manager = new ClientIdManager(storage);

      // WHEN getId() is called multiple times
      const first = manager.getId();
      const second = manager.getId();

      // THEN the same ID is returned each time
      expect(first).toBe(second);
    });
  });

  describe('ID stability across instances sharing the same storage', () => {
    test('should return the same ID when two managers share storage', () => {
      // GIVEN storage with no pre-existing ID
      const storage = makeStorage(null);

      // WHEN two ClientIdManagers are constructed with the same storage
      const first = new ClientIdManager(storage);
      const second = new ClientIdManager(storage);

      // THEN both managers return the same ID (the one the first wrote)
      expect(first.getId()).toBe(second.getId());
    });
  });

  describe('UUID format', () => {
    test('should always produce a version-4 UUID', () => {
      // GIVEN multiple managers constructed without storage
      // WHEN getId() is called on each
      const ids = Array.from({ length: 20 }, () => new ClientIdManager().getId());

      // THEN every ID is a valid UUID v4 (version digit is 4, variant digit is 8/9/a/b)
      ids.forEach(id => expect(id).toMatch(UUID_REGEX));
    });
  });

  describe('when crypto.randomUUID is unavailable', () => {
    test('should fall back to Math.random-based UUID generation', () => {
      // GIVEN crypto.randomUUID is not available (e.g. older React Native)
      const original = globalThis.crypto?.randomUUID;
      // @ts-expect-error simulating absence of randomUUID
      if (globalThis.crypto) globalThis.crypto.randomUUID = undefined;

      // WHEN ClientIdManager is constructed
      const manager = new ClientIdManager();

      // THEN a valid UUID v4 is still produced via the fallback
      expect(manager.getId()).toMatch(UUID_REGEX);

      if (globalThis.crypto) (globalThis.crypto as typeof globalThis.crypto & { randomUUID: unknown }).randomUUID = original;
    });
  });
});
