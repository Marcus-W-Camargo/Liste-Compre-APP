import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radii } from '@/theme';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

export function Button({ label, variant = 'primary', loading = false, disabled, style, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [styles.base, styles[variant], isDisabled && styles.disabled, pressed && !isDisabled && styles.pressed, typeof style === 'function' ? style({ pressed }) : style]}
    >
      {loading ? <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.navy : colors.white} /> : (
        <AppText style={[styles.label, (variant === 'secondary' || variant === 'ghost') && styles.darkLabel]}>{label}</AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 50, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 12 },
  primary: { backgroundColor: colors.orange },
  secondary: { backgroundColor: colors.white },
  danger: { backgroundColor: colors.danger },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  label: { color: colors.white, fontFamily: fonts.bold, fontSize: 15, textAlign: 'center' },
  darkLabel: { color: colors.navy },
  disabled: { opacity: 0.48 },
  pressed: { transform: [{ scale: 0.985 }] },
});
