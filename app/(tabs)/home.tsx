import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen'; import { Brand } from '@/components/Brand'; import { Card } from '@/components/Card'; import { AppText } from '@/components/AppText';
import { useAuth } from '@/providers/AuthProvider'; import { useCloud } from '@/providers/CloudProvider'; import { obterFotoPerfil } from '@/lib/profilePhoto'; import { colors, fonts, radii } from '@/theme';

const steps = [
  { icon: '📝', title: 'Crie sua lista', action: () => router.push('/lista') },
  { icon: '🛒', title: 'Faça sua compra', action: () => router.push('/(tabs)/comprar') },
  { icon: '🧾', title: 'Histórico de compras', action: () => router.push('/(tabs)/historico') },
];

export default function HomeTab() {
  const { user, name } = useAuth(); const { data, status } = useCloud(); const [photo, setPhoto] = useState<string | null>(null);
  useFocusEffect(useCallback(() => { let active = true; if (!user?.id) { setPhoto(null); return () => { active = false; }; } void obterFotoPerfil(user.id).then((url) => { if (active) setPhoto(url); }).catch(() => { if (active) setPhoto(null); }); return () => { active = false; }; }, [user?.id]));
  return <Screen scroll={false}><View style={styles.content}><View style={styles.topRow}><Brand compact /><Pressable accessibilityRole="button" accessibilityLabel="Minha conta" onPress={() => router.push('/(tabs)/conta')} style={({ pressed }) => [styles.accountButton, pressed && styles.accountPressed]}>{photo ? <Image source={{ uri: photo }} style={styles.accountPhoto} /> : <AppText style={styles.accountFallback}>👤</AppText>}</Pressable></View><AppText style={styles.greeting}>Olá{name ? `, ${name.split(' ')[0]}` : ''}.</AppText><View style={styles.steps}>{steps.map((step, index) => <View key={step.title}><Pressable accessibilityRole="button" accessibilityLabel={step.title} onPress={step.action} style={({ pressed }) => [pressed && styles.pressed]}><Card style={styles.step}><View style={styles.icon}><AppText style={styles.iconText}>{step.icon}</AppText></View><AppText style={styles.title}>{step.title}</AppText></Card></Pressable>{index < steps.length - 1 ? <AppText style={styles.down}>↓</AppText> : null}</View>)}</View><Card style={styles.summary}><AppText style={styles.summaryTitle}>Resumo rápido</AppText><View style={styles.summaryRow}><Summary value={data.historico.length} label="listas" /><Summary value={data.compras.length} label="compras" /><Summary value={status === 'ready' ? '✓' : '…'} label="nuvem" /></View></Card></View></Screen>;
}
function Summary({ value, label }: { value: number | string; label: string }) { return <View style={styles.summaryItem}><AppText style={styles.summaryValue}>{value}</AppText><AppText style={styles.summaryLabel}>{label}</AppText></View>; }
const styles = StyleSheet.create({
  content: { flex: 1, width: '100%' },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  accountButton: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, borderColor: colors.navy, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  accountPhoto: { width: '100%', height: '100%' },
  accountFallback: { fontSize: 24 },
  accountPressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
  greeting: { fontFamily: fonts.black, fontSize: 26, marginBottom: 16 },
  steps: { marginTop: 30 },
  step: { minHeight: 74, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 11 },
  icon: { width: 34, height: 34, borderRadius: radii.md, backgroundColor: colors.softOrange, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20 },
  title: { textAlign: 'center', fontFamily: fonts.bold, fontSize: 15 },
  down: { textAlign: 'center', fontFamily: fonts.black, color: colors.orange, fontSize: 24, lineHeight: 18, marginVertical: 1 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  summary: { marginTop: 'auto', paddingVertical: 10, marginBottom: 2, transform: [{ translateY: 30 }] },
  summaryTitle: { fontFamily: fonts.bold, fontSize: 13, marginBottom: 7 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontFamily: fonts.black, fontSize: 20, color: colors.orange },
  summaryLabel: { color: colors.muted, fontSize: 10 },
});
