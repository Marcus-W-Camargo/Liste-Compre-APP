import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
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
    >
      <KeyboardAvoidingView
        style={[styles.root, centered && styles.rootCentered]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar janela" />
        <View style={centered ? styles.centerCard : styles.sheet}>
          {centered ? null : <View style={styles.handle} />}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  rootCentered: { justifyContent: 'center', alignItems: 'center', padding: 18 },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.blackOverlay },
  sheet: { maxHeight: '92%', borderTopWidth: 3, borderColor: colors.navy, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, backgroundColor: colors.white, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 30 },
  centerCard: { width: '100%', maxWidth: 560, maxHeight: '84%', borderWidth: 3, borderColor: colors.navy, borderRadius: radii.lg, backgroundColor: colors.white, padding: 18 },
  handle: { width: 50, height: 5, borderRadius: 3, backgroundColor: '#A9B3C3', alignSelf: 'center', marginBottom: 14 },
});
