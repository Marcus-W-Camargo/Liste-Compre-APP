import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii } from '@/theme';

type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose(): void;
  variant?: 'sheet' | 'center';
}>;

export function BottomSheet({ visible, onClose, children, variant = 'sheet' }: BottomSheetProps) {
  const centered = variant === 'center';

  return (
    <Modal
      visible={visible}
      transparent
      animationType={centered ? 'fade' : 'slide'}
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <SafeAreaProvider>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar janela" />
      <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']} pointerEvents="box-none">
      <KeyboardAvoidingView
        pointerEvents="box-none"
        style={[styles.root, centered && styles.rootCentered]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={centered ? styles.centerCard : styles.sheet}>
          {centered ? null : <View style={styles.handle} />}
          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'} contentInsetAdjustmentBehavior="never">
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 0, flexShrink: 1 },
  root: { flex: 1, justifyContent: 'flex-end' },
  rootCentered: { justifyContent: 'center', alignItems: 'center', padding: 18 },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.blackOverlay },
  sheet: { maxHeight: '92%', borderTopWidth: 3, borderColor: colors.navy, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, backgroundColor: colors.white, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 30 },
  centerCard: { width: '100%', maxWidth: 560, maxHeight: '84%', borderWidth: 3, borderColor: colors.navy, borderRadius: radii.lg, backgroundColor: colors.white, padding: 18 },
  handle: { width: 50, height: 5, borderRadius: 3, backgroundColor: '#A9B3C3', alignSelf: 'center', marginBottom: 14 },
});
