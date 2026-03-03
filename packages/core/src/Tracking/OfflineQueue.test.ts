import '../_test_utilities/consoleMock';
import { OfflineQueue } from './OfflineQueue';
import { API } from '@gebeta/maps-api';

describe('OfflineQueue', () => {
  let queue: OfflineQueue;

  beforeEach(() => {
    //clear the local storage before a new one
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    queue = new OfflineQueue({ persistToStorage: false });
  });

  describe('enqueue', () => {
    test('should add request to queue', () => {
      // GIVEN a location data object
      const location: API.Platform.Types.LocationData = {
        lat: 9.145,
        lng: 38.7666,
        accuracy: 10,
        timestamp: Date.now(),
      };

      // WHEN enqueueing the request
      const request = queue.enqueue('user-1', 'driver', location);

      // THEN it should add the request to the queue
      expect(request).not.toBeNull();
      expect(request?.userId).toBe('user-1');
      expect(request?.role).toBe('driver');
      expect(request?.location).toEqual(location);
      expect(queue.size()).toBe(1);
    });

    test('should remove oldest item when queue is full', () => {
      // GIVEN a queue with max size of 2
      const smallQueue = new OfflineQueue({ maxQueueSize: 2, persistToStorage: false });
      const location: API.Platform.Types.LocationData = {
        lat: 9.145,
        lng: 38.7666,
        accuracy: 10,
        timestamp: Date.now(),
      };

      // WHEN adding three requests to the queue
      const req1 = smallQueue.enqueue('user-1', 'driver', location);
      const req2 = smallQueue.enqueue('user-2', 'driver', location);
      const req3 = smallQueue.enqueue('user-3', 'driver', location);

      // THEN it should remove the oldest item and keep the latest two
      expect(smallQueue.size()).toBe(2);
      const all = smallQueue.getAll();
      expect(all[0].id).toBe(req2?.id);
      expect(all[1].id).toBe(req3?.id);
      expect(all.find(r => r.id === req1?.id)).toBeUndefined();
    });
  });

  describe('dequeue', () => {
    test('should remove and return first request', () => {
      // GIVEN a queue with two requests
      const location: API.Platform.Types.LocationData = {
        lat: 9.145,
        lng: 38.7666,
        accuracy: 10,
        timestamp: Date.now(),
      };
      const req1 = queue.enqueue('user-1', 'driver', location);
      queue.enqueue('user-2', 'driver', location);

      // WHEN dequeuing a request
      const dequeued = queue.dequeue();

      // THEN it should return the first request and reduce queue size
      expect(dequeued?.id).toBe(req1?.id);
      expect(queue.size()).toBe(1);
    });

    test('should return null when queue is empty', () => {
      // GIVEN an empty queue
      // WHEN dequeuing a request
      const dequeued = queue.dequeue();

      // THEN it should return null
      expect(dequeued).toBeNull();
    });
  });

  describe('getAll', () => {
    test('should return all requests without removing them', () => {
      // GIVEN a queue with two requests
      const location: API.Platform.Types.LocationData = {
        lat: 9.145,
        lng: 38.7666,
        accuracy: 10,
        timestamp: Date.now(),
      };
      queue.enqueue('user-1', 'driver', location);
      queue.enqueue('user-2', 'driver', location);

      // WHEN getting all requests
      const all = queue.getAll();

      // THEN it should return all requests without removing them
      expect(all.length).toBe(2);
      expect(queue.size()).toBe(2);
    });
  });

  describe('remove', () => {
    test('should remove specific request by id', () => {
      // GIVEN a queue with two requests
      const location: API.Platform.Types.LocationData = {
        lat: 9.145,
        lng: 38.7666,
        accuracy: 10,
        timestamp: Date.now(),
      };
      const req1 = queue.enqueue('user-1', 'driver', location);
      queue.enqueue('user-2', 'driver', location);

      // WHEN removing a specific request by id
      const removed = queue.remove(req1!.id);

      // THEN it should remove the request and return true
      expect(removed).toBe(true);
      expect(queue.size()).toBe(1);
    });

    test('should return false when id not found', () => {
      // GIVEN an empty queue
      // WHEN removing a non-existent id
      const removed = queue.remove('non-existent-id');

      // THEN it should return false
      expect(removed).toBe(false);
    });
  });

  describe('retry', () => {
    test('should increment retry count and re-queue request', () => {
      // GIVEN a dequeued request
      const location: API.Platform.Types.LocationData = {
        lat: 9.145,
        lng: 38.7666,
        accuracy: 10,
        timestamp: Date.now(),
      };
      queue.enqueue('user-1', 'driver', location);
      const dequeued = queue.dequeue();

      // WHEN retrying the request
      expect(dequeued?.retryCount).toBe(0);
      queue.retry(dequeued!);

      // THEN it should increment retry count and re-queue
      const all = queue.getAll();
      expect(all[0].retryCount).toBe(1);
      expect(queue.size()).toBe(1);
    });
  });

  describe('clear', () => {
    test('should remove all requests', () => {
      // GIVEN a queue with two requests
      const location: API.Platform.Types.LocationData = {
        lat: 9.145,
        lng: 38.7666,
        accuracy: 10,
        timestamp: Date.now(),
      };
      queue.enqueue('user-1', 'driver', location);
      queue.enqueue('user-2', 'driver', location);

      // WHEN clearing the queue
      queue.clear();

      // THEN it should remove all requests
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('isEmpty', () => {
    test('should return true when queue is empty', () => {
      // GIVEN an empty queue
      // WHEN checking if queue is empty
      // THEN it should return true
      expect(queue.isEmpty()).toBe(true);
    });

    test('should return false when queue has items', () => {
      // GIVEN a queue with one request
      const location: API.Platform.Types.LocationData = {
        lat: 9.145,
        lng: 38.7666,
        accuracy: 10,
        timestamp: Date.now(),
      };
      queue.enqueue('user-1', 'driver', location);

      // WHEN checking if queue is empty
      // THEN it should return false
      expect(queue.isEmpty()).toBe(false);
    });
  });
});
