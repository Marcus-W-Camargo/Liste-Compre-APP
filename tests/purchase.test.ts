import { describe, expect, it, vi } from 'vitest';

vi.mock('expo-crypto', () => ({ randomUUID: () => '00000000-0000-4000-8000-000000000001' }));

import { calcularProgresso, calcularTotal, finalizarSessao, itensParaRefazerCompra } from '../src/domain/purchase';
import type { SessaoCompra } from '../src/types';

const session: SessaoCompra = { id: 's', listaId: 'l', nomeLista: 'Mercado', dataInicio: '2026-09-01T00:00:00Z', itens: [
  { id: '1', nome: 'Arroz', categoria: '🍞 Mercearia', quantidade: 2, tipo: 'un', precoUnitario: 10, pego: true, origem: 'planejado', quantidadePlanejada: 2 },
  { id: '2', nome: 'Chocolate', categoria: '🍞 Mercearia', quantidade: 1, tipo: 'un', precoUnitario: 5, pego: true, origem: 'extra' },
] };

describe('compra', () => {
  it('calcula total e progresso', () => { expect(calcularTotal(session.itens)).toBe(25); expect(calcularProgresso(session.itens)).toBe(100); });
  it('separa extras no fechamento', () => { const done = finalizarSessao(session); expect(done.valorTotal).toBe(25); expect(done.gastosAdicionais).toBe(5); });
  it('refaz compra sem preços antigos', () => { const items = itensParaRefazerCompra(finalizarSessao(session)); expect(items).toHaveLength(2); expect(items[0]).not.toHaveProperty('precoUnitario'); });
});
