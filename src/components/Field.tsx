import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radii } from '@/theme';

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Field({ label, error, style, secureTextEntry, ...props }: FieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry === true;

  return (
    <View style={styles.wrapper}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={[styles.inputRow, error ? styles.inputError : undefined]}>
        <TextInput
          {...props}
          secureTextEntry={isPasswordField ? !passwordVisible : secureTextEntry}
          placeholderTextColor="#70809A"
          selectionColor={colors.orange}
          style={[styles.input, style]}
        />
        {isPasswordField ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            accessibilityHint="Alterna a visualização da senha"
            hitSlop={8}
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={({ pressed }) => [styles.passwordToggle, pressed ? styles.passwordTogglePressed : undefined]}
          >
            <AppText style={styles.passwordToggleIcon}>{passwordVisible ? '👁️' : '🙈'}</AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? <AppText accessibilityRole="alert" style={styles.error}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontFamily: fonts.semibold, fontSize: 12 },
  inputRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, backgroundColor: colors.white },
  input: { flex: 1, minHeight: 46, paddingHorizontal: 14, color: colors.navy, fontFamily: fonts.regular, fontSize: 15 },
  inputError: { borderColor: colors.danger },
  passwordToggle: { minWidth: 48, minHeight: 46, alignItems: 'center', justifyContent: 'center', borderTopRightRadius: radii.md, borderBottomRightRadius: radii.md },
  passwordTogglePressed: { opacity: 0.65 },
  passwordToggleIcon: { fontSize: 20 },
  error: { color: colors.danger, fontSize: 11, fontFamily: fonts.semibold },
});
