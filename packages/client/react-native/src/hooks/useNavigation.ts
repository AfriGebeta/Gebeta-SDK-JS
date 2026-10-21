import { useEffect, useMemo, useState } from 'react';
import type { API } from '@gebeta/api';
import { resolveAuth } from '@gebeta/core';
import { NavigationManager } from '../Navigation';
import { useGebetaMapContextOrNull } from '../context/MapContext';

type ProgressEvent = API.Navigation.Events.ProgressEvent;
type NavigationManagerOptions = API.Navigation.Types.ManagerOptions;

export interface UseNavigationResult {
  /** The navigation manager, or null until the map platform is ready. */
  navigation: NavigationManager | null;
  /** Whether navigation is currently active. */
  isNavigating: boolean;
  /** Latest progress event (remaining distance/duration, current step), or null. */
  progress: ProgressEvent | null;
  /** True once the destination is reached (until the next start). */
  arrived: boolean;
}

/**
 * Hook that provides a {@link NavigationManager} wired to the enclosing `<GebetaMap>`, plus
 * reactive navigation state (isNavigating / progress / arrived) driven by the manager's events.
 * Must be called from a component rendered inside `<GebetaMap>`.
 *
 * Pass the same auth you gave `<GebetaMap>`.
 */
export function useNavigation(
  auth: { apiKey?: string; auth?: API.Auth.Types.ServiceAccountAuth },
  options: NavigationManagerOptions = {}
): UseNavigationResult {
  const ctx = useGebetaMapContextOrNull();
  const platform = ctx?.platform ?? null;

  const navigation = useMemo(() => {
    if (!platform) return null;
    return new NavigationManager(
      resolveAuth({ apiKey: auth.apiKey, auth: auth.auth }),
      platform.mapAdapter,
      platform.markerFactory,
      options
    );
    // Recreate only when the platform/auth changes; options are read at construction.
  }, [platform, auth.apiKey, auth.auth]);

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (!navigation) return;

    const onStart = () => {
      setIsNavigating(true);
      setArrived(false);
      setProgress(null);
    };
    const onProgress = (e: ProgressEvent) => setProgress(e);
    const onArrive = () => {
      setArrived(true);
      setIsNavigating(false);
    };
    const onStop = () => setIsNavigating(false);

    navigation.on('start', onStart);
    navigation.on('progress', onProgress);
    navigation.on('arrive', onArrive);
    navigation.on('stop', onStop);

    return () => {
      navigation.off('start', onStart);
      navigation.off('progress', onProgress);
      navigation.off('arrive', onArrive);
      navigation.off('stop', onStop);
      navigation.stop();
    };
  }, [navigation]);

  return { navigation, isNavigating, progress, arrived };
}
