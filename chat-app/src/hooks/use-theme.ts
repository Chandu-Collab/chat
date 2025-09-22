'use client';

import { useTheme as useThemeContext } from '@/contexts/theme-context';

// Re-export the theme hook for easier imports
export const useTheme = useThemeContext;

// Custom hooks for specific theme utilities
export function useIsDark() {
  const { actualTheme } = useThemeContext();
  return actualTheme === 'dark';
}

export function useIsLight() {
  const { actualTheme } = useThemeContext();
  return actualTheme === 'light';
}

export function useThemeColors() {
  const { actualTheme } = useThemeContext();
  
  return {
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
    background: actualTheme === 'dark' ? 'bg-gray-900' : 'bg-white',
    surface: actualTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
    text: actualTheme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    border: actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    hover: actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
  };
}