import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { useTheme } from '../../core/theme/ThemeContext';

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 38, showText = true }) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.container}>
      {/* High-voltage Glowing Spade + Crown Emblem */}
      <View
        style={[
          styles.iconContainer,
          {
            width: size,
            height: size,
            borderRadius: size * 0.32,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: theme.colors.accentPrimary,
            borderTopColor: '#38BDF8',
          },
        ]}
      >
        <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
          <Defs>
            <LinearGradient id="spadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#38BDF8" />
              <Stop offset="50%" stopColor="#6366F1" />
              <Stop offset="100%" stopColor="#A855F7" />
            </LinearGradient>
            <LinearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </LinearGradient>
          </Defs>
          {/* Ace of Spades Shape */}
          <Path
            d="M12 2C10.5 4.5 5 10 5 13.5C5 16 7 17.5 9.5 17.5C10.8 17.5 11.6 16.8 12 16.2C12.4 16.8 13.2 17.5 14.5 17.5C17 17.5 19 16 19 13.5C19 10 13.5 4.5 12 2Z"
            fill="url(#spadeGrad)"
          />
          {/* Stem */}
          <Path
            d="M10.5 22C11 19 11.5 17 12 16C12.5 17 13 19 13.5 22H10.5Z"
            fill="url(#spadeGrad)"
          />
          {/* Crown Accent on top of Spade */}
          <Circle cx="12" cy="7" r="1.5" fill="url(#crownGrad)" />
          <Circle cx="9" cy="9.5" r="1" fill="url(#crownGrad)" />
          <Circle cx="15" cy="9.5" r="1" fill="url(#crownGrad)" />
        </Svg>
      </View>

      {showText && (
        <View style={styles.textContainer}>
          <View style={styles.brandRow}>
            <Text style={[styles.brandName, { color: theme.colors.textPrimary }]}>
              KhelDeck
            </Text>
            <View style={[styles.proBadge, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={[styles.brandTagline, { color: theme.colors.textMuted }]}>
            Offline Card Game Tracker
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  proBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  proBadgeText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginTop: -1,
  },
});
