import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radii } from '@/theme';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.wrapper, compact && styles.compact]} accessibilityLabel="Liste e Compre">
      <View style={styles.icon}><AppText style={styles.emoji}>🛒</AppText></View>
      <View>
        <AppText style={[styles.title, compact && styles.compactTitle]}>LISTE <AppText style={styles.amp}>&</AppText> COMPRE</AppText>
        {!compact ? <AppText style={styles.subtitle}>Planeje. Compre. Acompanhe.</AppText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  compact: { marginBottom: 8 },
  icon: { width: 54, height: 54, borderWidth: 3, borderColor: colors.navy, borderRadius: radii.md, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 28 },
  title: { fontFamily: fonts.black, fontSize: 24, letterSpacing: -0.7 },
  compactTitle: { fontSize: 19 },
  amp: { color: colors.orange, fontFamily: fonts.black },
  subtitle: { color: colors.muted, fontFamily: fonts.medium, fontSize: 11 },
});
