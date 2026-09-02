import { Linking, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen'; import { PageHeader } from '@/components/PageHeader'; import { Card } from '@/components/Card'; import { AppText } from '@/components/AppText'; import { Button } from '@/components/Button';
import { env } from '@/config/env'; import { colors, fonts } from '@/theme';

const sections = [
  ['Dados da conta', 'O Supabase Auth gerencia identidade e sessão. Nome, listas, rascunhos, compras concluídas e foto de perfil ficam vinculados ao seu usuário.'],
  ['Compra em andamento', 'Enquanto não for finalizada, a compra fica armazenada localmente neste aparelho e não entra no payload normal de sincronização.'],
  ['Foto de perfil', 'A foto é convertida para JPEG, reduzida para 512 × 512 e enviada ao bucket privado profile-photos, no caminho exclusivo do seu UID.'],
  ['Segurança', 'O aplicativo utiliza somente a chave publicável do Supabase. Chaves service_role e segredos de e-mail nunca são distribuídos no app. O acesso aos dados depende de autenticação, RLS e RPCs com revisão.'],
  ['Exclusão', 'Na Minha Conta é possível solicitar exclusão permanente por código enviado ao e-mail. A exclusão remove o usuário e seus dados vinculados por cascade, além da foto de perfil.'],
];

export default function PrivacyScreen() {
  return <Screen><PageHeader title="Privacidade" subtitle="Resumo das práticas aplicadas ao Liste & Compre." back />{sections.map(([title, text]) => <Card key={title} style={styles.card}><AppText style={styles.title}>{title}</AppText><AppText style={styles.text}>{text}</AppText></Card>)}<Button label="Abrir política completa do site" variant="secondary" onPress={() => void Linking.openURL(`${env.webApiUrl}/privacidade`)} /></Screen>;
}
const styles = StyleSheet.create({ card: { marginBottom: 9 }, title: { fontFamily: fonts.bold, fontSize: 14 }, text: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 5 } });
