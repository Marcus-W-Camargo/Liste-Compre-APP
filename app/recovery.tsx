import { useState } from 'react'; import { router } from 'expo-router';
import { Screen } from '@/components/Screen'; import { PageHeader } from '@/components/PageHeader'; import { Card } from '@/components/Card'; import { Field } from '@/components/Field'; import { Button } from '@/components/Button'; import { AppText } from '@/components/AppText';
import { useAuthFlow } from '@/providers/AuthFlowProvider'; import { emailValido } from '@/domain/validation'; import { colors } from '@/theme';

export default function RecoveryScreen() {
  const flow = useAuthFlow(); const [email, setEmail] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit() { if (!emailValido(email)) { setError('Informe um e-mail válido.'); return; } setLoading(true); setError(''); try { await flow.startRecovery(email); router.push('/verify-recovery'); } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível iniciar a recuperação.'); } finally { setLoading(false); } }
  return <Screen><PageHeader title="Recuperar acesso" subtitle="Enviaremos um código para o e-mail da conta." back /><Card style={{ gap: 14 }}><Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />{error ? <AppText accessibilityRole="alert" style={{ color: colors.danger }}>{error}</AppText> : null}<Button label="Enviar código" loading={loading} onPress={() => void submit()} /></Card></Screen>;
}
