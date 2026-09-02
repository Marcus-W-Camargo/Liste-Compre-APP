import produtos from './produtosMercado.json';

const PRODUTOS = produtos as string[];

function normalizar(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function sugerirProdutos(query: string, limite = 8) {
  const needle = normalizar(query.trim());
  if (needle.length < 3) return [];
  return PRODUTOS.filter((produto) => normalizar(produto).startsWith(needle)).slice(0, limite);
}

export const TOTAL_CATALOGO_EMBUTIDO = PRODUTOS.length;
