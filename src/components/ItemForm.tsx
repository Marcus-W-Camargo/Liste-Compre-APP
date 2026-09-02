import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText'; import { Button } from './Button'; import { Field } from './Field'; import { CategorySelector } from './CategorySelector'; import { MeasureSwitch } from './MeasureSwitch';
import { CATEGORIAS, type TipoMedida } from '@/types'; import { sugerirProdutos } from '@/data/catalog'; import { colors, fonts, radii } from '@/theme';

export interface ItemFormValue { nome: string; categoria: string; quantidade: number; tipo: TipoMedida; }

export function ItemForm({ onSubmit, submitLabel = 'Adicionar item' }: { onSubmit(value: ItemFormValue): void; submitLabel?: string }) {
  const [nome, setNome] = useState(''); const [categoria, setCategoria] = useState<string>(CATEGORIAS[0].label); const [quantidade, setQuantidade] = useState('1'); const [tipo, setTipo] = useState<TipoMedida>('un'); const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const suggestions = useMemo(() => sugerirProdutos(nome), [nome]);
  function changeName(value: string) { setNome(value); setSuggestionsVisible(true); }
  function selectSuggestion(value: string) { setNome(value); setSuggestionsVisible(false); }
  function changeMeasure(next: TipoMedida) { setTipo(next); setQuantidade(next === 'Kg' ? '0.500' : '1'); }
  function submit() { const normalized = tipo === 'Kg' ? Number(quantidade.replace(',', '.')) : Math.min(999, Math.floor(Number(quantidade))); if (!nome.trim() || !Number.isFinite(normalized) || normalized <= 0) return; onSubmit({ nome: nome.trim(), categoria, quantidade: normalized, tipo }); setNome(''); setQuantidade(tipo === 'Kg' ? '0.500' : '1'); setSuggestionsVisible(false); }
  return <View style={styles.form}><Field label="Produto" value={nome} onChangeText={changeName} onFocus={() => setSuggestionsVisible(true)} onSubmitEditing={() => setSuggestionsVisible(false)} placeholder="Ex.: Arroz" autoCapitalize="sentences" maxLength={300} returnKeyType="next" />{suggestionsVisible && suggestions.length ? <View style={styles.suggestions}>{suggestions.map((suggestion) => <Pressable key={suggestion} onPress={() => selectSuggestion(suggestion)} style={styles.suggestion}><AppText style={styles.suggestionText}>{suggestion}</AppText></Pressable>)}</View> : null}<AppText style={styles.label}>Categoria</AppText><CategorySelector value={categoria} onChange={setCategoria} /><View style={styles.inline}><View style={styles.quantity}><Field label={tipo === 'Kg' ? 'Peso (kg)' : 'Quantidade'} value={quantidade} onChangeText={(value) => setQuantidade(value.replace(/[^0-9.,]/g, '').slice(0, 7))} keyboardType="decimal-pad" inputMode="decimal" /></View><MeasureSwitch value={tipo} onChange={changeMeasure} /></View><Button label={submitLabel} onPress={submit} disabled={!nome.trim()} /></View>;
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  suggestions: { marginTop: -8, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, backgroundColor: colors.white, overflow: 'hidden' },
  suggestion: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  suggestionText: { fontSize: 12 },
  label: { fontFamily: fonts.semibold, fontSize: 12 },
  inline: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  quantity: { flex: 1 },
});
