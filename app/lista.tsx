import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen'; import { PageHeader } from '@/components/PageHeader'; import { Card } from '@/components/Card'; import { AppText } from '@/components/AppText'; import { ItemForm, type ItemFormValue } from '@/components/ItemForm'; import { Button } from '@/components/Button';
import { useCloud } from '@/providers/CloudProvider'; import { gerarId } from '@/domain/purchase'; import { colors, fonts, radii } from '@/theme';

export default function ListBuilderScreen() {
  const cloud = useCloud(); const { itens, historico, edicaoId } = cloud.data;
  function add(value: ItemFormValue) { cloud.mutate((data) => { data.itens.push({ id: gerarId(), ...value, comprado: false }); }); }
  function remove(id: string) { Alert.alert('Remover item?', 'O item será retirado desta lista.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Remover', style: 'destructive', onPress: () => cloud.mutate((data) => { data.itens = data.itens.filter((item) => item.id !== id); }) }]); }
  function save() {
    if (!itens.length) return;
    if (edicaoId) {
      cloud.mutate((data) => { const current = data.historico.find((list) => list.id === edicaoId); if (current) { current.itens = structuredClone(data.itens); current.data = new Date().toISOString(); } data.itens = []; data.edicaoId = null; });
      router.replace('/(tabs)/listas'); return;
    }
    Alert.prompt('Nome da lista', 'Escolha um nome fácil de reconhecer.', (name) => {
      const clean = name.trim(); if (!clean) return;
      if (historico.some((list) => list.nome.toLowerCase() === clean.toLowerCase())) { Alert.alert('Nome já usado', 'Escolha outro nome para a lista.'); return; }
      cloud.mutate((data) => { data.historico.push({ id: gerarId(), nome: clean, itens: structuredClone(data.itens), data: new Date().toISOString() }); data.itens = []; data.edicaoId = null; }); router.replace('/(tabs)/listas');
    }, 'plain-text');
  }
  function clear() { if (!itens.length) return; Alert.alert('Limpar lista?', 'Todos os itens da lista em criação serão removidos.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Limpar', style: 'destructive', onPress: () => cloud.mutate((data) => { data.itens = []; data.edicaoId = null; }) }]); }
  return <Screen><PageHeader title={edicaoId ? 'Editar lista' : 'Crie sua lista'} subtitle="Adicione os produtos antes de ir às compras." back /><Card style={{ marginBottom: 14 }}><ItemForm onSubmit={add} /></Card><View style={styles.header}><AppText style={styles.heading}>{itens.length} {itens.length === 1 ? 'item' : 'itens'}</AppText>{itens.length ? <Pressable onPress={clear}><AppText style={styles.clear}>Limpar</AppText></Pressable> : null}</View>{itens.map((item) => <Card key={item.id} style={styles.item}><View style={{ flex: 1 }}><AppText style={styles.itemName}>{item.nome}</AppText><AppText style={styles.itemMeta}>{item.categoria} · {item.tipo === 'Kg' ? `${item.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} kg` : `${item.quantidade} un`}</AppText></View><Pressable accessibilityLabel={`Excluir ${item.nome}`} onPress={() => remove(item.id)} style={styles.remove}><AppText style={styles.removeText}>×</AppText></Pressable></Card>)}{!itens.length ? <Card><AppText style={styles.empty}>Sua lista está vazia. Comece adicionando um produto acima.</AppText></Card> : null}<Button label={edicaoId ? 'Salvar alterações' : 'Salvar lista'} onPress={save} disabled={!itens.length} style={{ marginTop: 16 }} /></Screen>;
}
const styles = StyleSheet.create({ header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, heading: { fontFamily: fonts.bold, fontSize: 16 }, clear: { color: colors.danger, fontFamily: fonts.semibold, padding: 8 }, item: { flexDirection: 'row', alignItems: 'center', padding: 13, marginBottom: 8, borderRadius: radii.md }, itemName: { fontFamily: fonts.bold, fontSize: 14 }, itemMeta: { color: colors.muted, fontSize: 10, marginTop: 2 }, remove: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }, removeText: { color: colors.danger, fontFamily: fonts.bold, fontSize: 26 }, empty: { color: colors.muted, textAlign: 'center', paddingVertical: 10 }, });
