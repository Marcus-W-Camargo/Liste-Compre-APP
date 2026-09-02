import { ScrollView, Pressable, StyleSheet } from 'react-native';
import { CATEGORIAS } from '@/types';
import { AppText } from './AppText';
import { colors, fonts, radii } from '@/theme';

export function CategorySelector({ value, onChange }: { value: string; onChange(value: string): void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} keyboardShouldPersistTaps="handled">
      {CATEGORIAS.map((category) => {
        const selected = value === category.label || value === category.value;
        return (
          <Pressable key={category.value} onPress={() => onChange(category.label)} style={[styles.chip, selected && styles.selected]} accessibilityRole="button" accessibilityState={{ selected }}>
            <AppText style={[styles.text, selected && styles.selectedText]}>{category.label}</AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: { minHeight: 42, justifyContent: 'center', borderWidth: 2, borderColor: colors.navy, borderRadius: radii.pill, backgroundColor: colors.white, paddingHorizontal: 13 },
  selected: { backgroundColor: colors.navy },
  text: { fontFamily: fonts.semibold, fontSize: 11 },
  selectedText: { color: colors.white },
});
