import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';

export const GamingBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#07090E' : '#F1F5F9' },
      ]}
    >
      {/* Ambient Glowing Radial Orbs */}
      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbTopLeft,
          {
            backgroundColor: isDark
              ? 'rgba(56, 189, 248, 0.12)'
              : 'rgba(56, 189, 248, 0.08)',
          },
        ]}
      />

      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbBottomRight,
          {
            backgroundColor: isDark
              ? 'rgba(99, 102, 241, 0.14)'
              : 'rgba(99, 102, 241, 0.08)',
          },
        ]}
      />

      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbCenter,
          {
            backgroundColor: isDark
              ? 'rgba(236, 72, 153, 0.06)'
              : 'rgba(236, 72, 153, 0.04)',
          },
        ]}
      />

      {/* High-tech Cyber Grid Texture (Web only) */}
      {Platform.OS === 'web' && (
        <View
          pointerEvents="none"
          style={[
            styles.gridOverlay,
            {
              backgroundImage: isDark
                ? `linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)`
                : `linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)`,
            } as any,
          ]}
        />
      )}

      {/* Content */}
      <View style={styles.contentWrapper}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1,
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 9999,
    ...Platform.select({
      web: {
        filter: 'blur(80px)',
      } as any,
    }),
  },
  orbTopLeft: {
    top: -100,
    left: -100,
    width: 360,
    height: 360,
  },
  orbBottomRight: {
    bottom: -100,
    right: -100,
    width: 400,
    height: 400,
  },
  orbCenter: {
    top: '40%',
    left: '20%',
    width: 300,
    height: 300,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    ...Platform.select({
      web: {
        backgroundSize: '28px 28px',
      } as any,
    }),
  },
});
