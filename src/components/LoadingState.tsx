import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts } from '@/theme';

export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return <View style={styles.root}><ActivityIndicator size="large" color={colors.orange} /><AppText style={styles.text}>{label}</AppText></View>;
}

const styles = StyleSheet.create({ root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }, text: { fontFamily: fonts.semibold } });
