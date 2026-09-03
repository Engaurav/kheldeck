# Design Tokens: Light Porcelain & Dark Liquid Cyber

This document details the exact token definitions for color palettes, elevation, spacing, and typography to be used across the application.

---

## 1. Color Palettes

### 🌙 Dark Liquid Cyber Palette
```typescript
export const darkTheme = {
  mode: 'dark' as const,
  colors: {
    // Canvas & Surfaces
    background: '#0B0F19',          // Deep obsidian
    backgroundSecondary: '#111827', // Slate 900
    surfaceGlass: 'rgba(17, 24, 39, 0.75)',
    surfaceGlassHover: 'rgba(31, 41, 55, 0.85)',
    surfaceGlassActive: 'rgba(55, 65, 81, 0.90)',
    modalOverlay: 'rgba(3, 7, 18, 0.80)',

    // Borders & Glass Highlights
    borderGlass: 'rgba(255, 255, 255, 0.10)',
    borderGlassHighlight: 'rgba(255, 255, 255, 0.22)', // Top edge sheen
    borderGlassFocus: 'rgba(99, 102, 241, 0.60)',

    // Typography
    textPrimary: '#F9FAFB',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0F172A',

    // Accents & Actions
    accentPrimary: '#6366F1',     // Indigo
    accentPrimaryGlow: 'rgba(99, 102, 241, 0.35)',
    accentSecondary: '#38BDF8',   // Sky Cyan
    accentSecondaryGlow: 'rgba(56, 189, 248, 0.30)',

    // Game Status Indicators
    scorePositive: '#10B981',     // Emerald
    scorePositiveBg: 'rgba(16, 185, 129, 0.15)',
    scoreNegative: '#EF4444',     // Crimson
    scoreNegativeBg: 'rgba(239, 68, 68, 0.15)',
    scoreWarning: '#F59E0B',      // Amber
    scoreWarningBg: 'rgba(245, 158, 11, 0.15)',
    dealerCrown: '#FBBF24',       // Gold
  },
  shadows: {
    glassSmall: '0 4px 12px rgba(0, 0, 0, 0.35)',
    glassMedium: '0 8px 24px rgba(0, 0, 0, 0.45)',
    glassGlow: '0 0 20px rgba(99, 102, 241, 0.25)',
  }
};
```

---

### ☀️ Light Minimal Porcelain Palette
```typescript
export const lightTheme = {
  mode: 'light' as const,
  colors: {
    // Canvas & Surfaces
    background: '#F8FAFC',          // Slate 50
    backgroundSecondary: '#FFFFFF', // Pure white
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',
    surfaceGlassHover: 'rgba(248, 250, 252, 0.95)',
    surfaceGlassActive: 'rgba(241, 245, 249, 1.0)',
    modalOverlay: 'rgba(15, 23, 42, 0.45)',

    // Borders & Glass Highlights
    borderGlass: 'rgba(15, 23, 42, 0.08)',
    borderGlassHighlight: 'rgba(255, 255, 255, 0.95)', // Top edge light catch
    borderGlassFocus: 'rgba(79, 70, 229, 0.45)',

    // Typography
    textPrimary: '#0F172A',         // Slate 900
    textSecondary: '#475569',       // Slate 600
    textMuted: '#94A3B8',           // Slate 400
    textInverse: '#F8FAFC',

    // Accents & Actions
    accentPrimary: '#4F46E5',     // Deep Indigo
    accentPrimaryGlow: 'rgba(79, 70, 229, 0.20)',
    accentSecondary: '#0284C7',   // Deep Sky
    accentSecondaryGlow: 'rgba(2, 132, 199, 0.18)',

    // Game Status Indicators
    scorePositive: '#059669',     // Deep Emerald
    scorePositiveBg: 'rgba(5, 150, 105, 0.12)',
    scoreNegative: '#DC2626',     // Bright Red
    scoreNegativeBg: 'rgba(220, 38, 38, 0.12)',
    scoreWarning: '#D97706',      // Dark Amber
    scoreWarningBg: 'rgba(217, 119, 6, 0.12)',
    dealerCrown: '#D97706',       // Amber Gold
  },
  shadows: {
    glassSmall: '0 4px 14px rgba(15, 23, 42, 0.06)',
    glassMedium: '0 10px 30px rgba(15, 23, 42, 0.10)',
    glassGlow: '0 0 20px rgba(79, 70, 229, 0.15)',
  }
};
```

---

## 2. Radii & Spacing Standards
- **Outer Card Container:** `border-radius: 20px` (or `rounded-2xl`)
- **Inner Buttons & Score Badges:** `border-radius: 12px` (or `rounded-xl`)
- **Quick-Tap Number Chips:** `border-radius: 10px` with minimum dimensions `44px x 44px`
- **Padding:** Outer container `20px` (or `p-5`), Card interiors `16px` (or `p-4`)
