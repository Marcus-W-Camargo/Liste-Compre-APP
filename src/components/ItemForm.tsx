import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText'; import { Button } from './Button'; import { Field } from './Field'; import { CategorySelector } from './CategorySelector';
import { CATEGORIAS, type TipoMedida } from '@/types'; import { sugerirProdutos } from '@/data/catalog'; import { colors, fonts, radii } from '@/theme';

export interface ItemFormValue { nome: string; categoria: string; quantidade: number; tipo: TipoMedida; }

export function ItemForm({ onSubmit, submitLabel = 'Adicionar item' }: { onSubmit(value: ItemFormValue): void; submitLabel?: string }) {
  const [nome, setNome] = useState(''); const [categoria, setCategoria] = useState<string>(CATEGORIAS[0].label); const [quantidade, setQuantidade] = useState('1'); const [tipo, setTipo] = useState<TipoMedida>('un'); const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const switchPosition = useRef(new Animated.Value(0)).current;
  const suggestions = useMemo(() => sugerirProdutos(nome), [nome]);

  useEffect(() => {
    Animated.timing(switchPosition, {
      toValue: tipo === 'Kg' ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [switchPosition, tipo]);

  function changeName(value: string) { setNome(value); setSuggestionsVisible(true); }
  function selectSuggestion(value: string) { setNome(value); setSuggestionsVisible(false); }
  function toggleMeasure() { const next: TipoMedida = tipo === 'Kg' ? 'un' : 'Kg'; setTipo(next); setQuantidade(next === 'Kg' ? '0.500' : '1'); }
  function submit() { const normalized = tipo === 'Kg' ? Number(quantidade.replace(',', '.')) : Math.min(999, Math.floor(Number(quantidade))); if (!nome.trim() || !Number.isFinite(normalized) || normalized <= 0) return; onSubmit({ nome: nome.trim(), categoria, quantidade: normalized, tipo }); setNome(''); setQuantidade(tipo === 'Kg' ? '0.500' : '1'); setSuggestionsVisible(false); }

  const thumbTranslate = switchPosition.interpolate({ inputRange: [0, 1], outputRange: [0, 46] });

  return <View style={styles.form}><Field label="Produto" value={nome} onChangeText={changeName} onFocus={() => setSuggestionsVisible(true)} onSubmitEditing={() => setSuggestionsVisible(false)} placeholder="Ex.: Arroz" autoCapitalize="sentences" maxLength={300} returnKeyType="next" />{suggestionsVisible && suggestions.length ? <View style={styles.suggestions}>{suggestions.map((suggestion) => <Pressable key={suggestion} onPress={() => selectSuggestion(suggestion)} style={styles.suggestion}><AppText style={styles.suggestionText}>{suggestion}</AppText></Pressable>)}</View> : null}<AppText style={styles.label}>Categoria</AppText><CategorySelector value={categoria} onChange={setCategoria} /><View style={styles.inline}><View style={styles.quantity}><Field label={tipo === 'Kg' ? 'Peso (kg)' : 'Quantidade'} value={quantidade} onChangeText={(value) => setQuantidade(value.replace(/[^0-9.,]/g, '').slice(0, 7))} keyboardType="decimal-pad" inputMode="decimal" /></View><View style={styles.measureWrapper}><AppText style={styles.label}>Medida ({tipo === 'Kg' ? 'kg.' : 'un.'})</AppText><Pressable accessibilityRole="switch" accessibilityLabel="Alternar unidade de medida" accessibilityState={{ checked: tipo === 'Kg' }} onPress={toggleMeasure} style={({ pressed }) => [styles.measureSwitch, pressed && styles.measureSwitchPressed]}><Animated.View style={[styles.measureThumb, { transform: [{ translateX: thumbTranslate }] }]}><AppText style={styles.measureEmoji}>{tipo === 'Kg' ? '⚖️' : '📦'}</AppText></Animated.View></Pressable></View></View><Button label={submitLabel} onPress={submit} disabled={!nome.trim()} /></View>;
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  suggestions: { marginTop: -8, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, backgroundColor: colors.white, overflow: 'hidden' },
  suggestion: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  suggestionText: { fontSize: 12 },
  label: { fontFamily: fonts.semibold, fontSize: 12 },
  inline: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  quantity: { flex: 1 },
  measureWrapper: { gap: 6, width: 96 },
  measureSwitch: { width: 96, height: 50, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.pill, backgroundColor: colors.orange, padding: 4, justifyContent: 'center', overflow: 'hidden' },
  measureSwitchPressed: { opacity: 0.88 },
  measureThumb: { width: 38, height: 38, borderWidth: 2, borderColor: colors.navy, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  measureEmoji: { fontSize: 19, lineHeight: 23 },
});
