import { BrowserLocationProvider } from './LocationProvider';
import { API } from '@gebeta/maps-api';

type LocationData = API.Platform.Types.LocationData;

describe('BrowserLocationProvider', () => {
  let provider: BrowserLocationProvider;
  let mockWatchPosition: jest.Mock;
  let mockClearWatch: jest.Mock;

  beforeEach(() => {
    provider = BrowserLocationProvider.getInstance();
    mockWatchPosition = jest.fn();
    mockClearWatch = jest.fn();

    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: {
        watchPosition: mockWatchPosition,
        clearWatch: mockClearWatch,
      },
      configurable: true,
    });
  });

  afterEach(() => {
    provider.stop();
    jest.clearAllMocks();
  });

  describe('start', () => {
    it('should start watching position with default options', () => {
      // GIVEN a provider, a callback, and a captured success callback from watchPosition
      let successCallback: (position: GeolocationPosition) => void = () => {};
      mockWatchPosition.mockImplementation((success: (position: GeolocationPosition) => void) => {
        successCallback = success;
        return 1;
      });

      const callback = jest.fn<void, [LocationData]>();
      provider.start(callback);

      const mockPosition = {
        coords: {
          latitude: 9.0161,
          longitude: 38.7685,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as GeolocationPosition;

      // WHEN the geolocation API invokes the success callback with mock output
      successCallback(mockPosition);

      // THEN our callback receives the mapped LocationData and watchPosition was called with default options
      expect(callback).toHaveBeenCalledWith({
        lat: mockPosition.coords.latitude,
        lng: mockPosition.coords.longitude,
        accuracy: mockPosition.coords.accuracy,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        timestamp: mockPosition.timestamp,
      });
      const watchPositionOptions = mockWatchPosition.mock.calls[0][2];
      expect(watchPositionOptions).toEqual({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

    it('should use low accuracy when constructed with enableHighAccuracy false', () => {
      // GIVEN a provider configured for low accuracy and a captured success callback
      const lowAccuracyProvider = BrowserLocationProvider.getInstance({
        enableHighAccuracy: false,
      });

      let successCallback: (position: GeolocationPosition) => void = () => {};
      mockWatchPosition.mockImplementation((success: (position: GeolocationPosition) => void) => {
        successCallback = success;
        return 1;
      });

      const callback = jest.fn<void, [LocationData]>();
      lowAccuracyProvider.start(callback);

      const mockPosition = {
        coords: {
          latitude: 9.0161,
          longitude: 38.7685,
          accuracy: 15,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as GeolocationPosition;

      // WHEN the geolocation API invokes the success callback with mock output
      successCallback(mockPosition);

      // THEN our callback receives the mapped LocationData and watchPosition was called with enableHighAccuracy false
      expect(callback).toHaveBeenCalledWith({
        lat: mockPosition.coords.latitude,
        lng: mockPosition.coords.longitude,
        accuracy: mockPosition.coords.accuracy,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        timestamp: mockPosition.timestamp,
      });
      const watchPositionOptions = mockWatchPosition.mock.calls[0][2];
      expect(watchPositionOptions).toEqual(
        expect.objectContaining({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        })
      );
    });

    it('should call callback with location data on position update', () => {
      // GIVEN a provider with a callback and a captured success callback from watchPosition
      let successCallback: (position: GeolocationPosition) => void = () => {};
      mockWatchPosition.mockImplementation((success: (position: GeolocationPosition) => void) => {
        successCallback = success;
        return 1;
      });

      const callback = jest.fn<void, [LocationData]>();
      provider.start(callback);

      const mockPosition = {
        coords: {
          latitude: 9.0161,
          longitude: 38.7685,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as GeolocationPosition;

      // WHEN the geolocation API invokes the success callback with a position
      successCallback(mockPosition);

      // THEN the provider callback is invoked with the mapped LocationData
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        lat: 9.0161,
        lng: 38.7685,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        timestamp: mockPosition.timestamp,
      });
    });

    it('should handle position with heading and speed', () => {
      // GIVEN a provider with a callback and a captured success callback
      let successCallback: (position: GeolocationPosition) => void = () => {};
      mockWatchPosition.mockImplementation((success: (position: GeolocationPosition) => void) => {
        successCallback = success;
        return 1;
      });

      const callback = jest.fn<void, [LocationData]>();
      provider.start(callback);

      const mockPosition = {
        coords: {
          latitude: 9.0161,
          longitude: 38.7685,
          accuracy: 5,
          altitude: 2400,
          altitudeAccuracy: 10,
          heading: 90,
          speed: 10,
        },
        timestamp: Date.now(),
      } as GeolocationPosition;

      // WHEN the success callback is invoked with position including heading and speed
      successCallback(mockPosition);

      // THEN the provider callback receives the full LocationData with those values
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        lat: 9.0161,
        lng: 38.7685,
        accuracy: 5,
        altitude: 2400,
        altitudeAccuracy: 10,
        heading: 90,
        speed: 10,
        timestamp: mockPosition.timestamp,
      });
    });

    it('should stop previous watch when starting again', () => {
      // GIVEN a provider that has started watching
      mockWatchPosition.mockReturnValue(1);
      const callback = jest.fn<void, [LocationData]>();
      provider.start(callback);

      // WHEN start is called again with a new callback
      const secondCallback = jest.fn<void, [LocationData]>();
      provider.start(secondCallback);

      // THEN clearWatch was called with the previous watch ID and watchPosition was called twice
      expect(mockClearWatch).toHaveBeenCalledWith(1);
      expect(mockWatchPosition).toHaveBeenCalledTimes(2);
    });

    it('should handle geolocation errors gracefully', () => {
      // GIVEN a provider with a callback and a captured error callback from watchPosition
      let errorCallback: (error: GeolocationPositionError) => void = () => {};
      mockWatchPosition.mockImplementation(
        (_success: (position: GeolocationPosition) => void, error: (error: GeolocationPositionError) => void) => {
          errorCallback = error;
          return 1;
        }
      );

      const callback = jest.fn<void, [LocationData]>();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      provider.start(callback);

      const mockError = {
        code: 1,
        message: 'User denied geolocation',
      } as GeolocationPositionError;

      // WHEN the geolocation API invokes the error callback
      errorCallback(mockError);

      // THEN console.error is called with the error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Geolocation error:', mockError);
      consoleErrorSpy.mockRestore();
    });

    it('should handle missing geolocation API', () => {
      // GIVEN navigator.geolocation is undefined
      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: undefined,
        configurable: true,
      });

      const callback = jest.fn<void, [LocationData]>();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // WHEN start is called
      provider.start(callback);

      // THEN console.error is called and watchPosition is never invoked
      expect(consoleErrorSpy).toHaveBeenCalledWith('Geolocation is not supported by this browser');
      expect(mockWatchPosition).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('stop', () => {
    it('should stop watching position', () => {
      // GIVEN a provider that has started watching with watch ID 1
      mockWatchPosition.mockReturnValue(1);
      const callback = jest.fn<void, [LocationData]>();
      provider.start(callback);

      // WHEN stop is called
      provider.stop();

      // THEN clearWatch is called with the watch ID
      expect(mockClearWatch).toHaveBeenCalledWith(1);
    });

    it('should do nothing if not watching', () => {
      // GIVEN a provider that has not started watching

      // WHEN stop is called
      provider.stop();

      // THEN clearWatch is not called
      expect(mockClearWatch).not.toHaveBeenCalled();
    });

    it('should clear callback reference so updates after stop are ignored', () => {
      // GIVEN a provider that has started and then stopped
      let successCallback: (position: GeolocationPosition) => void = () => {};
      mockWatchPosition.mockImplementation((success: (position: GeolocationPosition) => void) => {
        successCallback = success;
        return 1;
      });

      const callback = jest.fn<void, [LocationData]>();
      provider.start(callback);
      provider.stop();

      const mockPosition = {
        coords: {
          latitude: 9.0161,
          longitude: 38.7685,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as GeolocationPosition;

      // WHEN the geolocation API invokes the success callback after stop
      successCallback(mockPosition);

      // THEN the provider callback is not invoked
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
