import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme } from '../core/theme/ThemeContext';
import { useAuth } from '../core/auth/AuthContext';
import { LiquidGlassCard } from '../components/common/LiquidGlassCard';
import { ArrowRight, Users, Play, ShieldCheck, Flame, Sparkles, Trophy, Crown, Coins, Dices, ChevronRight, BookOpen } from 'lucide-react-native';

interface GamesHubScreenProps {
  onSelectGame: (gameId: string) => void;
  hasActiveCallBreak: boolean;
  onResumeCallBreak: () => void;
  onOpenGoogleAuth: () => void;
  onOpenRules: () => void;
}

export const GamesHubScreen: React.FC<GamesHubScreenProps> = ({
  onSelectGame,
  hasActiveCallBreak,
  onResumeCallBreak,
  onOpenGoogleAuth,
  onOpenRules,
}) => {
  const { theme, isDark, typography, preset, accentColor } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | 'trick' | 'casino' | 'universal'>('all');

  const handleLaunch = (gameId: string) => {
    if (gameId === 'callbreak') {
      onSelectGame('callbreak');
    } else if (gameId === 'teenpatti') {
      onSelectGame('teenpatti');
    } else {
      onSelectGame('universal');
    }
  };

  const getLaunchBtnStyle = (baseColor: string): any => {
    if (preset === 'brutalism') {
      return {
        backgroundColor: isDark ? '#FACC15' : '#0F172A',
        borderWidth: 2.5,
        borderColor: isDark ? '#FFFFFF' : '#000000',
        ...(Platform.OS === 'web' ? { boxShadow: isDark ? '4px 4px 0px #38BDF8' : '4px 4px 0px #000000' } : {}),
        borderRadius: 6,
      };
    }
    if (preset === 'clay') {
      return {
        backgroundColor: baseColor,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
        ...(Platform.OS === 'web' ? { boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.6), 4px 8px 16px rgba(0,0,0,0.25)' } : {}),
      };
    }
    if (preset === 'maximalism') {
      return {
        backgroundColor: baseColor,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        ...(Platform.OS === 'web' ? { boxShadow: `0 0 20px ${baseColor}` } : {}),
      };
    }
    if (preset === 'minimal') {
      return {
        backgroundColor: isDark ? '#1E293B' : '#0F172A',
        borderRadius: 8,
      };
    }
    return {
      backgroundColor: baseColor,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
      ...(Platform.OS === 'web' ? { boxShadow: `0 0 20px ${baseColor}50` } : {}),
    };
  };

  const dynamicHeading = {
    fontFamily: typography.headingFont,
    letterSpacing: typography.letterSpacing,
    textTransform: typography.isUppercase ? ('uppercase' as const) : ('none' as const),
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.heroBadgeRow}>
          <View style={[styles.pulseDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.heroBadgeText, { color: theme.colors.accentSecondary }]}>
            KHELDECK • 100% OFFLINE SCORE ENGINE
          </Text>
        </View>

        <Text style={[styles.heroMainTitle, { color: theme.colors.textPrimary }, dynamicHeading]}>
          Track Any Game.
        </Text>

        <Text style={[styles.heroSubText, { color: theme.colors.textSecondary }]}>
          Offline scorekeeper with authentic integer rules, live pot counter, turn-by-turn wizard, and Google Docs backup.
        </Text>
      </View>

      {/* Active Call Break In-Progress Banner (If Any) */}
      {hasActiveCallBreak && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onResumeCallBreak}
          style={[
            styles.resumeBanner,
            {
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.08)',
              borderColor: '#38BDF8',
            },
          ]}
        >
          <View style={styles.resumeLeft}>
            <View style={[styles.pulseDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.resumeText, { color: theme.colors.textPrimary }]}>
              Call Break match in progress (Tap to resume)
            </Text>
          </View>
          <Text style={[styles.resumeAction, { color: '#38BDF8' }]}>
            Resume ➔
          </Text>
        </TouchableOpacity>
      )}

      {/* Filter Tabs Bar (Shadcn Tabs) */}
      <View style={styles.tabsRow}>
        {[
          { id: 'all', label: 'All Bento Games' },
          { id: 'trick', label: '♠️ Trick Taking' },
          { id: 'casino', label: '🃏 Casino / Flash' },
          { id: 'universal', label: '🎲 Universal' },
        ].map((tab) => {
          const isSelected = activeCategory === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveCategory(tab.id as any)}
              style={[
                styles.tabItem,
                {
                  backgroundColor: isSelected
                    ? theme.colors.accentPrimary
                    : isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.04)',
                  borderColor: isSelected
                    ? theme.colors.accentPrimary
                    : theme.colors.borderGlass,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isSelected ? '#FFFFFF' : theme.colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ACETERNITY BENTO GRID */}
      <View style={styles.bentoGrid}>
        {/* BENTO 1: FEATURED CALL BREAK HERO CARD (Double-Slot / Full-Width) */}
        {(activeCategory === 'all' || activeCategory === 'trick') && (
          <LiquidGlassCard
            glowColor="#38BDF8"
            style={[styles.heroBentoCard, { borderColor: 'rgba(56, 189, 248, 0.4)' }]}
          >
            {/* Top Tag & Status */}
            <View style={styles.bentoHeaderRow}>
              <View style={styles.bentoBadge}>
                <Text style={styles.bentoBadgeText}>♠️ FEATURED • 13 ROUNDS OFFLINE ENGINE</Text>
              </View>

              <View style={styles.headerActionGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onOpenRules}
                  style={[styles.callBreakRulesBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderColor: theme.colors.borderGlass }]}
                >
                  <BookOpen size={12} color={accentColor} />
                  <Text style={[styles.callBreakRulesText, { color: theme.colors.textPrimary }]}>Rules</Text>
                </TouchableOpacity>

                <View style={[styles.liveStatusPill, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <View style={[styles.pulseDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.liveStatusText, { color: '#10B981' }]}>READY</Text>
                </View>
              </View>
            </View>

            {/* Title & Sub */}
            <Text style={[styles.bentoHeroTitle, { color: theme.colors.textPrimary }, dynamicHeading]}>
              Call Break 13 Rounds
            </Text>
            <Text style={[styles.bentoHeroSub, { color: theme.colors.textSecondary }]}>
              Authentic offline integer scoring, over-trick bust penalty ($R &gt; C+2 \implies -pts$), live remaining cards counter &amp; 13-round matrix table.
            </Text>

            {/* Feature Pills */}
            <View style={styles.bentoChipsWrap}>
              {['4 Players', '13 Rounds', 'Integer Scoring (10x)', 'Over-trick Penalty', 'Turn Wizard'].map((chip, idx) => (
                <View key={idx} style={[styles.bentoChip, { backgroundColor: isDark ? `${accentColor}18` : `${accentColor}12` }]}>
                  <Text style={[styles.bentoChipText, { color: accentColor }]}>
                    {chip}
                  </Text>
                </View>
              ))}
            </View>

            {/* Dynamic Preset Action Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleLaunch('callbreak')}
              style={[styles.shimmerLaunchBtn, getLaunchBtnStyle(accentColor)]}
            >
              <Text style={[styles.shimmerBtnText, { color: preset === 'brutalism' && isDark ? '#000000' : '#FFFFFF' }, dynamicHeading]}>
                Play Call Break ➔
              </Text>
              <ArrowRight size={18} color={preset === 'brutalism' && isDark ? '#000000' : '#FFFFFF'} />
            </TouchableOpacity>
          </LiquidGlassCard>
        )}

        {/* BENTO 2 & 3 (Side-by-Side Modern Grid) */}
        <View style={styles.gridRow}>
          {/* TEEN PATTI */}
          {(activeCategory === 'all' || activeCategory === 'casino') && (
            <LiquidGlassCard glowColor="#F43F5E" style={styles.bentoHalfCard}>
              <View style={styles.miniCardHeader}>
                <View style={[styles.miniIconBadge, { backgroundColor: 'rgba(244, 63, 94, 0.2)' }]}>
                  <Text style={{ fontSize: 20 }}>🃏</Text>
                </View>
                <View style={[styles.playerCountPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                  <Users size={11} color={theme.colors.textMuted} />
                  <Text style={[styles.playerCountText, { color: theme.colors.textSecondary }]}>2 - 6</Text>
                </View>
              </View>

              <Text style={[styles.miniCardTitle, { color: theme.colors.textPrimary }, dynamicHeading]}>
                Teen Patti
              </Text>
              <Text style={[styles.miniCardSub, { color: theme.colors.textMuted }]}>
                3-Card Casino Flash
              </Text>
              <Text style={[styles.miniCardDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                Live pot counter, boot amounts (10/20/50), chaal multipliers, pack folds.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleLaunch('teenpatti')}
                style={[styles.miniActionBtn, getLaunchBtnStyle('#F43F5E')]}
              >
                <Text style={[styles.miniActionBtnText, { color: preset === 'brutalism' && isDark ? '#000000' : '#FFFFFF' }, dynamicHeading]}>
                  Play Pot ➔
                </Text>
              </TouchableOpacity>
            </LiquidGlassCard>
          )}

          {/* UNIVERSAL SCOREKEEPER */}
          {(activeCategory === 'all' || activeCategory === 'universal') && (
            <LiquidGlassCard glowColor="#10B981" style={styles.bentoHalfCard}>
              <View style={styles.miniCardHeader}>
                <View style={[styles.miniIconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Text style={{ fontSize: 20 }}>🎲</Text>
                </View>
                <View style={[styles.playerCountPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                  <Users size={11} color={theme.colors.textMuted} />
                  <Text style={[styles.playerCountText, { color: theme.colors.textSecondary }]}>2 - 8</Text>
                </View>
              </View>

              <Text style={[styles.miniCardTitle, { color: theme.colors.textPrimary }, dynamicHeading]}>
                Universal Tracker
              </Text>
              <Text style={[styles.miniCardSub, { color: theme.colors.textMuted }]}>
                Uno, Rummy &amp; Custom
              </Text>
              <Text style={[styles.miniCardDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                Type any game name, add friends, and track live rounds with cumulative scoreboard.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleLaunch('universal')}
                style={[styles.miniActionBtn, getLaunchBtnStyle('#10B981')]}
              >
                <Text style={[styles.miniActionBtnText, { color: preset === 'brutalism' && isDark ? '#000000' : '#FFFFFF' }, dynamicHeading]}>
                  Track Game ➔
                </Text>
              </TouchableOpacity>
            </LiquidGlassCard>
          )}
        </View>

        {/* BENTO 4, 5, 6 (Additional Cards) */}
        <View style={styles.gridRow}>
          {/* INDIAN RUMMY */}
          {(activeCategory === 'all' || activeCategory === 'trick') && (
            <LiquidGlassCard glowColor="#A855F7" style={styles.bentoHalfCard}>
              <View style={styles.miniCardHeader}>
                <View style={[styles.miniIconBadge, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                  <Text style={{ fontSize: 20 }}>♣️</Text>
                </View>
                <View style={[styles.playerCountPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                  <Users size={11} color={theme.colors.textMuted} />
                  <Text style={[styles.playerCountText, { color: theme.colors.textSecondary }]}>2 - 6</Text>
                </View>
              </View>

              <Text style={[styles.miniCardTitle, { color: theme.colors.textPrimary }, dynamicHeading]}>
                Indian Rummy
              </Text>
              <Text style={[styles.miniCardSub, { color: theme.colors.textMuted }]}>
                13-Card Deals &amp; Pool
              </Text>
              <Text style={[styles.miniCardDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                Pool 101/201, auto first drop (20), middle drop (40), full count 80.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleLaunch('universal')}
                style={[styles.miniActionBtn, getLaunchBtnStyle('#A855F7')]}
              >
                <Text style={[styles.miniActionBtnText, { color: preset === 'brutalism' && isDark ? '#000000' : '#FFFFFF' }, dynamicHeading]}>
                  Launch Rummy ➔
                </Text>
              </TouchableOpacity>
            </LiquidGlassCard>
          )}

          {/* TEXAS HOLDEM */}
          {(activeCategory === 'all' || activeCategory === 'casino') && (
            <LiquidGlassCard glowColor="#F59E0B" style={styles.bentoHalfCard}>
              <View style={styles.miniCardHeader}>
                <View style={[styles.miniIconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                  <Text style={{ fontSize: 20 }}>♦️</Text>
                </View>
                <View style={[styles.playerCountPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                  <Users size={11} color={theme.colors.textMuted} />
                  <Text style={[styles.playerCountText, { color: theme.colors.textSecondary }]}>2 - 9</Text>
                </View>
              </View>

              <Text style={[styles.miniCardTitle, { color: theme.colors.textPrimary }, dynamicHeading]}>
                Texas Poker
              </Text>
              <Text style={[styles.miniCardSub, { color: theme.colors.textMuted }]}>
                No-Limit Chips &amp; Blinds
              </Text>
              <Text style={[styles.miniCardDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                Chip stacks, blinds level timer, re-buy log, and tournament pot payout.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleLaunch('universal')}
                style={[styles.miniActionBtn, getLaunchBtnStyle('#F59E0B')]}
              >
                <Text style={[styles.miniActionBtnText, { color: preset === 'brutalism' && isDark ? '#000000' : '#FFFFFF' }, dynamicHeading]}>
                  Launch Poker ➔
                </Text>
              </TouchableOpacity>
            </LiquidGlassCard>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroSection: {
    paddingVertical: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  themeSwitchPillBox: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
    gap: 3,
  },
  themeBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  heroMainTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 6,
  },
  heroSubText: {
    fontSize: 14,
    lineHeight: 20,
  },
  resumeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  resumeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resumeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  resumeAction: {
    fontSize: 13,
    fontWeight: '900',
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bentoGrid: {
    gap: 12,
    marginBottom: 40,
  },
  heroBentoCard: {
    padding: 22,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  bentoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callBreakRulesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  callBreakRulesText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bentoBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bentoBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  bentoHeroTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  bentoHeroSub: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  bentoChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 18,
  },
  bentoChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bentoChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  shimmerLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  shimmerBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  bentoHalfCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.2,
    justifyContent: 'space-between',
  },
  miniCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  playerCountText: {
    fontSize: 10,
    fontWeight: '700',
  },
  miniCardTitle: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  miniCardSub: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  miniCardDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
    height: 32,
  },
  miniActionBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  miniActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
