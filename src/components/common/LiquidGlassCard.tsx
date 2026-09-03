import React from 'react';
import { View, StyleSheet, Platform, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  highlightTop?: boolean;
  glowColor?: string;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  highlightTop = true,
  glowColor,
}) => {
  const { theme, isDark, preset, borderRadius, accentColor } = useTheme();

  const activeGlow = glowColor || accentColor;

  // Preset-specific styling matrix
  const getPresetStyles = (): { viewStyle: ViewStyle; webBoxShadow?: string } => {
    switch (preset) {
      /* 1. CLAYMORPHISM: INFLATED SOFT 3D PILLOWY SHAPES */
      case 'clay':
        return {
          viewStyle: {
            backgroundColor: isDark ? '#1C2237' : '#FFFFFF',
            borderRadius: 26,
            borderWidth: 2,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.9)',
          },
          webBoxShadow: isDark
            ? 'inset 3px 3px 6px rgba(255, 255, 255, 0.18), inset -3px -3px 6px rgba(0, 0, 0, 0.5), 10px 14px 28px rgba(0, 0, 0, 0.4)'
            : 'inset 3px 3px 6px rgba(255, 255, 255, 0.95), inset -3px -3px 6px rgba(15, 23, 42, 0.08), 10px 14px 28px rgba(99, 102, 241, 0.14)',
        };

      /* 2. CYBER MAXIMALISM: HIGH-OCTANE NEON BORDERS & GLOW HUD */
      case 'maximalism':
        return {
          viewStyle: {
            backgroundColor: isDark ? 'rgba(5, 8, 18, 0.92)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 12,
            borderWidth: 2,
            borderColor: activeGlow,
          },
          webBoxShadow: `0 0 25px ${activeGlow}50, inset 0 0 15px ${activeGlow}15, 0 10px 30px rgba(0, 0, 0, 0.7)`,
        };

      /* 3. NEO-BRUTALISM: 3PX SOLID BLACK BORDERS & HARD 5PX DROP SHADOW */
      case 'brutalism':
        return {
          viewStyle: {
            backgroundColor: isDark ? '#1F2430' : '#FFFFFF',
            borderRadius: 6,
            borderWidth: 3,
            borderColor: isDark ? '#F8FAFC' : '#0F172A',
          },
          webBoxShadow: isDark
            ? '5px 5px 0px #38BDF8'
            : '5px 5px 0px #0F172A',
        };

      /* 4. MINIMALIST PORCELAIN: RAZOR-THIN HAIRLINE BORDER & CLEAN MATTE */
      case 'minimal':
        return {
          viewStyle: {
            backgroundColor: isDark ? '#0C0F17' : '#FFFFFF',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.10)',
          },
          webBoxShadow: isDark
            ? '0 4px 14px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(15, 23, 42, 0.05)',
        };

      /* 5. LIQUID GLASS (DEFAULT): CRYSTAL TRANSLUCENT GLASS WITH 32PX BLUR & SPECULAR TOP EDGE */
      case 'glass':
      default:
        return {
          viewStyle: {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.05)'  // High optical translucency!
              : 'rgba(255, 255, 255, 0.45)', // Crystal porcelain frosted glass!
            borderRadius: 20,
            borderWidth: 1.2,
            borderTopWidth: highlightTop ? 2.2 : 1.2,
            borderColor: glowColor ? `${glowColor}60` : isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(255, 255, 255, 0.85)',
            borderTopColor: glowColor
              ? glowColor
              : isDark
              ? 'rgba(255, 255, 255, 0.65)' // Bright specular glass rim
              : '#FFFFFF',
          },
          webBoxShadow: glowColor
            ? `inset 0 1px 2px rgba(255, 255, 255, 0.35), 0 0 25px ${glowColor}40, ${isDark ? theme.shadows.glassMedium : theme.shadows.glassSmall}`
            : isDark
            ? 'inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.15)'
            : 'inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 12px 32px rgba(31, 38, 135, 0.10)',
        };
    }
  };

  const { viewStyle, webBoxShadow } = getPresetStyles();

  return (
    <View
      style={[
        styles.baseCard,
        viewStyle,
        Platform.select({
          web: {
            backdropFilter: preset === 'glass' ? 'blur(32px) saturate(190%)' : undefined,
            WebkitBackdropFilter: preset === 'glass' ? 'blur(32px) saturate(190%)' : undefined,
            boxShadow: webBoxShadow,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          } as any,
          default: {
            shadowColor: glowColor || (isDark ? '#000000' : '#0F172A'),
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isDark ? 0.45 : 0.08,
            shadowRadius: 14,
            elevation: 5,
          },
        }),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    padding: 18,
    marginVertical: 6,
  },
});
