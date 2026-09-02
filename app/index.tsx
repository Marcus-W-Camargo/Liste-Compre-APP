import { useEffect } from 'react';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen'; import { Brand } from '@/components/Brand'; import { Card } from '@/components/Card'; import { AppText } from '@/components/AppText'; import { Button } from '@/components/Button'; import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/providers/AuthProvider'; import { colors, fonts } from '@/theme';

const ABOUT_URL = 'https://marcuscamargo-portfolio.mcpt.workers.dev/';

export default function EntryScreen() {
  const { loading, configured, user } = useAuth();
  useEffect(() => { if (!loading && configured && user) router.replace('/(tabs)/home'); }, [loading, configured, user]);
  if (loading) return <LoadingState />;
  if (!configured) return <Screen><Brand /><Card><AppText style={{ fontFamily: fonts.bold, fontSize: 20 }}>Configuração necessária</AppText><AppText style={{ marginTop: 8 }}>Crie um arquivo .env a partir de .env.example e informe a chave publicável do Supabase. Chaves secretas nunca devem entrar no aplicativo.</AppText></Card></Screen>;
  if (user) return <LoadingState label="Abrindo suas listas…" />;
  return <Screen><Brand /><Card style={{ gap: 14 }}><AppText style={{ fontFamily: fonts.black, fontSize: 28 }}>Sua compra, do planejamento ao caixa.</AppText><AppText style={{ color: colors.muted }}>Crie listas, acompanhe preços durante a compra e consulte seu histórico usando a mesma conta do Liste & Compre Web.</AppText><Button label="Entrar" onPress={() => router.push('/login')} /><Button label="Criar conta" variant="secondary" onPress={() => router.push('/signup')} /></Card><Button label="🌐 Sobre o criador" variant="ghost" onPress={() => void Linking.openURL(ABOUT_URL)} /><Button label="Política de Privacidade" variant="ghost" onPress={() => router.push('/privacidade')} /></Screen>;
}
