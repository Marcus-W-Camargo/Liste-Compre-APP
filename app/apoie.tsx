import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors, fonts, radii } from '@/theme';

const PIX_KEY = 'listeecompre@gmail.com';
const PORTFOLIO_PROJECTS_URL = 'https://marcuscamargo-portfolio.com.br/#projetos';

const PIX_CODE = '00020126440014BR.GOV.BCB.PIX0122listeecompre@gmail.com5204000053039865802BR5914LISTE E COMPRE6009SAO PAULO62070503***63041F07';
const PIX_CODE_PUBLIC_THANKS = '00020126440014BR.GOV.BCB.PIX0122listeecompre@gmail.com5204000053039865802BR5914LISTE E COMPRE6009SAO PAULO62170513AGRADECIMENTO63044519';

const QR_ROWS = [
  '11111110011000101100100010100110101111111',
  '10000010111101010011110001110010001000001',
  '10111010000010010111100100011010101011101',
  '10111010011001000110010001100100001011101',
  '10111010110001101010110101000011101011101',
  '10000010010100000001010110111101101000001',
  '11111110101010101010101010101010101111111',
  '00000000001100100111111000100000000000000',
  '10101010010101000100010110011000100010010',
  '11011100111011011100000010100001010011010',
  '01100010001111011011101001111110101010101',
  '10101000111000011101011001110101010001001',
  '11000011000111100010001111010010001100110',
  '10001000111110111101011110000100000001010',
  '01000111000110001110001111011100101101001',
  '11100000111000001011010010110101001111011',
  '01011111110001100110001110111000001010001',
  '11100001101100101111000111101111010001011',
  '00101010010010101010110010001001000010100',
  '01101001000001011111000111011011101101001',
  '11111111100111000010100001001110011011000',
  '10001001100011100111010010010111011101010',
  '11111010001011000110101001100001000001001',
  '00100000111110011111010001100110001100110',
  '10100110000000101001101100011010111010101',
  '10001001010110000100010011100101010001010',
  '11100010011101100010101000100110110000111',
  '10011100101000101100101011101111010111001',
  '01100111110101011011100111000111101110100',
  '01100100011110010101100100100011010101101',
  '10001110011001000001101010101011101101011',
  '01100101000011101010101100011100010111010',
  '10010110110100011011110011100100111110001',
  '00000000111010100011011101100001100011000',
  '11111110010001101100101001111011101011000',
  '10000010011101110001011000111100100011001',
  '10111010111111010000001000101000111111000',
  '10111010001100011001011101001101011101100',
  '10111010110111100010000000100000110011101',
  '10000010001111011000110001100111011101011',
  '11111110101111010010111001110100010110001',
] as const;

const QR_ROWS_PUBLIC_THANKS = [
  '11111110110001010100001011011010001111111',
  '10000010110100100010000001000001101000001',
  '10111010001001110100001111011111001011101',
  '10111010111111001001001111100111001011101',
  '10111010011111001100111011001101101011101',
  '10000010001000000101001010100001101000001',
  '11111110101010101010101010101010101111111',
  '00000000111111010110001001010001100000000',
  '10110111010110110111110101111011001001011',
  '00010001101101011011000101100110010100010',
  '11101010010001110101100111110000100100100',
  '10110100110101000001000101101001001101010',
  '10101011111100111010010111100010001100001',
  '10001100101111100100101101110100110000100',
  '10100111100001110101101010101111101110101',
  '00110100111011000100010101100011001000011',
  '11110011111011101001000000110110000100000',
  '01111101100000110011001010110011001101000',
  '01010010100011010010010010110001111010011',
  '01011000101001001110101111001110011100111',
  '01000010111110100001010011001101111000100',
  '00101000001000011000011101110000011010010',
  '01010111000001011000100111101111001111000',
  '00101101000110000011001101111010010000101',
  '10111110111000010001010100100010000010010',
  '01111000110111110101100010010100100000100',
  '00001111100111100001000011000101001011011',
  '10010001101111001011110100101000010000001',
  '00110011100010111101101011001001100000101',
  '00101000101110010001011000111111001001110',
  '10000110100111101001010010000011010101100',
  '00110101110100010010111001110101100110100',
  '01110110010111101000010000000111111111101',
  '00000000111101100100011010100010100010000',
  '11111110111110100010100110110001101011001',
  '10000010111000101101001100000000100011010',
  '10111010001110101000100001010000111111111',
  '10111010110001110000101100111110101100010',
  '10111010110010010001100011000011010000001',
  '10000010001100010111110110100000011010011',
  '11111110100001001100110111111010011000000',
] as const;

