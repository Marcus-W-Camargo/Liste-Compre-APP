import { Image, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts } from '@/theme';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.wrapper, compact && styles.compact]} accessibilityLabel="Liste & Compre">
      <Image
        source={require('../assets/ListeLogo.png')}
        style={[styles.logo, compact && styles.compactLogo]}
        resizeMode="contain"
      />
      {!compact ? <AppText style={styles.subtitle}>Planeje. Compre. Acompanhe.</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginBottom: 18 },
  compact: { alignItems: 'flex-start', marginBottom: 8 },
  logo: { width: 220, height: 124 },
  compactLogo: { width: 150, height: 84 },
  subtitle: { color: colors.muted, fontFamily: fonts.medium, fontSize: 11, marginTop: -8 },
});
