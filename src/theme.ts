export const colors = {
  blue: '#7B9FD6',
  blueDark: '#6088C5',
  navy: '#1A263B',
  orange: '#F7501B',
  orangeDark: '#E04312',
  white: '#FFFFFF',
  cream: '#FFF4E7',
  softBlue: '#DCE7F7',
  softOrange: '#FFEBDB',
  muted: '#5E6F89',
  line: '#D4DCE8',
  danger: '#B92F18',
  success: '#1F7A4D',
  blackOverlay: 'rgba(11, 20, 36, 0.55)',
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 26,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#0B1424',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 5,
  },
} as const;

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  black: 'Poppins_900Black',
} as const;
