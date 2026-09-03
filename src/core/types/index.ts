export interface GoogleUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  authProvider: 'google' | 'guest';
  createdAt: number;
  lastLoginAt: number;
}

export interface Player {
  id: string;
  userId: string; // Scoped to Google user
  name: string;
  createdAt: number;
  lastPlayedAt: number;
  totalMatches: number;
  totalWins: number;
}

export type ScoreStatus = 'SAFE_WIN' | 'UNDER_TRICK' | 'OVER_TRICK_PENALTY';

export interface RoundScoreBreakdown {
  score: number;
  status: ScoreStatus;
  message: string;
}

export interface CallBreakRound {
  roundNumber: number;      // 1 to 13
  dealerIndex: number;      // 0 to 3
  calls: Record<string, number>;    // { [playerId]: call (1..13) }
  results: Record<string, number>;  // { [playerId]: result (0..13) }
  scores: Record<string, number>;   // { [playerId]: integerScore }
  isCompleted: boolean;
}

export type MatchStatus = 'in_progress' | 'completed' | 'abandoned';

export interface CallBreakMatch {
  id: string;
  userId: string; // Owner's Google UID
  gameType: 'callbreak';
  startedAt: number;
  completedAt?: number;
  status: MatchStatus;
  totalRounds: 13;
  currentRoundNumber: number;
  players: [Player, Player, Player, Player];
  rounds: CallBreakRound[];
  cumulativeScores: Record<string, number>;
  winnerId?: string;
  syncedToGoogleAt?: number;
}

// Universal / Custom Game Data Model
export interface UniversalGameRound {
  roundNumber: number;
  scores: Record<string, number>; // { [playerId]: score }
}

export interface UniversalGameMatch {
  id: string;
  userId: string;
  gameType: 'universal' | 'teenpatti' | 'rummy';
  gameTitle: string;
  startedAt: number;
  completedAt?: number;
  status: MatchStatus;
  players: Player[];
  rounds: UniversalGameRound[];
  cumulativeScores: Record<string, number>;
  winnerId?: string;
}

// Google Docs / Drive JSON Backup Schema
export interface GoogleBackupData {
  schemaVersion: '1.0';
  exportedAt: number;
  user: GoogleUserProfile;
  players: Player[];
  callbreakMatches: CallBreakMatch[];
  otherMatches: UniversalGameMatch[];
}
