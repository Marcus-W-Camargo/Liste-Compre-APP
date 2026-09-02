import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { useAuth } from '@/providers/AuthProvider';
import { colors, fonts } from '@/theme';

const icons: Record<string, string> = { home: '⌂', listas: '☷', comprar: '$', historico: '◷' };

export default function TabsLayout() {
  const { loading, user } = useAuth();
  if (loading) return <View style={styles.loading}><ActivityIndicator color={colors.orange} /></View>;
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        animation: 'fade',
        sceneStyle: styles.scene,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.bar,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color }) => (
          <AppText
            style={[
              styles.icon,
              route.name === 'comprar' && styles.purchaseIcon,
              route.name === 'historico' && styles.historyIcon,
              { color },
            ]}
          >
            {icons[route.name] ?? '•'}
          </AppText>
        ),
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Início' }} />
      <Tabs.Screen name="listas" options={{ title: 'Listas' }} />
      <Tabs.Screen name="comprar" options={{ title: 'Comprar' }} />
      <Tabs.Screen name="historico" options={{ title: 'Histórico' }} />
      <Tabs.Screen name="conta" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  scene: { backgroundColor: colors.blue },
  bar: { height: 70, paddingTop: 7, paddingBottom: 8, borderTopWidth: 2, borderTopColor: colors.navy, backgroundColor: colors.white },
  label: { fontFamily: fonts.semibold, fontSize: 10 },
  icon: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 22, textAlign: 'center', minWidth: 24 },
  purchaseIcon: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 22 },
  historyIcon: { fontSize: 32, lineHeight: 32 },
});
