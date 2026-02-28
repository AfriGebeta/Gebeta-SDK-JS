
export class Map {
  private handlers: Record<string, ((...args: any[]) => void)[]> = {};
  
  constructor(public options: any) {}
  
  on(event: string, handler: (...args: any[]) => void) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }
  
  once(event: string, handler: (...args: any[]) => void) {
    this.on(event, handler);
  }
  
  off(event: string, handler: (...args: any[]) => void) {
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
  
  easeTo(_options: any) {
    //mock impl.
  }
  
  resize() {}
  
  getStyle() {
    return { layers: [] };
  }
  
  setStyle(_style: any) {}
  
  isStyleLoaded() {
    return true;
  }
  
  addSource(_id: string, _spec: any) {}
  getSource(_id: string) {
    return null;
  }
  removeSource(_id: string) {}
  
  addLayer(_spec: any, _beforeId?: string) {}
  removeLayer(_id: string) {}
  
  addControl(_control: any, _position?: string) {}
  
  fitBounds(_bounds: any, _options?: any) {}
  
  setPaintProperty(_layer: string, _name: string, _value: any) {}
  setLayoutProperty(_layer: string, _name: string, _value: any) {}
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

