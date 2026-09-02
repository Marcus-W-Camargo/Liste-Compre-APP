import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { cancelarTentativa, solicitarAuth, type TentativaAuth } from '@/lib/authApi';
import { normalizarEmail } from '@/domain/validation';

interface SignupFlow {
  email: string;
  name: string;
  password: string;
  attempt: TentativaAuth;
}

interface RecoveryFlow {
  email: string;
  attempt: TentativaAuth;
  resetAttempt?: TentativaAuth;
}

interface AuthFlowContextValue {
  signup: SignupFlow | null;
  recovery: RecoveryFlow | null;
  startSignup(name: string, email: string, password: string): Promise<void>;
  confirmSignup(code: string): Promise<void>;
  startRecovery(email: string): Promise<void>;
  verifyRecovery(code: string): Promise<void>;
  resetPassword(password: string): Promise<void>;
  clearSignup(cancel?: boolean): Promise<void>;
  clearRecovery(cancel?: boolean): Promise<void>;
}

const AuthFlowContext = createContext<AuthFlowContextValue | null>(null);

export function AuthFlowProvider({ children }: PropsWithChildren) {
  const [signup, setSignup] = useState<SignupFlow | null>(null);
  const [recovery, setRecovery] = useState<RecoveryFlow | null>(null);

  const startSignup = useCallback(async (name: string, email: string, password: string) => {
    if (signup) await cancelarTentativa(signup.attempt);
    const normalizedEmail = normalizarEmail(email);
    const result = await solicitarAuth<{ ok: true; id: string; token: string }>({
      action: 'start', purpose: 'cadastro', email: normalizedEmail, name,
    });
    setSignup({ email: normalizedEmail, name: name.normalize('NFC'), password, attempt: { id: result.id, token: result.token } });
  }, [signup]);

  const confirmSignup = useCallback(async (code: string) => {
    if (!signup) throw new Error('Inicie o cadastro novamente.');
    await solicitarAuth({ action: 'confirm-signup', email: signup.email, name: signup.name, password: signup.password, code, ...signup.attempt });
    setSignup(null);
  }, [signup]);

  const startRecovery = useCallback(async (email: string) => {
    if (recovery) await cancelarTentativa(recovery.resetAttempt ?? recovery.attempt);
    const normalizedEmail = normalizarEmail(email);
    const result = await solicitarAuth<{ ok: true; id: string; token: string }>({ action: 'start', purpose: 'recuperacao', email: normalizedEmail });
    setRecovery({ email: normalizedEmail, attempt: { id: result.id, token: result.token } });
  }, [recovery]);

  const verifyRecovery = useCallback(async (code: string) => {
    if (!recovery) throw new Error('Inicie a recuperação novamente.');
    const result = await solicitarAuth<{ ok: true; id: string; token: string }>({ action: 'verify-recovery', email: recovery.email, code, ...recovery.attempt });
    setRecovery({ ...recovery, resetAttempt: { id: result.id, token: result.token } });
  }, [recovery]);

  const resetPassword = useCallback(async (password: string) => {
    if (!recovery?.resetAttempt) throw new Error('Confirme o código novamente.');
    await solicitarAuth({ action: 'reset-password', email: recovery.email, password, ...recovery.resetAttempt });
    setRecovery(null);
  }, [recovery]);

  const clearSignup = useCallback(async (cancel = true) => {
    const current = signup;
    setSignup(null);
    if (cancel && current) await cancelarTentativa(current.attempt);
  }, [signup]);

  const clearRecovery = useCallback(async (cancel = true) => {
    const current = recovery;
    setRecovery(null);
    if (cancel && current) await cancelarTentativa(current.resetAttempt ?? current.attempt);
  }, [recovery]);

  const value = useMemo<AuthFlowContextValue>(() => ({
    signup, recovery, startSignup, confirmSignup, startRecovery, verifyRecovery, resetPassword, clearSignup, clearRecovery,
  }), [signup, recovery, startSignup, confirmSignup, startRecovery, verifyRecovery, resetPassword, clearSignup, clearRecovery]);

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
}

export function useAuthFlow() {
  const value = useContext(AuthFlowContext);
  if (!value) throw new Error('useAuthFlow precisa estar dentro de AuthFlowProvider.');
  return value;
}
