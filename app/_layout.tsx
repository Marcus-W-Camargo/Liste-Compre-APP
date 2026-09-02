import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_900Black } from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/providers/AuthProvider';
import { CloudProvider } from '@/providers/CloudProvider';
import { ConnectivityProvider } from '@/providers/ConnectivityProvider';
import { AuthFlowProvider } from '@/providers/AuthFlowProvider';
import { LoadingState } from '@/components/LoadingState';
import { StatusBanners } from '@/components/StatusBanners';
import { colors } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_900Black });
  if (!fontsLoaded) return <LoadingState label="Preparando o Liste & Compre…" />;

  return (
    <SafeAreaProvider>
      <ConnectivityProvider>
        <AuthProvider>
          <CloudProvider>
            <AuthFlowProvider>
              <StatusBar style="dark" backgroundColor={colors.blue} />
              <StatusBanners />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.blue }, animation: 'slide_from_right' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="verify-signup" />
                <Stack.Screen name="recovery" />
                <Stack.Screen name="verify-recovery" />
                <Stack.Screen name="reset-password" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="lista" />
                <Stack.Screen name="compra/[listaId]" />
                <Stack.Screen name="ajuda" />
                <Stack.Screen name="privacidade" />
              </Stack>
            </AuthFlowProvider>
          </CloudProvider>
        </AuthProvider>
      </ConnectivityProvider>
    </SafeAreaProvider>
  );
}
