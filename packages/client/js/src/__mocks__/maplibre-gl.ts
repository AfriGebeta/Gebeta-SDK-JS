type Handler = (...args: unknown[]) => void;

export class Map {
  private handlers: Record<string, Handler[]> = {};

  constructor(public options: unknown) {}

  on(event: string, handler: Handler) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }

  once(event: string, handler: Handler) {
    this.on(event, handler);
  }

  off(event: string, handler: Handler) {
    if (this.handlers[event]) {
      this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
  }

  getContainer() {
    return document.createElement('div');
  }

  getBounds() {
    return {
      getWest: () => 0,
      getSouth: () => 0,
      getEast: () => 1,
      getNorth: () => 1,
    };
  }

  getZoom() {
    return 10;
  }

  easeTo(_options: unknown) {
    //mock impl.
  }

  resize() {}

  getStyle() {
    return { layers: [] };
  }

  setStyle(_style: unknown) {}

  isStyleLoaded() {
    return true;
  }

  addSource(_id: string, _spec: unknown) {}
  getSource(_id: string) {
    return null;
  }
  removeSource(_id: string) {}

  addLayer(_spec: unknown, _beforeId?: string) {}
  removeLayer(_id: string) {}

  addControl(_control: unknown, _position?: string) {}

  fitBounds(_bounds: unknown, _options?: unknown) {}

  setPaintProperty(_layer: string, _name: string, _value: unknown) {}
  setLayoutProperty(_layer: string, _name: string, _value: unknown) {}
}

export class Marker {
  private lngLat: unknown;
  private _popup: unknown = null;

  constructor(public options?: unknown) {}

  setLngLat(lngLat: unknown) {
    this.lngLat = lngLat;
    return this;
  }

  addTo(_map: unknown) {
    return this;
  }

  remove() {
    return;
  }

  getLngLat() {
    return this.lngLat;
  }

  setPopup(popup: unknown) {
    this._popup = popup;
    return this;
  }
}

export class Popup {
  constructor(public options?: Record<string, unknown>) {}

  setLngLat(_lngLat: unknown) {
    return this;
  }

  setHTML(_html: string) {
    return this;
  }

  setDOMContent(_element: unknown) {
    return this;
  }

  addTo(_map: unknown) {
    return this;
  }

  remove() {
    return;
  }
}

export class NavigationControl {}

export class LngLatBounds {
  extendedPoints: [number, number][] = [];

  extend(lngLat: [number, number] | { lng: number; lat: number }) {
    const coords: [number, number] = Array.isArray(lngLat) ? lngLat : [lngLat.lng, lngLat.lat];
    this.extendedPoints.push(coords);
    return this;
  }
}

export default {
  Map,
  Marker,
  Popup,
  NavigationControl,
  LngLatBounds,
};
