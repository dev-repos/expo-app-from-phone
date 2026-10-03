import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';

import { HabitsProvider, useHabits } from '@/habits/habits-context';
import { useNavigationTheme } from '@/theme/colors';

// Keep the splash up until saved habits are read, so the list appears without a loading flash.
SplashScreen.preventAutoHideAsync().catch(() => {});

function HideSplashWhenLoaded({ children }: { children: ReactNode }) {
  const { loaded } = useHabits();
  useEffect(() => {
    if (loaded) SplashScreen.hide();
  }, [loaded]);
  return children;
}

export default function RootLayout() {
  return (
    <ThemeProvider value={useNavigationTheme()}>
      <StatusBar style="auto" />
      <HabitsProvider>
        <HideSplashWhenLoaded>
          <Stack screenOptions={{ headerShadowVisible: false }}>
            <Stack.Screen name="index" options={{ title: 'Habits' }} />
            <Stack.Screen name="add-habit" options={{ title: 'New habit', presentation: 'modal' }} />
          </Stack>
        </HideSplashWhenLoaded>
      </HabitsProvider>
    </ThemeProvider>
  );
}
