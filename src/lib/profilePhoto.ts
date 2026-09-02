import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getSupabase } from './supabase';

const BUCKET = 'profile-photos';

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
  return obterFotoPerfil(userId);
}

export async function obterFotoPerfil(userId: string) {
  const client = getSupabase();
  const path = `${userId}/avatar.jpg`;
  const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}

export async function excluirFotoPerfil(userId: string) {
  const client = getSupabase();
  const { error } = await client.storage.from(BUCKET).remove([`${userId}/avatar.jpg`]);
  if (error) throw new Error('Não foi possível remover a foto de perfil.');
}
