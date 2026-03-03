import { API } from '@gebeta/maps-api';

type LocationData = API.Platform.Types.LocationData;
type Role = API.Tracking.Types.Role;

export interface QueuedRequest {
  id: string; //which
  userId: string; //who
  role: Role;
  location: LocationData;
  timestamp: number;
  retryCount: number; //how many tries
}

export interface OfflineQueueOptions {
  maxQueueSize?: number;
  persistToStorage?: boolean;
  storageKey?: string;
}

export class OfflineQueue {
  private queue: QueuedRequest[] = [];
  private readonly maxQueueSize: number;
  private readonly persistToStorage: boolean;
  private readonly storageKey: string;

  constructor(options: OfflineQueueOptions = {}) {
    this.maxQueueSize = options.maxQueueSize ?? 100; 
    this.persistToStorage = options.persistToStorage ?? true;
    this.storageKey = options.storageKey ?? 'gebeta_tracking_queue';

    if (this.persistToStorage) {
      this.loadFromStorage();
    }
  }

  //adding
  enqueue(userId: string, role: Role, location: LocationData): QueuedRequest | null {
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift();
    }

    const request: QueuedRequest = {
      id: this.generateId(),
      userId,
      role,
      location,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(request);
    this.saveToStorage();

    return request;
  }

  //removing
  dequeue(): QueuedRequest | null {
    const request = this.queue.shift() || null;
    if (request) {
      this.saveToStorage();
    }
    return request;
  }

  getAll(): QueuedRequest[] {
    return [...this.queue];
  }

  remove(id: string): boolean {
    const index = this.queue.findIndex(req => req.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

//for retrying
  retry(request: QueuedRequest): void {
    request.retryCount++;
    this.queue.push(request);
    this.saveToStorage();
  }

  //clearing
  clear(): void {
    this.queue = [];
    this.saveToStorage();
  }

  size(): number {
    return this.queue.length;
  }

  //check if empty
  isEmpty(): boolean {
    return this.queue.length === 0;
  }


  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load offline queue from storage:', error);
    }
  }

//saves queue to localstorage
  private saveToStorage(): void {
    if (!this.persistToStorage || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.warn('Failed to save offline queue to storage:', error);
    }
  }

  //unique id for a request
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
