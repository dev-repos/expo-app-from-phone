import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { useColorScheme } from 'react-native';

// One palette per scheme. Navigation (headers, modals) and screens both read from here,
// so the app looks the same everywhere. Splash colours in app.json match `background`.
const light = {
  background: '#F6F7F4',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  primary: '#16A34A',
  onPrimary: '#FFFFFF',
  danger: '#DC2626',
};

const dark: typeof light = {
  background: '#0B0F0D',
  card: '#161B18',
  text: '#F3F4F6',
  muted: '#9CA3AF',
  border: '#2A312D',
  primary: '#22C55E',
  onPrimary: '#052E16',
  danger: '#F87171',
};

export type AppColors = typeof light;

export function useAppColors(): AppColors {
  return useColorScheme() === 'dark' ? dark : light;
}

export function useNavigationTheme(): Theme {
  const scheme = useColorScheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const palette = scheme === 'dark' ? dark : light;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.primary,
      background: palette.background,
      card: palette.background,
      text: palette.text,
      border: palette.border,
      notification: palette.danger,
    },
  };
}

const DARK_TEXT = '#111827';
const LIGHT_TEXT = '#FFFFFF';

function luminance(hex: string) {
  const value = parseInt(hex.replace('#', ''), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

// Text colour for content drawn on a habit colour: white while it meets the 3:1 contrast WCAG asks
// of bold text, near-black otherwise. Keeps names legible on light fills like yellow and green.
export function textOn(hex: string) {
  const contrastWhite = 1.05 / (luminance(hex) + 0.05);
  return contrastWhite >= 3 ? LIGHT_TEXT : DARK_TEXT;
}
