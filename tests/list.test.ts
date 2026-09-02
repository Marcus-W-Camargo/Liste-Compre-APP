import { describe, expect, it } from 'vitest';
import { dataPrevistaValida, normalizarDataPrevista } from '../src/domain/list';

describe('data prevista', () => {
  it('aceita vazio e data ISO válida', () => { expect(dataPrevistaValida('')).toBe(true); expect(dataPrevistaValida('2026-09-30')).toBe(true); });
  it('recusa rollover e formato brasileiro', () => { expect(dataPrevistaValida('2026-02-31')).toBe(false); expect(dataPrevistaValida('30/09/2026')).toBe(false); });
  it('normaliza opcional', () => { expect(normalizarDataPrevista(' 2026-09-30 ')).toBe('2026-09-30'); expect(normalizarDataPrevista('')).toBeUndefined(); });
});
