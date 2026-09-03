import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeContext';
import { CallBreakMatch } from '../../../core/types';
import { computeCumulativeScores, getRankedPlayers } from '../engine/scoring';
import { LiquidGlassCard } from '../../../components/common/LiquidGlassCard';
import { Crown, ArrowLeft, Trophy, Edit3 } from 'lucide-react-native';

interface ScorecardMatrix13Props {
  match: CallBreakMatch;
  onBackToWizard: () => void;
  onSelectRoundToEdit?: (roundNumber: number) => void;
}

export const ScorecardMatrix13: React.FC<ScorecardMatrix13Props> = ({
  match,
  onBackToWizard,
  onSelectRoundToEdit,
}) => {
  const { theme, isDark } = useTheme();

  const cumulativeScores = computeCumulativeScores(match.players, match.rounds);
  const rankedPlayers = getRankedPlayers(match.players, cumulativeScores);
  const leaderId = rankedPlayers[0]?.player.id;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBackToWizard}
          style={[styles.backBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
        >
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
          <Text style={[styles.backBtnText, { color: theme.colors.textPrimary }]}>Back to Round Entry</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'flex-end' }}>
          <View style={[styles.liveBadge, { backgroundColor: theme.colors.scorePositiveBg }]}>
            <Text style={[styles.liveBadgeText, { color: theme.colors.scorePositive }]}>
              Round {match.currentRoundNumber} of 13
            </Text>
          </View>
          <Text style={{ fontSize: 10, color: theme.colors.textMuted, marginTop: 2, fontWeight: '600' }}>
            {new Date(match.startedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Leaderboard Cards Carousel */}
      <View style={styles.leaderboardRow}>
        {rankedPlayers.map((item) => {
          const isLeader = item.player.id === leaderId;
          return (
            <LiquidGlassCard
              key={item.player.id}
              style={[
                styles.rankCard,
                isLeader && {
                  borderColor: theme.colors.dealerCrown,
                  borderTopColor: theme.colors.dealerCrown,
                },
              ]}
            >
              <View style={styles.rankCardHeader}>
                <View
                  style={[
                    styles.rankBadge,
                    {
                      backgroundColor:
                        item.rank === 1
                          ? '#F59E0B'
                          : item.rank === 2
                          ? '#94A3B8'
                          : item.rank === 3
                          ? '#D97706'
                          : 'rgba(255, 255, 255, 0.1)',
                    },
                  ]}
                >
                  <Text style={styles.rankBadgeText}>#{item.rank}</Text>
                </View>
                {isLeader && <Trophy size={14} color="#F59E0B" />}
              </View>

              <Text style={[styles.rankPlayerName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {item.player.name}
              </Text>
              <Text
                style={[
                  styles.rankTotalScore,
                  {
                    color:
                      item.totalScore > 0
                        ? theme.colors.scorePositive
                        : item.totalScore < 0
                        ? theme.colors.scoreNegative
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {item.totalScore > 0 ? `+${item.totalScore}` : item.totalScore} pts
              </Text>
            </LiquidGlassCard>
          );
        })}
      </View>

      {/* 13-Round Matrix Table */}
      <LiquidGlassCard style={styles.matrixCard}>
        <View style={styles.tableHintRow}>
          <Edit3 size={13} color={theme.colors.accentSecondary} />
          <Text style={[styles.tableHintText, { color: theme.colors.accentSecondary }]}>
            Tap any round below to edit its bids or tricks
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeaderRow, { borderBottomColor: theme.colors.borderGlass }]}>
              <View style={[styles.cellRound, styles.headerCell]}>
                <Text style={[styles.headerCellText, { color: theme.colors.textMuted }]}>ROUND</Text>
              </View>
              {match.players.map((player) => (
                <View key={player.id} style={[styles.cellPlayer, styles.headerCell]}>
                  <Text style={[styles.headerCellText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                    {player.name}
                  </Text>
                </View>
              ))}
            </View>

            {/* 13 Rows */}
            <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
              {match.rounds.map((round) => {
                const isCurrent = round.roundNumber === match.currentRoundNumber;
                const dealer = match.players[round.dealerIndex];

                return (
                  <TouchableOpacity
                    key={round.roundNumber}
                    activeOpacity={0.7}
                    onPress={() =>
                      onSelectRoundToEdit
                        ? onSelectRoundToEdit(round.roundNumber)
                        : onBackToWizard()
                    }
                    style={[
                      styles.tableRow,
                      {
                        borderBottomColor: theme.colors.borderGlass,
                        backgroundColor: isCurrent
                          ? isDark
                            ? 'rgba(99, 102, 241, 0.12)'
                            : 'rgba(79, 70, 229, 0.08)'
                          : 'transparent',
                      },
                    ]}
                  >
                    {/* Round Number + Dealer crown + Edit indicator */}
                    <View style={styles.cellRound}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text
                          style={[
                            styles.roundIndexText,
                            {
                              color: isCurrent
                                ? theme.colors.accentSecondary
                                : theme.colors.textSecondary,
                              fontWeight: isCurrent ? '800' : '600',
                            },
                          ]}
                        >
                          R{round.roundNumber}
                        </Text>
                        <Edit3 size={10} color={theme.colors.textMuted} />
                      </View>
                      <Crown size={10} color={theme.colors.dealerCrown} style={{ marginTop: 2 }} />
                    </View>

                    {/* 4 Player Cells */}
                    {match.players.map((player) => {
                      const call = round.calls[player.id] || 0;
                      const res = round.results[player.id] || 0;
                      const score = round.scores[player.id];
                      const hasPlayed = round.isCompleted;

                      return (
                        <View key={player.id} style={styles.cellPlayer}>
                          {hasPlayed ? (
                            <View style={styles.scoreCellContent}>
                              <Text style={[styles.callResultSub, { color: theme.colors.textMuted }]}>
                                {call} / {res}
                              </Text>
                              <View
                                style={[
                                  styles.matrixScoreBadge,
                                  {
                                    backgroundColor:
                                      score > 0
                                        ? theme.colors.scorePositiveBg
                                        : score < 0
                                        ? theme.colors.scoreNegativeBg
                                        : 'rgba(255, 255, 255, 0.05)',
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.matrixScoreText,
                                    {
                                      color:
                                        score > 0
                                          ? theme.colors.scorePositive
                                          : score < 0
                                          ? theme.colors.scoreNegative
                                          : theme.colors.textSecondary,
                                    },
                                  ]}
                                >
                                  {score > 0 ? `+${score}` : score}
                                </Text>
                              </View>
                            </View>
                          ) : isCurrent ? (
                            <View style={styles.scoreCellContent}>
                              <Text style={[styles.currentCallTag, { color: theme.colors.accentSecondary }]}>
                                {call > 0 ? `Call: ${call}` : '—'}
                              </Text>
                            </View>
                          ) : (
                            <Text style={[styles.dashText, { color: theme.colors.textMuted }]}>—</Text>
                          )}
                        </View>
                      );
                    })}
                  </TouchableOpacity>
                );
              })}

              {/* Total Footer Row */}
              <View style={[styles.tableRow, styles.totalFooterRow, { borderTopColor: theme.colors.borderGlass }]}>
                <View style={[styles.cellRound, styles.footerCell]}>
                  <Text style={[styles.footerTitleText, { color: theme.colors.textPrimary }]}>TOTAL</Text>
                </View>
                {match.players.map((player) => {
                  const total = cumulativeScores[player.id] || 0;
                  return (
                    <View key={player.id} style={[styles.cellPlayer, styles.footerCell]}>
                      <Text
                        style={[
                          styles.footerTotalText,
                          {
                            color:
                              total > 0
                                ? theme.colors.scorePositive
                                : total < 0
                                ? theme.colors.scoreNegative
                                : theme.colors.textPrimary,
                          },
                        ]}
                      >
                        {total > 0 ? `+${total}` : total}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </LiquidGlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  liveBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  leaderboardRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  rankCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    marginVertical: 0,
    alignItems: 'center',
  },
  rankCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rankBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  rankPlayerName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  rankTotalScore: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  matrixCard: {
    padding: 12,
    flex: 1,
  },
  tableHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  tableHintText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  tableHeaderRow: {
    paddingBottom: 10,
  },
  headerCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCellText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cellRound: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellPlayer: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  roundIndexText: {
    fontSize: 13,
  },
  scoreCellContent: {
    alignItems: 'center',
  },
  callResultSub: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  matrixScoreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  matrixScoreText: {
    fontSize: 12,
    fontWeight: '800',
  },
  currentCallTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  dashText: {
    fontSize: 14,
  },
  tableBody: {
    maxHeight: 380,
  },
  totalFooterRow: {
    borderTopWidth: 2,
    paddingTop: 12,
    marginTop: 6,
  },
  footerCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTitleText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  footerTotalText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
