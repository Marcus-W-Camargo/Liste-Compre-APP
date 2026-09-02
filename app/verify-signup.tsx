import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen'; import { PageHeader } from '@/components/PageHeader'; import { Card } from '@/components/Card'; import { Field } from '@/components/Field'; import { Button } from '@/components/Button'; import { AppText } from '@/components/AppText';
import { useAuthFlow } from '@/providers/AuthFlowProvider'; import { colors, fonts } from '@/theme';

export default function VerifySignupScreen() {
  const flow = useAuthFlow(); const [code, setCode] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  useEffect(() => { if (!flow.signup) router.replace('/signup'); }, [flow.signup]);
  async function submit() { if (!/^\d{4}$/.test(code)) { setError('Informe os 4 dígitos.'); return; } setLoading(true); setError(''); try { await flow.confirmSignup(code); router.replace('/login'); } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível confirmar.'); } finally { setLoading(false); } }
  return <Screen><PageHeader title="Confirme seu e-mail" subtitle="Digite o código de 4 dígitos recebido." back /><Card style={{ gap: 14 }}><Field label="Código" value={code} onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" inputMode="numeric" autoComplete="one-time-code" maxLength={4} textAlign="center" style={{ fontSize: 26, letterSpacing: 10, fontFamily: fonts.bold }} />{error ? <AppText accessibilityRole="alert" style={{ color: colors.danger }}>{error}</AppText> : null}<Button label="Confirmar cadastro" loading={loading} disabled={code.length !== 4} onPress={() => void submit()} /><Button label="Cancelar cadastro" variant="ghost" onPress={() => void flow.clearSignup(true).then(() => router.replace('/signup'))} /></Card></Screen>;
}
