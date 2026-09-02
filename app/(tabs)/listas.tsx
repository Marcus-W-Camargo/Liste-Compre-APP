import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/Screen'; import { TabTopBar } from '@/components/TabTopBar'; import { PageHeader } from '@/components/PageHeader'; import { Card } from '@/components/Card'; import { AppText } from '@/components/AppText'; import { Button } from '@/components/Button'; import { BottomSheet } from '@/components/BottomSheet'; import { Field } from '@/components/Field';
import { useAuth } from '@/providers/AuthProvider'; import { useCloud } from '@/providers/CloudProvider'; import { carregarSessaoCompra } from '@/storage/purchaseSession'; import { dataPrevistaValida, normalizarDataPrevista } from '@/domain/list'; import type { ListaSalva } from '@/types'; import { colors, fonts, radii } from '@/theme';

export default function ListsTab() {
  const { user } = useAuth();
  const cloud = useCloud(); const lists = cloud.data.historico;
  const [activePurchaseListId, setActivePurchaseListId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ListaSalva | null>(null); const [name, setName] = useState(''); const [date, setDate] = useState(''); const [error, setError] = useState('');
  const [replaceTarget, setReplaceTarget] = useState<ListaSalva | null>(null); const [deleteTarget, setDeleteTarget] = useState<ListaSalva | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!user?.id) {
        setActivePurchaseListId(null);
        return () => { active = false; };
      }

      void carregarSessaoCompra(user.id).then((session) => {
        if (!active) return;
        const activeId = session?.listaId ?? null;
        setActivePurchaseListId(activeId);
        setSelected((current) => current?.id === activeId ? null : current);
        setReplaceTarget((current) => current?.id === activeId ? null : current);
        setDeleteTarget((current) => current?.id === activeId ? null : current);
      });

      return () => { active = false; };
    }, [user?.id]),
  );

  const editableLists = activePurchaseListId
    ? lists.filter((list) => list.id !== activePurchaseListId)
    : lists;

  function openActions(list: ListaSalva) { if (list.id === activePurchaseListId) return; setSelected(list); setName(list.nome); setDate(list.dataPrevista ?? ''); setError(''); }
  function openForEdit(list: ListaSalva) { if (list.id === activePurchaseListId) return; setSelected(null); cloud.mutate((data) => { data.itens = structuredClone(list.itens); data.edicaoId = list.id; }); router.push('/lista'); }
  function edit(id: string) { if (id === activePurchaseListId) return; const list = lists.find((item) => item.id === id); if (!list) return; if (cloud.data.itens.length && cloud.data.edicaoId !== id) { setSelected(null); setReplaceTarget(list); return; } openForEdit(list); }
  function confirmReplace() { if (!replaceTarget || replaceTarget.id === activePurchaseListId) { setReplaceTarget(null); return; } const target = replaceTarget; setReplaceTarget(null); openForEdit(target); }
  function remove(id: string) { if (id === activePurchaseListId) return; const list = lists.find((item) => item.id === id); if (!list) return; setSelected(null); setDeleteTarget(list); }
  function confirmRemove() { if (!deleteTarget || deleteTarget.id === activePurchaseListId) { setDeleteTarget(null); return; } const id = deleteTarget.id; cloud.mutate((data) => { data.historico = data.historico.filter((item) => item.id !== id); if (data.edicaoId === id) data.edicaoId = null; }); setDeleteTarget(null); }
  function saveMetadata() { if (!selected || selected.id === activePurchaseListId) { setSelected(null); return; } const clean = name.trim(); if (!clean) { setError('Informe um nome para a lista.'); return; } if (clean.length > 200) { setError('O nome da lista é muito longo.'); return; } if (lists.some((list) => list.id !== selected.id && list.nome.toLowerCase() === clean.toLowerCase())) { setError('Já existe outra lista com esse nome.'); return; } const cleanDate = date.trim(); if (!dataPrevistaValida(cleanDate)) { setError('Use uma data válida no formato AAAA-MM-DD.'); return; } const normalizedDate = normalizarDataPrevista(cleanDate); cloud.mutate((data) => { const list = data.historico.find((item) => item.id === selected.id); if (!list) return; list.nome = clean; list.data = new Date().toISOString(); if (normalizedDate) list.dataPrevista = normalizedDate; else delete list.dataPrevista; }); setSelected(null); }
  function startPurchase(id: string) { setSelected(null); router.push({ pathname: '/compra/[listaId]', params: { listaId: id } }); }

  return <Screen><TabTopBar /><PageHeader title="Minhas listas" subtitle="Listas sincronizadas com a sua conta." /><Button label="+ Nova lista" onPress={() => router.push('/lista')} style={{ marginBottom: 14 }} />{editableLists.length ? editableLists.map((list) => <Pressable key={list.id} onPress={() => openActions(list)}><Card style={styles.card}><View style={{ flex: 1 }}><AppText style={styles.name}>{list.nome}</AppText><AppText style={styles.meta}>{list.itens.length} {list.itens.length === 1 ? 'item' : 'itens'} · atualizada {new Date(list.data).toLocaleDateString('pt-BR')}</AppText>{list.dataPrevista ? <AppText style={styles.date}>📅 {new Date(`${list.dataPrevista}T12:00:00`).toLocaleDateString('pt-BR')}</AppText> : null}</View><AppText style={styles.chevron}>›</AppText></Card></Pressable>) : <Card><AppText style={styles.empty}>Você ainda não tem listas disponíveis para edição.</AppText></Card>}

  <BottomSheet visible={Boolean(selected)} onClose={() => setSelected(null)}>{selected ? <><AppText style={styles.sheetTitle}>Opções da lista</AppText><Field label="Nome" value={name} onChangeText={(value) => { setName(value); setError(''); }} maxLength={200} /><Field label="Data prevista (opcional)" value={date} onChangeText={(value) => { setDate(value.replace(/[^0-9-]/g, '').slice(0, 10)); setError(''); }} placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" maxLength={10} style={{ marginTop: 10 }} />{error ? <AppText accessibilityRole="alert" style={styles.error}>{error}</AppText> : null}<Button label="Salvar nome e data" onPress={saveMetadata} style={{ marginTop: 12 }} /><Button label="Editar itens" variant="secondary" onPress={() => edit(selected.id)} style={{ marginTop: 8 }} /><Button label="🛒 Iniciar compra" variant="secondary" onPress={() => startPurchase(selected.id)} style={{ marginTop: 8 }} /><Button label="Excluir lista" variant="dangerOutline" onPress={() => remove(selected.id)} style={{ marginTop: 8 }} /><Button label="Cancelar" variant="ghost" onPress={() => setSelected(null)} /></> : null}</BottomSheet>

  <BottomSheet visible={Boolean(replaceTarget)} onClose={() => setReplaceTarget(null)}><AppText style={styles.sheetTitle}>Substituir lista em criação?</AppText><AppText style={styles.sheetText}>A lista que está sendo criada será substituída por “{replaceTarget?.nome}”. Os itens ainda não salvos serão descartados.</AppText><Button label="Substituir lista" variant="dangerOutline" onPress={confirmReplace} style={{ marginTop: 8 }} /><Button label="Cancelar" variant="secondary" onPress={() => setReplaceTarget(null)} style={{ marginTop: 8 }} /></BottomSheet>

  <BottomSheet visible={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}><AppText style={styles.sheetTitle}>Excluir lista salva?</AppText><AppText style={styles.sheetText}>“{deleteTarget?.nome}” será removida das suas listas. Compras já finalizadas continuarão disponíveis no histórico.</AppText><Button label="Excluir lista" variant="dangerOutline" onPress={confirmRemove} style={{ marginTop: 8 }} /><Button label="Cancelar" variant="secondary" onPress={() => setDeleteTarget(null)} style={{ marginTop: 8 }} /></BottomSheet>
  </Screen>;
}
const styles = StyleSheet.create({ card: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 10, borderRadius: radii.md }, name: { fontFamily: fonts.bold, fontSize: 16 }, meta: { color: colors.muted, fontSize: 10, marginTop: 2 }, date: { color: colors.orangeDark, fontFamily: fonts.semibold, fontSize: 10, marginTop: 4 }, chevron: { fontFamily: fonts.bold, fontSize: 28 }, empty: { textAlign: 'center', color: colors.muted, paddingVertical: 16 }, sheetTitle: { fontFamily: fonts.black, fontSize: 21, marginBottom: 10 }, sheetText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 6 }, error: { color: colors.danger, fontFamily: fonts.semibold, fontSize: 11, marginTop: 7 } });
