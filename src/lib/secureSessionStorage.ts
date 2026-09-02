import * as SecureStore from 'expo-secure-store';

const CHUNK_SIZE = 1700;

function safeKey(key: string) {
  return `lc_${key.replace(/[^A-Za-z0-9._-]/g, '_')}`;
}

async function countFor(base: string) {
  const raw = await SecureStore.getItemAsync(`${base}.__count`);
  const count = Number(raw ?? 0);
  return Number.isInteger(count) && count >= 0 && count <= 64 ? count : 0;
}

export const secureSessionStorage = {
  async getItem(key: string) {
    const base = safeKey(key);
    const count = await countFor(base);
    if (!count) return null;
    const chunks = await Promise.all(
      Array.from({ length: count }, (_, index) => SecureStore.getItemAsync(`${base}.${index}`)),
    );
    if (chunks.some((chunk) => chunk === null)) return null;
    return chunks.join('');
  },

  async setItem(key: string, value: string) {
    const base = safeKey(key);
    const previousCount = await countFor(base);
    const chunks = value.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'gs')) ?? [''];
    if (chunks.length > 64) throw new Error('Sessão local maior que o limite seguro suportado.');

    await Promise.all(
      chunks.map((chunk, index) =>
        SecureStore.setItemAsync(`${base}.${index}`, chunk, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        }),
      ),
    );
    await SecureStore.setItemAsync(`${base}.__count`, String(chunks.length), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    if (previousCount > chunks.length) {
      await Promise.all(
        Array.from({ length: previousCount - chunks.length }, (_, offset) =>
          SecureStore.deleteItemAsync(`${base}.${chunks.length + offset}`),
        ),
      );
    }
  },

  async removeItem(key: string) {
    const base = safeKey(key);
    const count = await countFor(base);
    await Promise.all(
      Array.from({ length: count }, (_, index) => SecureStore.deleteItemAsync(`${base}.${index}`)),
    );
    await SecureStore.deleteItemAsync(`${base}.__count`);
  },
};
