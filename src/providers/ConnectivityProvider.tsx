import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { cloudStore } from '@/state/cloudStore';

interface ConnectivityValue {
  online: boolean;
  known: boolean;
}

const ConnectivityContext = createContext<ConnectivityValue>({ online: true, known: false });

export function ConnectivityProvider({ children }: PropsWithChildren) {
  const [known, setKnown] = useState(false);
  const [online, setOnline] = useState(true);
  const previous = useRef(true);

  useEffect(() => NetInfo.addEventListener((state) => {
    const nextOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
    setKnown(true);
    setOnline(nextOnline);
    if (!previous.current && nextOnline) void cloudStore.retry().catch(() => undefined);
    previous.current = nextOnline;
  }), []);

  const value = useMemo(() => ({ online, known }), [online, known]);
  return <ConnectivityContext.Provider value={value}>{children}</ConnectivityContext.Provider>;
}

export function useConnectivity() {
  return useContext(ConnectivityContext);
}
