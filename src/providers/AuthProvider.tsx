import { AppState } from 'react-native';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { env } from '@/config/env';
import { getSupabase } from '@/lib/supabase';
import { cloudStore } from '@/state/cloudStore';

interface AuthContextValue {
  loading: boolean;
  configured: boolean;
  session: Session | null;
  user: User | null;
  name: string;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  refreshProfile(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState('');

  const refreshProfile = useCallback(async () => {
    if (!env.configured) return;
    const client = getSupabase();
    const { data: sessionData } = await client.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setName('');
      return;
    }
    const { data } = await client.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
    const profileName = typeof data?.full_name === 'string' ? data.full_name : '';
    setName(profileName || String(user.user_metadata?.full_name ?? '').trim());
  }, []);

  useEffect(() => {
    if (!env.configured) {
      setLoading(false);
      return;
    }

    const client = getSupabase();
    let active = true;

    void client.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) {
        await cloudStore.connect(data.session.user.id, data.session.user.email ?? '').catch(() => undefined);
        await refreshProfile();
      }
      if (active) setLoading(false);
    });

    const { data: authSubscription } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) {
        cloudStore.reset();
        setName('');
      } else {
        void cloudStore.connect(nextSession.user.id, nextSession.user.email ?? '').catch(() => undefined);
        void refreshProfile();
      }
    });

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    });

    return () => {
      active = false;
      authSubscription.subscription.unsubscribe();
      appStateSubscription.remove();
      client.auth.stopAutoRefresh();
    };
  }, [refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = getSupabase();
    const { error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw new Error('E-mail ou senha inválidos.');
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabase();
    await cloudStore.flush().catch((error) => {
      throw error instanceof Error ? error : new Error('Não foi possível sincronizar antes de sair.');
    });
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) throw new Error('Não foi possível sair da conta.');
    cloudStore.reset();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    configured: env.configured,
    session,
    user: session?.user ?? null,
    name,
    signIn,
    signOut,
    refreshProfile,
  }), [loading, session, name, signIn, signOut, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth precisa estar dentro de AuthProvider.');
  return value;
}
