import { describe, expect, it } from 'vitest';
import { sugerirProdutos, TOTAL_CATALOGO_EMBUTIDO } from '../src/data/catalog';

describe('autocomplete', () => {
  it('só sugere após três caracteres', () => { expect(sugerirProdutos('ar')).toEqual([]); expect(sugerirProdutos('arr').length).toBeGreaterThan(0); });
  it('ignora acentos e caixa', () => { expect(sugerirProdutos('maca').some((item) => item.startsWith('Maçã'))).toBe(true); });
  it('possui fallback local substancial', () => expect(TOTAL_CATALOGO_EMBUTIDO).toBeGreaterThan(100));
});
