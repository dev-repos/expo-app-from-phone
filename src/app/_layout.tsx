import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { HabitsProvider } from '@/habits/habits-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <HabitsProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Habits' }} />
          <Stack.Screen name="add-habit" options={{ title: 'New habit', presentation: 'modal' }} />
        </Stack>
      </HabitsProvider>
    </ThemeProvider>
  );
}
