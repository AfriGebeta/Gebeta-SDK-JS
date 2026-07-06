import type { API } from '@gebeta/api';

/**
 * No-op style injector for React Native.
 *
 * On the web, StyleInjector adds CSS to <head> so HTML marker elements can be styled.
 * In React Native there is no DOM; styling is per-component via React Native's StyleSheet
 * API. Adapters that need to style markers/popups should pass styles via component props
 * instead of relying on this injector.
 */
export class StyleInjector implements API.Platform.Types.IStyleInjector {
  private static instance: StyleInjector | null = null;

  static getInstance(): StyleInjector {
    if (!StyleInjector.instance) {
      StyleInjector.instance = new StyleInjector();
    }
    return StyleInjector.instance;
  }

  injectStyle(): void {
    // no-op on React Native
  }

  removeStyle(): void {
    // no-op on React Native
  }
}
