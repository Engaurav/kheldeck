import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeContext';
import { CallBreakMatch, CallBreakRound, Player } from '../../../core/types';
import { calculatePlayerScore, validateRoundTricks, validateBiddingPhase } from '../engine/scoring';
import { LiquidGlassCard } from '../../../components/common/LiquidGlassCard';
import { NumberChipPad } from '../../../components/common/NumberChipPad';
import {
  Crown,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Lock,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react-native';

interface RoundInputWizardProps {
  match: CallBreakMatch;
  selectedRoundNumber?: number;
  onSelectRoundNumber?: (roundNum: number) => void;
  onUpdateRound: (updatedRound: CallBreakRound) => void;
  onCompleteRound: (completedRound: CallBreakRound) => void;
  onToggleScorecard: () => void;
}

export const RoundInputWizard: React.FC<RoundInputWizardProps> = ({
  match,
  selectedRoundNumber,
  onSelectRoundNumber,
  onUpdateRound,
  onCompleteRound,
  onToggleScorecard,
}) => {
  const { theme, isDark, accentColor } = useTheme();

  // Active round number being viewed / edited (defaults to match.currentRoundNumber)
  const activeRoundNumber = selectedRoundNumber || match.currentRoundNumber;
  const currentRoundIndex = Math.max(0, Math.min(12, activeRoundNumber - 1));
  const currentRound = match.rounds[currentRoundIndex];
  const dealerPlayer = match.players[currentRound.dealerIndex];

  const isEditingPastRound =
    currentRound.isCompleted || activeRoundNumber < match.currentRoundNumber;

  // Turn order: Starts from (dealerIndex + 1) % 4, ends at dealerIndex
  const turnOrderPlayers = [
    match.players[(currentRound.dealerIndex + 1) % 4],
    match.players[(currentRound.dealerIndex + 2) % 4],
    match.players[(currentRound.dealerIndex + 3) % 4],
    match.players[currentRound.dealerIndex],
  ];

  // Bidding Phase Validation: All 4 players must have placed a call >= 2
  const biddingValidation = validateBiddingPhase(
    currentRound.calls,
    turnOrderPlayers.map((p) => p.id)
  );
  const allCallsPlaced = biddingValidation.isValid;

  // Local state for active phase: 'bidding' | 'results'
  const [phase, setPhase] = useState<'bidding' | 'results'>(
    allCallsPlaced ? 'results' : 'bidding'
  );
  const [biddingWarning, setBiddingWarning] = useState<string | null>(null);

  // Sync phase when round changes
  useEffect(() => {
    if (allCallsPlaced) {
      setPhase('results');
    } else {
      setPhase('bidding');
    }
    setBiddingWarning(null);
  }, [activeRoundNumber]);

  // Currently focused player index in turn order (0 to 3)
  const [focusedPlayerIndex, setFocusedPlayerIndex] = useState<number>(0);
  const activeTurnPlayer = turnOrderPlayers[focusedPlayerIndex];

  // Live trick calculation (must equal 13)
  const resultsArray = match.players.map((p) => currentRound.results[p.id] || 0);
  const trickValidation = validateRoundTricks(resultsArray);

  // Handle call selection (minimum 2)
  const handleSelectCall = (playerId: string, callValue: number) => {
    if (callValue < 2) return; // Strict minimum 2
    const updatedCalls = { ...currentRound.calls, [playerId]: callValue };
    const updatedRound: CallBreakRound = {
      ...currentRound,
      calls: updatedCalls,
    };
    onUpdateRound(updatedRound);
    setBiddingWarning(null);

    // Auto-advance to next player in turn order
    if (focusedPlayerIndex < 3) {
      setFocusedPlayerIndex(focusedPlayerIndex + 1);
    }
  };

  // Handler for setting result (tricks won) for a player
  const handleSelectResult = (playerId: string, resultValue: number) => {
    const updatedResults = { ...currentRound.results, [playerId]: resultValue };

    // Calculate new scores for all players
    const updatedScores: Record<string, number> = {};
    match.players.forEach((p) => {
      const call = currentRound.calls[p.id] || 0;
      const res = updatedResults[p.id] || 0;
      if (call >= 2) {
        updatedScores[p.id] = calculatePlayerScore(call, res).score;
      } else {
        updatedScores[p.id] = 0;
      }
    });

    const updatedRound: CallBreakRound = {
      ...currentRound,
      results: updatedResults,
      scores: updatedScores,
    };
    onUpdateRound(updatedRound);
  };

  // Switch to Phase 2: Tricks Won
  const handleSwitchToResults = () => {
    if (!allCallsPlaced) {
      setBiddingWarning(
        '⚠️ Bidding is strictly required before tricks won! All 4 players must bid at least 2.'
      );
      return;
    }
    setBiddingWarning(null);
    setPhase('results');
  };

  // Finish or Save Round
  const handleFinishRound = () => {
    if (!trickValidation.isValid) return;

    const finalScores: Record<string, number> = {};
    match.players.forEach((p) => {
      const call = currentRound.calls[p.id] || 0;
      const res = currentRound.results[p.id] || 0;
      finalScores[p.id] = calculatePlayerScore(call, res).score;
    });

    const completedRound: CallBreakRound = {
      ...currentRound,
      scores: finalScores,
      isCompleted: true,
    };
    onCompleteRound(completedRound);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 13-Round Selector Carousel (User can tap ANY round to edit) */}
      <View style={styles.roundSelectorWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roundSelectorScroll}
        >
          {match.rounds.map((r) => {
            const isSelected = r.roundNumber === activeRoundNumber;
            const isLive = r.roundNumber === match.currentRoundNumber;
            const isDone = r.isCompleted;

            return (
              <TouchableOpacity
                key={r.roundNumber}
                activeOpacity={0.8}
                onPress={() => onSelectRoundNumber && onSelectRoundNumber(r.roundNumber)}
                style={[
                  styles.roundPill,
                  {
                    backgroundColor: isSelected
                      ? accentColor
                      : isDone
                      ? isDark
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(5, 150, 105, 0.12)'
                      : isLive
                      ? isDark
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(79, 70, 229, 0.12)'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                    borderColor: isSelected
                      ? accentColor
                      : isLive
                      ? theme.colors.accentPrimary
                      : theme.colors.borderGlass,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.roundPillText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : isDone
                        ? '#10B981'
                        : isLive
                        ? theme.colors.accentPrimary
                        : theme.colors.textMuted,
                      fontWeight: isSelected || isLive ? '900' : '600',
                    },
                  ]}
                >
                  R{r.roundNumber} {isDone ? '✓' : isLive ? '●' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Editing Mode Banner if Editing a Past Round */}
      {isEditingPastRound && (
        <View style={[styles.editingNoticeBanner, { backgroundColor: 'rgba(245, 158, 11, 0.12)', borderColor: '#F59E0B' }]}>
          <View style={styles.editingNoticeLeft}>
            <Edit3 size={16} color="#F59E0B" />
            <Text style={[styles.editingNoticeText, { color: '#F59E0B' }]}>
              Editing Round {activeRoundNumber} (Scorecard will auto-recalculate)
            </Text>
          </View>
          {activeRoundNumber !== match.currentRoundNumber && (
            <TouchableOpacity
              onPress={() => onSelectRoundNumber && onSelectRoundNumber(match.currentRoundNumber)}
              style={styles.returnToLiveBtn}
            >
              <Text style={styles.returnToLiveText}>Go to Live R{match.currentRoundNumber} ➔</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Top Round Status Card */}
      <LiquidGlassCard style={styles.topBanner}>
        <View style={styles.bannerRow}>
          <View>
            <Text style={[styles.roundLabel, { color: theme.colors.textMuted }]}>
              {isEditingPastRound ? 'PAST ROUND EDIT' : 'ROUND IN PROGRESS'}
            </Text>
            <Text style={[styles.roundTitle, { color: theme.colors.textPrimary }]}>
              Round {activeRoundNumber} of 13
            </Text>
          </View>

          {/* Dealer Badge */}
          <View
            style={[
              styles.dealerBadge,
              {
                backgroundColor: isDark
                  ? 'rgba(251, 191, 36, 0.15)'
                  : 'rgba(217, 119, 6, 0.12)',
              },
            ]}
          >
            <Crown size={16} color={theme.colors.dealerCrown} />
            <Text style={[styles.dealerText, { color: theme.colors.dealerCrown }]}>
              Dealer: {dealerPlayer.name}
            </Text>
          </View>
        </View>

        {/* Phase Switcher Tabs */}
        <View
          style={[
            styles.phaseTabs,
            { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' },
          ]}
        >
          {/* Phase 1: Bidding (Calls) */}
          <TouchableOpacity
            onPress={() => setPhase('bidding')}
            style={[
              styles.phaseTab,
              phase === 'bidding' && {
                backgroundColor: theme.colors.accentPrimary,
              },
            ]}
          >
            <Text
              style={[
                styles.phaseTabText,
                { color: phase === 'bidding' ? '#FFFFFF' : theme.colors.textSecondary },
              ]}
            >
              Phase 1: Bidding (min 2) {allCallsPlaced ? '✓' : ''}
            </Text>
          </TouchableOpacity>

          {/* Phase 2: Tricks Won (Locked until all 4 bids are entered) */}
          <TouchableOpacity
            onPress={handleSwitchToResults}
            style={[
              styles.phaseTab,
              phase === 'results' && {
                backgroundColor: theme.colors.accentPrimary,
              },
              !allCallsPlaced && { opacity: 0.6 },
            ]}
          >
            <View style={styles.lockedTabRow}>
              {!allCallsPlaced && <Lock size={12} color={theme.colors.textMuted} />}
              <Text
                style={[
                  styles.phaseTabText,
                  {
                    color: phase === 'results' ? '#FFFFFF' : theme.colors.textSecondary,
                  },
                ]}
              >
                Phase 2: Tricks Won
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </LiquidGlassCard>

      {/* Warning message if trying to access tricks won before bidding */}
      {biddingWarning && (
        <View
          style={[
            styles.warningCard,
            {
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              borderColor: '#EF4444',
            },
          ]}
        >
          <AlertCircle size={16} color="#EF4444" />
          <Text style={[styles.warningCardText, { color: '#EF4444' }]}>
            {biddingWarning}
          </Text>
        </View>
      )}

      {/* PHASE A: BIDDING WIZARD */}
      {phase === 'bidding' && (
        <View>
          {/* Active Player Turn Card */}
          <LiquidGlassCard style={styles.activeTurnCard}>
            <View style={styles.turnHeader}>
              <Text style={[styles.turnStepLabel, { color: theme.colors.accentSecondary }]}>
                TURN {focusedPlayerIndex + 1} OF 4
              </Text>
              {activeTurnPlayer.id === dealerPlayer.id && (
                <View style={styles.inlineDealerBadge}>
                  <Crown size={14} color={theme.colors.dealerCrown} />
                  <Text style={[styles.dealerSmall, { color: theme.colors.dealerCrown }]}>
                    Dealer
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.activePlayerName, { color: theme.colors.textPrimary }]}>
              {activeTurnPlayer.name}
            </Text>
            <Text style={[styles.activeInstruction, { color: theme.colors.textSecondary }]}>
              Select call/bid (minimum 2, maximum 13):
            </Text>

            {/* Quick-Tap Number Chips: min={2} STRICT CALL BREAK RULE */}
            <NumberChipPad
              min={2}
              max={13}
              selectedValue={currentRound.calls[activeTurnPlayer.id] || null}
              onSelect={(val) => handleSelectCall(activeTurnPlayer.id, val)}
              accentColor={theme.colors.accentPrimary}
            />
          </LiquidGlassCard>

          {/* Player Cards Summary in Turn Order */}
          <Text style={[styles.sectionHeading, { color: theme.colors.textMuted }]}>
            SEATING &amp; TURN ORDER (MINIMUM BID 2):
          </Text>
          <View style={styles.playerChipsGrid}>
            {turnOrderPlayers.map((player, idx) => {
              const call = currentRound.calls[player.id] || 0;
              const isSelected = focusedPlayerIndex === idx;
              const hasPlacedBid = call >= 2;

              return (
                <TouchableOpacity
                  key={player.id}
                  activeOpacity={0.8}
                  onPress={() => setFocusedPlayerIndex(idx)}
                  style={[
                    styles.playerStatusChip,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(99, 102, 241, 0.25)'
                          : 'rgba(79, 70, 229, 0.15)'
                        : theme.colors.surfaceGlass,
                      borderColor: isSelected
                        ? theme.colors.accentPrimary
                        : theme.colors.borderGlass,
                    },
                  ]}
                >
                  <View style={styles.chipRow}>
                    <Text style={[styles.chipIndex, { color: theme.colors.textMuted }]}>
                      T{idx + 1}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[styles.chipPlayerName, { color: theme.colors.textPrimary }]}
                    >
                      {player.name}
                    </Text>
                    {player.id === dealerPlayer.id && (
                      <Crown size={12} color={theme.colors.dealerCrown} />
                    )}
                  </View>

                  <View
                    style={[
                      styles.callBadge,
                      {
                        backgroundColor: hasPlacedBid
                          ? theme.colors.accentPrimary
                          : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.06)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.callBadgeText,
                        { color: hasPlacedBid ? '#FFFFFF' : theme.colors.textMuted },
                      ]}
                    >
                      {hasPlacedBid ? `Call: ${call}` : 'Pending Bid'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Proceed Button when all 4 bids are entered */}
          {allCallsPlaced && (
            <TouchableOpacity
              onPress={handleSwitchToResults}
              style={[styles.proceedBtn, { backgroundColor: theme.colors.accentPrimary }]}
            >
              <Text style={styles.proceedBtnText}>
                All Bids Placed! Proceed to Phase 2: Tricks Won ➔
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* PHASE B: RESULTS WIZARD */}
      {phase === 'results' && (
        <View>
          {/* Live 13-Trick Remaining Counter Banner */}
          <View
            style={[
              styles.validationBanner,
              {
                backgroundColor: trickValidation.isValid
                  ? theme.colors.scorePositiveBg
                  : trickValidation.total > 13
                  ? theme.colors.scoreNegativeBg
                  : theme.colors.scoreWarningBg,
                borderColor: trickValidation.isValid
                  ? theme.colors.scorePositive
                  : trickValidation.total > 13
                  ? theme.colors.scoreNegative
                  : theme.colors.scoreWarning,
              },
            ]}
          >
            <View style={styles.validationRow}>
              {trickValidation.isValid ? (
                <CheckCircle2 size={20} color={theme.colors.scorePositive} />
              ) : (
                <AlertCircle
                  size={20}
                  color={
                    trickValidation.total > 13
                      ? theme.colors.scoreNegative
                      : theme.colors.scoreWarning
                  }
                />
              )}
              <Text
                style={[
                  styles.validationText,
                  {
                    color: trickValidation.isValid
                      ? theme.colors.scorePositive
                      : trickValidation.total > 13
                      ? theme.colors.scoreNegative
                      : theme.colors.scoreWarning,
                  },
                ]}
              >
                {trickValidation.message}
              </Text>
            </View>
            <Text style={[styles.validationSub, { color: theme.colors.textSecondary }]}>
              Total Assigned: {trickValidation.total} of 13
            </Text>
          </View>

          {/* 4 Player Result Cards */}
          {match.players.map((player) => {
            const call = currentRound.calls[player.id] || 0;
            const result = currentRound.results[player.id] || 0;
            const scoreBreakdown = calculatePlayerScore(call, result);

            return (
              <LiquidGlassCard key={player.id} style={styles.resultCard}>
                <View style={styles.resultCardHeader}>
                  <View>
                    <View style={styles.nameWithCrown}>
                      <Text
                        style={[styles.playerResultName, { color: theme.colors.textPrimary }]}
                      >
                        {player.name}
                      </Text>
                      {player.id === dealerPlayer.id && (
                        <Crown size={15} color={theme.colors.dealerCrown} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.playerCallBadgeText,
                        { color: theme.colors.accentSecondary },
                      ]}
                    >
                      Bid: {call} tricks
                    </Text>
                  </View>

                  {/* Real-time score badge */}
                  <View
                    style={[
                      styles.scorePreviewBadge,
                      {
                        backgroundColor:
                          scoreBreakdown.status === 'SAFE_WIN'
                            ? theme.colors.scorePositiveBg
                            : theme.colors.scoreNegativeBg,
                        borderColor:
                          scoreBreakdown.status === 'SAFE_WIN'
                            ? theme.colors.scorePositive
                            : theme.colors.scoreNegative,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scorePreviewText,
                        {
                          color:
                            scoreBreakdown.status === 'SAFE_WIN'
                              ? theme.colors.scorePositive
                              : theme.colors.scoreNegative,
                        },
                      ]}
                    >
                      {scoreBreakdown.score > 0
                        ? `+${scoreBreakdown.score}`
                        : scoreBreakdown.score}{' '}
                      pts
                    </Text>
                  </View>
                </View>

                <Text style={[styles.scoreRuleStatus, { color: theme.colors.textMuted }]}>
                  {scoreBreakdown.message}
                </Text>

                {/* Number selector for won tricks (0 to 13) */}
                <NumberChipPad
                  min={0}
                  max={13}
                  label="Tricks Won:"
                  selectedValue={currentRound.results[player.id] ?? null}
                  onSelect={(val) => handleSelectResult(player.id, val)}
                  accentColor={
                    scoreBreakdown.status === 'SAFE_WIN'
                      ? theme.colors.scorePositive
                      : theme.colors.scoreNegative
                  }
                />
              </LiquidGlassCard>
            );
          })}

          {/* Complete or Save Round Action Button */}
          <LiquidGlassCard style={styles.completeRoundCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!trickValidation.isValid}
              onPress={handleFinishRound}
              style={[
                styles.primaryBtn,
                {
                  backgroundColor: trickValidation.isValid
                    ? theme.colors.scorePositive
                    : isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  { color: trickValidation.isValid ? '#FFFFFF' : theme.colors.textMuted },
                ]}
              >
                {trickValidation.isValid
                  ? isEditingPastRound
                    ? `Save Changes to Round ${activeRoundNumber} ✓`
                    : `Lock & Complete Round ${activeRoundNumber} ✓`
                  : `Assign all 13 tricks to finish (${trickValidation.total}/13)`}
              </Text>
            </TouchableOpacity>
          </LiquidGlassCard>
        </View>
      )}

      {/* Floating Toggle to Full Scorecard */}
      <TouchableOpacity
        onPress={onToggleScorecard}
        style={[
          styles.scorecardToggleBtn,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
            borderColor: theme.colors.borderGlass,
          },
        ]}
      >
        <Text style={[styles.scorecardToggleText, { color: theme.colors.accentSecondary }]}>
          📊 View 13-Round Scorecard (Tap any round to edit)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  roundSelectorWrapper: {
    marginVertical: 10,
  },
  roundSelectorScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  roundPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  roundPillText: {
    fontSize: 12,
  },
  editingNoticeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  editingNoticeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  editingNoticeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  returnToLiveBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
  },
  returnToLiveText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
  topBanner: {
    padding: 16,
    marginBottom: 12,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  roundLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  roundTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  dealerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dealerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  phaseTabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  phaseTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  phaseTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  lockedTabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  warningCardText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  activeTurnCard: {
    padding: 18,
    marginVertical: 10,
  },
  turnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  turnStepLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  inlineDealerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dealerSmall: {
    fontSize: 11,
    fontWeight: '700',
  },
  activePlayerName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  activeInstruction: {
    fontSize: 13,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 8,
  },
  playerChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  playerStatusChip: {
    width: '48%',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  chipIndex: {
    fontSize: 10,
    fontWeight: '800',
  },
  chipPlayerName: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  callBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  callBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  proceedBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  validationBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  validationText: {
    fontSize: 13,
    fontWeight: '700',
  },
  validationSub: {
    fontSize: 11,
    marginLeft: 28,
  },
  resultCard: {
    padding: 14,
    marginBottom: 10,
  },
  resultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameWithCrown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerResultName: {
    fontSize: 16,
    fontWeight: '800',
  },
  playerCallBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  scorePreviewBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  scorePreviewText: {
    fontSize: 13,
    fontWeight: '800',
  },
  scoreRuleStatus: {
    fontSize: 11,
    marginBottom: 10,
  },
  completeRoundCard: {
    padding: 14,
    marginVertical: 10,
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  scorecardToggleBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 16,
  },
  scorecardToggleText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
