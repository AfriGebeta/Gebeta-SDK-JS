import '../_test_utilities/consoleMock';
import { loadIntegrationConfig } from '../_test_utilities/integrationConfig';
import { TrackingClient } from './TrackingClient';
import { API } from '@gebeta/maps-api';

let config: ReturnType<typeof loadIntegrationConfig>;

beforeAll(() => {
  config = loadIntegrationConfig();
});

const createMockLocationProvider = (): API.Platform.Types.ILocationProvider => {
  let interval: ReturnType<typeof setInterval> | null = null;
  return {
    start: (onLocation: (location: API.Platform.Types.LocationData) => void) => {
      interval = setInterval(() => {
        onLocation({
          lat: 9.145 + Math.random() * 0.01,
          lng: 38.7666 + Math.random() * 0.01,
          accuracy: 10,
          timestamp: Date.now(),
        });
      }, 1000);
    },
    stop: () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    },
  };
};

describe('TrackingClient Integration Tests', () => {
  let client: TrackingClient;
  let locationProvider: API.Platform.Types.ILocationProvider;

  beforeEach(() => {
    client = new TrackingClient({
      userId: 'test-user-integration',
      bearerToken: config.apiKey,
      role: 'driver',
    });
    locationProvider = createMockLocationProvider();
  });

  afterEach(() => {
    client.stop();
    locationProvider.stop();
  });

  describe('WebSocket connection', () => {
    test('should connect to WebSocket server', (done) => {
      // GIVEN a TrackingClient instance with connect and error listeners
      client.on('connect', () => {
        // THEN it should connect and be active
        expect(client.isActive()).toBe(true);
        done();
      });

      client.on('error', (error) => {
        console.warn('Tracking connection error (may be expected in test environment):', error);
      });

      // WHEN starting the client
      client.start(locationProvider);
    }, 10000);

    test('should send location updates', (done) => {
      // GIVEN a TrackingClient instance with connect and location listeners
      let connectReceived = false;
      let locationReceived = false;

      client.on('connect', () => {
        connectReceived = true;
      });

      client.on('location', () => {
        locationReceived = true;
        // THEN it should receive both connect and location events
        if (connectReceived && locationReceived) {
          done();
        }
      });

      // WHEN starting the client
      client.start(locationProvider);
    }, 15000);
  });

  describe('reconnection', () => {
    test('should attempt to reconnect on disconnect', (done) => {
      // GIVEN a TrackingClient instance with a connect listener
      let connectCount = 0;

      client.on('connect', () => {
        connectCount++;
        // THEN it should reconnect and emit connect event again
        if (connectCount >= 2) {
          done();
        }
      });

      client.start(locationProvider);

      // WHEN disconnecting and restarting
      setTimeout(() => {
        if (client.isActive()) {
          client.stop();
          setTimeout(() => {
            client.start(locationProvider);
          }, 1000);
        }
      }, 2000);
    }, 20000);
  });
});
