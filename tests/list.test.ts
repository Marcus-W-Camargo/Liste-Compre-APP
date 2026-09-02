import { describe, expect, it } from 'vitest';
import { dataPrevistaValida, normalizarDataPrevista } from '../src/domain/list';

describe('data prevista', () => {
  it('aceita vazio e data brasileira válida', () => { expect(dataPrevistaValida('')).toBe(true); expect(dataPrevistaValida('30/09/2026')).toBe(true); });
  it('recusa rollover e formato ISO na entrada', () => { expect(dataPrevistaValida('31/02/2026')).toBe(false); expect(dataPrevistaValida('2026-09-30')).toBe(false); });
  it('normaliza formato brasileiro válido para ISO interno', () => { expect(normalizarDataPrevista(' 30/09/2026 ')).toBe('2026-09-30'); expect(normalizarDataPrevista('')).toBeUndefined(); });
});
