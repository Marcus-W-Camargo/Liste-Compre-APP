import * as Crypto from 'expo-crypto';
import type { CompraFinalizada, Item, ItemCompra, ListaSalva, SessaoCompra } from '@/types';

export function gerarId() {
  return Crypto.randomUUID();
}

export function criarSessaoCompra(lista: ListaSalva): SessaoCompra {
  return {
    id: gerarId(),
    listaId: lista.id,
    nomeLista: lista.nome,
    dataInicio: new Date().toISOString(),
    ...(lista.dataPrevista ? { dataPrevista: lista.dataPrevista } : {}),
    itens: lista.itens.map<ItemCompra>((item) => ({
      ...item,
      precoUnitario: 0,
      pego: false,
      origem: 'planejado',
      quantidadePlanejada: item.quantidade,
    })),
  };
}

export function calcularTotal(itens: ItemCompra[]) {
  return itens
    .filter((item) => item.pego && item.precoUnitario > 0 && item.quantidade > 0)
    .reduce((total, item) => total + item.precoUnitario * item.quantidade, 0);
}

export function calcularProgresso(itens: ItemCompra[]) {
  if (!itens.length) return 0;
  return Math.round((itens.filter((item) => item.pego).length / itens.length) * 100);
}

export function finalizarSessao(sessao: SessaoCompra): CompraFinalizada {
  const valorTotal = calcularTotal(sessao.itens);
  return {
    ...sessao,
    dataFim: new Date().toISOString(),
    valorTotal,
    porcentagemFinal: calcularProgresso(sessao.itens),
    gastosAdicionais: sessao.itens
      .filter((item) => item.origem === 'extra')
      .reduce((total, item) => total + item.precoUnitario * item.quantidade, 0),
  };
}

export function itensParaRefazerCompra(compra: CompraFinalizada): Item[] {
  return compra.itens.map((item) => ({
    id: gerarId(),
    nome: item.nome,
    categoria: item.categoria,
    quantidade: item.quantidadePlanejada ?? item.quantidade,
    tipo: item.tipo,
    comprado: false,
  }));
}
