import { useCallback, useMemo, useRef, type PropsWithChildren } from 'react';
import { Animated, Easing, Keyboard, KeyboardAvoidingView, PanResponder, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, usePathname } from 'expo-router';
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
const SWIPE_TRIGGER_DISTANCE = 42;
const SWIPE_AXIS_RATIO = 1.25;
const DRAG_LIMIT = 88;
const TRANSITION_DISTANCE = 72;
const TRANSITION_DURATION = 220;
let lastFocusedTabIndex = -1;

function getTabIndex(pathname: string) {
  const segment = pathname.split('/').filter(Boolean).at(-1);
  return TAB_NAMES.findIndex((name) => name === segment);
}

export function Screen({ children, scroll = true, padded = true }: ScreenProps) {
  const pathname = usePathname();
  const tabIndex = getTabIndex(pathname);
  const transitionX = useRef(new Animated.Value(0)).current;
  const transitionOpacity = useRef(new Animated.Value(1)).current;
  const swipeCommitted = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (tabIndex < 0) {
        transitionX.setValue(0);
        transitionOpacity.setValue(1);
        return;
      }

      const previousIndex = lastFocusedTabIndex;
      const direction = previousIndex < 0 || previousIndex === tabIndex
        ? 0
        : tabIndex > previousIndex ? 1 : -1;
      lastFocusedTabIndex = tabIndex;

      transitionX.stopAnimation();
      transitionOpacity.stopAnimation();

      if (direction === 0) {
        transitionX.setValue(0);
        transitionOpacity.setValue(1);
        return;
      }

      transitionX.setValue(direction * TRANSITION_DISTANCE);
      transitionOpacity.setValue(1);

      Animated.timing(transitionX, {
        toValue: 0,
        duration: TRANSITION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [tabIndex, transitionOpacity, transitionX]),
  );

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) => {
      if (tabIndex < 0) return false;
      const horizontal = Math.abs(gesture.dx);
      const vertical = Math.abs(gesture.dy);
      return horizontal > 12 && horizontal > vertical * SWIPE_AXIS_RATIO;
    },
    onPanResponderGrant: () => {
      swipeCommitted.current = false;
      transitionX.stopAnimation();
    },
    onPanResponderMove: (_event, gesture) => {
      if (tabIndex < 0 || swipeCommitted.current) return;

      const horizontal = Math.abs(gesture.dx);
      const vertical = Math.abs(gesture.dy);
      if (horizontal <= vertical * SWIPE_AXIS_RATIO) return;

      const nextIndex = gesture.dx < 0 ? tabIndex + 1 : tabIndex - 1;
      const canNavigate = nextIndex >= 0 && nextIndex < TAB_ROUTES.length;
      const resistance = canNavigate ? 1 : 0.28;
      const drag = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, gesture.dx * resistance));
      transitionX.setValue(drag);

      if (!canNavigate || horizontal < SWIPE_TRIGGER_DISTANCE) return;

      swipeCommitted.current = true;
      Keyboard.dismiss();
      lastFocusedTabIndex = tabIndex;
      router.navigate(TAB_ROUTES[nextIndex]);
    },
    onPanResponderRelease: () => {
      if (swipeCommitted.current) return;
      Animated.timing(transitionX, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminate: () => {
      if (swipeCommitted.current) return;
      Animated.timing(transitionX, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminationRequest: () => true,
  }), [tabIndex, transitionX]);

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
      <Animated.View style={[styles.flex, { transform: [{ translateX: transitionX }] }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {content}
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.blue, overflow: 'hidden' }, flex: { flex: 1 },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingBottom: 36 }, padded: { paddingHorizontal: 16, paddingTop: 14 },
  decorOne: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.10)', top: -90, right: -70 },
  decorTwo: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(247,80,27,0.10)', bottom: 100, left: -70 },
});
