import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const files = ['src/lib/supabase.ts','src/lib/authApi.ts','src/lib/accountDeletionApi.ts','src/lib/secureSessionStorage.ts'].map((path) => readFileSync(path, 'utf8')).join('\n');

describe('contrato de segurança do cliente', () => {
  it('não contém service role ou secret key', () => { expect(files).not.toMatch(/service[_-]?role/i); expect(files).not.toMatch(/SUPABASE_SECRET_KEY/); });
  it('usa armazenamento seguro para sessão', () => expect(files).toMatch(/SecureStore/));
  it('usa bearer token na exclusão de conta', () => expect(files).toMatch(/Authorization: `Bearer/));
  it('não persiste senha do cadastro em AsyncStorage', () => { const flow = readFileSync('src/providers/AuthFlowProvider.tsx', 'utf8'); expect(flow).not.toMatch(/AsyncStorage|SecureStore/); });
});
