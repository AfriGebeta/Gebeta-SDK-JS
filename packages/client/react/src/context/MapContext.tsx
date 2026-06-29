import { createContext, useContext } from 'react';
import type { GebetaMaps } from '@gebeta/js';

const GebetaMapContext = createContext<GebetaMaps | null>(null);

export function useGebetaMap(): GebetaMaps {
  const value = useContext(GebetaMapContext);
  if (!value) {
    throw new Error('useGebetaMap must be used within a GebetaMap component');
  }
  return value;
}

export function useGebetaMapOrNull(): GebetaMaps | null {
  return useContext(GebetaMapContext);
}

export { GebetaMapContext };
