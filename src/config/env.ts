const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';
const webApiUrl = (process.env.EXPO_PUBLIC_WEB_API_URL?.trim() || 'https://listeecompre.vercel.app').replace(/\/$/, '');

export const env = {
  supabaseUrl,
  supabasePublishableKey,
  webApiUrl,
  configured: Boolean(supabaseUrl && supabasePublishableKey && !supabasePublishableKey.includes('COLE_A_CHAVE')),
} as const;
