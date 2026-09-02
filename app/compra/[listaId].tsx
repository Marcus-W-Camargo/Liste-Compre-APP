import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { BottomSheet } from '@/components/BottomSheet';
import { ItemForm, type ItemFormValue } from '@/components/ItemForm';
import { useAuth } from '@/providers/AuthProvider';
import { useCloud } from '@/providers/CloudProvider';
import { carregarSessaoCompra, limparSessaoCompra, salvarSessaoCompra } from '@/storage/purchaseSession';
import { calcularProgresso, calcularTotal, criarSessaoCompra, finalizarSessao, gerarId } from '@/domain/purchase';
import type { ItemCompra, SessaoCompra } from '@/types';
import { colors, fonts, radii } from '@/theme';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PurchaseScreen() {
  const params = useLocalSearchParams<{ listaId: string }>();
  const listaId = String(params.listaId ?? '');
  const { user } = useAuth();
  const cloud = useCloud();
  const [session, setSession] = useState<SessaoCompra | null>(null);
  const [extraOpen, setExtraOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void (async () => {
      const stored = await carregarSessaoCompra(user.id);
      if (stored && stored.listaId !== listaId) {
        Alert.alert('Outra compra está em andamento', `Finalize “${stored.nomeLista}” antes de abrir outra lista.`, [{ text: 'Voltar', onPress: () => router.replace('/(tabs)/comprar') }]);
        return;
      }
      if (stored) { if (active) setSession(stored); return; }
      const list = cloud.data.historico.find((item) => item.id === listaId);
      if (!list) { router.replace('/(tabs)/comprar'); return; }
      const created = criarSessaoCompra(list);
      await salvarSessaoCompra(user.id, created);
      if (active) setSession(created);
    })();
    return () => { active = false; };
  }, [user, listaId, cloud.data.historico]);

  async function updateItems(change: (items: ItemCompra[]) => ItemCompra[]) {
    if (!session || !user) return;
    const next = { ...session, itens: change(session.itens) };
    await salvarSessaoCompra(user.id, next);
    setSession(next);
  }

  async function patch(id: string, itemPatch: Partial<ItemCompra>) {
    await updateItems((items) => items.map((item) => item.id === id ? { ...item, ...itemPatch } : item));
  }

  async function addExtra(value: ItemFormValue) {
    await updateItems((items) => [...items, { id: gerarId(), ...value, precoUnitario: 0, pego: false, origem: 'extra' }]);
    setExtraOpen(false);
  }

  const total = useMemo(() => calcularTotal(session?.itens ?? []), [session]);
  const progress = useMemo(() => calcularProgresso(session?.itens ?? []), [session]);
  const pending = session?.itens.filter((item) => !item.pego) ?? [];

  async function finish() {
    if (!session || !user || finishing) return;
    if (pending.length) { setPendingOpen(true); return; }
    setFinishing(true);
    const completed = finalizarSessao(session);
    try {
      cloud.mutate((data) => { data.compras.push(completed); });
      await cloud.flush();
      await limparSessaoCompra(user.id);
      setSession(null);
      router.replace('/(tabs)/historico');
    } catch (error) {
      Alert.alert('Não foi possível finalizar', error instanceof Error ? error.message : 'Confira a conexão e tente novamente. A compra continua salva neste aparelho.');
    } finally { setFinishing(false); }
  }

  async function removePending() {
    await updateItems((items) => items.filter((item) => item.pego));
    setPendingOpen(false);
  }

  async function transferPending(destinationId: string) {
    if (!session) return;
    const toTransfer = session.itens.filter((item) => !item.pego);
    cloud.mutate((data) => {
      const destination = data.historico.find((list) => list.id === destinationId);
      if (!destination) return;
      destination.itens.push(...toTransfer.map((item) => ({ id: gerarId(), nome: item.nome, categoria: item.categoria, quantidade: item.quantidadePlanejada ?? item.quantidade, tipo: item.tipo, comprado: false })));
      destination.data = new Date().toISOString();
    });
    await updateItems((items) => items.filter((item) => item.pego));
    setPendingOpen(false);
  }

  if (!session) return <Screen><PageHeader title="Carregando compra" back /><Card><AppText>Preparando os itens deste aparelho…</AppText></Card></Screen>;

  const destinations = cloud.data.historico.filter((list) => list.id !== session.listaId);
  return (
    <Screen>
      <PageHeader title={session.nomeLista} subtitle={session.dataPrevista ? `Agendada para ${new Date(`${session.dataPrevista}T12:00:00`).toLocaleDateString('pt-BR')}` : 'Compra em andamento neste aparelho'} back />
      <Card style={styles.summary}><View><AppText style={styles.progress}>{progress}% concluída</AppText><AppText style={styles.meta}>{session.itens.filter((item) => item.pego).length}/{session.itens.length} itens</AppText></View><AppText style={styles.total}>{money.format(total)}</AppText></Card>
      {session.itens.map((item) => <PurchaseRow key={item.id} item={item} onPatch={patch} onRemove={() => Alert.alert('Excluir item?', item.nome, [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: () => void updateItems((items) => items.filter((entry) => entry.id !== item.id)) }])} />)}
      <View style={styles.actions}><Button label="+ Adicionar item extra" variant="secondary" onPress={() => setExtraOpen(true)} /><Button label={finishing ? 'Salvando…' : 'Finalizar compra'} loading={finishing} onPress={() => void finish()} /></View>

      <BottomSheet visible={extraOpen} onClose={() => setExtraOpen(false)}><AppText style={styles.sheetTitle}>Adicionar item extra</AppText><ItemForm onSubmit={(value) => void addExtra(value)} submitLabel="Adicionar à compra" /></BottomSheet>
      <BottomSheet visible={pendingOpen} onClose={() => setPendingOpen(false)}>
        <AppText style={styles.sheetTitle}>Existem {pending.length} itens pendentes</AppText><AppText style={styles.sheetText}>Para finalizar, apague os pendentes ou transfira-os para outra lista.</AppText>
        {destinations.length ? <><AppText style={styles.destinationTitle}>Transferir para:</AppText>{destinations.map((list) => <Pressable key={list.id} onPress={() => void transferPending(list.id)} style={styles.destination}><AppText style={styles.destinationText}>📋 {list.nome}</AppText></Pressable>)}</> : null}
        <Button label="Apagar itens pendentes" variant="danger" onPress={() => void removePending()} style={{ marginTop: 12 }} /><Button label="Voltar à compra" variant="ghost" onPress={() => setPendingOpen(false)} />
      </BottomSheet>
    </Screen>
  );
}

