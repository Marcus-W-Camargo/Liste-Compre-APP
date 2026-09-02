import * as Crypto from 'expo-crypto';
import { getSupabase } from '@/lib/supabase';
import { dadosContaValidos } from '@/domain/dataValidation';
import { carregarSessaoCompra, salvarSessaoCompra } from '@/storage/purchaseSession';
import type { DadosConta } from '@/types';

export type CloudStatus = 'idle' | 'loading' | 'ready' | 'saving' | 'error' | 'conflict';

export interface CloudState {
  owner: string;
  email: string;
  status: CloudStatus;
  data: DadosConta;
  revision: number;
  dirty: boolean;
  error: string;
  notice: string;
  epoch: number;
}

export const emptyData = (): DadosConta => ({
  itens: [],
  historico: [],
  sessao: null,
  compras: [],
  edicaoId: null,
});

interface PendingSave {
  operation: string;
  revision: number;
  data: DadosConta;
  edits: number;
}

async function remoteOnly(owner: string, data: DadosConta) {
  if (data.sessao && !(await carregarSessaoCompra(owner))) {
    await salvarSessaoCompra(owner, data.sessao);
  }
  return { ...data, sessao: null } satisfies DadosConta;
}

async function loadRemote(owner: string) {
  const client = getSupabase();
  const { data: sessionData } = await client.auth.getSession();
  if (sessionData.session?.user.id !== owner) throw new Error('Sua sessão mudou. Entre novamente.');
  const { data, error } = await client.rpc('lc_load_data');
  if (error || !data || typeof data !== 'object') throw new Error('Não foi possível carregar seus dados.');
  const result = data as { revision?: unknown; data?: unknown };
  if (typeof result.revision !== 'number' || !dadosContaValidos(result.data)) {
    throw new Error('O servidor retornou dados incompatíveis.');
  }
  return { revision: result.revision, data: await remoteOnly(owner, result.data) };
}

async function saveRemote(owner: string, revision: number, operation: string, data: DadosConta) {
  const sanitized = await remoteOnly(owner, data);
  if (!dadosContaValidos(sanitized)) throw new Error('Os dados locais não passaram pela validação.');
  const client = getSupabase();
  const { data: sessionData } = await client.auth.getSession();
  if (sessionData.session?.user.id !== owner) throw new Error('Sua sessão mudou. Entre novamente.');
  const { data: response, error } = await client.rpc('lc_save_data', {
    p_expected_revision: revision,
    p_operation: operation,
    p_data: sanitized,
  });
  if (error || !response || typeof response !== 'object') throw new Error('Não foi possível sincronizar. Confira sua conexão.');
  const result = response as { ok?: unknown; revision?: unknown; reason?: unknown };
  if (typeof result.revision !== 'number') throw new Error('Resposta de sincronização inválida.');
  return { ok: result.ok === true, revision: result.revision, reason: result.reason };
}

class CloudStore {
  private listeners = new Set<() => void>();
  private generation = 0;
  private edits = 0;
  private running: Promise<void> | null = null;
  private loading: Promise<void> | null = null;
  private pending: PendingSave | null = null;

  private state: CloudState = {
    owner: '',
    email: '',
    status: 'idle',
    data: emptyData(),
    revision: 0,
    dirty: false,
    error: '',
    notice: '',
    epoch: 0,
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.state;

  private publish(patch: Partial<CloudState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  reset() {
    this.generation += 1;
    this.edits = 0;
    this.running = null;
    this.loading = null;
    this.pending = null;
    this.publish({
      owner: '',
      email: '',
      status: 'idle',
      data: emptyData(),
      revision: 0,
      dirty: false,
      error: '',
      notice: '',
      epoch: this.state.epoch + 1,
    });
  }

  async connect(owner: string, email: string) {
    if (this.state.owner === owner && this.state.status !== 'idle') return;
    this.reset();
    this.publish({ owner, email, status: 'loading' });
    await this.load(true);
  }

  async load(initial = false) {
    if (this.loading) return this.loading;
    if (!this.state.owner || this.state.dirty || this.running) return;
    const generation = this.generation;
    const edits = this.edits;
    const owner = this.state.owner;
    const task = (async () => {
      try {
        const result = await loadRemote(owner);
        if (generation !== this.generation || edits !== this.edits || this.state.dirty) return;
        const changed = initial || result.revision !== this.state.revision;
        this.publish({
          status: 'ready',
          error: '',
          ...(changed ? { data: structuredClone(result.data), revision: result.revision, epoch: this.state.epoch + 1 } : {}),
        });
      } catch (error) {
        if (generation === this.generation) {
          this.publish({ status: initial ? 'error' : this.state.status, error: error instanceof Error ? error.message : 'Falha de sincronização.' });
        }
        if (initial) throw error;
      }
    })();
    this.loading = task;
    try {
      await task;
    } finally {
      if (this.loading === task) this.loading = null;
    }
  }

  mutate(change: (data: DadosConta) => void) {
    if (!this.state.owner || !['ready', 'saving', 'error'].includes(this.state.status)) {
      throw new Error('Aguarde o carregamento dos seus dados.');
    }
    const next = structuredClone(this.state.data);
    change(next);
    if (!dadosContaValidos(next)) throw new Error('A alteração produziria dados inválidos.');
    if (JSON.stringify(next) === JSON.stringify(this.state.data)) return;
    this.edits += 1;
    this.publish({ data: next, dirty: true, status: 'saving', error: '' });
    queueMicrotask(() => void this.flush().catch(() => undefined));
  }

  async flush() {
    if (this.running) return this.running;
    if (this.state.status === 'conflict') throw new Error(this.state.error);
    if (!this.state.dirty) return;
    const generation = this.generation;
    const owner = this.state.owner;
    const task = (async () => {
      try {
        while (this.state.dirty && generation === this.generation) {
          this.pending ??= {
            operation: Crypto.randomUUID(),
            revision: this.state.revision,
            data: structuredClone(this.state.data),
            edits: this.edits,
          };
          const sent = this.pending;
          const result = await saveRemote(owner, sent.revision, sent.operation, sent.data);
          if (generation !== this.generation) return;
          if (!result.ok) {
            this.publish({ status: 'conflict', error: 'Há alterações mais recentes em outro dispositivo. Seus dados locais não foram sobrescritos.' });
            throw new Error(this.state.error);
          }
          this.pending = null;
          const dirty = this.edits !== sent.edits;
          this.publish({ revision: result.revision, dirty, status: dirty ? 'saving' : 'ready', error: '' });
        }
      } catch (error) {
        if (generation === this.generation && this.state.status !== 'conflict') {
          this.publish({ status: 'error', error: error instanceof Error ? error.message : 'Falha de sincronização.' });
        }
        throw error;
      }
    })();
    this.running = task;
    try {
      await task;
    } finally {
      if (this.running === task) this.running = null;
    }
  }

  async retry() {
    if (this.state.status === 'conflict') return;
    if (this.state.dirty) await this.flush();
    else await this.load(true);
  }

  async discardAndReload() {
    const { owner, email } = this.state;
    this.reset();
    if (!owner) return;
    this.publish({ owner, email, status: 'loading' });
    await this.load(true);
  }
}

export const cloudStore = new CloudStore();
