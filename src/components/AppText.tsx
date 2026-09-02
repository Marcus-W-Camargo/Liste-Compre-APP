import { Text, type TextProps } from 'react-native';
import { colors, fonts } from '@/theme';

export function AppText({ style, ...props }: TextProps) {
  return <Text {...props} style={[{ fontFamily: fonts.regular, color: colors.navy }, style]} />;
}
