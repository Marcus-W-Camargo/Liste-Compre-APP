import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { TabTopBar } from '@/components/TabTopBar';
import { Card } from '@/components/Card';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { BottomSheet } from '@/components/BottomSheet';
import { useAuth } from '@/providers/AuthProvider';
import { useCloud } from '@/providers/CloudProvider';
import { colors, fonts, radii } from '@/theme';

const steps = [
  { icon: '📝', title: 'Crie sua lista', action: () => router.push('/lista') },
  { icon: '🛒', title: 'Faça sua compra', action: () => router.push('/(tabs)/comprar') },
  { icon: '🧾', title: 'Histórico de compras', action: () => router.push('/(tabs)/historico') },
];

const GESTURE_TIP_PREFIX = 'liste-e-compre:gesture-tip:v1:';

export default function HomeTab() {
  const { user } = useAuth();
  const { data, status } = useCloud();
  const [gestureTipOpen, setGestureTipOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    const key = `${GESTURE_TIP_PREFIX}${user.id}`;

    void AsyncStorage.getItem(key)
      .then((seen) => {
        if (active && seen !== '1') setGestureTipOpen(true);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [user?.id]);

  function closeGestureTip() {
    setGestureTipOpen(false);
    if (user?.id) void AsyncStorage.setItem(`${GESTURE_TIP_PREFIX}${user.id}`, '1').catch(() => undefined);
  }

  return (
    <Screen scroll={false}>
      <View style={styles.content}>
        <TabTopBar showGreeting />

        <AppText style={styles.question}>Por onde começamos?</AppText>

        <View style={styles.steps}>
          {steps.map((step, index) => (
            <View key={step.title}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={step.title}
                onPress={step.action}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Card style={styles.step}>
                  <View style={styles.icon}>
                    <AppText style={styles.iconText}>{step.icon}</AppText>
                  </View>
                  <AppText style={styles.title}>{step.title}</AppText>
                </Card>
              </Pressable>
              {index < steps.length - 1 ? <AppText style={styles.down}>↓</AppText> : null}
            </View>
          ))}
        </View>

        <Card style={styles.summary}>
          <AppText style={styles.summaryTitle}>Resumo rápido</AppText>
          <View style={styles.summaryRow}>
            <Summary value={data.historico.length} label="listas" />
            <Summary value={data.compras.length} label="compras" />
            <Summary value={status === 'ready' ? '✓' : '…'} label="nuvem" />
          </View>
        </Card>
      </View>

      <BottomSheet visible={gestureTipOpen} onClose={closeGestureTip} variant="center">
        <View style={styles.gestureIconRow}>
          <AppText style={styles.gestureArrow}>←</AppText>
          <View style={styles.gesturePhone}>
            <AppText style={styles.gestureHand}>☝️</AppText>
          </View>
          <AppText style={styles.gestureArrow}>→</AppText>
        </View>
        <AppText style={styles.gestureTitle}>Navegue do seu jeito</AppText>
        <AppText style={styles.gestureText}>Além dos botões, gestos são bem-vindos aqui.</AppText>
        <AppText style={styles.gestureSubtext}>Deslize a tela para a esquerda ou para a direita para alternar entre Início, Listas, Comprar e Histórico.</AppText>
        <Button label="Compreendi" onPress={closeGestureTip} style={{ marginTop: 14 }} />
      </BottomSheet>
    </Screen>
  );
}

function Summary({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.summaryItem}>
      <AppText style={styles.summaryValue}>{value}</AppText>
      <AppText style={styles.summaryLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, width: '100%' },
  question: { textAlign: 'center', fontFamily: fonts.black, fontSize: 21, marginTop: 4, marginBottom: 10 },
  steps: { marginTop: 6 },
  step: { minHeight: 74, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 11 },
  icon: { width: 34, height: 34, borderRadius: radii.md, backgroundColor: colors.softOrange, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20 },
  title: { textAlign: 'center', fontFamily: fonts.bold, fontSize: 15 },
  down: { textAlign: 'center', fontFamily: fonts.black, color: colors.orange, fontSize: 24, lineHeight: 22, marginTop: -3, marginBottom: 1 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  summary: { marginTop: 'auto', paddingVertical: 10, marginBottom: 2, transform: [{ translateY: 30 }] },
  summaryTitle: { fontFamily: fonts.bold, fontSize: 13, marginBottom: 7 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontFamily: fonts.black, fontSize: 20, color: colors.orange },
  summaryLabel: { color: colors.muted, fontSize: 10 },
  gestureIconRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 14 },
  gestureArrow: { color: colors.orange, fontFamily: fonts.black, fontSize: 34, lineHeight: 38 },
  gesturePhone: { width: 66, height: 82, borderWidth: 3, borderColor: colors.navy, borderRadius: radii.lg, backgroundColor: colors.softBlue, alignItems: 'center', justifyContent: 'center' },
  gestureHand: { fontSize: 30 },
  gestureTitle: { textAlign: 'center', fontFamily: fonts.black, fontSize: 21 },
  gestureText: { textAlign: 'center', fontFamily: fonts.semibold, fontSize: 14, marginTop: 8 },
  gestureSubtext: { textAlign: 'center', color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 8 },
});
