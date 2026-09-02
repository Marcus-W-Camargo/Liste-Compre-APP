import { Modal, Pressable, StyleSheet, View, type PropsWithChildren } from 'react-native';
import { colors, radii } from '@/theme';

interface BottomSheetProps extends PropsWithChildren {
  visible: boolean;
  onClose(): void;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar janela" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.blackOverlay },
  sheet: { maxHeight: '92%', borderTopWidth: 3, borderColor: colors.navy, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, backgroundColor: colors.white, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 30 },
  handle: { width: 50, height: 5, borderRadius: 3, backgroundColor: '#A9B3C3', alignSelf: 'center', marginBottom: 14 },
});
