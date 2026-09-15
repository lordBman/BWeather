// src/theme/ThemeProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { blendColors, colorSchemes, darkTheme, lightTheme, ThemeColors } from '../constants/colors';
import { useSettingsStore } from '../store/settingsStore';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({ colors: lightTheme, isDark: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themePreference = useSettingsStore((s) => s.theme);
  const colorScheme = useSettingsStore((s) => s.colorScheme);
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDark =
    themePreference === 'dark' || (themePreference === 'system' && systemScheme === 'dark');

  const baseColors = isDark ? darkTheme : lightTheme;
  const selectedColorScheme = colorSchemes[colorScheme] ?? colorSchemes.ocean;
  const primary = isDark ? selectedColorScheme.darkPrimary : selectedColorScheme.primary;
  const colors: ThemeColors = {
    ...baseColors,
    primary,
    primaryContainer: isDark
      ? selectedColorScheme.darkPrimaryContainer
      : selectedColorScheme.primaryContainer,
    onPrimary: isDark ? selectedColorScheme.darkOnPrimary : selectedColorScheme.onPrimary,
    secondary: isDark ? selectedColorScheme.darkSecondary : selectedColorScheme.secondary,
    secondaryContainer: isDark
      ? selectedColorScheme.darkSecondaryContainer
      : selectedColorScheme.secondaryContainer,
    tertiary: isDark ? selectedColorScheme.darkTertiary : selectedColorScheme.tertiary,
    tertiaryContainer: isDark
      ? selectedColorScheme.darkTertiaryContainer
      : selectedColorScheme.tertiaryContainer,
    surfaceElevated: blendColors(baseColors.surfaceElevated, primary, isDark ? 0.08 : 0.04),
  };

  return <ThemeContext.Provider value={{ colors, isDark }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
