import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useConnectivity } from '@/providers/ConnectivityProvider';
import { useCloud } from '@/providers/CloudProvider';
import { colors, fonts, radii } from '@/theme';

export function StatusBanners() {
  const { online, known } = useConnectivity();
  const cloud = useCloud();

  if (known && !online) {
    return <Banner icon="📡" text="Sem internet. A compra em andamento continua no aparelho; alterações sincronizadas aguardam conexão." />;
  }
  if (cloud.status === 'conflict') {
    return (
      <View style={styles.conflict}>
        <AppText style={styles.conflictText}>⚠️ {cloud.error}</AppText>
        <Pressable accessibilityRole="button" onPress={() => void cloud.discardAndReload()}><AppText style={styles.action}>Carregar nuvem</AppText></Pressable>
      </View>
    );
  }
  if (cloud.status === 'error' && cloud.error) {
    return (
      <View style={styles.error}>
        <AppText style={styles.errorText}>⚠️ {cloud.error}</AppText>
        <Pressable accessibilityRole="button" onPress={() => void cloud.retry()}><AppText style={styles.action}>Tentar de novo</AppText></Pressable>
      </View>
    );
  }
  return null;
}

function Banner({ icon, text }: { icon: string; text: string }) {
  return <View style={styles.offline}><AppText style={styles.offlineText}>{icon} {text}</AppText></View>;
}

const styles = StyleSheet.create({
  offline: { backgroundColor: colors.cream, borderBottomWidth: 1, borderColor: colors.navy, paddingHorizontal: 14, paddingVertical: 8 },
  offlineText: { fontSize: 11, fontFamily: fonts.semibold, textAlign: 'center' },
  error: { backgroundColor: '#FFF0EC', borderBottomWidth: 1, borderColor: colors.danger, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  conflict: { backgroundColor: '#FFF3D8', borderBottomWidth: 1, borderColor: '#8A5D00', paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  errorText: { flex: 1, color: colors.danger, fontSize: 11, fontFamily: fonts.semibold },
  conflictText: { flex: 1, color: '#6F4B00', fontSize: 11, fontFamily: fonts.semibold },
  action: { fontFamily: fonts.bold, fontSize: 11, textDecorationLine: 'underline', padding: 6, borderRadius: radii.sm },
});
