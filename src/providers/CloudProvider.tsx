import { createContext, useContext, useMemo, useSyncExternalStore, type PropsWithChildren } from 'react';
import { cloudStore, type CloudState } from '@/state/cloudStore';

interface CloudContextValue extends CloudState {
  mutate: typeof cloudStore.mutate;
  flush: typeof cloudStore.flush;
  retry: typeof cloudStore.retry;
  discardAndReload: typeof cloudStore.discardAndReload;
}

const CloudContext = createContext<CloudContextValue | null>(null);

export function CloudProvider({ children }: PropsWithChildren) {
  const state = useSyncExternalStore(cloudStore.subscribe, cloudStore.getSnapshot, cloudStore.getSnapshot);
  const value = useMemo<CloudContextValue>(() => ({
    ...state,
    mutate: cloudStore.mutate.bind(cloudStore),
    flush: cloudStore.flush.bind(cloudStore),
    retry: cloudStore.retry.bind(cloudStore),
    discardAndReload: cloudStore.discardAndReload.bind(cloudStore),
  }), [state]);
  return <CloudContext.Provider value={value}>{children}</CloudContext.Provider>;
}

export function useCloud() {
  const value = useContext(CloudContext);
  if (!value) throw new Error('useCloud precisa estar dentro de CloudProvider.');
  return value;
}
