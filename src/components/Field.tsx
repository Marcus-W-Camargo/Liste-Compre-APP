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
  const hasPasswordToggle = secureTextEntry === true;

  return (
    <View style={styles.wrapper}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.inputArea}>
        <TextInput
          {...props}
          secureTextEntry={hasPasswordToggle ? !passwordVisible : secureTextEntry}
          placeholderTextColor="#70809A"
          selectionColor={colors.orange}
          style={[
            styles.input,
            hasPasswordToggle && styles.inputWithToggle,
            error ? styles.inputError : undefined,
            style,
          ]}
        />
        {hasPasswordToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            accessibilityState={{ expanded: passwordVisible }}
            hitSlop={8}
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={({ pressed }) => [styles.passwordToggle, pressed && styles.passwordTogglePressed]}
          >
            <AppText style={styles.passwordToggleIcon}>{passwordVisible ? '🙈' : '👁️'}</AppText>
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
  inputArea: { position: 'relative' },
  input: { minHeight: 50, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, backgroundColor: colors.white, paddingHorizontal: 14, color: colors.navy, fontFamily: fonts.regular, fontSize: 15 },
  inputWithToggle: { paddingRight: 52 },
  inputError: { borderColor: colors.danger },
  passwordToggle: { position: 'absolute', right: 5, top: 4, width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md },
  passwordTogglePressed: { opacity: 0.65 },
  passwordToggleIcon: { fontSize: 20, lineHeight: 24 },
  error: { color: colors.danger, fontSize: 11, fontFamily: fonts.semibold },
});
