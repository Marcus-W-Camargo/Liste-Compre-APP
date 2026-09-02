import { describe, expect, it } from 'vitest';
import { emailValido, nomeValido, normalizarEmail, senhaValida } from '../src/domain/validation';

describe('validação compatível com o web', () => {
  it('normaliza e valida e-mail', () => { expect(normalizarEmail(' Teste@Email.COM ')).toBe('teste@email.com'); expect(emailValido('a@b.com')).toBe(true); expect(emailValido('invalido')).toBe(false); });
  it('exige nome e sobrenome com um espaço', () => { expect(nomeValido('Marcus Camargo')).toBe(true); expect(nomeValido('Marcus')).toBe(false); expect(nomeValido('Marcus  Camargo')).toBe(false); });
  it('mantém a política de senha', () => { expect(senhaValida('abc1@2')).toBe(true); expect(senhaValida('abcdef')).toBe(false); expect(senhaValida('123456@')).toBe(false); });
});
