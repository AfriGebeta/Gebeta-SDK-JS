import type { API } from '@gebeta/maps-api';

type IStyleInjector = API.Platform.Types.IStyleInjector;

export class StyleInjector implements IStyleInjector {
  injectStyle(id: string, cssText: string): void {
    const existingStyle = document.getElementById(id);
    if (existingStyle) {
      existingStyle.textContent = cssText;
      return;
    }

    const style = document.createElement('style');
    style.id = id;
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  removeStyle(id: string): void {
    const style = document.getElementById(id);
    if (style) {
      style.remove();
    }
  }
}
