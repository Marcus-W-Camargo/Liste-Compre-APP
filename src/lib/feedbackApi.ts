import { Platform } from 'react-native';
import { env } from '@/config/env';
import { fetchWithTimeout } from './http';

export type FeedbackType = 'Elogio' | 'Reclamação' | 'Bug';

export async function enviarFeedback(type: FeedbackType, message: string, email = '') {
  const trimmed = message.trim();
  if (!trimmed || trimmed.length > 5000) throw new Error('Escreva uma mensagem com até 5000 caracteres.');
  const response = await fetchWithTimeout(`${env.webApiUrl}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: env.webApiUrl },
    body: JSON.stringify({
      tipo: type,
      mensagem: trimmed,
      email: email.trim().toLowerCase(),
      navegador: type === 'Bug' ? `Liste & Compre APP — ${Platform.OS} ${Platform.Version}` : '',
      website: '',
    }),
  });
  const result = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(result.error ?? 'Não foi possível enviar seu feedback.');
}
