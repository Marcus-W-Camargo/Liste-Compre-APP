import { useState } from 'react';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { AppText } from '@/components/AppText';
import { useAuthFlow } from '@/providers/AuthFlowProvider';
import { emailValido, nomeValido, senhaValida } from '@/domain/validation';
import { colors, fonts } from '@/theme';

export default function SignupScreen() {
  const flow = useAuthFlow();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  async function submit() {
    if (!nomeValido(name)) { setError('Use Nome e Sobrenome, um único espaço e até 21 caracteres.'); return; }
    if (!emailValido(email)) { setError('Informe um e-mail válido.'); return; }
    if (!senhaValida(password)) { setError('Use 6 a 128 caracteres, com letra, número e símbolo permitido.'); return; }
    setLoading(true); setError('');
    try { await flow.startSignup(name, email, password); router.push('/verify-signup'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível iniciar o cadastro.'); }
    finally { setLoading(false); }
  }

  return <Screen><PageHeader title="Criar conta" subtitle="O código de verificação será enviado ao seu e-mail." back /><Card style={{ gap: 14 }}><Field label="Nome e Sobrenome" value={name} onChangeText={setName} autoCapitalize="words" maxLength={21} /><Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /><Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry /><AppText style={{ fontSize: 11, color: colors.muted }}>Mínimo 6 caracteres, com letra, número e um símbolo: ! @ # $ % & * / ? _ -</AppText>{error ? <AppText accessibilityRole="alert" style={{ color: colors.danger, fontFamily: fonts.semibold }}>{error}</AppText> : null}<Button label="Enviar código" loading={loading} onPress={() => void submit()} /></Card></Screen>;
}
