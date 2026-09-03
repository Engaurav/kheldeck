import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeContext';
import { CallBreakMatch } from '../../../core/types';
import { computeCumulativeScores, getRankedPlayers } from '../engine/scoring';
import { LiquidGlassCard } from '../../../components/common/LiquidGlassCard';
import { Trophy, Medal, RotateCcw, Home, Crown } from 'lucide-react-native';

interface PodiumSummaryProps {
  match: CallBreakMatch;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onViewScorecard: () => void;
}

export const PodiumSummary: React.FC<PodiumSummaryProps> = ({
  match,
  onPlayAgain,
  onGoHome,
  onViewScorecard,
}) => {
  const { theme, isDark } = useTheme();

  const cumulativeScores = computeCumulativeScores(match.players, match.rounds);
  const ranked = getRankedPlayers(match.players, cumulativeScores);

  const winner = ranked[0];
  const second = ranked[1];
  const third = ranked[2];
  const fourth = ranked[3];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Celebratory Banner */}
      <LiquidGlassCard style={styles.bannerCard}>
        <View style={styles.crownGlow}>
          <Trophy size={48} color="#F59E0B" />
        </View>
        <Text style={[styles.celebrationSub, { color: theme.colors.accentSecondary }]}>
          13 ROUNDS COMPLETED • {new Date(match.completedAt || match.startedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        <Text style={[styles.winnerName, { color: theme.colors.textPrimary }]}>
          {winner.player.name} Won! 👑
        </Text>
        <Text style={[styles.winnerScore, { color: theme.colors.scorePositive }]}>
          {winner.totalScore > 0 ? `+${winner.totalScore}` : winner.totalScore} Points
        </Text>
      </LiquidGlassCard>

      {/* Visual Podium 2nd - 1st - 3rd */}
      <View style={styles.podiumContainer}>
        {/* 2nd Place */}
        {second && (
          <LiquidGlassCard style={[styles.podiumColumn, styles.colSecond]}>
            <Medal size={24} color="#94A3B8" />
            <Text style={[styles.podiumRank, { color: '#94A3B8' }]}>2nd</Text>
            <Text style={[styles.podiumName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {second.player.name}
            </Text>
            <Text style={[styles.podiumScore, { color: theme.colors.textSecondary }]}>
              {second.totalScore > 0 ? `+${second.totalScore}` : second.totalScore}
            </Text>
          </LiquidGlassCard>
        )}

        {/* 1st Place (Center / Taller) */}
        {winner && (
          <LiquidGlassCard
            style={[
              styles.podiumColumn,
              styles.colFirst,
              {
                borderColor: '#F59E0B',
                borderTopColor: '#FBBF24',
              },
            ]}
          >
            <Crown size={28} color="#F59E0B" />
            <Text style={[styles.podiumRank, { color: '#F59E0B' }]}>1st</Text>
            <Text style={[styles.podiumName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {winner.player.name}
            </Text>
            <Text style={[styles.podiumScore, { color: theme.colors.scorePositive }]}>
              {winner.totalScore > 0 ? `+${winner.totalScore}` : winner.totalScore}
            </Text>
          </LiquidGlassCard>
        )}

        {/* 3rd Place */}
        {third && (
          <LiquidGlassCard style={[styles.podiumColumn, styles.colThird]}>
            <Medal size={22} color="#D97706" />
            <Text style={[styles.podiumRank, { color: '#D97706' }]}>3rd</Text>
            <Text style={[styles.podiumName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {third.player.name}
            </Text>
            <Text style={[styles.podiumScore, { color: theme.colors.textSecondary }]}>
              {third.totalScore > 0 ? `+${third.totalScore}` : third.totalScore}
            </Text>
          </LiquidGlassCard>
        )}
      </View>

      {/* 4th Place Card */}
      {fourth && (
        <LiquidGlassCard style={styles.fourthCard}>
          <Text style={[styles.fourthRank, { color: theme.colors.textMuted }]}>4th Place:</Text>
          <Text style={[styles.fourthName, { color: theme.colors.textPrimary }]}>{fourth.player.name}</Text>
          <Text style={[styles.fourthScore, { color: theme.colors.textSecondary }]}>
            {fourth.totalScore > 0 ? `+${fourth.totalScore}` : fourth.totalScore} pts
          </Text>
        </LiquidGlassCard>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPlayAgain}
          style={[styles.primaryBtn, { backgroundColor: theme.colors.accentPrimary }]}
        >
          <RotateCcw size={18} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Play Again (Same 4)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onViewScorecard}
          style={[styles.secondaryBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
        >
          <Text style={[styles.secondaryBtnText, { color: theme.colors.textPrimary }]}>
            View Final Scorecard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onGoHome}
          style={[styles.secondaryBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
        >
          <Home size={18} color={theme.colors.textSecondary} />
          <Text style={[styles.secondaryBtnText, { color: theme.colors.textSecondary }]}>
            Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bannerCard: {
    alignItems: 'center',
    padding: 24,
    marginVertical: 12,
  },
  crownGlow: {
    marginBottom: 8,
  },
  celebrationSub: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  winnerScore: {
    fontSize: 22,
    fontWeight: '800',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  colFirst: {
    height: 180,
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  colSecond: {
    height: 150,
    justifyContent: 'center',
  },
  colThird: {
    height: 130,
    justifyContent: 'center',
  },
  podiumRank: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 4,
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 16,
    fontWeight: '800',
  },
  fourthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginVertical: 6,
  },
  fourthRank: {
    fontSize: 13,
    fontWeight: '700',
  },
  fourthName: {
    fontSize: 15,
    fontWeight: '700',
  },
  fourthScore: {
    fontSize: 15,
    fontWeight: '800',
  },
  actionsRow: {
    gap: 10,
    marginTop: 14,
    marginBottom: 40,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
