import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallBreakMatch, GoogleBackupData, GoogleUserProfile, Player, UniversalGameMatch } from '../types';

const MATCHES_KEY = '@gametrack_matches';
const ACTIVE_MATCH_KEY = '@gametrack_active_match';
const PLAYERS_KEY = '@gametrack_players';
const GOOGLE_USER_KEY = '@gametrack_google_user';
const OTHER_MATCHES_KEY = '@gametrack_other_matches';

/**
 * Get saved players for the current user.
 * ZERO default players - starts completely empty!
 */
export async function getSavedPlayers(userId?: string): Promise<Player[]> {
  try {
    const raw = await AsyncStorage.getItem(PLAYERS_KEY);
    if (!raw) return [];
    const allPlayers: Player[] = JSON.parse(raw);
    if (!userId) return allPlayers;
    return allPlayers.filter((p) => !p.userId || p.userId === userId);
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
}

/**
 * Save a newly added player under the current user's profile.
 */
export async function savePlayer(name: string, userId: string): Promise<Player> {
  const players = await getSavedPlayers();
  const trimmed = name.trim();
  const existing = players.find(
    (p) => p.name.toLowerCase() === trimmed.toLowerCase() && (!p.userId || p.userId === userId)
  );

  if (existing) {
    existing.lastPlayedAt = Date.now();
    await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
    return existing;
  }

  const newPlayer: Player = {
    id: 'player_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    name: trimmed,
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    totalMatches: 0,
    totalWins: 0,
  };

  const updated = [newPlayer, ...players];
  await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(updated));
  return newPlayer;
}

export async function updatePlayerStats(playerIds: string[], winnerId?: string): Promise<void> {
  const players = await getSavedPlayers();
  const updated = players.map((p) => {
    if (playerIds.includes(p.id)) {
      return {
        ...p,
        totalMatches: p.totalMatches + 1,
        totalWins: p.id === winnerId ? p.totalWins + 1 : p.totalWins,
        lastPlayedAt: Date.now(),
      };
    }
    return p;
  });
  await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(updated));
}

/**
 * Edit a saved player's name
 */
export async function editPlayerName(playerId: string, newName: string): Promise<Player | null> {
  const players = await getSavedPlayers();
  const trimmed = newName.trim();
  if (!trimmed) return null;

  let edited: Player | null = null;
  const updated = players.map((p) => {
    if (p.id === playerId) {
      edited = { ...p, name: trimmed };
      return edited;
    }
    return p;
  });

  await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(updated));
  return edited;
}

/**
 * Delete a saved player
 */
export async function deletePlayer(playerId: string): Promise<void> {
  const players = await getSavedPlayers();
  const updated = players.filter((p) => p.id !== playerId);
  await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(updated));
}

/**
 * Clear all saved players completely
 */
export async function clearAllSavedPlayers(): Promise<void> {
  await AsyncStorage.removeItem(PLAYERS_KEY);
}

/**
 * Update a player's name in the active match
 */
export async function updateActiveMatchPlayerName(playerId: string, newName: string): Promise<CallBreakMatch | null> {
  const active = await getActiveMatch();
  if (!active) return null;

  const trimmed = newName.trim();
  if (!trimmed) return active;

  const updatedPlayers = active.players.map((p) => (p.id === playerId ? { ...p, name: trimmed } : p));
  const updatedMatch: CallBreakMatch = { ...active, players: updatedPlayers as [Player, Player, Player, Player] };
  await saveActiveMatch(updatedMatch);
  return updatedMatch;
}

export async function getActiveMatch(): Promise<CallBreakMatch | null> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_MATCH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveActiveMatch(match: CallBreakMatch | null): Promise<void> {
  try {
    if (!match) {
      await AsyncStorage.removeItem(ACTIVE_MATCH_KEY);
    } else {
      await AsyncStorage.setItem(ACTIVE_MATCH_KEY, JSON.stringify(match));
    }
  } catch (err) {
    console.error('Error saving active match:', err);
  }
}

export async function getMatchHistory(userId?: string): Promise<CallBreakMatch[]> {
  try {
    const raw = await AsyncStorage.getItem(MATCHES_KEY);
    if (!raw) return [];
    const allMatches: CallBreakMatch[] = JSON.parse(raw);
    if (!userId) return allMatches;
    return allMatches.filter((m) => !m.userId || m.userId === userId);
  } catch {
    return [];
  }
}

export async function saveCompletedMatch(match: CallBreakMatch): Promise<void> {
  try {
    const history = await getMatchHistory();
    const updated = [match, ...history.filter((m) => m.id !== match.id)];
    await AsyncStorage.setItem(MATCHES_KEY, JSON.stringify(updated));
    await saveActiveMatch(null);

    // Update player stats
    const playerIds = match.players.map((p) => p.id);
    await updatePlayerStats(playerIds, match.winnerId);
  } catch (err) {
    console.error('Error saving completed match:', err);
  }
}

// Google User Persistence
export async function getStoredGoogleUser(): Promise<GoogleUserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(GOOGLE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveStoredGoogleUser(user: GoogleUserProfile | null): Promise<void> {
  try {
    if (!user) {
      await AsyncStorage.removeItem(GOOGLE_USER_KEY);
    } else {
      await AsyncStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Error saving Google user:', err);
  }
}

// Export complete game data as JSON for Google Docs / Cloud Storage
export async function generateGoogleBackupJson(user: GoogleUserProfile): Promise<string> {
  const players = await getSavedPlayers(user.uid);
  const callbreakMatches = await getMatchHistory(user.uid);

  const backupData: GoogleBackupData = {
    schemaVersion: '1.0',
    exportedAt: Date.now(),
    user,
    players,
    callbreakMatches,
    otherMatches: [],
  };

  return JSON.stringify(backupData, null, 2);
}

// Restore game data from JSON
export async function restoreGoogleBackupJson(jsonString: string): Promise<boolean> {
  try {
    const data: GoogleBackupData = JSON.parse(jsonString);
    if (!data.players || !data.callbreakMatches) {
      throw new Error('Invalid backup JSON structure');
    }

    // Merge players
    const existingPlayers = await getSavedPlayers();
    const newPlayerIds = new Set(data.players.map((p) => p.id));
    const mergedPlayers = [
      ...data.players,
      ...existingPlayers.filter((p) => !newPlayerIds.has(p.id)),
    ];
    await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(mergedPlayers));

    // Merge matches
    const existingMatches = await getMatchHistory();
    const newMatchIds = new Set(data.callbreakMatches.map((m) => m.id));
    const mergedMatches = [
      ...data.callbreakMatches,
      ...existingMatches.filter((m) => !newMatchIds.has(m.id)),
    ];
    await AsyncStorage.setItem(MATCHES_KEY, JSON.stringify(mergedMatches));

    return true;
  } catch (err) {
    console.error('Failed to restore backup JSON:', err);
    return false;
  }
}
