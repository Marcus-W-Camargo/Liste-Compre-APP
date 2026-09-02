import { env } from '@/config/env';
import { fetchWithTimeout } from './http';

export interface TentativaAuth {
  id: string;
  token: string;
}

export class AuthApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'ERRO', status = 0) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function solicitarAuth<T = { ok: true }>(body: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetchWithTimeout(`${env.webApiUrl}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: env.webApiUrl,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthApiError('Não foi possível conectar ao servidor. Confira sua internet.', 'CONEXAO');
  }

  const result = (await response.json().catch(() => null)) as
    | { error?: string; code?: string }
    | null;

  if (!result) throw new AuthApiError('Resposta inválida do servidor.', 'API_INDISPONIVEL', response.status);
  if (!response.ok) {
    throw new AuthApiError(
      result.error ?? 'Não foi possível concluir a operação.',
      result.code ?? 'ERRO',
      response.status,
    );
  }
  return result as T;
}

export async function cancelarTentativa(tentativa: TentativaAuth) {
  await solicitarAuth({ action: 'cancel', ...tentativa }).catch(() => undefined);
}
