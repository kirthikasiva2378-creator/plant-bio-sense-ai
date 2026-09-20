import { DarkTheme, DefaultTheme, ThemeProvider, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { CropsProvider } from '@/context/crops-context';

SplashScreen.preventAutoHideAsync();

function InitialRouteGuard({ children }: { children: React.ReactNode }) {
  const { isOnboarded, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup =
      segments[0] === 'landing' ||
      segments[0] === 'signup' ||
      segments[0] === 'login';

    if (!isOnboarded && !inAuthGroup) {
      router.replace('/landing');
    }
  }, [isOnboarded, isLoading, segments]);

  return <>{children}</>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <CropsProvider>
          <InitialRouteGuard>
            <AnimatedSplashOverlay />
            <AppTabs />
          </InitialRouteGuard>
        </CropsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