function PurchaseRow({ item, onPatch, onRemove }: { item: ItemCompra; onPatch(id: string, patch: Partial<ItemCompra>): Promise<void>; onRemove(): void }) {
  const [priceText, setPriceText] = useState(item.precoUnitario ? item.precoUnitario.toFixed(2).replace('.', ',') : '');
  const [quantityText, setQuantityText] = useState(String(item.quantidade).replace('.', ','));
  function commitPrice() { const value = Number(priceText.replace(',', '.')); void onPatch(item.id, { precoUnitario: Number.isFinite(value) && value >= 0 ? value : 0, pego: Number.isFinite(value) && value > 0 && item.quantidade > 0 ? item.pego : false }); }
  function commitQuantity() { const value = Number(quantityText.replace(',', '.')); const valid = Number.isFinite(value) && value > 0 ? (item.tipo === 'un' ? Math.min(999, Math.floor(value)) : value) : item.quantidade; setQuantityText(String(valid).replace('.', ',')); void onPatch(item.id, { quantidade: valid, pego: item.precoUnitario > 0 && valid > 0 ? item.pego : false }); }
  const canCheck = item.precoUnitario > 0 && item.quantidade > 0;
  return <Card style={[styles.row, item.pego && styles.rowDone]}><Pressable disabled={!canCheck} onPress={() => void onPatch(item.id, { pego: !item.pego })} style={[styles.check, item.pego && styles.checkDone, !canCheck && styles.checkDisabled]} accessibilityRole="checkbox" accessibilityState={{ checked: item.pego, disabled: !canCheck }}><AppText style={styles.checkText}>{item.pego ? '✓' : ''}</AppText></Pressable><View style={styles.rowBody}><View style={styles.rowHead}><View style={{ flex: 1 }}><AppText style={styles.itemName}>{item.nome}</AppText><AppText style={styles.itemMeta}>{item.categoria}{item.origem === 'extra' ? ' · Extra' : ''}</AppText></View><Pressable accessibilityLabel={`Excluir ${item.nome}`} onPress={onRemove} style={styles.delete}><AppText style={styles.deleteText}>×</AppText></Pressable></View><View style={styles.inputs}><View style={{ flex: 1 }}><AppText style={styles.inputLabel}>Preço unitário</AppText><TextInput value={priceText} onChangeText={(value) => setPriceText(value.replace(/[^0-9,]/g, '').slice(0, 8))} onEndEditing={commitPrice} keyboardType="decimal-pad" inputMode="decimal" placeholder="0,00" style={styles.input} /></View><View style={{ width: 104 }}><AppText style={styles.inputLabel}>{item.tipo === 'Kg' ? 'Peso kg' : 'Qtd.'}</AppText><TextInput value={quantityText} onChangeText={(value) => setQuantityText(value.replace(/[^0-9,]/g, '').slice(0, 7))} onEndEditing={commitQuantity} keyboardType="decimal-pad" inputMode="decimal" style={styles.input} /></View></View>{canCheck && !item.pego ? <AppText style={styles.hint}>Toque no círculo para marcar como colocado no carrinho.</AppText> : null}</View></Card>;
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.softOrange, marginBottom: 12 }, progress: { fontFamily: fonts.bold, fontSize: 16 }, meta: { color: colors.muted, fontSize: 10 }, total: { fontFamily: fonts.black, color: colors.orangeDark, fontSize: 20 },
  row: { flexDirection: 'row', gap: 10, padding: 12, marginBottom: 9, borderRadius: radii.md }, rowDone: { opacity: 0.78, backgroundColor: '#F2FBF6' }, check: { width: 42, height: 42, borderRadius: 21, borderWidth: 3, borderColor: colors.navy, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, marginTop: 2 }, checkDone: { backgroundColor: colors.success }, checkDisabled: { opacity: 0.35 }, checkText: { color: colors.white, fontFamily: fonts.black, fontSize: 20 },
  rowBody: { flex: 1 }, rowHead: { flexDirection: 'row', alignItems: 'flex-start' }, itemName: { fontFamily: fonts.bold, fontSize: 14 }, itemMeta: { color: colors.muted, fontSize: 9 }, delete: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }, deleteText: { color: colors.danger, fontFamily: fonts.bold, fontSize: 24 }, inputs: { flexDirection: 'row', gap: 8, marginTop: 9 }, inputLabel: { fontFamily: fonts.semibold, fontSize: 9, marginBottom: 3 }, input: { minHeight: 44, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.sm, backgroundColor: colors.white, paddingHorizontal: 10, color: colors.navy, fontFamily: fonts.medium, fontSize: 13 }, hint: { color: colors.muted, fontSize: 8, marginTop: 5 }, actions: { gap: 9, marginTop: 8 }, sheetTitle: { fontFamily: fonts.black, fontSize: 21, marginBottom: 8 }, sheetText: { color: colors.muted, marginBottom: 14 }, destinationTitle: { fontFamily: fonts.bold, marginBottom: 7 }, destination: { minHeight: 48, borderWidth: 2, borderColor: colors.navy, borderRadius: radii.md, justifyContent: 'center', paddingHorizontal: 14, marginBottom: 7, backgroundColor: colors.cream }, destinationText: { fontFamily: fonts.semibold },
});
