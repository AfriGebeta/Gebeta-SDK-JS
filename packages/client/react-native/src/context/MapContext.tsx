import { createContext, useContext } from 'react';
import type { PlatformContext } from '../adapters/createPlatform';

export interface GebetaMapContextValue {
  platform: PlatformContext | null;
}

const GebetaMapContext = createContext<GebetaMapContextValue | null>(null);

export function useGebetaMapContext(): GebetaMapContextValue {
  const value = useContext(GebetaMapContext);
  if (!value) {
    throw new Error('useGebetaMapContext must be used within a GebetaMap component');
  }
  return value;
}

export function useGebetaMapContextOrNull(): GebetaMapContextValue | null {
  return useContext(GebetaMapContext);
}

export { GebetaMapContext };
