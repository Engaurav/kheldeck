import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkLiquidTheme, lightPorcelainTheme, ThemeMode, ThemeTokens } from './tokens';

export type DesignPreset = 'glass' | 'clay' | 'maximalism' | 'minimal' | 'brutalism';

export interface ThemeConfig {
  mode: ThemeMode;
  preset: DesignPreset;
  accentColor: string;
  borderRadius: number;
}

interface PresetTypography {
  fontFamily: string;
  headingFont: string;
  letterSpacing: number;
  isUppercase: boolean;
}

interface ThemeContextType {
  theme: ThemeTokens;
  mode: ThemeMode;
  preset: DesignPreset;
  accentColor: string;
  borderRadius: number;
  typography: PresetTypography;
  isDark: boolean;
  isDrawerOpen: boolean;
  openThemeDrawer: () => void;
  closeThemeDrawer: () => void;
  setMode: (mode: ThemeMode) => void;
  setPreset: (preset: DesignPreset) => void;
  setAccentColor: (color: string) => void;
  setBorderRadius: (radius: number) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = '@gametrack_theme_config_v3';

const DEFAULT_CONFIG: ThemeConfig = {
  mode: 'dark',
  preset: 'glass',
  accentColor: '#38BDF8',
  borderRadius: 18,
};

const TYPOGRAPHY_PRESETS: Record<DesignPreset, PresetTypography> = {
  glass: {
    fontFamily: Platform.OS === 'web' ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
    headingFont: Platform.OS === 'web' ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
    letterSpacing: -0.5,
    isUppercase: false,
  },
  clay: {
    fontFamily: Platform.OS === 'web' ? '"Quicksand", "Nunito", system-ui, -apple-system, sans-serif' : 'System',
    headingFont: Platform.OS === 'web' ? '"Quicksand", "Nunito", system-ui, sans-serif' : 'System',
    letterSpacing: 0.2,
    isUppercase: false,
  },
  maximalism: {
    fontFamily: Platform.OS === 'web' ? '"JetBrains Mono", "Courier New", monospace' : 'monospace',
    headingFont: Platform.OS === 'web' ? '"JetBrains Mono", monospace' : 'monospace',
    letterSpacing: 1.2,
    isUppercase: true,
  },
  brutalism: {
    fontFamily: Platform.OS === 'web' ? '"Arial Black", Impact, system-ui, sans-serif' : 'System',
    headingFont: Platform.OS === 'web' ? '"Arial Black", Impact, sans-serif' : 'System',
    letterSpacing: 0,
    isUppercase: true,
  },
  minimal: {
    fontFamily: Platform.OS === 'web' ? 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' : 'System',
    headingFont: Platform.OS === 'web' ? 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' : 'System',
    letterSpacing: -0.3,
    isUppercase: false,
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: darkLiquidTheme,
  mode: 'dark',
  preset: 'glass',
  accentColor: '#38BDF8',
  borderRadius: 18,
  typography: TYPOGRAPHY_PRESETS.glass,
  isDark: true,
  isDrawerOpen: false,
  openThemeDrawer: () => {},
  closeThemeDrawer: () => {},
  setMode: () => {},
  setPreset: () => {},
  setAccentColor: () => {},
  setBorderRadius: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setConfig((prev) => ({ ...prev, ...parsed }));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const saveConfig = (newConfig: ThemeConfig) => {
    setConfig(newConfig);
    AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newConfig)).catch(() => {});
  };

  const setMode = (mode: ThemeMode) => {
    saveConfig({ ...config, mode });
  };

  const setPreset = (preset: DesignPreset) => {
    // Also adjust default radius based on preset
    let defaultR = 18;
    if (preset === 'clay') defaultR = 26;
    if (preset === 'brutalism') defaultR = 6;
    if (preset === 'minimal') defaultR = 10;
    saveConfig({ ...config, preset, borderRadius: defaultR });
  };

  const setAccentColor = (accentColor: string) => {
    saveConfig({ ...config, accentColor });
  };

  const setBorderRadius = (borderRadius: number) => {
    saveConfig({ ...config, borderRadius });
  };

  const toggleTheme = () => {
    const nextMode = config.mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
  };

  const openThemeDrawer = () => setIsDrawerOpen(true);
  const closeThemeDrawer = () => setIsDrawerOpen(false);

  // Derive dynamic theme tokens with custom accent color
  const baseTokens = config.mode === 'dark' ? darkLiquidTheme : lightPorcelainTheme;
  const theme: ThemeTokens = {
    ...baseTokens,
    colors: {
      ...baseTokens.colors,
      accentPrimary: config.accentColor,
      accentSecondary: config.accentColor === '#38BDF8' ? '#6366F1' : '#38BDF8',
    },
  };

  const isDark = config.mode === 'dark';
  const typography = TYPOGRAPHY_PRESETS[config.preset] || TYPOGRAPHY_PRESETS.glass;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode: config.mode,
        preset: config.preset,
        accentColor: config.accentColor,
        borderRadius: config.borderRadius,
        typography,
        isDark,
        isDrawerOpen,
        openThemeDrawer,
        closeThemeDrawer,
        setMode,
        setPreset,
        setAccentColor,
        setBorderRadius,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
