import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../core/theme/ThemeContext';
import { CallBreakMatch, CallBreakRound } from '../core/types';
import { saveActiveMatch, saveCompletedMatch } from '../core/storage/storage';
import { computeCumulativeScores, getRankedPlayers, createInitialRounds } from '../games/callbreak/engine/scoring';
import { RoundInputWizard } from '../games/callbreak/components/RoundInputWizard';
import { ScorecardMatrix13 } from '../games/callbreak/components/ScorecardMatrix13';
import { PodiumSummary } from '../games/callbreak/components/PodiumSummary';

interface ActiveMatchScreenProps {
  initialMatch: CallBreakMatch;
  onGoHome: () => void;
}

export const ActiveMatchScreen: React.FC<ActiveMatchScreenProps> = ({
  initialMatch,
  onGoHome,
}) => {
  const { theme } = useTheme();

  const [match, setMatch] = useState<CallBreakMatch>(initialMatch);
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<number>(initialMatch.currentRoundNumber);
  const [viewMode, setViewMode] = useState<'wizard' | 'matrix' | 'podium'>(
    initialMatch.status === 'completed' ? 'podium' : 'wizard'
  );

  // Update a round in-place during input
  const handleUpdateRound = (updatedRound: CallBreakRound) => {
    const updatedRounds = match.rounds.map((r) =>
      r.roundNumber === updatedRound.roundNumber ? updatedRound : r
    );
    const updatedMatch: CallBreakMatch = {
      ...match,
      rounds: updatedRounds,
    };
    setMatch(updatedMatch);
    saveActiveMatch(updatedMatch);
  };

  // Complete round or save edits to past round
  const handleCompleteRound = async (completedRound: CallBreakRound) => {
    const updatedRounds = match.rounds.map((r) =>
      r.roundNumber === completedRound.roundNumber ? completedRound : r
    );

    const newCumulativeScores = computeCumulativeScores(match.players, updatedRounds);

    const isEditingPastRound = completedRound.roundNumber < match.currentRoundNumber;

    if (isEditingPastRound) {
      // User saved changes to an earlier round! Update and stay on / return to live round
      const updatedMatch: CallBreakMatch = {
        ...match,
        rounds: updatedRounds,
        cumulativeScores: newCumulativeScores,
      };
      setMatch(updatedMatch);
      await saveActiveMatch(updatedMatch);
      setSelectedRoundNumber(match.currentRoundNumber);
      return;
    }

    if (match.currentRoundNumber >= 13) {
      // MATCH COMPLETED!
      const ranked = getRankedPlayers(match.players, newCumulativeScores);
      const winner = ranked[0]?.player;

      const completedMatch: CallBreakMatch = {
        ...match,
        rounds: updatedRounds,
        cumulativeScores: newCumulativeScores,
        status: 'completed',
        completedAt: Date.now(),
        winnerId: winner?.id,
      };

      setMatch(completedMatch);
      await saveCompletedMatch(completedMatch);
      setViewMode('podium');
    } else {
      // Advance to next round (e.g. Round 2 -> Round 3)
      const nextRoundNumber = match.currentRoundNumber + 1;
      const updatedMatch: CallBreakMatch = {
        ...match,
        currentRoundNumber: nextRoundNumber,
        rounds: updatedRounds,
        cumulativeScores: newCumulativeScores,
      };

      setSelectedRoundNumber(nextRoundNumber);
      setMatch(updatedMatch);
      await saveActiveMatch(updatedMatch);
    }
  };

  const handlePlayAgain = () => {
    const initialRounds = createInitialRounds(match.players);
    const initialCumulative: Record<string, number> = {};
    match.players.forEach((p) => {
      initialCumulative[p.id] = 0;
    });

    const newMatch: CallBreakMatch = {
      id: 'match_' + Date.now(),
      userId: match.userId || 'guest',
      gameType: 'callbreak',
      startedAt: Date.now(),
      status: 'in_progress',
      totalRounds: 13,
      currentRoundNumber: 1,
      players: match.players,
      rounds: initialRounds,
      cumulativeScores: initialCumulative,
    };

    setMatch(newMatch);
    setSelectedRoundNumber(1);
    setViewMode('wizard');
    saveActiveMatch(newMatch);
  };

  return (
    <View style={styles.container}>
      {viewMode === 'wizard' && (
        <RoundInputWizard
          match={match}
          selectedRoundNumber={selectedRoundNumber}
          onSelectRoundNumber={(roundNum) => setSelectedRoundNumber(roundNum)}
          onUpdateRound={handleUpdateRound}
          onCompleteRound={handleCompleteRound}
          onToggleScorecard={() => setViewMode('matrix')}
        />
      )}

      {viewMode === 'matrix' && (
        <ScorecardMatrix13
          match={match}
          onBackToWizard={() => setViewMode('wizard')}
          onSelectRoundToEdit={(roundNum) => {
            setSelectedRoundNumber(roundNum);
            setViewMode('wizard');
          }}
        />
      )}

      {viewMode === 'podium' && (
        <PodiumSummary
          match={match}
          onPlayAgain={handlePlayAgain}
          onGoHome={onGoHome}
          onViewScorecard={() => setViewMode('matrix')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
