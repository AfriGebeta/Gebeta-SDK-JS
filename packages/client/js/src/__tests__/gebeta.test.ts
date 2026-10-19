import { PlatformError } from '@gebeta/api';
import { GebetaMaps, gebeta, Marker, Popup } from '../index';
import * as engine from 'maplibre-gl';

type MockMarker = Marker & {
  options: Record<string, unknown>;
  getPopup(): MockPopup | null;
  fire(event: string): void;
};
type MockPopup = Popup & {
  options: Record<string, unknown>;
  content: { text?: string; html?: string; element?: unknown };
  lngLat: unknown;
};

describe('gebeta namespace', () => {
  test('should expose map building blocks under the Gebeta name', () => {
    // GIVEN the gebeta namespace
    // THEN it provides the engine classes and functions apps need
    expect(gebeta.Marker).toBe(engine.Marker);
    expect(gebeta.Popup).toBe(engine.Popup);
    expect(gebeta.LngLatBounds).toBe(engine.LngLatBounds);
    expect(gebeta.NavigationControl).toBe(engine.NavigationControl);
    expect(gebeta.GeolocateControl).toBe(engine.GeolocateControl);
    expect(gebeta.FullscreenControl).toBe(engine.FullscreenControl);
    expect(gebeta.ScaleControl).toBe(engine.ScaleControl);
    expect(gebeta.TerrainControl).toBe(engine.TerrainControl);
    expect(gebeta.addProtocol).toBe(engine.addProtocol);
  });
});

describe('GebetaMaps.addMarker / addPopup', () => {
  let sdk: GebetaMaps;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    sdk = new GebetaMaps({ apiKey: 'test-key' });
  });

  afterEach(() => jest.restoreAllMocks());

  test('should throw PlatformError when called before init()', () => {
    expect(() => sdk.addMarker({ lngLat: [38.75, 9.03] })).toThrow(PlatformError);
    expect(() => sdk.addPopup({ lngLat: [38.75, 9.03], text: 'x' })).toThrow(PlatformError);
  });

  describe('after init()', () => {
    beforeEach(() => {
      const container = document.createElement('div');
      sdk.init({ container });
    });

    test('should add a marker at [lng, lat] and { lng, lat } positions', () => {
      // WHEN adding markers with both coordinate forms
      const a = sdk.addMarker({ lngLat: [38.75, 9.03] });
      const b = sdk.addMarker({ lngLat: { lng: 38.76, lat: 9.04 } });

      // THEN both are placed at [lng, lat]
      expect(a.getLngLat()).toEqual([38.75, 9.03]);
      expect(b.getLngLat()).toEqual([38.76, 9.04]);
    });

    test('should use a custom element and anchor', () => {
      // GIVEN a custom pin element
      const pin = document.createElement('div');

      // WHEN adding a marker with it
      const marker = sdk.addMarker({ lngLat: [38.75, 9.03], element: pin, anchor: 'bottom' });

      // THEN the marker uses the element and anchor
      expect(marker.getElement()).toBe(pin);
      // (compare DOM nodes by reference; deep equality walks the whole jsdom graph)
      expect((marker as MockMarker).options.element).toBe(pin);
      expect((marker as MockMarker).options.anchor).toBe('bottom');
    });

    test('should build an image marker anchored at the bottom by default', () => {
      // WHEN adding an image marker
      const marker = sdk.addMarker({ lngLat: [38.75, 9.03], imageUrl: '/pin.png', size: [40, 40] });

      // THEN the element shows the image at the given size, anchored at the bottom
      const el = marker.getElement();
      expect(el.style.backgroundImage).toContain('/pin.png');
      expect(el.style.width).toBe('40px');
      expect((marker as MockMarker).options).toMatchObject({ anchor: 'bottom' });
    });

    test('should attach a text popup', () => {
      // WHEN adding a marker with a popup string
      const marker = sdk.addMarker({ lngLat: [38.75, 9.03], popup: '<b>Bole</b>' });

      // THEN the popup content is set as text (not HTML), so user data is safe
      expect((marker as MockMarker).getPopup()?.content).toEqual({ text: '<b>Bole</b>' });
    });

    test('should call onClick with the marker', () => {
      // GIVEN a click handler
      const onClick = jest.fn();
      const marker = sdk.addMarker({ lngLat: [38.75, 9.03], onClick });

      // WHEN the marker element is clicked
      marker.getElement().dispatchEvent(new MouseEvent('click'));

      // THEN the handler receives the marker
      expect(onClick).toHaveBeenCalledWith(marker, expect.any(MouseEvent));
    });

    test('should report the new position on drag end', () => {
      // GIVEN a draggable marker with onDragEnd
      const onDragEnd = jest.fn();
      const marker = sdk.addMarker({ lngLat: [38.75, 9.03], draggable: true, onDragEnd });
      jest.spyOn(marker, 'getLngLat').mockReturnValue({ lng: 38.8, lat: 9.1 } as never);

      // WHEN the drag ends
      (marker as MockMarker).fire('dragend');

      // THEN the handler gets { lng, lat }
      expect((marker as MockMarker).options).toMatchObject({ draggable: true });
      expect(onDragEnd).toHaveBeenCalledWith({ lng: 38.8, lat: 9.1 }, marker);
    });

    test('should open a popup with text, html or element content', () => {
      const el = document.createElement('div');

      const text = sdk.addPopup({ lngLat: [38.75, 9.03], text: 'Meskel Square' }) as MockPopup;
      const html = sdk.addPopup({ lngLat: [38.75, 9.03], html: '<b>Hi</b>' }) as MockPopup;
      const dom = sdk.addPopup({ lngLat: { lng: 38.75, lat: 9.03 }, element: el }) as MockPopup;

      expect(text.content).toEqual({ text: 'Meskel Square' });
      expect(html.content).toEqual({ html: '<b>Hi</b>' });
      expect(dom.content.element).toBe(el);
      expect(dom.lngLat).toEqual([38.75, 9.03]);
      expect(text.options).toMatchObject({ closeButton: true, closeOnClick: true });
    });
  });
});
