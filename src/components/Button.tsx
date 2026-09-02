import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { AppText } from './AppText';
import { colors, fonts, radii } from '@/theme';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'dangerOutline' | 'ghost';
  loading?: boolean;
}

export function Button({ label, variant = 'primary', loading = false, disabled, style, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
  const usesDarkSpinner = variant === 'secondary' || variant === 'ghost';
  const usesDarkLabel = variant === 'secondary' || variant === 'ghost';
  const usesDangerLabel = variant === 'dangerOutline';

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={isDisabled}
      style={(state) => [styles.base, styles[variant], isDisabled && styles.disabled, state.pressed && !isDisabled && styles.pressed, typeof style === 'function' ? style(state) : style]}
    >
      {loading ? (
        <ActivityIndicator color={usesDarkSpinner ? colors.navy : usesDangerLabel ? colors.danger : colors.white} />
      ) : (
        <AppText style={[styles.label, usesDarkLabel && styles.darkLabel, usesDangerLabel && styles.dangerOutlineLabel]}>{label}</AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 50, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 12 },
  primary: { backgroundColor: colors.orange },
  secondary: { backgroundColor: colors.white },
  danger: { backgroundColor: colors.danger },
  dangerOutline: { backgroundColor: '#FFF0EC', borderColor: colors.danger },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  label: { color: colors.white, fontFamily: fonts.bold, fontSize: 15, textAlign: 'center' },
  darkLabel: { color: colors.navy },
  dangerOutlineLabel: { color: colors.danger },
  disabled: { opacity: 0.48 },
  pressed: { transform: [{ scale: 0.985 }] },
});
