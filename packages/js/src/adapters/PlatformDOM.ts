import type { API } from '@gebeta/maps-api';

type IPlatformDOM = API.Platform.Types.IPlatformDOM;

export class PlatformDOM implements IPlatformDOM {
  createElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  createTextNode(text: string): Text {
    return document.createTextNode(text);
  }

  appendChild(parent: unknown, child: unknown): unknown {
    if (parent instanceof Node && child instanceof Node) {
      return parent.appendChild(child);
    }
    throw new Error('Invalid parent or child node');
  }

  removeChild(parent: unknown, child: unknown): unknown {
    if (parent instanceof Node && child instanceof Node) {
      return parent.removeChild(child);
    }
    throw new Error('Invalid parent or child node');
  }

  insertBefore(parent: unknown, child: unknown, before: unknown): unknown {
    if (parent instanceof Node && child instanceof Node) {
      return parent.insertBefore(child, before instanceof Node ? before : null);
    }
    throw new Error('Invalid parent or child node');
  }

  addEventListener(target: unknown, event: string, handler: (event: unknown) => void): void {
    if (target instanceof EventTarget) {
      target.addEventListener(event, handler as EventListener);
    }
  }

  removeEventListener(target: unknown, event: string, handler: (event: unknown) => void): void {
    if (target instanceof EventTarget) {
      target.removeEventListener(event, handler as EventListener);
    }
  }

  querySelector(container: unknown, selector: string): Element | null {
    if (container instanceof Document || container instanceof Element) {
      return container.querySelector(selector);
    }
    return null;
  }

  querySelectorAll(container: unknown, selector: string): Element[] {
    if (container instanceof Document || container instanceof Element) {
      return Array.from(container.querySelectorAll(selector));
    }
    return [];
  }

  getBody(): HTMLElement {
    return document.body;
  }

  getHead(): HTMLHeadElement {
    return document.head;
  }
}
