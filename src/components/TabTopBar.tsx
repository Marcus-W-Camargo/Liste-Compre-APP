import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { AppText } from './AppText';
import { useAuth } from '@/providers/AuthProvider';
import { obterFotoPerfil } from '@/lib/profilePhoto';
import { colors, fonts } from '@/theme';

type TabTopBarProps = {
  showGreeting?: boolean;
  photoUri?: string | null;
};

export function TabTopBar({ showGreeting = false, photoUri }: TabTopBarProps) {
  const { user, name } = useAuth();
  const [loadedPhoto, setLoadedPhoto] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (photoUri !== undefined) return;

      let active = true;
      if (!user?.id) {
        setLoadedPhoto(null);
        return () => {
          active = false;
        };
      }

      void obterFotoPerfil(user.id)
        .then((url) => {
          if (active) setLoadedPhoto(url);
        })
        .catch(() => {
          if (active) setLoadedPhoto(null);
        });

      return () => {
        active = false;
      };
    }, [photoUri, user?.id]),
  );

  const photo = photoUri !== undefined ? photoUri : loadedPhoto;

  return (
    <View style={styles.topRow}>
      <Image
        accessibilityLabel="Liste & Compre"
        source={require('../assets/ListeLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.accountArea}>
        {showGreeting ? (
          <AppText numberOfLines={1} style={styles.greeting}>
            Olá{name ? `, ${name.split(' ')[0]}` : ''}
          </AppText>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Minha conta"
          onPress={() => router.push('/(tabs)/conta')}
          style={({ pressed }) => [styles.accountButton, pressed && styles.accountPressed]}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.accountPhoto} />
          ) : (
            <AppText style={styles.accountFallback}>👤</AppText>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 4,
  },
  logo: { width: 150, height: 84 },
  accountArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    flex: 1,
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textAlign: 'right',
    flexShrink: 1,
  },
  accountButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colors.navy,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  accountPhoto: { width: '100%', height: '100%' },
  accountFallback: { fontSize: 24 },
  accountPressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
});
