/**
 * Simple event emitter for core managers.
 * Platform-agnostic: pure event handling logic, no DOM dependencies.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => void;

export class EventEmitter<T extends { [K in keyof T]: AnyFn }> {
  private readonly listeners: Map<keyof T, Set<AnyFn>> = new Map();

  /**
   * Register an event listener.
   * @param event - Event name
   * @param callback - Callback function
   */
  on<K extends keyof T>(event: K, callback: T[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Remove an event listener.
   * @param event - Event name
   * @param callback - Callback function to remove
   */
  off<K extends keyof T>(event: K, callback: T[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit an event to all registered listeners.
   * @param event - Event name
   * @param args - Event payload arguments
   */
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${String(event)}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event, or all events if no event specified.
   * @param event - Optional event name
   */
  removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get the number of listeners for an event.
   * @param event - Event name
   * @returns Number of listeners
   */
  listenerCount<K extends keyof T>(event: K): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}
