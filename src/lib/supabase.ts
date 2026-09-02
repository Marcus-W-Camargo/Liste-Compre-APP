import 'react-native-url-polyfill/auto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';
import { secureSessionStorage } from './secureSessionStorage';

let client: SupabaseClient | null = null;

export function getSupabase() {
  if (!env.configured) {
    throw new Error('Configuração do Supabase ausente. Confira o arquivo .env.');
  }
  client ??= createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      storage: secureSessionStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
