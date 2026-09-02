import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from './AppText';
import { colors, fonts } from '@/theme';

export function PageHeader({ title, subtitle, back = false }: { title: string; subtitle?: string; back?: boolean }) {
  return (
    <View style={styles.root}>
      {back ? (
        <View style={styles.row}>
          <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => router.back()} style={styles.back}>
            <AppText style={styles.backText}>‹</AppText>
          </Pressable>
        </View>
      ) : null}
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginBottom: 16 },
  row: { minHeight: 54, justifyContent: 'center' },
  back: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.navy, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 38, marginTop: -3 },
  title: { fontFamily: fonts.black, fontSize: 29, lineHeight: 34 },
  subtitle: { color: colors.muted, fontFamily: fonts.medium, fontSize: 12, marginTop: 3 },
});
