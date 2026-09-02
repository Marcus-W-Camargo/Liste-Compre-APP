import * as Crypto from 'expo-crypto';
import { env } from '@/config/env';
import { getSupabase } from './supabase';
import { fetchWithTimeout } from './http';

export interface TentativaExclusao {
  id: string;
  token: string;
  sessionId: string;
}

function randomHex(bytes = 32) {
  return Array.from(Crypto.getRandomBytes(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function call(body: Record<string, string>) {
  const client = getSupabase();
  const { data } = await client.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error('Sua sessão expirou. Entre novamente.');

  const response = await fetchWithTimeout(`${env.webApiUrl}/api/account`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Origin: env.webApiUrl,
    },
    body: JSON.stringify(body),
  });
  const result = (await response.json().catch(() => ({}))) as { error?: string; id?: string; token?: string };
  if (!response.ok) throw new Error(result.error ?? 'Não foi possível concluir a solicitação.');
  return result;
}

export async function solicitarExclusaoConta(): Promise<TentativaExclusao> {
  const sessionId = randomHex();
  const result = await call({ action: 'request', sessionId });
  if (!result.id || !result.token) throw new Error('Não foi possível iniciar a confirmação.');
  return { id: result.id, token: result.token, sessionId };
}

export async function cancelarExclusaoConta(tentativa: TentativaExclusao) {
  await call({ action: 'cancel', ...tentativa }).catch(() => undefined);
}

export async function confirmarExclusaoConta(tentativa: TentativaExclusao, code: string) {
  await call({ action: 'confirm', ...tentativa, code });
}
