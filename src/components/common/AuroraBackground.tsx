import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { aceternityKeyframes } from '../../core/theme/aceternity.css';

export const AuroraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark, preset, accentColor } = useTheme();

  // Background color depending on preset
  const getBackgroundColor = () => {
    switch (preset) {
      case 'clay':
        return isDark ? '#141829' : '#EAF0F8';
      case 'maximalism':
        return isDark ? '#020409' : '#F1F5F9';
      case 'brutalism':
        return isDark ? '#121316' : '#FFFDF5';
      case 'minimal':
        return isDark ? '#09090B' : '#FAFAFA';
      case 'glass':
      default:
        return isDark ? '#040711' : '#F1F5F9';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {/* Inject Aceternity CSS on Web */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{ __html: aceternityKeyframes }} />
      )}

      {/* 1. LIQUID GLASS BACKGROUND: VIBRANT AURORA SPHERES SHINING THROUGH GLASS */}
      {preset === 'glass' && (
        <>
          {/* Top Spotlight */}
          <View
            pointerEvents="none"
            style={[
              styles.spotlight,
              Platform.select({
                web: {
                  background: isDark
                    ? `radial-gradient(ellipse 85% 60% at 50% -10%, ${accentColor}40, rgba(99, 102, 241, 0.25) 45%, transparent 75%)`
                    : `radial-gradient(ellipse 85% 60% at 50% -10%, ${accentColor}25, rgba(99, 102, 241, 0.12) 45%, transparent 75%)`,
                } as any,
              }),
            ]}
          />
          {/* Glowing Orb 1 (Underneath Hero Card - Cyan) */}
          <View
            pointerEvents="none"
            style={[
              styles.auroraOrb,
              styles.glassOrb1,
              { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(56, 189, 248, 0.35)' },
            ]}
          />
          {/* Glowing Orb 2 (Middle Cards - Violet) */}
          <View
            pointerEvents="none"
            style={[
              styles.auroraOrb,
              styles.glassOrb2,
              { backgroundColor: isDark ? 'rgba(168, 85, 247, 0.45)' : 'rgba(168, 85, 247, 0.35)' },
            ]}
          />
          {/* Glowing Orb 3 (Bottom Cards - Emerald) */}
          <View
            pointerEvents="none"
            style={[
              styles.auroraOrb,
              styles.glassOrb3,
              { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.25)' },
            ]}
          />
          {/* Glowing Orb 4 (Center - Rose) */}
          <View
            pointerEvents="none"
            style={[
              styles.auroraOrb,
              {
                top: '50%',
                left: '20%',
                width: 380,
                height: 380,
                backgroundColor: isDark ? 'rgba(244, 63, 94, 0.35)' : 'rgba(244, 63, 94, 0.25)',
              },
            ]}
          />
          {/* Dot Matrix Pattern */}
          {Platform.OS === 'web' && (
            <View
              pointerEvents="none"
              style={[
                styles.dotMatrix,
                {
                  backgroundImage: isDark
                    ? `radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px)`
                    : `radial-gradient(rgba(15, 23, 42, 0.09) 1px, transparent 1px)`,
                } as any,
              ]}
            />
          )}
        </>
      )}

      {/* 2. CLAYMORPHISM BACKGROUND: SOFT MARSHMALLOW PASTEL CLOUDS */}
      {preset === 'clay' && (
        <>
          <View
            pointerEvents="none"
            style={[
              styles.auroraOrb,
              {
                top: -50,
                left: '10%',
                width: 450,
                height: 450,
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(199, 210, 254, 0.6)',
              },
            ]}
          />
          <View
            pointerEvents="none"
            style={[
              styles.auroraOrb,
              {
                bottom: -50,
                right: '10%',
                width: 450,
                height: 450,
                backgroundColor: isDark ? 'rgba(236, 72, 153, 0.12)' : 'rgba(253, 230, 138, 0.5)',
              },
            ]}
          />
        </>
      )}

      {/* 3. CYBER MAXIMALISM BACKGROUND: HIGH-TECH NEON MATRIX GRID LINES */}
      {preset === 'maximalism' && (
        <>
          <View
            pointerEvents="none"
            style={[
              styles.spotlight,
              Platform.select({
                web: {
                  background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accentColor}30, transparent 75%)`,
                } as any,
              }),
            ]}
          />
          {Platform.OS === 'web' && (
            <View
              pointerEvents="none"
              style={[
                styles.gridOverlay,
                {
                  backgroundImage: isDark
                    ? `linear-gradient(${accentColor}20 1px, transparent 1px), linear-gradient(90deg, ${accentColor}20 1px, transparent 1px)`
                    : `linear-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px)`,
                } as any,
              ]}
            />
          )}
        </>
      )}

      {/* 4. NEO-BRUTALISM BACKGROUND: RETRO POP DOTS */}
      {preset === 'brutalism' && Platform.OS === 'web' && (
        <View
          pointerEvents="none"
          style={[
            styles.dotMatrix,
            {
              backgroundSize: '20px 20px',
              backgroundImage: isDark
                ? `radial-gradient(#FACC15 1.8px, transparent 1.8px)`
                : `radial-gradient(#0F172A 1.8px, transparent 1.8px)`,
            } as any,
          ]}
        />
      )}

      {/* 5. MINIMALIST: PURE MONOLITH (NO BACKGROUND NOISE) */}

      {/* Main Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  spotlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 460,
    zIndex: 0,
  },
  auroraOrb: {
    position: 'absolute',
    borderRadius: 9999,
    ...Platform.select({
      web: {
        filter: 'blur(65px)',
      } as any,
    }),
  },
  glassOrb1: {
    top: 40,
    left: '-5%',
    width: 440,
    height: 440,
  },
  glassOrb2: {
    top: '35%',
    right: '-5%',
    width: 440,
    height: 440,
  },
  glassOrb3: {
    bottom: 80,
    left: '15%',
    width: 420,
    height: 420,
  },
  dotMatrix: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      web: {
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, #000 65%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, #000 65%, transparent 100%)',
      } as any,
    }),
    zIndex: 0,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      web: {
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, #000 65%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, #000 65%, transparent 100%)',
      } as any,
    }),
    zIndex: 0,
  },
});
