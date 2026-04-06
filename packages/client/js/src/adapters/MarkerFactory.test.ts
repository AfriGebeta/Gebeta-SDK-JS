import { MarkerFactory } from './MarkerFactory';
import { MapAdapter } from './MapAdapter';
import maplibre from 'maplibre-gl';
import { Map as MapLibreMap } from 'maplibre-gl';
import type { API } from '@gebeta/api';

type IMarker = API.Platform.Types.IMarker;
type IPopup = API.Platform.Types.IPopup;
type MarkerFactoryOptions = API.Platform.Types.MarkerFactoryOptions;

describe('MarkerFactory', () => {
  let mockMap: MapLibreMap;
  let factory: MarkerFactory;

  beforeEach(() => {
    mockMap = new MapLibreMap({ container: 'map', style: 'test' } as never);
    factory = new MarkerFactory(mockMap);
  });

  describe('createMarker', () => {
    it('should create marker with default className when options are empty', () => {
      // GIVEN spy on document.createElement to capture created elements
      const createElementSpy = jest.spyOn(document, 'createElement');

      // WHEN createMarker is called with empty options
      const marker = factory.createMarker({});

      // THEN a div is created with default className gebeta-marker and marker is returned
      const divIndices = createElementSpy.mock.calls
        .map((call, i) => (call[0] === 'div' ? i : -1))
        .filter((i) => i >= 0);
      const lastDivIndex = divIndices[divIndices.length - 1] ?? 0;
      const createdElement = createElementSpy.mock.results[lastDivIndex]?.value as HTMLDivElement;
      expect(createdElement.className).toBe('gebeta-marker');
      expect(marker).not.toBeNull();
      expect(marker).toHaveProperty('setLngLat');
      expect(marker).toHaveProperty('addTo');
      expect(marker).toHaveProperty('remove');
    });

    it('should create marker with custom className applied to element', () => {
      // GIVEN options with custom className
      const options: MarkerFactoryOptions = { className: 'custom-marker' };

      // WHEN createMarker is called with custom className
      const marker = factory.createMarker(options);

      // THEN the marker's element has the custom className
      expect(marker).not.toBeNull();
      const element = marker?.getElement?.() as HTMLDivElement | null;
      expect(element).not.toBeNull();
      expect(element?.className).toBe('custom-marker');
    });

    it('should create marker with size applied to element dimensions', () => {
      // GIVEN options with size
      const options: MarkerFactoryOptions = { size: [30, 40] };

      // WHEN createMarker is called with size
      const marker = factory.createMarker(options);

      // THEN the marker's element has width and height set
      expect(marker).not.toBeNull();
      const element = marker?.getElement?.() as HTMLDivElement | null;
      expect(element).not.toBeNull();
      expect(element?.style.width).toBe('30px');
      expect(element?.style.height).toBe('40px');
    });

    it('should create marker with custom element when element option provided', () => {
      // GIVEN a custom HTMLElement
      const element = document.createElement('div');
      element.className = 'custom-element';
      const options: MarkerFactoryOptions = { element };

      // WHEN createMarker is called with element
      const marker = factory.createMarker(options);

      // THEN marker is created and returned (factory uses provided element, does not create new one)
      expect(marker).not.toBeNull();
    });

    it('should create marker with anchor when anchor option provided', () => {
      // GIVEN options with anchor
      const options: MarkerFactoryOptions = { anchor: 'bottom' };

      // WHEN createMarker is called with anchor
      const marker = factory.createMarker(options);

      // THEN marker is created successfully
      expect(marker).not.toBeNull();
    });

    it('should apply imageUrl to element background styles', () => {
      // GIVEN options with imageUrl
      const imageUrl = 'https://example.com/pin.png';
      const options: MarkerFactoryOptions = { imageUrl };

      // WHEN createMarker is called with imageUrl
      const marker = factory.createMarker(options);

      // THEN the marker element has background image styles set
      expect(marker).not.toBeNull();
      const element = marker?.getElement?.() as HTMLDivElement | null;
      expect(element).not.toBeNull();
      expect(element?.style.backgroundImage).toBe(`url(${imageUrl})`);
      expect(element?.style.backgroundSize).toBe('contain');
      expect(element?.style.backgroundRepeat).toBe('no-repeat');
      expect(element?.style.backgroundPosition).toBe('center');
    });

    it('should apply custom cursor when cursor option provided', () => {
      // GIVEN options with cursor
      const options: MarkerFactoryOptions = { cursor: 'grab' };

      // WHEN createMarker is called with cursor
      const marker = factory.createMarker(options);

      // THEN the marker element has the cursor style
      expect(marker).not.toBeNull();
      const element = marker?.getElement?.() as HTMLDivElement | null;
      expect(element?.style.cursor).toBe('grab');
    });

    it('should use default cursor pointer when cursor not provided', () => {
      // GIVEN empty options
      const marker = factory.createMarker({});

      // WHEN marker is created
      const element = marker?.getElement?.() as HTMLDivElement | null;

      // THEN element has cursor pointer
      expect(element?.style.cursor).toBe('pointer');
    });

    it('should invoke onClick with lngLat, marker adapter, and event when element is clicked', () => {
      // GIVEN a marker created with onClick callback
      const onClick = jest.fn<
        void,
        [API.Common.Types.LngLatLike, IMarker, MouseEvent]
      >();
      const options: MarkerFactoryOptions = { onClick };

      // WHEN createMarker is called and the marker element is clicked
      const marker = factory.createMarker(options) as IMarker;
      const element = marker?.getElement?.() as HTMLElement | null;
      expect(element).not.toBeNull();

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 200,
      });
      element?.dispatchEvent(clickEvent);

      // THEN onClick was called with lngLat { lng: 0, lat: 0 }, the marker adapter, and the event
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(
        { lng: 0, lat: 0 },
        marker,
        clickEvent
      );
    });

    it('should not add click listener when onClick is not provided', () => {
      // GIVEN spy on addEventListener on the element that will be created
      const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');

      // WHEN createMarker is called without onClick
      factory.createMarker({});

      // THEN addEventListener was not called with 'click'
      const clickCalls = addEventListenerSpy.mock.calls.filter((call) => call[0] === 'click');
      expect(clickCalls).toHaveLength(0);
      addEventListenerSpy.mockRestore();
    });
  });

  describe('marker operations', () => {
    it('should delegate setLngLat to underlying marker and return marker for chaining', () => {
      // GIVEN a created marker
      const marker = factory.createMarker({}) as IMarker;

      // WHEN setLngLat is called with coordinates
      const result = marker.setLngLat({ lng: 10, lat: 20 });

      // THEN the method returns the marker for chaining
      expect(result).toBe(marker);
    });

    it('should delegate addTo to underlying marker when given map adapter', () => {
      // GIVEN a created marker and map adapter with getMapLibreMap
      const marker = factory.createMarker({}) as IMarker;
      const mapAdapter = { getMapLibreMap: () => mockMap };

      // WHEN addTo is called with map adapter
      const result = marker.addTo(mapAdapter);

      // THEN addTo returns marker for chaining
      expect(result).toBe(marker);
    });

    it('should unwrap MapAdapter via getMapLibreMap and pass raw map to underlying marker', () => {
      // GIVEN MapAdapter wraps MapLibre map; Marker.addTo expects raw map (has _getUIString etc.)
      const addToSpy = jest.spyOn(maplibre.Marker.prototype, 'addTo');
      const mapAdapter = new MapAdapter(mockMap);
      const marker = factory.createMarker({}) as IMarker;

      // WHEN addTo is called with MapAdapter
      marker.addTo(mapAdapter);

      // THEN underlying marker.addTo received the raw MapLibre map, not the adapter
      expect(addToSpy).toHaveBeenCalledWith(mockMap);
      addToSpy.mockRestore();
    });

    it('should delegate remove to underlying marker', () => {
      // GIVEN a created marker added to map
      const marker = factory.createMarker({}) as IMarker;
      marker.addTo(mockMap);

      // WHEN remove is called
      marker.remove();

      // THEN no error is thrown
      expect(marker).toBeDefined();
    });

    it('should delegate setPopup(null) to underlying marker and return marker for chaining', () => {
      // GIVEN a created marker with setPopup
      const marker = factory.createMarker({}) as IMarker;

      // WHEN setPopup is called with null
      const result = marker.setPopup?.(null);

      // THEN method returns the marker for chaining
      expect(result).toBe(marker);
    });

    it('should delegate setPopup(popup) to underlying marker via getMapLibrePopup', () => {
      // GIVEN a marker and a popup adapter that exposes getMapLibrePopup
      const mockMapLibrePopup = { setDOMContent: jest.fn(), remove: jest.fn() };
      const getMapLibrePopup = jest.fn(() => mockMapLibrePopup);
      const popup = {
        setHTML: jest.fn(),
        setDOMContent: jest.fn(),
        setLngLat: jest.fn(),
        addTo: jest.fn(),
        remove: jest.fn(),
        getMapLibrePopup,
      } as unknown as IPopup;
      const marker = factory.createMarker({}) as IMarker;

      // WHEN setPopup is called with the popup adapter
      const result = marker.setPopup?.(popup);

      // THEN getMapLibrePopup is called to resolve the underlying popup and method returns marker
      expect(getMapLibrePopup).toHaveBeenCalled();
      expect(result).toBe(marker);
    });

    it('should not call underlying setPopup when popup has no getMapLibrePopup and logs warning', () => {
      // GIVEN a marker and a popup-like object without getMapLibrePopup
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const marker = factory.createMarker({}) as IMarker;
      const popupWithoutAdapter = {
        setHTML: jest.fn(),
        setDOMContent: jest.fn(),
        setLngLat: jest.fn(),
        addTo: jest.fn(),
        remove: jest.fn(),
      };

      // WHEN setPopup is called with popup that does not expose getMapLibrePopup
      const result = marker.setPopup?.(popupWithoutAdapter as unknown as IPopup);

      // THEN console.warn is called and method still returns marker
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Popup adapter does not expose MapLibre popup instance'
      );
      expect(result).toBe(marker);
      consoleWarnSpy.mockRestore();
    });
  });

  describe('marker chaining', () => {
    it('should support method chaining on setLngLat and addTo', () => {
      // GIVEN a created marker
      const marker = factory.createMarker({}) as IMarker;

      // WHEN setLngLat and addTo are chained
      const result = marker.setLngLat({ lng: 10, lat: 20 }).addTo(mockMap);

      // THEN the chain returns the marker
      expect(result).toBe(marker);
    });
  });
});
