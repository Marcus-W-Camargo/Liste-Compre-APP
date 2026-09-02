import { useMemo, type PropsWithChildren } from 'react';
import { Keyboard, KeyboardAvoidingView, PanResponder, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
}>;

const TAB_ROUTES = [
  '/(tabs)/home',
  '/(tabs)/listas',
  '/(tabs)/comprar',
  '/(tabs)/historico',
] as const;

const TAB_NAMES = ['home', 'listas', 'comprar', 'historico'] as const;
const SWIPE_DISTANCE = 64;
const SWIPE_AXIS_RATIO = 1.25;

function getTabIndex(pathname: string) {
  const segment = pathname.split('/').filter(Boolean).at(-1);
  return TAB_NAMES.findIndex((name) => name === segment);
}

export function Screen({ children, scroll = true, padded = true }: ScreenProps) {
  const pathname = usePathname();
  const tabIndex = getTabIndex(pathname);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) => {
      if (tabIndex < 0) return false;
      const horizontal = Math.abs(gesture.dx);
      const vertical = Math.abs(gesture.dy);
      return horizontal > 18 && horizontal > vertical * SWIPE_AXIS_RATIO;
    },
    onPanResponderRelease: (_event, gesture) => {
      if (tabIndex < 0) return;
      const horizontal = Math.abs(gesture.dx);
      const vertical = Math.abs(gesture.dy);
      if (horizontal < SWIPE_DISTANCE || horizontal <= vertical * SWIPE_AXIS_RATIO) return;

      const nextIndex = gesture.dx < 0 ? tabIndex + 1 : tabIndex - 1;
      if (nextIndex < 0 || nextIndex >= TAB_ROUTES.length) return;

      Keyboard.dismiss();
      router.navigate(TAB_ROUTES[nextIndex]);
    },
    onPanResponderTerminationRequest: () => true,
  }), [tabIndex]);

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, padded && styles.padded]}
      keyboardShouldPersistTaps="never"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, padded && styles.padded]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']} {...panResponder.panHandlers}>
      <View pointerEvents="none" style={styles.decorOne} />
      <View pointerEvents="none" style={styles.decorTwo} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blue }, flex: { flex: 1 },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingBottom: 36 }, padded: { paddingHorizontal: 16, paddingTop: 14 },
  decorOne: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.10)', top: -90, right: -70 },
  decorTwo: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(247,80,27,0.10)', bottom: 100, left: -70 },
});
