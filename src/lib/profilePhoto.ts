import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getSupabase } from './supabase';

const BUCKET = 'profile-photos';
const PHOTO_CACHE_TTL_MS = 50 * 60 * 1000;
const EMPTY_CACHE_TTL_MS = 5 * 60 * 1000;

type PhotoCacheEntry = {
  url: string | null;
  expiresAt: number;
};

const photoCache = new Map<string, PhotoCacheEntry>();
const pendingPhotoRequests = new Map<string, Promise<string | null>>();

function savePhotoCache(userId: string, url: string | null) {
  photoCache.set(userId, {
    url,
    expiresAt: Date.now() + (url ? PHOTO_CACHE_TTL_MS : EMPTY_CACHE_TTL_MS),
  });
}

export function obterFotoPerfilEmCache(userId: string) {
  if (!userId) return null;
  const cached = photoCache.get(userId);
  if (!cached || cached.expiresAt <= Date.now()) return null;
  return cached.url;
}

export async function escolherEEnviarFoto(userId: string) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (result.canceled || !result.assets[0]) return null;

  const edited = await ImageManipulator.manipulateAsync(
    result.assets[0].uri,
    [{ resize: { width: 512, height: 512 } }],
    { compress: 0.72, format: ImageManipulator.SaveFormat.JPEG },
  );
  const response = await fetch(edited.uri);
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > 2 * 1024 * 1024) throw new Error('A imagem final excedeu o limite permitido.');

  const client = getSupabase();
  const path = `${userId}/avatar.jpg`;
  const { error } = await client.storage.from(BUCKET).upload(path, bytes, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error('Não foi possível enviar a foto de perfil.');

  photoCache.delete(userId);
  pendingPhotoRequests.delete(userId);
  return obterFotoPerfil(userId, true);
}

export async function obterFotoPerfil(userId: string, forceRefresh = false) {
  if (!userId) return null;

  if (!forceRefresh) {
    const cached = photoCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) return cached.url;

    const pending = pendingPhotoRequests.get(userId);
    if (pending) return pending;
  }

  const request = (async () => {
    const client = getSupabase();
    const path = `${userId}/avatar.jpg`;
    const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
    const url = error ? null : data.signedUrl;
    savePhotoCache(userId, url);
    return url;
  })();

  pendingPhotoRequests.set(userId, request);
  try {
    return await request;
  } finally {
    if (pendingPhotoRequests.get(userId) === request) pendingPhotoRequests.delete(userId);
  }
}

export async function excluirFotoPerfil(userId: string) {
  const client = getSupabase();
  const { error } = await client.storage.from(BUCKET).remove([`${userId}/avatar.jpg`]);
  if (error) throw new Error('Não foi possível remover a foto de perfil.');
  savePhotoCache(userId, null);
  pendingPhotoRequests.delete(userId);
}
