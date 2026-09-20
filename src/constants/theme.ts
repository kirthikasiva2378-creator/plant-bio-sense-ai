/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#172117',
    background: '#F7FAF7',
    backgroundElement: '#E8F5E9',
    backgroundSelected: '#C8E6C9',
    textSecondary: '#667366',
    primary: '#1B5E20',
    secondary: '#2E7D32',
    accent: '#66BB6A',
    softGreen: '#E8F5E9',
    tint: '#1B5E20',
    card: '#FFFFFF',
    border: '#E2EBE2',
    warningBg: '#FFF8E1',
    warningText: '#E65100',
  },
  dark: {
    text: '#E8F5E9',
    background: '#0B140C',
    backgroundElement: '#162618',
    backgroundSelected: '#1F3822',
    textSecondary: '#94A895',
    primary: '#4CAF50',
    secondary: '#66BB6A',
    accent: '#81C784',
    softGreen: '#182C1B',
    tint: '#4CAF50',
    card: '#122014',
    border: '#203623',
    warningBg: '#3E2723',
    warningText: '#FFB74D',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
