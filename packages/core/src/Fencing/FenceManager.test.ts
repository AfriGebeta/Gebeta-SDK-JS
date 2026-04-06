import '../_test_utilities/consoleMock';
import { FenceManager } from './FenceManager';
import { API } from '@gebeta/api';
import { ValidationError } from '@gebeta/api';

describe('FenceManager', () => {
  let manager: FenceManager;

  beforeEach(() => {
    manager = new FenceManager();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should create instance with default style', () => {
      // GIVEN no style options provided
      // WHEN creating a FenceManager instance
      // THEN it should create the instance successfully
      expect(manager).toBeInstanceOf(FenceManager);
      // AND it should use default style
      const style = manager.getDefaultStyle();
      expect(style.fillColor).toBe('#ff0000');
      expect(style.fillOpacity).toBe(0.3);
    });

    test('should create instance with custom style', () => {
      // GIVEN custom style options
      const customStyle: API.Fencing.Types.StyleOptions = {
        fillColor: '#00ff00',
        fillOpacity: 0.5,
        lineColor: '#0000ff',
      };
      // WHEN creating a FenceManager instance with custom style
      manager = new FenceManager(customStyle);
      // THEN it should use the custom style
      const actualStyle = manager.getDefaultStyle();
      expect(actualStyle.fillColor).toBe('#00ff00');
      expect(actualStyle.fillOpacity).toBe(0.5);
      expect(actualStyle.lineColor).toBe('#0000ff');
    });
  });

  describe('startDrawing', () => {
    test('should start drawing a new fence', () => {
      // GIVEN a FenceManager instance
      // WHEN starting to draw a fence
      manager.startDrawing();
      // THEN it should be in drawing state
      expect(manager.isDrawing()).toBe(true);
      // AND current fence points should be empty
      expect(manager.getCurrentFencePoints()).toHaveLength(0);
    });

    test('should start drawing with custom style', () => {
      // GIVEN a FenceManager instance
      const customStyle: API.Fencing.Types.StyleOptions = {
        fillColor: '#00ff00',
      };
      // WHEN starting to draw with custom style
      manager.startDrawing(customStyle);
      // THEN it should use the custom style
      const currentStyle = manager.getCurrentStyle();
      expect(currentStyle.fillColor).toBe('#00ff00');
    });
  });

  describe('stopDrawing', () => {
    test('should stop drawing', () => {
      // GIVEN a fence being drawn
      manager.startDrawing();
      expect(manager.isDrawing()).toBe(true);
      // WHEN stopping drawing
      manager.stopDrawing();
      // THEN it should no longer be in drawing state
      expect(manager.isDrawing()).toBe(false);
    });
  });

  describe('addPoint', () => {
    test('should add point to current fence', () => {
      // GIVEN a fence being drawn
      manager.startDrawing();
      const point: API.Common.Types.LngLat = { lng: 0, lat: 0 };
      // WHEN adding a point
      const wasAdded = manager.addPoint(point);
      // THEN it should return true
      expect(wasAdded).toBe(true);
      // AND the point should be added
      const points = manager.getCurrentFencePoints();
      expect(points).toHaveLength(1);
      expect(points[0]).toEqual(point);
    });

    test('should auto-start drawing if not already drawing', () => {
      // GIVEN a FenceManager instance not drawing
      expect(manager.isDrawing()).toBe(false);
      const point: API.Common.Types.LngLat = { lng: 0, lat: 0 };
      // WHEN adding a point
      manager.addPoint(point);
      // THEN it should start drawing automatically
      expect(manager.isDrawing()).toBe(true);
      // AND the point should be added
      expect(manager.getCurrentFencePoints()).toHaveLength(1);
    });

    test('should add point with array format', () => {
      // GIVEN a fence being drawn
      manager.startDrawing();
      const point: API.Common.Types.LngLatLike = [1, 2];
      // WHEN adding a point in array format
      manager.addPoint(point);
      // THEN it should be added correctly
      const points = manager.getCurrentFencePoints();
      expect(points[0]).toEqual([1, 2]);
    });

    test('should add point with options', () => {
      // GIVEN a fence being drawn
      manager.startDrawing();
      const point: API.Common.Types.LngLat = { lng: 0, lat: 0 };
      const options: API.Fencing.Types.PointOptions = {
        name: 'Test Fence',
        overlayContent: 'Test Overlay',
      };
      // WHEN adding a point with options
      manager.addPoint(point, options);
      // THEN the options should be stored
      const currentFence = manager.getCurrentFence();
      expect(currentFence?.name).toBe('Test Fence');
      expect(currentFence?.overlayContent).toBe('Test Overlay');
    });

    test('should auto-close fence when clicking near first point', () => {
      // GIVEN a fence with multiple points
      manager.startDrawing();
      const firstPoint: API.Common.Types.LngLat = { lng: 0, lat: 0 };
      manager.addPoint(firstPoint);
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      // WHEN adding a point near the first point
      const nearPoint: API.Common.Types.LngLat = { lng: 0.0001, lat: 0.0001 };
      const wasAdded = manager.addPoint(nearPoint);
      // THEN it should return false (fence was closed)
      expect(wasAdded).toBe(false);
      // AND the fence should be closed
      expect(manager.isDrawing()).toBe(false);
    });

    test('should not auto-close when suppressAutoClose is true', () => {
      // GIVEN a fence with multiple points
      manager.startDrawing();
      const firstPoint: API.Common.Types.LngLat = { lng: 0, lat: 0 };
      manager.addPoint(firstPoint);
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      // WHEN adding a point near the first point with suppressAutoClose
      const nearPoint: API.Common.Types.LngLat = { lng: 0.0001, lat: 0.0001 };
      const wasAdded = manager.addPoint(nearPoint, { suppressAutoClose: true });
      // THEN it should return true (point was added)
      expect(wasAdded).toBe(true);
      // AND the fence should still be drawing
      expect(manager.isDrawing()).toBe(true);
    });
  });

  describe('closeFence', () => {
    test('should close fence with at least 3 points', () => {
      // GIVEN a fence with 3 points
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      // WHEN closing the fence
      const fence = manager.closeFence();
      // THEN it should return a fence definition
      expect(fence).not.toBeNull();
      expect(fence?.id).toBeDefined();
      expect(fence?.points).toHaveLength(4);
      // AND it should no longer be drawing
      expect(manager.isDrawing()).toBe(false);
    });

    test('should return null if fence has less than 3 points', () => {
      // GIVEN a fence with only 2 points
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      // WHEN closing the fence
      const fence = manager.closeFence();
      // THEN it should return null
      expect(fence).toBeNull();
    });

    test('should emit fenceCompleted event', () => {
      // GIVEN a fence with 3 points and an event listener
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      const eventHandler = jest.fn();
      manager.on('fenceCompleted', eventHandler);
      // WHEN closing the fence
      manager.closeFence();
      // THEN the event should be emitted
      expect(eventHandler).toHaveBeenCalledTimes(1);
      expect(eventHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          fenceId: expect.any(String),
          points: expect.any(Array),
        })
      );
    });

    test('should store persistent fence', () => {
      // GIVEN a fence with persistent option
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      // WHEN closing the fence
      const fence = manager.closeFence();
      // THEN it should be stored
      expect(fence).not.toBeNull();
      const fences = manager.getFences();
      expect(fences).toHaveLength(1);
      expect(fences[0].id).toBe(fence?.id);
    });

    test('should not store non-persistent fence', () => {
      // GIVEN a fence without persistent option
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      // WHEN closing the fence
      const fence = manager.closeFence();
      // THEN it should not be stored
      expect(fence).not.toBeNull();
      const fences = manager.getFences();
      expect(fences).toHaveLength(0);
    });
  });

  describe('clearCurrentFence', () => {
    test('should clear current fence', () => {
      // GIVEN a fence being drawn with points
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      // WHEN clearing the current fence
      manager.clearCurrentFence();
      // THEN it should no longer be drawing
      expect(manager.isDrawing()).toBe(false);
      // AND points should be cleared
      expect(manager.getCurrentFencePoints()).toHaveLength(0);
    });
  });

  describe('getCurrentFencePoints', () => {
    test('should return empty array when not drawing', () => {
      // GIVEN a FenceManager instance not drawing
      // WHEN getting current fence points
      const points = manager.getCurrentFencePoints();
      // THEN it should return empty array
      expect(points).toEqual([]);
    });

    test('should return current fence points', () => {
      // GIVEN a fence being drawn with points
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      // WHEN getting current fence points
      const points = manager.getCurrentFencePoints();
      // THEN it should return the points
      expect(points).toHaveLength(2);
    });
  });

  describe('canCloseFence', () => {
    test('should return false with less than 3 points', () => {
      // GIVEN a fence with 2 points
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      // WHEN checking if fence can be closed
      const canClose = manager.canCloseFence();
      // THEN it should return false
      expect(canClose).toBe(false);
    });

    test('should return true with 3 or more points', () => {
      // GIVEN a fence with 3 points
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      // WHEN checking if fence can be closed
      const canClose = manager.canCloseFence();
      // THEN it should return true
      expect(canClose).toBe(true);
    });
  });

  describe('getFences', () => {
    test('should return empty array when no fences stored', () => {
      // GIVEN a FenceManager with no stored fences
      // WHEN getting all fences
      const fences = manager.getFences();
      // THEN it should return empty array
      expect(fences).toEqual([]);
    });

    test('should return all stored fences', () => {
      // GIVEN multiple stored fences
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      const fence1 = manager.closeFence();
      manager.startDrawing();
      manager.addPoint({ lng: 10, lat: 10 }, { persistent: true });
      manager.addPoint({ lng: 11, lat: 11 });
      manager.addPoint({ lng: 12, lat: 12 });
      const fence2 = manager.closeFence();
      // WHEN getting all fences
      const fences = manager.getFences();
      // THEN it should return all fences
      expect(fences).toHaveLength(2);
      expect(fences[0].id).toBe(fence1?.id);
      expect(fences[1].id).toBe(fence2?.id);
    });
  });

  describe('getFence', () => {
    test('should return fence by ID', () => {
      // GIVEN a stored fence
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      const fence = manager.closeFence();
      // WHEN getting fence by ID
      const found = manager.getFence(fence!.id!);
      // THEN it should return the fence
      expect(found).toEqual(fence);
    });

    test('should return undefined for non-existent fence', () => {
      // GIVEN a FenceManager with no fences
      // WHEN getting a non-existent fence
      const found = manager.getFence('non-existent');
      // THEN it should return undefined
      expect(found).toBeUndefined();
    });
  });

  describe('getFenceByName', () => {
    test('should return fence by name', () => {
      // GIVEN a stored fence with a name
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { name: 'Test Fence', persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      manager.closeFence();
      // WHEN getting fence by name
      const found = manager.getFenceByName('Test Fence');
      // THEN it should return the fence
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Fence');
    });

    test('should return undefined for non-existent name', () => {
      // GIVEN a FenceManager with no fences
      // WHEN getting a fence by non-existent name
      const found = manager.getFenceByName('Non-existent');
      // THEN it should return undefined
      expect(found).toBeUndefined();
    });
  });

  describe('removeFence', () => {
    test('should remove fence by ID', () => {
      // GIVEN a stored fence
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      const fence = manager.closeFence();
      // WHEN removing the fence
      const removed = manager.removeFence(fence!.id!);
      // THEN it should return true
      expect(removed).toBe(true);
      // AND the fence should be removed
      expect(manager.getFences()).toHaveLength(0);
    });

    test('should return false for non-existent fence', () => {
      // GIVEN a FenceManager with no fences
      // WHEN removing a non-existent fence
      const removed = manager.removeFence('non-existent');
      // THEN it should return false
      expect(removed).toBe(false);
    });
  });

  describe('removeFenceByName', () => {
    test('should remove fence by name', () => {
      // GIVEN a stored fence with a name
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { name: 'Test Fence', persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      manager.closeFence();
      // WHEN removing the fence by name
      const removed = manager.removeFenceByName('Test Fence');
      // THEN it should return true
      expect(removed).toBe(true);
      // AND the fence should be removed
      expect(manager.getFences()).toHaveLength(0);
    });

    test('should return false for non-existent name', () => {
      // GIVEN a FenceManager with no fences
      // WHEN removing a fence by non-existent name
      const removed = manager.removeFenceByName('Non-existent');
      // THEN it should return false
      expect(removed).toBe(false);
    });
  });

  describe('clearAllFences', () => {
    test('should clear all stored fences', () => {
      // GIVEN multiple stored fences
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      manager.closeFence();
      manager.startDrawing();
      manager.addPoint({ lng: 10, lat: 10 }, { persistent: true });
      manager.addPoint({ lng: 11, lat: 11 });
      manager.addPoint({ lng: 12, lat: 12 });
      manager.closeFence();
      // WHEN clearing all fences
      manager.clearAllFences();
      // THEN all fences should be removed
      expect(manager.getFences()).toHaveLength(0);
    });
  });

  describe('clearNonPersistentFences', () => {
    test('should clear only non-persistent fences', () => {
      // GIVEN persistent and non-persistent fences
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      manager.closeFence();
      manager.startDrawing();
      manager.addPoint({ lng: 10, lat: 10 }, { persistent: false });
      manager.addPoint({ lng: 11, lat: 11 });
      manager.addPoint({ lng: 12, lat: 12 });
      manager.closeFence();
      // WHEN clearing non-persistent fences
      manager.clearNonPersistentFences();
      // THEN only persistent fences should remain
      const fences = manager.getFences();
      expect(fences).toHaveLength(1);
      const firstPoint = Array.isArray(fences[0].points[0])
        ? fences[0].points[0]
        : [fences[0].points[0].lng, fences[0].points[0].lat];
      expect(firstPoint).toEqual([0, 0]);
    });
  });

  describe('getFenceCentroid', () => {
    test('should calculate centroid for a fence', () => {
      // GIVEN a stored fence
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 2, lat: 0 });
      manager.addPoint({ lng: 1, lat: 2 });
      const fence = manager.closeFence();
      // WHEN getting the centroid
      const centroid = manager.getFenceCentroid(fence!);
      // THEN it should return the centroid
      expect(centroid.lng).toBeCloseTo(1, 5);
      expect(centroid.lat).toBeCloseTo(0.66667, 5);
    });

    test('should calculate centroid by fence ID', () => {
      // GIVEN a stored fence
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 2, lat: 0 });
      manager.addPoint({ lng: 1, lat: 2 });
      const fence = manager.closeFence();
      // WHEN getting the centroid by ID
      const centroid = manager.getFenceCentroid(fence!.id!);
      // THEN it should return the centroid
      expect(centroid.lng).toBeCloseTo(1, 5);
      expect(centroid.lat).toBeCloseTo(0.66667, 5);
    });

    test('should throw error for non-existent fence', () => {
      // GIVEN a FenceManager with no fences
      // WHEN getting centroid for non-existent fence
      // THEN it should throw ValidationError
      expect(() => {
        manager.getFenceCentroid('non-existent');
      }).toThrow(ValidationError);
    });

    test('should throw error for fence with no points', () => {
      // GIVEN a fence definition with no points
      const emptyFence: API.Fencing.Types.Definition = {
        id: 'empty',
        points: [],
      };
      // WHEN getting the centroid
      // THEN it should throw ValidationError
      expect(() => {
        manager.getFenceCentroid(emptyFence);
      }).toThrow(ValidationError);
    });
  });

  describe('updateCurrentFenceStyle', () => {
    test('should update style for current fence', () => {
      // GIVEN a fence being drawn
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      // WHEN updating the style
      manager.updateCurrentFenceStyle({ fillColor: '#00ff00' });
      // THEN the style should be updated
      const style = manager.getCurrentStyle();
      expect(style.fillColor).toBe('#00ff00');
    });

    test('should do nothing if not drawing', () => {
      // GIVEN a FenceManager not drawing
      const defaultStyle = manager.getDefaultStyle();
      // WHEN updating the style
      manager.updateCurrentFenceStyle({ fillColor: '#00ff00' });
      // THEN the default style should not change
      expect(manager.getDefaultStyle()).toEqual(defaultStyle);
    });
  });

  describe('setDefaultStyle', () => {
    test('should set default style', () => {
      // GIVEN a FenceManager instance
      const newStyle: API.Fencing.Types.StyleOptions = {
        fillColor: '#00ff00',
        fillOpacity: 0.5,
      };
      // WHEN setting default style
      manager.setDefaultStyle(newStyle);
      // THEN the default style should be updated
      const style = manager.getDefaultStyle();
      expect(style.fillColor).toBe('#00ff00');
      expect(style.fillOpacity).toBe(0.5);
    });
  });

  describe('getDefaultStyle', () => {
    test('should return default style', () => {
      // GIVEN a FenceManager instance
      // WHEN getting default style
      const style = manager.getDefaultStyle();
      // THEN it should return the default style
      expect(style.fillColor).toBe('#ff0000');
      expect(style.fillOpacity).toBe(0.3);
    });
  });

  describe('getCurrentStyle', () => {
    test('should return default style when not drawing', () => {
      // GIVEN a FenceManager not drawing
      // WHEN getting current style
      const style = manager.getCurrentStyle();
      // THEN it should return default style
      expect(style.fillColor).toBe('#ff0000');
    });

    test('should return current fence style when drawing', () => {
      // GIVEN a fence being drawn with custom style
      manager.startDrawing({ fillColor: '#00ff00' });
      // WHEN getting current style
      const style = manager.getCurrentStyle();
      // THEN it should return the custom style
      expect(style.fillColor).toBe('#00ff00');
    });
  });

  describe('setProximityThreshold', () => {
    test('should set proximity threshold', () => {
      // GIVEN a FenceManager instance
      // WHEN setting proximity threshold
      manager.setProximityThreshold(100);
      // THEN the threshold should be updated
      expect(manager.getProximityThreshold()).toBe(100);
    });

    test('should throw error for negative threshold', () => {
      // GIVEN a FenceManager instance
      // WHEN setting negative threshold
      // THEN it should throw ValidationError
      expect(() => {
        manager.setProximityThreshold(-1);
      }).toThrow(ValidationError);
    });
  });

  describe('getProximityThreshold', () => {
    test('should return default proximity threshold', () => {
      // GIVEN a FenceManager instance
      // WHEN getting proximity threshold
      const threshold = manager.getProximityThreshold();
      // THEN it should return default value (50)
      expect(threshold).toBe(50);
    });
  });

  describe('renderFences', () => {
    test('should render multiple fences', () => {
      // GIVEN multiple fence definitions
      const fences: API.Fencing.Types.Definition[] = [
        {
          id: '1',
          points: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
        {
          id: '2',
          points: [
            [10, 10],
            [11, 11],
            [12, 12],
          ],
        },
      ];
      // WHEN rendering the fences
      manager.renderFences(fences, { persistent: true });
      // THEN they should be stored
      const storedFences = manager.getFences();
      expect(storedFences).toHaveLength(2);
    });

    test('should clear existing fences when clearExisting is true', () => {
      // GIVEN existing stored fences
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 }, { persistent: true });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      manager.closeFence();
      // WHEN rendering new fences with clearExisting
      const fences: API.Fencing.Types.Definition[] = [
        {
          id: 'new',
          points: [
            [10, 10],
            [11, 11],
            [12, 12],
          ],
        },
      ];
      manager.renderFences(fences, { clearExisting: true, persistent: true });
      // THEN old fences should be cleared
      const storedFences = manager.getFences();
      expect(storedFences).toHaveLength(1);
      expect(storedFences[0].id).toBe('new');
    });
  });

  describe('event system', () => {
    test('should allow adding and removing event listeners', () => {
      // GIVEN a FenceManager instance
      const handler = jest.fn();
      // WHEN adding an event listener
      manager.on('fenceCompleted', handler);
      // THEN it should be registered
      expect(manager.listenerCount('fenceCompleted')).toBe(1);
      // WHEN removing the listener
      manager.off('fenceCompleted', handler);
      // THEN it should be removed
      expect(manager.listenerCount('fenceCompleted')).toBe(0);
    });

    test('should emit events to all listeners', () => {
      // GIVEN multiple event listeners
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      manager.on('fenceCompleted', handler1);
      manager.on('fenceCompleted', handler2);
      // WHEN closing a fence
      manager.startDrawing();
      manager.addPoint({ lng: 0, lat: 0 });
      manager.addPoint({ lng: 1, lat: 1 });
      manager.addPoint({ lng: 2, lat: 2 });
      manager.closeFence();
      // THEN all listeners should be called
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });
});