function PixQr({ publicThanks }: { publicThanks: boolean }) {
  const rows = publicThanks ? QR_ROWS_PUBLIC_THANKS : QR_ROWS;
  return (
    <View style={styles.qrQuietZone} accessibilityLabel="QR Code PIX para apoiar o projeto">
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.qrRow}>
          {[...row].map((module, columnIndex) => (
            <View key={`${rowIndex}-${columnIndex}`} style={[styles.qrModule, module === '1' && styles.qrModuleDark]} />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function SupportScreen() {
  const [publicThanks, setPublicThanks] = useState(false);
  const [copied, setCopied] = useState(false);
  const pixCode = publicThanks ? PIX_CODE_PUBLIC_THANKS : PIX_CODE;

  async function copyPix() {
    await Clipboard.setStringAsync(pixCode);
    setCopied(true);
  }

  function togglePublicThanks() {
    setPublicThanks((current) => !current);
    setCopied(false);
  }

  return (
    <Screen>
      <PageHeader title="Apoie-me" subtitle="Ajude a manter este e futuros projetos independentes." back />

      <Card style={styles.heroCard}>
        <AppText style={styles.heroEmoji}>💛</AppText>
        <AppText style={styles.heroTitle}>O Liste & Compre continua gratuito e sem propagandas.</AppText>
        <AppText style={styles.bodyText}>
          Se o app faz diferença na sua rotina e você quiser apoiar meu trabalho, sua contribuição ajuda na manutenção deste projeto e na criação de novas ideias.
        </AppText>
        <AppText style={styles.optionalText}>O apoio é totalmente opcional e não altera nenhuma função do aplicativo.</AppText>
      </Card>

      <Pressable onPress={() => void Linking.openURL(PORTFOLIO_PROJECTS_URL)} style={styles.projectsLink} accessibilityRole="link">
        <View style={{ flex: 1 }}>
          <AppText style={styles.projectsTitle}>Outros projetos</AppText>
          <AppText style={styles.projectsText}>Conheça outros trabalhos e projetos que já publiquei.</AppText>
        </View>
        <AppText style={styles.projectsArrow}>↗</AppText>
      </Pressable>

      <AppText style={styles.section}>Apoiar via PIX</AppText>
      <Card style={styles.pixCard}>
        <AppText style={styles.pixIntro}>Escolha qualquer valor no seu banco. Não existe valor mínimo ou sugerido.</AppText>
        <View style={styles.qrWrapper}><PixQr publicThanks={publicThanks} /></View>
        <AppText style={styles.keyLabel}>Chave PIX · E-mail</AppText>
        <AppText selectable style={styles.key}>{PIX_KEY}</AppText>
        <Button label={copied ? '✓ Código PIX copiado' : 'Copiar código PIX'} onPress={() => void copyPix()} style={{ marginTop: 12 }} />
      </Card>

      <AppText style={styles.section}>Agradecimento público</AppText>
      <Card>
        <Pressable onPress={togglePublicThanks} style={styles.consentRow} accessibilityRole="checkbox" accessibilityState={{ checked: publicThanks }}>
          <View style={[styles.checkbox, publicThanks && styles.checkboxChecked]}>
            <AppText style={styles.checkmark}>{publicThanks ? '✓' : ''}</AppText>
          </View>
          <AppText style={styles.consentText}>Aceito ter meu nome apresentado para agradecimentos no Instagram.</AppText>
        </Pressable>
        <AppText style={styles.notice}>
          Marcar esta opção não é necessário para apoiar. Quando marcada, o código PIX recebe uma identificação de autorização para o agradecimento.
        </AppText>
        <View style={styles.observationBox}>
          <AppText style={styles.observationTitle}>Se quiser o agradecimento público</AppText>
          <AppText style={styles.observationText}>
            Coloque seu nome na Observação do PIX. Assim consigo identificar mais facilmente quem autorizou o agradecimento no Instagram do Liste & Compre.
          </AppText>
        </View>
      </Card>

      <AppText style={styles.footerText}>Obrigado por apoiar um projeto independente. 💛</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: { backgroundColor: colors.softOrange, alignItems: 'center', paddingVertical: 20 },
  heroEmoji: { fontSize: 30, marginBottom: 8 },
  heroTitle: { fontFamily: fonts.black, fontSize: 19, textAlign: 'center', lineHeight: 25 },
  bodyText: { color: colors.navy, fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 10 },
  optionalText: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 10 },
  projectsLink: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, padding: 14, marginTop: 12, backgroundColor: colors.white },
  projectsTitle: { fontFamily: fonts.bold, fontSize: 15 },
  projectsText: { color: colors.muted, fontSize: 10, marginTop: 2 },
  projectsArrow: { fontFamily: fonts.black, fontSize: 24 },
  section: { fontFamily: fonts.bold, fontSize: 15, marginTop: 20, marginBottom: 8 },
  pixCard: { alignItems: 'stretch' },
  pixIntro: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginBottom: 14 },
  qrWrapper: { alignItems: 'center', marginBottom: 14 },
  qrQuietZone: { backgroundColor: '#FFFFFF', padding: 16 },
  qrRow: { flexDirection: 'row' },
  qrModule: { width: 4, height: 4, backgroundColor: '#FFFFFF' },
  qrModuleDark: { backgroundColor: '#000000' },
  keyLabel: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 9, textAlign: 'center' },
  key: { fontFamily: fonts.bold, fontSize: 13, textAlign: 'center', marginTop: 3 },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: { width: 25, height: 25, borderWidth: 2, borderColor: colors.navy, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, marginTop: 1 },
  checkboxChecked: { backgroundColor: colors.navy },
  checkmark: { color: colors.white, fontFamily: fonts.black, fontSize: 15 },
  consentText: { flex: 1, fontFamily: fonts.semibold, fontSize: 12, lineHeight: 18 },
  notice: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 10 },
  observationBox: { backgroundColor: colors.softBlue, borderRadius: radii.md, padding: 12, marginTop: 12 },
  observationTitle: { fontFamily: fonts.bold, fontSize: 11 },
  observationText: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 4 },
  footerText: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 10, textAlign: 'center', marginTop: 18, marginBottom: 8 },
});
