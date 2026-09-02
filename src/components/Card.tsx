import { memo } from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { colors, radii, shadows } from '@/theme';

export const Card = memo(function Card({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: colors.navy,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 18,
    ...Platform.select({
      android: { elevation: 3 },
      default: shadows.card,
    }),
  },
});
