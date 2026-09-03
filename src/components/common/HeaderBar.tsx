import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { useAuth } from '../../core/auth/AuthContext';
import { Sun, Moon, BookOpen, ChevronLeft, Gamepad2, CheckCircle2 } from 'lucide-react-native';

interface HeaderBarProps {
  currentScreen: string;
  onOpenRules: () => void;
  onOpenGoogleProfile: () => void;
  onGoHome: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentScreen,
  onOpenRules,
  onOpenGoogleProfile,
  onGoHome,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const isInsideGame = currentScreen !== 'hub';

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: isDark ? 'rgba(11, 15, 25, 0.90)' : 'rgba(248, 250, 252, 0.90)',
          borderBottomColor: theme.colors.borderGlass,
        },
        Platform.select({
          web: {
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          } as any,
        }),
      ]}
    >
      <View style={styles.leftNav}>
        {isInsideGame ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onGoHome}
            style={[
              styles.backToHubBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
                borderColor: theme.colors.borderGlass,
              },
            ]}
          >
            <ChevronLeft size={18} color={theme.colors.textPrimary} />
            <Text style={[styles.backToHubText, { color: theme.colors.textPrimary }]}>
              All Games
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onGoHome}
            style={styles.logoContainer}
          >
            <View style={[styles.brandIcon, { backgroundColor: theme.colors.accentPrimary }]}>
              <Gamepad2 size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Game Track</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Offline Scorekeeper
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actions}>
        {/* Rules Guide Button */}
        <TouchableOpacity
          onPress={onOpenRules}
          style={[
            styles.actionButton,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
              borderColor: theme.colors.borderGlass,
            },
          ]}
          accessibilityLabel="Rules Guide"
        >
          <BookOpen size={18} color={theme.colors.accentSecondary} />
        </TouchableOpacity>

        {/* Dynamic Theme Switcher */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.actionButton,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
              borderColor: theme.colors.borderGlass,
            },
          ]}
          accessibilityLabel="Toggle Light/Dark Theme"
        >
          {isDark ? (
            <Sun size={18} color="#FBBF24" />
          ) : (
            <Moon size={18} color="#6366F1" />
          )}
        </TouchableOpacity>

        {/* Google User Profile Button */}
        <TouchableOpacity
          onPress={onOpenGoogleProfile}
          style={[
            styles.googleProfileBtn,
            {
              backgroundColor: isAuthenticated
                ? isDark
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(5, 150, 105, 0.10)'
                : '#FFFFFF',
              borderColor: isAuthenticated ? theme.colors.scorePositive : '#CBD5E1',
            },
          ]}
        >
          {isAuthenticated ? (
            <View style={styles.signedInChip}>
              <View style={styles.googleMiniBadge}>
                <Text style={styles.googleMiniG}>G</Text>
              </View>
              <Text style={[styles.profileBtnText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {user?.displayName}
              </Text>
            </View>
          ) : (
            <View style={styles.signedInChip}>
              <View style={styles.googleMiniBadge}>
                <Text style={styles.googleMiniG}>G</Text>
              </View>
              <Text style={[styles.profileBtnText, { color: '#1F2937' }]}>
                Sign In
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leftNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  backToHubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  backToHubText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleProfileBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signedInChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: 110,
  },
  googleMiniBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleMiniG: {
    fontSize: 12,
    fontWeight: '900',
    color: '#4285F4',
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
