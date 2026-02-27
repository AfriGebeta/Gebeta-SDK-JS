/* eslint-disable @typescript-eslint/no-explicit-any */

import { BrowserLocationProvider } from './LocationProvider';

describe('BrowserLocationProvider', () => {
  let provider: BrowserLocationProvider;
  let mockGeolocation: any;

  beforeEach(() => {
    provider = new BrowserLocationProvider();
    
    //mock navigator.geolocation
    mockGeolocation = {
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    };
    
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('start', () => {
    it('should start watching position', () => {
      const callback = jest.fn();
      
      provider.start(callback);
      
      expect(mockGeolocation.watchPosition).toHaveBeenCalled();
    });

    it('should call callback with location data on position update', () => {
      const callback = jest.fn();
      let positionCallback: any;
      
      mockGeolocation.watchPosition.mockImplementation((success: any) => {
        positionCallback = success;
        return 1;
      });
      
      provider.start(callback);
      
      //simulate position update
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
      };
      
      positionCallback(mockPosition);
      
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
      const callback = jest.fn();
      let positionCallback: any;
      
      mockGeolocation.watchPosition.mockImplementation((success: any) => {
        positionCallback = success;
        return 1;
      });
      
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
      };
      
      positionCallback(mockPosition);
      
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          heading: 90,
          speed: 10,
          altitude: 2400,
        })
      );
    });

    it('should stop previous watch when starting again', () => {
      const callback = jest.fn();
      
      mockGeolocation.watchPosition.mockReturnValue(1);
      
      provider.start(callback);
      provider.start(callback);
      
      expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(1);
      expect(mockGeolocation.watchPosition).toHaveBeenCalledTimes(2);
    });

    it('should handle geolocation errors gracefully', () => {
      const callback = jest.fn();
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      let errorCallback: any;
      
      mockGeolocation.watchPosition.mockImplementation((_success: any, error: any) => {
        errorCallback = error;
        return 1;
      });
      
      provider.start(callback);
      
      const mockError = {
        code: 1,
        message: 'User denied geolocation',
      };
      
      errorCallback(mockError);
      
      expect(consoleError).toHaveBeenCalledWith('Geolocation error:', mockError);
      consoleError.mockRestore();
    });

    it('should handle missing geolocation API', () => {
      const callback = jest.fn();
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      
      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: undefined,
        configurable: true,
      });
      
      provider.start(callback);
      
      expect(consoleError).toHaveBeenCalledWith(
        'Geolocation is not supported by this browser'
      );
      expect(mockGeolocation.watchPosition).not.toHaveBeenCalled();
      
      consoleError.mockRestore();
    });
  });

  describe('stop', () => {
    it('should stop watching position', () => {
      const callback = jest.fn();
      
      mockGeolocation.watchPosition.mockReturnValue(1);
      
      provider.start(callback);
      provider.stop();
      
      expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(1);
    });

    it('should do nothing if not watching', () => {
      provider.stop();
      
      expect(mockGeolocation.clearWatch).not.toHaveBeenCalled();
    });

    it('should clear callback reference', () => {
      const callback = jest.fn();
      let positionCallback: any;
      
      mockGeolocation.watchPosition.mockImplementation((success: any) => {
        positionCallback = success;
        return 1;
      });
      
      provider.start(callback);
      provider.stop();
      
      //simulate position update after stop
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
      };
      
      positionCallback(mockPosition);
      
      //callback shouldnt be called after stop
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
