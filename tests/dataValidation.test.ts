import { describe, expect, it } from 'vitest';
import { dadosContaValidos, sessaoCompraValida } from '../src/domain/dataValidation';

describe('integridade de dados', () => {
  const item = { id: '1', nome: 'Arroz', categoria: '🍞 Mercearia', quantidade: 1, tipo: 'un' as const, precoUnitario: 0, pego: false, origem: 'planejado' as const };
  it('aceita sessão válida', () => expect(sessaoCompraValida({ id: 's', listaId: 'l', nomeLista: 'L', dataInicio: 'x', itens: [item] })).toBe(true));
  it('recusa quantidade inválida', () => expect(sessaoCompraValida({ id: 's', listaId: 'l', nomeLista: 'L', dataInicio: 'x', itens: [{ ...item, quantidade: -1 }] })).toBe(false));
  it('recusa payload de conta incompleto', () => expect(dadosContaValidos({ itens: [], historico: [] })).toBe(false));
  it('aceita payload remoto sem sessão', () => expect(dadosContaValidos({ itens: [], historico: [], sessao: null, compras: [], edicaoId: null })).toBe(true));
});
