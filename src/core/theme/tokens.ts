export type ThemeMode = 'dark' | 'light';

export interface ThemeTokens {
  mode: ThemeMode;
  colors: {
    // Surfaces (Shadcn Zinc + Frosted Glass)
    background: string;
    backgroundSecondary: string;
    surfaceGlass: string;
    surfaceGlassElevated: string;
    surfaceGlassHover: string;
    modalOverlay: string;

    // Borders & Specular Sheen
    borderGlass: string;
    borderGlassHighlight: string;
    borderGlassFocus: string;

    // Typography
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string;

    // Accents & Gradients
    accentPrimary: string;
    accentPrimaryGlow: string;
    accentSecondary: string;
    accentSecondaryGlow: string;

    // Gaming Badges & Scoring
    scorePositive: string;
    scorePositiveBg: string;
    scoreNegative: string;
    scoreNegativeBg: string;
    scoreWarning: string;
    scoreWarningBg: string;
    dealerCrown: string;
  };
  shadows: {
    glassSmall: string;
    glassMedium: string;
    glassGlow: string;
    neonGlow: (color: string) => string;
  };
}

export const darkLiquidTheme: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: '#07090E',             // Deepest obsidian void
    backgroundSecondary: '#0E131F',    // Zinc/navy depth
    surfaceGlass: 'rgba(15, 23, 42, 0.68)',  // Translucent frosted slate
    surfaceGlassElevated: 'rgba(22, 32, 54, 0.85)',
    surfaceGlassHover: 'rgba(30, 41, 59, 0.90)',
    modalOverlay: 'rgba(3, 7, 18, 0.85)',

    borderGlass: 'rgba(255, 255, 255, 0.08)',
    borderGlassHighlight: 'rgba(255, 255, 255, 0.24)', // Specular top light catch
    borderGlassFocus: 'rgba(56, 189, 248, 0.70)',

    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#07090E',

    accentPrimary: '#6366F1',           // Electric Indigo
    accentPrimaryGlow: 'rgba(99, 102, 241, 0.40)',
    accentSecondary: '#38BDF8',         // Cyber Cyan
    accentSecondaryGlow: 'rgba(56, 189, 248, 0.35)',

    scorePositive: '#10B981',           // Radiant Emerald
    scorePositiveBg: 'rgba(16, 185, 129, 0.16)',
    scoreNegative: '#F43F5E',           // Rose Crimson
    scoreNegativeBg: 'rgba(244, 63, 94, 0.16)',
    scoreWarning: '#F59E0B',            // Amber
    scoreWarningBg: 'rgba(245, 158, 11, 0.16)',
    dealerCrown: '#FBBF24',
  },
  shadows: {
    glassSmall: '0 4px 16px 0 rgba(0, 0, 0, 0.35)',
    glassMedium: '0 8px 32px 0 rgba(0, 0, 0, 0.50)',
    glassGlow: '0 0 24px rgba(99, 102, 241, 0.35)',
    neonGlow: (color: string) => `0 0 20px ${color}60`,
  },
};

export const lightPorcelainTheme: ThemeTokens = {
  mode: 'light',
  colors: {
    background: '#F1F5F9',             // Modern crisp slate-100
    backgroundSecondary: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.82)', // Frosted porcelain
    surfaceGlassElevated: 'rgba(255, 255, 255, 0.95)',
    surfaceGlassHover: 'rgba(248, 250, 252, 0.98)',
    modalOverlay: 'rgba(15, 23, 42, 0.45)',

    borderGlass: 'rgba(15, 23, 42, 0.08)',
    borderGlassHighlight: 'rgba(255, 255, 255, 0.95)',
    borderGlassFocus: 'rgba(79, 70, 229, 0.60)',

    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#F8FAFC',

    accentPrimary: '#4F46E5',           // Deep Indigo
    accentPrimaryGlow: 'rgba(79, 70, 229, 0.20)',
    accentSecondary: '#0284C7',         // Deep Sky
    accentSecondaryGlow: 'rgba(2, 132, 199, 0.20)',

    scorePositive: '#059669',
    scorePositiveBg: 'rgba(5, 150, 105, 0.12)',
    scoreNegative: '#E11D48',
    scoreNegativeBg: 'rgba(225, 29, 72, 0.12)',
    scoreWarning: '#D97706',
    scoreWarningBg: 'rgba(217, 119, 6, 0.12)',
    dealerCrown: '#D97706',
  },
  shadows: {
    glassSmall: '0 4px 16px 0 rgba(15, 23, 42, 0.06)',
    glassMedium: '0 8px 30px 0 rgba(15, 23, 42, 0.10)',
    glassGlow: '0 0 20px rgba(79, 70, 229, 0.15)',
    neonGlow: (color: string) => `0 0 16px ${color}30`,
  },
};
