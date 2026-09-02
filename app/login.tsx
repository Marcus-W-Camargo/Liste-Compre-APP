import { useState } from 'react';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { AppText } from '@/components/AppText';
import { useAuth } from '@/providers/AuthProvider';
import { emailValido } from '@/domain/validation';
import { colors, fonts } from '@/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!emailValido(email) || !password) { setError('Confira o e-mail e a senha.'); return; }
    setLoading(true); setError('');
    try { await signIn(email, password); router.replace('/(tabs)/home'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível entrar.'); }
    finally { setLoading(false); }
  }

  return <Screen><PageHeader title="Entrar" subtitle="Use a mesma conta do Liste & Compre Web." back /><Card style={{ gap: 14 }}><Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" /><Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" onSubmitEditing={() => void submit()} />{error ? <AppText accessibilityRole="alert" style={{ color: colors.danger, fontFamily: fonts.semibold }}>{error}</AppText> : null}<Button label="Entrar" loading={loading} onPress={() => void submit()} /><Button label="Esqueci minha senha" variant="ghost" onPress={() => router.push('/recovery')} /></Card></Screen>;
}
