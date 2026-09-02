export type TipoMedida = 'un' | 'Kg';

export interface Item {
  id: string;
  nome: string;
  quantidade: number;
  tipo: TipoMedida;
  categoria: string;
  preco?: number;
  comprado?: boolean;
}

export interface ListaSalva {
  id: string;
  nome: string;
  itens: Item[];
  data: string;
  dataPrevista?: string;
}

export interface ItemCompra extends Item {
  precoUnitario: number;
  pego: boolean;
  origem: 'planejado' | 'extra';
  quantidadePlanejada?: number;
}

export interface SessaoCompra {
  id: string;
  listaId: string;
  nomeLista: string;
  dataInicio: string;
  dataPrevista?: string;
  itens: ItemCompra[];
}

export interface CompraFinalizada extends SessaoCompra {
  dataFim: string;
  valorTotal: number;
  porcentagemFinal: number;
  gastosAdicionais: number;
}

export interface DadosConta {
  itens: Item[];
  historico: ListaSalva[];
  sessao: SessaoCompra | null;
  compras: CompraFinalizada[];
  edicaoId: string | null;
}

export interface CloudPayload {
  revision: number;
  data: DadosConta;
}

export const CATEGORIAS = [
  { value: 'Mercearia', label: '🍞 Mercearia' },
  { value: 'Hortifruti', label: '🍎 Hortifrúti' },
  { value: 'Acougue', label: '🥩 Açougue' },
  { value: 'Bebidas', label: '🥤 Bebidas' },
  { value: 'Laticinios', label: '🥛 Laticínios' },
  { value: 'Limpeza', label: '🧹 Limpeza' },
  { value: 'Higiene', label: '🧼 Higiene' },
  { value: 'Outros', label: '📦 Outros' }
] as const;

export type CategoriaValue = (typeof CATEGORIAS)[number]['value'];
