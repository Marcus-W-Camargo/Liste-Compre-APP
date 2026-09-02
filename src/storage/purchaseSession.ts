import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessaoCompra } from '@/types';
import { sessaoCompraValida } from '@/domain/dataValidation';

const PREFIX = 'liste-e-compre:compra-em-andamento:v1:';

function key(owner: string) {
  return `${PREFIX}${owner}`;
}

export async function carregarSessaoCompra(owner: string) {
  try {
    const raw = await AsyncStorage.getItem(key(owner));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (sessaoCompraValida(value)) return value;
    await AsyncStorage.removeItem(key(owner));
    return null;
  } catch {
    await AsyncStorage.removeItem(key(owner)).catch(() => undefined);
    return null;
  }
}

export async function salvarSessaoCompra(owner: string, session: SessaoCompra) {
  if (!sessaoCompraValida(session)) throw new Error('A compra em andamento contém dados inválidos.');
  await AsyncStorage.setItem(key(owner), JSON.stringify(session));
}

export async function limparSessaoCompra(owner: string) {
  await AsyncStorage.removeItem(key(owner));
}
