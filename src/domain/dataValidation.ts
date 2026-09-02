import type { DadosConta, Item, ItemCompra, SessaoCompra, TipoMedida } from '@/types';

function finiteNonNegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function tipoValido(value: unknown): value is TipoMedida {
  return value === 'un' || value === 'Kg';
}

export function itemValido(value: unknown): value is Item {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 100 &&
    typeof item.nome === 'string' && item.nome.trim().length > 0 && item.nome.length <= 300 &&
    typeof item.categoria === 'string' && item.categoria.length <= 100 &&
    finiteNonNegative(item.quantidade) &&
    tipoValido(item.tipo) &&
    (item.preco === undefined || finiteNonNegative(item.preco)) &&
    (item.comprado === undefined || typeof item.comprado === 'boolean')
  );
}

export function itemCompraValido(value: unknown): value is ItemCompra {
  if (!itemValido(value)) return false;
  const item = value as unknown as Record<string, unknown>;
  return (
    finiteNonNegative(item.precoUnitario) &&
    typeof item.pego === 'boolean' &&
    (item.origem === 'planejado' || item.origem === 'extra') &&
    (item.quantidadePlanejada === undefined || finiteNonNegative(item.quantidadePlanejada))
  );
}

export function sessaoCompraValida(value: unknown): value is SessaoCompra {
  if (!value || typeof value !== 'object') return false;
  const session = value as Record<string, unknown>;
  return (
    typeof session.id === 'string' &&
    typeof session.listaId === 'string' &&
    typeof session.nomeLista === 'string' && session.nomeLista.trim().length > 0 &&
    typeof session.dataInicio === 'string' &&
    (session.dataPrevista === undefined || typeof session.dataPrevista === 'string') &&
    Array.isArray(session.itens) && session.itens.every(itemCompraValido)
  );
}

function listaValida(value: unknown) {
  if (!value || typeof value !== 'object') return false;
  const list = value as Record<string, unknown>;
  return (
    typeof list.id === 'string' && list.id.length > 0 && list.id.length <= 100 &&
    typeof list.nome === 'string' && list.nome.trim().length > 0 && list.nome.length <= 200 &&
    typeof list.data === 'string' &&
    (list.dataPrevista === undefined || typeof list.dataPrevista === 'string') &&
    Array.isArray(list.itens) && list.itens.every(itemValido)
  );
}

function compraFinalizadaValida(value: unknown) {
  if (!sessaoCompraValida(value)) return false;
  const purchase = value as unknown as Record<string, unknown>;
  return (
    typeof purchase.dataFim === 'string' &&
    finiteNonNegative(purchase.valorTotal) &&
    finiteNonNegative(purchase.porcentagemFinal) && Number(purchase.porcentagemFinal) <= 100 &&
    finiteNonNegative(purchase.gastosAdicionais)
  );
}

export function dadosContaValidos(value: unknown): value is DadosConta {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return (
    Array.isArray(data.itens) && data.itens.every(itemValido) &&
    Array.isArray(data.historico) && data.historico.every(listaValida) &&
    (data.sessao === null || sessaoCompraValida(data.sessao)) &&
    Array.isArray(data.compras) && data.compras.every(compraFinalizadaValida) &&
    (data.edicaoId === null || typeof data.edicaoId === 'string')
  );
}
