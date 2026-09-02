import { useEffect, useState } from 'react'; import { router } from 'expo-router';
import { Screen } from '@/components/Screen'; import { PageHeader } from '@/components/PageHeader'; import { Card } from '@/components/Card'; import { Field } from '@/components/Field'; import { Button } from '@/components/Button'; import { AppText } from '@/components/AppText';
import { useAuthFlow } from '@/providers/AuthFlowProvider'; import { senhaValida } from '@/domain/validation'; import { colors } from '@/theme';

export default function ResetPasswordScreen() {
  const flow = useAuthFlow(); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  useEffect(() => { if (!flow.recovery?.resetAttempt) router.replace('/recovery'); }, [flow.recovery]);
  async function submit() { if (!senhaValida(password)) { setError('A nova senha não cumpre os requisitos.'); return; } if (password !== confirm) { setError('As senhas não coincidem.'); return; } setLoading(true); setError(''); try { await flow.resetPassword(password); router.replace('/login'); } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível trocar a senha.'); } finally { setLoading(false); } }
  return <Screen><PageHeader title="Nova senha" subtitle="Defina uma senha nova para a sua conta." back /><Card style={{ gap: 14 }}><Field label="Nova senha" value={password} onChangeText={setPassword} secureTextEntry /><Field label="Confirmar senha" value={confirm} onChangeText={setConfirm} secureTextEntry />{error ? <AppText accessibilityRole="alert" style={{ color: colors.danger }}>{error}</AppText> : null}<Button label="Salvar nova senha" loading={loading} onPress={() => void submit()} /></Card></Screen>;
}
