import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen'; import { Brand } from '@/components/Brand'; import { Card } from '@/components/Card'; import { AppText } from '@/components/AppText';
import { useAuth } from '@/providers/AuthProvider'; import { useCloud } from '@/providers/CloudProvider'; import { colors, fonts, radii } from '@/theme';

const steps = [
  { icon: '📝', title: 'Crie sua lista', action: () => router.push('/lista') },
  { icon: '🛒', title: 'Faça sua compra', action: () => router.push('/(tabs)/comprar') },
  { icon: '🧾', title: 'Histórico de compras', action: () => router.push('/(tabs)/historico') },
];

export default function HomeTab() {
  const { name } = useAuth(); const { data, status } = useCloud();
  return <Screen scroll={false}><View style={styles.content}><Brand compact /><AppText style={styles.greeting}>Olá{name ? `, ${name.split(' ')[0]}` : ''}.</AppText><View style={styles.steps}>{steps.map((step, index) => <View key={step.title}><Pressable accessibilityRole="button" accessibilityLabel={step.title} onPress={step.action} style={({ pressed }) => [pressed && styles.pressed]}><Card style={styles.step}><View style={styles.iconSlot}><View style={styles.icon}><AppText style={styles.iconText}>{step.icon}</AppText></View></View><AppText style={styles.title}>{step.title}</AppText><View style={styles.arrowSlot}><AppText style={styles.arrow}>›</AppText></View></Card></Pressable>{index < steps.length - 1 ? <AppText style={styles.down}>↓</AppText> : null}</View>)}</View><Card style={styles.summary}><AppText style={styles.summaryTitle}>Resumo rápido</AppText><View style={styles.summaryRow}><Summary value={data.historico.length} label="listas" /><Summary value={data.compras.length} label="compras" /><Summary value={status === 'ready' ? '✓' : '…'} label="nuvem" /></View></Card></View></Screen>;
}
function Summary({ value, label }: { value: number | string; label: string }) { return <View style={styles.summaryItem}><AppText style={styles.summaryValue}>{value}</AppText><AppText style={styles.summaryLabel}>{label}</AppText></View>; }
const styles = StyleSheet.create({
  content: { width: '100%' },
  greeting: { fontFamily: fonts.black, fontSize: 26, marginBottom: 10 },
  steps: { gap: 0 },
  step: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 10 },
  iconSlot: { width: 42, alignItems: 'flex-start' },
  icon: { width: 38, height: 38, borderRadius: radii.md, backgroundColor: colors.softOrange, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 21 },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 15 },
  arrowSlot: { width: 42, alignItems: 'flex-end' },
  arrow: { fontFamily: fonts.bold, fontSize: 25, lineHeight: 25 },
  down: { textAlign: 'center', fontFamily: fonts.black, color: colors.orange, fontSize: 24, lineHeight: 19, marginVertical: 0 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  summary: { marginTop: 10, paddingVertical: 10 },
  summaryTitle: { fontFamily: fonts.bold, fontSize: 13, marginBottom: 7 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontFamily: fonts.black, fontSize: 20, color: colors.orange },
  summaryLabel: { color: colors.muted, fontSize: 10 },
});
