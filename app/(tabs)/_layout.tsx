import { Redirect, withLayoutContext } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import {
  createMaterialTopTabNavigator,
  type MaterialTopTabNavigationEventMap,
  type MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { AppText } from '@/components/AppText';
import { useAuth } from '@/providers/AuthProvider';
import { colors, fonts } from '@/theme';

const { Navigator } = createMaterialTopTabNavigator();
const SwipeTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const icons: Record<string, string> = { home: '⌂', listas: '☷', comprar: '$', historico: '◷' };

export default function TabsLayout() {
  const { loading, user } = useAuth();
  if (loading) return <View style={styles.loading}><ActivityIndicator color={colors.orange} /></View>;
  if (!user) return <Redirect href="/login" />;

  return (
    <SwipeTabs
      initialRouteName="home"
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        animationEnabled: true,
        tabBarShowIcon: true,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.muted,
        tabBarPressColor: 'rgba(247,80,27,0.10)',
        tabBarIndicatorStyle: styles.indicator,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.bar,
        tabBarItemStyle: styles.item,
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
      <SwipeTabs.Screen name="home" options={{ title: 'Início' }} />
      <SwipeTabs.Screen name="listas" options={{ title: 'Listas' }} />
      <SwipeTabs.Screen name="comprar" options={{ title: 'Comprar' }} />
      <SwipeTabs.Screen name="historico" options={{ title: 'Histórico' }} />
    </SwipeTabs>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  bar: { height: 70, paddingTop: 4, paddingBottom: 4, borderTopWidth: 2, borderTopColor: colors.navy, backgroundColor: colors.white, elevation: 0 },
  item: { minHeight: 60, paddingVertical: 2 },
  indicator: { height: 0 },
  label: { fontFamily: fonts.semibold, fontSize: 10, textTransform: 'none', margin: 0 },
  icon: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 22, textAlign: 'center', minWidth: 24, marginBottom: 1 },
  purchaseIcon: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 22 },
  historyIcon: { fontSize: 30, lineHeight: 30 },
});
