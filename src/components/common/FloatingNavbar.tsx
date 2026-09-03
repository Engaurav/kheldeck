import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { useAuth } from '../../core/auth/AuthContext';
import { ChevronLeft, Palette, Users } from 'lucide-react-native';
import { BrandLogo } from './BrandLogo';

interface FloatingNavbarProps {
  currentScreen: string;
  onOpenRules: () => void;
  onOpenGoogleProfile: () => void;
  onOpenPlayers?: () => void;
  onGoHome: () => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  currentScreen,
  onOpenGoogleProfile,
  onOpenPlayers,
  onGoHome,
}) => {
  const { theme, isDark, openThemeDrawer, preset, accentColor } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const isInsideGame = currentScreen !== 'hub';

  const presetLabels: Record<string, string> = {
    glass: '💧 Glass',
    clay: '🎨 Clay',
    maximalism: '⚡ Maximal',
    minimal: '🏛️ Minimal',
    brutalism: '🕹️ Brutal',
  };

  return (
    <View
      style={[
        styles.topBarWrapper,
        {
          backgroundColor: isDark
            ? 'rgba(7, 10, 19, 0.75)'
            : 'rgba(255, 255, 255, 0.82)',
          borderBottomColor: isDark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(15, 23, 42, 0.08)',
        },
        Platform.select({
          web: {
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: isDark
              ? '0 4px 24px rgba(0, 0, 0, 0.45)'
              : '0 4px 20px rgba(15, 23, 42, 0.06)',
          } as any,
        }),
      ]}
    >
      <View style={styles.topBarContent}>
        {/* Left Section: Brand Logo or Back to Games */}
        {isInsideGame ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onGoHome}
            style={[
              styles.backChip,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                borderColor: theme.colors.borderGlass,
              },
            ]}
          >
            <ChevronLeft size={16} color={theme.colors.textPrimary} />
            <Text style={[styles.backChipText, { color: theme.colors.textPrimary }]}>
              All Games
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.8} onPress={onGoHome}>
            <BrandLogo size={34} showText={true} />
          </TouchableOpacity>
        )}

        {/* Right Section: Theme Studio & Google Profile */}
        <View style={styles.rightGroup}>
          {/* Global Players Directory Button */}
          {onOpenPlayers && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onOpenPlayers}
              style={[
                styles.playersPill,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                  borderColor: theme.colors.borderGlass,
                },
              ]}
            >
              <Users size={14} color={theme.colors.textPrimary} />
              <Text style={[styles.playersPillText, { color: theme.colors.textPrimary }]}>
                Players
              </Text>
            </TouchableOpacity>
          )}

          {/* AESTHETICS STUDIO DRAWER BUTTON */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openThemeDrawer}
            style={[
              styles.themePill,
              {
                backgroundColor: isDark ? `${accentColor}20` : `${accentColor}12`,
                borderColor: accentColor,
              },
            ]}
          >
            <Palette size={14} color={accentColor} />
            <Text style={[styles.themePillText, { color: isDark ? accentColor : theme.colors.textPrimary }]}>
              {presetLabels[preset] || 'Theme'}
            </Text>
          </TouchableOpacity>

          {/* Google Account Profile Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenGoogleProfile}
            style={[
              styles.googlePill,
              {
                backgroundColor: isAuthenticated
                  ? isDark
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(5, 150, 105, 0.10)'
                  : isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : '#FFFFFF',
                borderColor: isAuthenticated ? theme.colors.scorePositive : theme.colors.borderGlass,
              },
            ]}
          >
            {isAuthenticated && user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.googleAvatar} />
            ) : user?.authProvider === 'guest' ? (
              <View style={[styles.googleGContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
                <Text style={{ fontSize: 11 }}>👤</Text>
              </View>
            ) : (
              <View style={styles.googleGContainer}>
                <Text style={styles.googleGText}>G</Text>
              </View>
            )}
            <Text
              style={[
                styles.googlePillText,
                { color: theme.colors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {user?.authProvider === 'guest' ? 'Guest' : isAuthenticated ? user?.displayName : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBarWrapper: {
    width: '100%',
    borderBottomWidth: 1,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  backChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  backChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playersPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  playersPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  themePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.2,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  googlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: 130,
  },
  googleAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  googleGContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleGText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#4285F4',
  },
  googlePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
