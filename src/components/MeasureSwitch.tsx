import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import type { TipoMedida } from '@/types';
import { colors, fonts, radii } from '@/theme';

type MeasureSwitchProps = {
  value: TipoMedida;
  onChange(value: TipoMedida): void;
  compact?: boolean;
  showLabel?: boolean;
};

export function MeasureSwitch({ value, onChange, compact = false, showLabel = true }: MeasureSwitchProps) {
  const position = useRef(new Animated.Value(value === 'Kg' ? 1 : 0)).current;
  const width = compact ? 64 : 96;
  const height = compact ? 44 : 50;
  const padding = compact ? 3 : 4;
  const thumbSize = compact ? 30 : 38;
  const travel = width - (padding * 2) - thumbSize - 4;

  useEffect(() => {
    Animated.timing(position, {
      toValue: value === 'Kg' ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [position, value]);

  const translateX = position.interpolate({ inputRange: [0, 1], outputRange: [0, travel] });

  function toggle() {
    onChange(value === 'Kg' ? 'un' : 'Kg');
  }

  return (
    <View style={styles.wrapper}>
      {showLabel ? <AppText style={styles.label}>Medida ({value === 'Kg' ? 'kg.' : 'un.'})</AppText> : null}
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel="Alternar unidade de medida"
        accessibilityState={{ checked: value === 'Kg' }}
        onPress={toggle}
        style={({ pressed }) => [
          styles.switch,
          { width, height, padding },
          pressed && styles.pressed,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{ translateX }],
            },
          ]}
        >
          <AppText style={[styles.emoji, compact && styles.emojiCompact]}>{value === 'Kg' ? '⚖️' : '📦'}</AppText>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontFamily: fonts.semibold, fontSize: 12 },
  switch: {
    borderWidth: 2,
    borderColor: colors.navy,
    borderRadius: radii.pill,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    borderWidth: 2,
    borderColor: colors.navy,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 19, lineHeight: 23 },
  emojiCompact: { fontSize: 14, lineHeight: 18 },
  pressed: { opacity: 0.88 },
});
