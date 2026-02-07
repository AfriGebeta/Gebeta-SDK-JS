import '../_test_utilities/consoleMock';
import { ClusteringManager } from './ClusteringManager';
import { API } from '@gebeta/maps-api';
import { ValidationError } from '@gebeta/maps-api';
import { EMPTY_VALUES } from '../_test_utilities/commonTestValues';

describe('ClusteringManager', () => {
  let manager: ClusteringManager;

  beforeEach(() => {
    manager = new ClusteringManager();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should create instance with default options', () => {
      // GIVEN no options provided
      // WHEN creating a ClusteringManager instance
      // THEN it should create the instance successfully
      expect(manager).toBeInstanceOf(ClusteringManager);
      // AND it should use default options
      const options = manager.getOptions();
      expect(options.radius).toBe(50);
      expect(options.maxZoom).toBe(16);
      expect(options.showClusterCount).toBe(false);
      expect(options.clusterImage).toBeNull();
      expect(options.clusterOnClick).toBeNull();
    });

    test('should create instance with custom options', () => {
      // GIVEN custom clustering options
      const customOptions: API.Clustering.Types.Options = {
        radius: 100,
        maxZoom: 18,
        showClusterCount: true,
        clusterImage: 'https://example.com/cluster.png',
      };
      // WHEN creating a ClusteringManager instance with custom options
      manager = new ClusteringManager(customOptions);
      // THEN it should use the custom options
      const actualOptions = manager.getOptions();
      expect(actualOptions.radius).toBe(100);
      expect(actualOptions.maxZoom).toBe(18);
      expect(actualOptions.showClusterCount).toBe(true);
      expect(actualOptions.clusterImage).toBe('https://example.com/cluster.png');
    });

    test('should use API constants for defaults', () => {
      // GIVEN a ClusteringManager instance
      manager = new ClusteringManager({});
      // THEN it should use the API constants for defaults
      expect(API.Clustering.Constants.DEFAULT_OPTIONS).toBeDefined();
    });
  });

  describe('addMarker', () => {
    const validMarker: API.Overlay.Types.MarkerData = {
      id: 'marker-1',
      lngLat: { lng: 38.7685, lat: 9.0161 },
      imageUrl: 'https://example.com/marker.png',
      size: [30, 30],
    };

    test('should add marker successfully', () => {
      // GIVEN a valid marker
      // WHEN adding the marker to the manager
      manager.addMarker(validMarker);
      // THEN it should be added to the markers list
      const markers = manager.getMarkers();
      expect(markers).toHaveLength(1);
      expect(markers[0]).toEqual(validMarker);
    });

    test('should update existing marker with same ID', () => {
      // GIVEN an existing marker and an updated marker with the same ID
      const updatedMarker: API.Overlay.Types.MarkerData = {
        ...validMarker,
        imageUrl: 'https://example.com/updated.png',
      };
      manager.addMarker(validMarker);
      // WHEN adding the updated marker
      manager.addMarker(updatedMarker);
      // THEN it should update the existing marker instead of adding a new one
      const markers = manager.getMarkers();
      expect(markers).toHaveLength(1);
      expect(markers[0].imageUrl).toBe('https://example.com/updated.png');
    });

    test('should add multiple markers', () => {
      // GIVEN multiple markers with different IDs
      const marker2: API.Overlay.Types.MarkerData = {
        id: 'marker-2',
        lngLat: { lng: 38.7785, lat: 9.0261 },
      };
      // WHEN adding multiple markers
      manager.addMarker(validMarker);
      manager.addMarker(marker2);
      // THEN all markers should be added
      const markers = manager.getMarkers();
      expect(markers).toHaveLength(2);
    });

    test.each(EMPTY_VALUES)(
      'should throw error if marker ID is missing (%s)',
      (_description, givenId?: string | null) => {
        // GIVEN a marker with missing ID
        const invalidMarker = {
          ...validMarker,
          id: givenId,
        };
        // WHEN adding the marker
        // THEN it should throw a ValidationError
        expect(() => manager.addMarker(invalidMarker as API.Overlay.Types.MarkerData)).toThrow(
          ValidationError
        );
      }
    );

    test('should throw error if marker lngLat is missing', () => {
      // GIVEN a marker with missing lngLat
      const invalidMarker = {
        ...validMarker,
        lngLat: undefined,
      };
      // WHEN adding the marker
      // THEN it should throw a ValidationError
      expect(() =>
        manager.addMarker(invalidMarker as unknown as API.Overlay.Types.MarkerData)
      ).toThrow(ValidationError);
    });

    test('should accept lngLat as array', () => {
      // GIVEN a marker with lngLat as an array
      const markerWithArray: API.Overlay.Types.MarkerData = {
        id: 'marker-array',
        lngLat: [38.7685, 9.0161],
      };
      // WHEN adding the marker
      manager.addMarker(markerWithArray);
      // THEN it should be added successfully
      const markers = manager.getMarkers();
      expect(markers).toHaveLength(1);
    });

    test('should accept marker with onClick handler', () => {
      // GIVEN a marker with an onClick handler
      const markerWithHandler: API.Overlay.Types.MarkerData = {
        ...validMarker,
        onClick: (_lngLat, _marker, _event) => {
          console.log('clicked');
        },
      };
      // WHEN adding the marker
      manager.addMarker(markerWithHandler);
      // THEN the onClick handler should be preserved
      const marker = manager.getMarker('marker-1');
      expect(marker?.onClick).toBeDefined();
    });

    test('should accept marker with popupContent', () => {
      // GIVEN a marker with popupContent
      const markerWithPopup: API.Overlay.Types.MarkerData = {
        ...validMarker,
        popupContent: '<div>Popup content</div>',
      };
      // WHEN adding the marker
      manager.addMarker(markerWithPopup);
      // THEN the popupContent should be preserved
      const marker = manager.getMarker('marker-1');
      expect(marker?.popupContent).toBe('<div>Popup content</div>');
    });
  });

  describe('removeMarker', () => {
    const marker1: API.Overlay.Types.MarkerData = {
      id: 'marker-1',
      lngLat: { lng: 38.7685, lat: 9.0161 },
    };
    const marker2: API.Overlay.Types.MarkerData = {
      id: 'marker-2',
      lngLat: { lng: 38.7785, lat: 9.0261 },
    };

    test('should remove marker successfully', () => {
      // GIVEN multiple markers added to the manager
      manager.addMarker(marker1);
      manager.addMarker(marker2);
      // WHEN removing a marker by ID
      const removed = manager.removeMarker('marker-1');
      // THEN it should return true and remove the marker
      expect(removed).toBe(true);
      const markers = manager.getMarkers();
      expect(markers).toHaveLength(1);
      expect(markers[0].id).toBe('marker-2');
    });

    test('should return false if marker not found', () => {
      // GIVEN a marker added to the manager
      manager.addMarker(marker1);
      // WHEN removing a non-existent marker ID
      const removed = manager.removeMarker('non-existent');
      // THEN it should return false and not remove any markers
      expect(removed).toBe(false);
      const markers = manager.getMarkers();
      expect(markers).toHaveLength(1);
    });

    test('should handle removing from empty list', () => {
      // GIVEN an empty manager
      // WHEN removing any marker ID
      const removed = manager.removeMarker('any-id');
      // THEN it should return false
      expect(removed).toBe(false);
    });
  });

  describe('clearMarkers', () => {
    test('should clear all markers', () => {
      // GIVEN multiple markers added to the manager
      manager.addMarker({ id: 'marker-1', lngLat: { lng: 38.7685, lat: 9.0161 } });
      manager.addMarker({ id: 'marker-2', lngLat: { lng: 38.7785, lat: 9.0261 } });
      // WHEN clearing all markers
      manager.clearMarkers();
      // THEN all markers should be removed
      const markers = manager.getMarkers();
      expect(markers).toHaveLength(0);
    });

    test('should handle clearing empty list', () => {
      // GIVEN an empty manager
      // WHEN clearing markers
      manager.clearMarkers();
      // THEN it should remain empty without errors
      const markers = manager.getMarkers();
      expect(markers).toHaveLength(0);
    });
  });

  describe('getMarkers', () => {
    test('should return empty array when no markers', () => {
      // GIVEN an empty manager
      // WHEN getting all markers
      const markers = manager.getMarkers();
      // THEN it should return an empty array
      expect(markers).toEqual([]);
    });

    test('should return copy of markers array', () => {
      // GIVEN a marker added to the manager
      const marker: API.Overlay.Types.MarkerData = {
        id: 'marker-1',
        lngLat: { lng: 38.7685, lat: 9.0161 },
      };
      manager.addMarker(marker);
      // WHEN getting markers multiple times
      const markers1 = manager.getMarkers();
      const markers2 = manager.getMarkers();
      // THEN each call should return a new array (copy)
      expect(markers1).not.toBe(markers2);
      expect(markers1).toEqual(markers2);
    });
  });

  describe('getMarker', () => {
    const marker: API.Overlay.Types.MarkerData = {
      id: 'marker-1',
      lngLat: { lng: 38.7685, lat: 9.0161 },
    };

    test('should return marker by ID', () => {
      // GIVEN a marker added to the manager
      manager.addMarker(marker);
      // WHEN getting the marker by ID
      const found = manager.getMarker('marker-1');
      // THEN it should return the marker
      expect(found).toEqual(marker);
    });

    test('should return undefined if marker not found', () => {
      // GIVEN a marker added to the manager
      manager.addMarker(marker);
      // WHEN getting a non-existent marker ID
      const found = manager.getMarker('non-existent');
      // THEN it should return undefined
      expect(found).toBeUndefined();
    });

    test('should return undefined for empty list', () => {
      // GIVEN an empty manager
      // WHEN getting any marker ID
      const found = manager.getMarker('any-id');
      // THEN it should return undefined
      expect(found).toBeUndefined();
    });
  });

  describe('getClusters', () => {
    test('should return empty array when no markers', () => {
      // GIVEN an empty manager
      // WHEN getting clusters for any bounds and zoom
      const clusters = manager.getClusters([38.7, 9.0, 38.8, 9.1], 12);
      // THEN it should return an empty array
      expect(clusters).toEqual([]);
    });

    test('should return clusters for markers in bounds', () => {
      // GIVEN markers added to the manager
      manager.addMarker({ id: 'marker-1', lngLat: { lng: 38.7685, lat: 9.0161 } });
      manager.addMarker({ id: 'marker-2', lngLat: { lng: 38.7686, lat: 9.0162 } });
      // WHEN getting clusters for bounds containing the markers
      const clusters = manager.getClusters([38.76, 9.01, 38.77, 9.02], 12);
      // THEN it should return clusters
      expect(clusters.length).toBeGreaterThan(0);
    });

    test('should cluster nearby markers at low zoom', () => {
      // GIVEN multiple nearby markers
      manager.addMarker({ id: 'marker-1', lngLat: { lng: 38.7685, lat: 9.0161 } });
      manager.addMarker({ id: 'marker-2', lngLat: { lng: 38.7686, lat: 9.0162 } });
      manager.addMarker({ id: 'marker-3', lngLat: { lng: 38.7687, lat: 9.0163 } });
      // WHEN getting clusters at low zoom level
      const clusters = manager.getClusters([38.76, 9.01, 38.77, 9.02], 10);
      // THEN it should return clustered markers
      const clusterCount = clusters.filter(c => c.properties.cluster).length;
      expect(clusterCount).toBeGreaterThan(0);
    });

    test('should return individual markers at high zoom', () => {
      // GIVEN markers added to the manager
      manager.addMarker({ id: 'marker-1', lngLat: { lng: 38.7685, lat: 9.0161 } });
      manager.addMarker({ id: 'marker-2', lngLat: { lng: 38.7785, lat: 9.0261 } });
      // WHEN getting clusters at high zoom level
      const clusters = manager.getClusters([38.76, 9.01, 38.78, 9.03], 18);
      // THEN it should return individual markers (not clusters)
      const individualMarkers = clusters.filter(c => !c.properties.cluster);
      expect(individualMarkers.length).toBeGreaterThan(0);
    });

    test('should include marker properties in cluster data', () => {
      // GIVEN a marker with properties
      const marker: API.Overlay.Types.MarkerData = {
        id: 'marker-1',
        lngLat: { lng: 38.7685, lat: 9.0161 },
        imageUrl: 'https://example.com/marker.png',
        size: [30, 30],
      };
      manager.addMarker(marker);
      // WHEN getting clusters
      const clusters = manager.getClusters([38.76, 9.01, 38.77, 9.02], 18);
      // THEN the cluster data should include marker properties
      const individualCluster = clusters.find(c => c.properties.markerId === 'marker-1');
      expect(individualCluster).toBeDefined();
      expect(individualCluster?.properties.imageUrl).toBe('https://example.com/marker.png');
      expect(individualCluster?.properties.size).toEqual([30, 30]);
    });

    test('should floor zoom level', () => {
      // GIVEN a marker added to the manager
      manager.addMarker({ id: 'marker-1', lngLat: { lng: 38.7685, lat: 9.0161 } });
      // WHEN getting clusters with different decimal zoom values that floor to the same integer
      const clusters1 = manager.getClusters([38.76, 9.01, 38.77, 9.02], 12.7);
      const clusters2 = manager.getClusters([38.76, 9.01, 38.77, 9.02], 12.2);
      // THEN both should return the same clusters (both floor to 12)
      expect(clusters1.length).toBe(clusters2.length);
    });
  });

  describe('getClusterExpansionZoom', () => {
    test('should return expansion zoom for cluster', () => {
      // GIVEN markers that form a cluster
      manager.addMarker({ id: 'marker-1', lngLat: { lng: 38.7685, lat: 9.0161 } });
      manager.addMarker({ id: 'marker-2', lngLat: { lng: 38.7686, lat: 9.0162 } });
      const clusters = manager.getClusters([38.76, 9.01, 38.77, 9.02], 10);
      const cluster = clusters.find(c => c.properties.cluster);
      // WHEN getting expansion zoom for the cluster
      if (cluster) {
        const expansionZoom = manager.getClusterExpansionZoom(cluster.id);
        // THEN it should return a valid zoom level
        expect(expansionZoom).toBeGreaterThan(0);
        expect(typeof expansionZoom).toBe('number');
      }
    });

    test('should return 0 for non-existent cluster ID', () => {
      // GIVEN a manager (with or without markers)
      // WHEN getting expansion zoom for a non-existent cluster ID
      const zoom = manager.getClusterExpansionZoom(99999);
      // THEN it should return 0
      expect(zoom).toBe(0);
    });

    test('should return 0 when supercluster not loaded', () => {
      // GIVEN a new manager with no markers loaded
      const newManager = new ClusteringManager();
      // WHEN getting expansion zoom
      const zoom = newManager.getClusterExpansionZoom(1);
      // THEN it should return 0
      expect(zoom).toBe(0);
    });
  });

  describe('getOptions', () => {
    test('should return copy of options', () => {
      // GIVEN a ClusteringManager instance
      // WHEN getting options multiple times
      const options1 = manager.getOptions();
      const options2 = manager.getOptions();
      // THEN each call should return a new object (copy)
      expect(options1).not.toBe(options2);
      expect(options1).toEqual(options2);
    });

    test('should return current normalized options', () => {
      // GIVEN a ClusteringManager instance
      // WHEN getting options
      const options = manager.getOptions();
      // THEN it should return normalized options with all required fields
      expect(options).toHaveProperty('radius');
      expect(options).toHaveProperty('maxZoom');
      expect(options).toHaveProperty('showClusterCount');
      expect(options).toHaveProperty('clusterImage');
      expect(options).toHaveProperty('clusterOnClick');
    });
  });

  describe('updateOptions', () => {
    test('should update options without recreating Supercluster', () => {
      // GIVEN a ClusteringManager instance
      const initialOptions = manager.getOptions();
      // WHEN updating options that don't require Supercluster recreation
      manager.updateOptions({ showClusterCount: true });
      // THEN options should be updated without recreating Supercluster
      const updatedOptions = manager.getOptions();
      expect(updatedOptions.showClusterCount).toBe(true);
      expect(updatedOptions.radius).toBe(initialOptions.radius);
      expect(updatedOptions.maxZoom).toBe(initialOptions.maxZoom);
    });

    test('should recreate Supercluster when radius changes', () => {
      // GIVEN markers added to the manager
      manager.addMarker({ id: 'marker-1', lngLat: { lng: 38.7685, lat: 9.0161 } });
      // WHEN updating radius option
      manager.updateOptions({ radius: 100 });
      // THEN Supercluster should be recreated and radius updated
      const options = manager.getOptions();
      expect(options.radius).toBe(100);
      const clustersAfter = manager.getClusters([38.76, 9.01, 38.77, 9.02], 12);
      expect(clustersAfter).toBeDefined();
    });

    test('should recreate Supercluster when maxZoom changes', () => {
      // GIVEN markers added to the manager
      manager.addMarker({ id: 'marker-1', lngLat: { lng: 38.7685, lat: 9.0161 } });
      // WHEN updating maxZoom option
      manager.updateOptions({ maxZoom: 18 });
      // THEN Supercluster should be recreated and maxZoom updated
      const options = manager.getOptions();
      expect(options.maxZoom).toBe(18);
    });

    test('should update clusterImage', () => {
      // GIVEN a ClusteringManager instance
      // WHEN updating clusterImage option
      manager.updateOptions({ clusterImage: 'https://example.com/cluster.png' });
      // THEN clusterImage should be updated
      const options = manager.getOptions();
      expect(options.clusterImage).toBe('https://example.com/cluster.png');
    });

    test('should update clusterOnClick handler', () => {
      // GIVEN a click handler function
      const handler = (_cluster: API.Overlay.Types.ClusterData, _event: MouseEvent) => {
        console.log('clicked');
      };
      // WHEN updating clusterOnClick option
      manager.updateOptions({ clusterOnClick: handler });
      // THEN clusterOnClick should be updated
      const options = manager.getOptions();
      expect(options.clusterOnClick).toBe(handler);
    });

    test('should clear clusterImage when set to null', () => {
      // GIVEN clusterImage set to a URL
      manager.updateOptions({ clusterImage: 'https://example.com/cluster.png' });
      // WHEN setting clusterImage to null
      manager.updateOptions({ clusterImage: null });
      // THEN clusterImage should be cleared
      const options = manager.getOptions();
      expect(options.clusterImage).toBeNull();
    });

    test('should clear clusterOnClick when set to null', () => {
      // GIVEN clusterOnClick set to a handler
      const handler = (_cluster: API.Overlay.Types.ClusterData, _event: MouseEvent) => {
        console.log('clicked');
      };
      manager.updateOptions({ clusterOnClick: handler });
      // WHEN setting clusterOnClick to null
      manager.updateOptions({ clusterOnClick: null });
      // THEN clusterOnClick should be cleared
      const options = manager.getOptions();
      expect(options.clusterOnClick).toBeNull();
    });

    test('should update multiple options at once', () => {
      // GIVEN a ClusteringManager instance
      // WHEN updating multiple options simultaneously
      manager.updateOptions({
        radius: 75,
        maxZoom: 17,
        showClusterCount: true,
      });
      // THEN all options should be updated
      const options = manager.getOptions();
      expect(options.radius).toBe(75);
      expect(options.maxZoom).toBe(17);
      expect(options.showClusterCount).toBe(true);
    });

    test('should preserve existing options when updating partial', () => {
      // GIVEN a ClusteringManager with initial options
      manager = new ClusteringManager({ radius: 100, showClusterCount: true });
      // WHEN updating only some options
      manager.updateOptions({ maxZoom: 18 });
      // THEN existing options should be preserved
      const options = manager.getOptions();
      expect(options.radius).toBe(100);
      expect(options.showClusterCount).toBe(true);
      expect(options.maxZoom).toBe(18);
    });
  });
});
