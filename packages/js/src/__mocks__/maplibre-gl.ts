//mocked maplibre gl for test

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  private lngLat: any;
  
  constructor(public options?: any) {}
  
  setLngLat(lngLat: any) {
    this.lngLat = lngLat;
    return this;
  }
  
  addTo(_map: any) {
    return this;
  }
  
  remove() {
    return this;
  }
  
  getLngLat() {
    return this.lngLat;
  }
}

export class Popup {
  constructor(public options?: any) {}
  
  setLngLat(_lngLat: any) {
    return this;
  }
  
  setHTML(_html: string) {
    return this;
  }
  
  addTo(_map: any) {
    return this;
  }
  
  remove() {
    return this;
  }
}

export class NavigationControl {}

export class LngLatBounds {
  extend(_lngLat: any) {
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

