import { CallBreakMatch, CallBreakRound, Player, RoundScoreBreakdown } from '../../../core/types';

/**
 * Calculates a player's round score based on authentic offline Call Break rules.
 * 
 * Rules:
 * 1. Under-trick: result < call => -(call * 10)
 * 2. Safe Win: call <= result <= call + 2 => (call * 10) + (result - call)
 * 3. Over-trick Penalty: result > call + 2 => -((call * 10) + (result - call))
 */
export function calculatePlayerScore(call: number, result: number): RoundScoreBreakdown {
  if (result < call) {
    const score = -(call * 10);
    return {
      score,
      status: 'UNDER_TRICK',
      message: `Failed call of ${call} (won ${result}). Penalty: ${score}`,
    };
  }

  const extra = result - call;

  if (extra <= 2) {
    const score = (call * 10) + extra;
    return {
      score,
      status: 'SAFE_WIN',
      message: `Made call of ${call} + ${extra} extra. Score: +${score}`,
    };
  }

  // Over-trick bust penalty: won more than 2 extra hands
  const score = -((call * 10) + extra);
  return {
    score,
    status: 'OVER_TRICK_PENALTY',
    message: `Exceeded call of ${call} by ${extra} tricks (> 2 extra). Penalty: ${score}`,
  };
}

/**
 * Validates that all 4 players have placed a call/bid of at least 2 (minimum bid is 2).
 */
export function validateBiddingPhase(
  calls: Record<string, number>,
  playerIds: string[]
): {
  isValid: boolean;
  missingCount: number;
  totalCalls: number;
} {
  const missing = playerIds.filter((id) => (calls[id] || 0) < 2);
  const totalCalls = Object.values(calls).reduce((a, b) => a + (b || 0), 0);
  return {
    isValid: missing.length === 0,
    missingCount: missing.length,
    totalCalls,
  };
}

/**
 * Validates that the sum of tricks won across all 4 players equals exactly 13.
 */
export function validateRoundTricks(results: number[]): {
  isValid: boolean;
  total: number;
  remaining: number;
  message: string;
} {
  const total = results.reduce((acc, curr) => acc + (isNaN(curr) ? 0 : curr), 0);
  const remaining = 13 - total;

  if (total === 13) {
    return {
      isValid: true,
      total,
      remaining: 0,
      message: 'All 13 tricks accounted for!',
    };
  }

  if (total > 13) {
    return {
      isValid: false,
      total,
      remaining,
      message: `Total tricks (${total}) exceeds 13 by ${total - 13}!`,
    };
  }

  return {
    isValid: false,
    total,
    remaining,
    message: `${remaining} trick${remaining === 1 ? '' : 's'} remaining to assign.`,
  };
}

/**
 * Computes cumulative scores for all 4 players across completed rounds.
 */
export function computeCumulativeScores(
  players: Player[],
  rounds: CallBreakRound[]
): Record<string, number> {
  const cumulative: Record<string, number> = {};
  players.forEach((p) => {
    cumulative[p.id] = 0;
  });

  rounds.forEach((round) => {
    if (round.isCompleted) {
      players.forEach((p) => {
        const roundScore = round.scores[p.id] || 0;
        cumulative[p.id] = (cumulative[p.id] || 0) + roundScore;
      });
    }
  });

  return cumulative;
}

export interface PlayerRank {
  player: Player;
  totalScore: number;
  rank: number; // 1, 2, 3, 4
}

/**
 * Ranks players by total score in descending order.
 */
export function getRankedPlayers(
  players: Player[],
  cumulativeScores: Record<string, number>
): PlayerRank[] {
  const sorted = [...players].sort((a, b) => {
    const scoreA = cumulativeScores[a.id] || 0;
    const scoreB = cumulativeScores[b.id] || 0;
    return scoreB - scoreA;
  });

  return sorted.map((player, index) => ({
    player,
    totalScore: cumulativeScores[player.id] || 0,
    rank: index + 1,
  }));
}

/**
 * Generates an empty initial round object for the 13 rounds.
 */
export function createInitialRounds(players: Player[]): CallBreakRound[] {
  const rounds: CallBreakRound[] = [];
  for (let i = 1; i <= 13; i++) {
    const roundCalls: Record<string, number> = {};
    const roundResults: Record<string, number> = {};
    const roundScores: Record<string, number> = {};

    players.forEach((p) => {
      roundCalls[p.id] = 0;
      roundResults[p.id] = 0;
      roundScores[p.id] = 0;
    });

    rounds.push({
      roundNumber: i,
      dealerIndex: (i - 1) % 4,
      calls: roundCalls,
      results: roundResults,
      scores: roundScores,
      isCompleted: false,
    });
  }
  return rounds;
}
