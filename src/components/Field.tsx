import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radii } from '@/theme';

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Field({ label, error, style, ...props }: FieldProps) {
  return (
    <View style={styles.wrapper}>
      <AppText style={styles.label}>{label}</AppText>
      <TextInput
        {...props}
        placeholderTextColor="#70809A"
        selectionColor={colors.orange}
        style={[styles.input, error ? styles.inputError : undefined, style]}
      />
      {error ? <AppText accessibilityRole="alert" style={styles.error}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontFamily: fonts.semibold, fontSize: 12 },
  input: { minHeight: 50, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, backgroundColor: colors.white, paddingHorizontal: 14, color: colors.navy, fontFamily: fonts.regular, fontSize: 15 },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 11, fontFamily: fonts.semibold },
});
