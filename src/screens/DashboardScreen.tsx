import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme } from '../core/theme/ThemeContext';
import { useAuth } from '../core/auth/AuthContext';
import { CallBreakMatch, Player } from '../core/types';
import {
  getActiveMatch,
  getMatchHistory,
  getSavedPlayers,
  editPlayerName,
  deletePlayer,
  clearAllSavedPlayers,
} from '../core/storage/storage';
import { LiquidGlassCard } from '../components/common/LiquidGlassCard';
import {
  Play,
  RotateCcw,
  Trophy,
  Users,
  Calendar,
  Filter,
  ChevronRight,
  Edit2,
  Trash2,
  Check,
  X,
  UserCheck,
} from 'lucide-react-native';
import { TextInput } from 'react-native';

interface DashboardScreenProps {
  onStartNewGame: () => void;
  onResumeGame: (match: CallBreakMatch) => void;
  onOpenRules: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartNewGame,
  onResumeGame,
  onOpenRules,
}) => {
  const { theme, isDark, accentColor } = useTheme();
  const { user } = useAuth();

  const [activeMatch, setActiveMatch] = useState<CallBreakMatch | null>(null);
  const [history, setHistory] = useState<CallBreakMatch[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<string | null>(null);
  const [showManagePlayers, setShowManagePlayers] = useState<boolean>(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const active = await getActiveMatch();
    const matches = await getMatchHistory(user?.uid);
    const savedPlayers = await getSavedPlayers(user?.uid);

    setActiveMatch(active);
    setHistory(matches);
    setPlayers(savedPlayers);
  };

  const handleStartEditPlayer = (p: Player) => {
    setEditingPlayerId(p.id);
    setEditNameText(p.name);
  };

  const handleSaveEditPlayer = async () => {
    if (!editingPlayerId || !editNameText.trim()) return;
    await editPlayerName(editingPlayerId, editNameText.trim());
    setEditingPlayerId(null);
    setEditNameText('');
    await loadData();
  };

  const handleDeletePlayer = async (id: string) => {
    await deletePlayer(id);
    if (selectedPlayerFilter === id) {
      setSelectedPlayerFilter(null);
    }
    await loadData();
  };

  const handleClearAllPlayers = async () => {
    await clearAllSavedPlayers();
    setSelectedPlayerFilter(null);
    await loadData();
  };

  // Filter history by player if selected
  const filteredHistory = selectedPlayerFilter
    ? history.filter((m) => m.players.some((p) => p.id === selectedPlayerFilter))
    : history;

  // Calculate quick stats
  const totalMatchesCount = history.length;
  const topPlayer = [...players].sort((a, b) => b.totalWins - a.totalWins)[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <LiquidGlassCard style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={[styles.heroSub, { color: theme.colors.accentSecondary }]}>
              OFFLINE SCORE TRACKER
            </Text>
            <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
              Call Break 13 Rounds
            </Text>
          </View>
          <View style={[styles.heroBadge, { backgroundColor: theme.colors.accentPrimaryGlow }]}>
            <Text style={[styles.heroBadgeText, { color: theme.colors.accentPrimary }]}>
              Offline First ⚡
            </Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>
              {totalMatchesCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Matches Played
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.colors.borderGlass }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.scorePositive }]}>
              {topPlayer ? topPlayer.name : '—'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Top Winner ({topPlayer ? topPlayer.totalWins : 0} wins)
            </Text>
          </View>
        </View>

        {/* Primary CTA: Start New Game */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onStartNewGame}
          style={[styles.startBtn, { backgroundColor: theme.colors.accentPrimary }]}
        >
          <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.startBtnText}>Start New 13-Round Match</Text>
        </TouchableOpacity>
      </LiquidGlassCard>

      {/* In-Progress Active Match Card (if exists) */}
      {activeMatch && (
        <LiquidGlassCard
          style={[
            styles.activeMatchCard,
            {
              borderColor: theme.colors.accentSecondary,
              borderTopColor: theme.colors.accentSecondary,
            },
          ]}
        >
          <View style={styles.activeMatchHeader}>
            <View>
              <Text style={[styles.activeMatchTag, { color: theme.colors.accentSecondary }]}>
                UNFINISHED MATCH
              </Text>
              <Text style={[styles.activeMatchTitle, { color: theme.colors.textPrimary }]}>
                Round {activeMatch.currentRoundNumber} of 13 in progress
              </Text>
              <Text style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
                Started: {new Date(activeMatch.startedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={[styles.pulsingDot, { backgroundColor: theme.colors.scorePositive }]} />
          </View>

          <Text style={[styles.activePlayersList, { color: theme.colors.textSecondary }]}>
            Players: {activeMatch.players.map((p) => p.name).join(' • ')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onResumeGame(activeMatch)}
            style={[styles.resumeBtn, { backgroundColor: theme.colors.accentSecondary }]}
          >
            <RotateCcw size={16} color="#FFFFFF" />
            <Text style={styles.resumeBtnText}>Resume Game</Text>
          </TouchableOpacity>
        </LiquidGlassCard>
      )}

      {/* Match History Section with Player Filter */}
      <View style={styles.historySection}>
        <View style={styles.historySectionHeader}>
          <Text style={[styles.historyTitle, { color: theme.colors.textPrimary }]}>
            Match History
          </Text>
          <View style={styles.historyHeaderActions}>
            <TouchableOpacity
              onPress={() => setShowManagePlayers(!showManagePlayers)}
              style={[
                styles.managePlayersToggleBtn,
                {
                  backgroundColor: showManagePlayers ? accentColor : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  borderColor: theme.colors.borderGlass,
                },
              ]}
            >
              <Users size={12} color={showManagePlayers ? '#FFFFFF' : theme.colors.textPrimary} />
              <Text
                style={[
                  styles.managePlayersToggleText,
                  { color: showManagePlayers ? '#FFFFFF' : theme.colors.textPrimary },
                ]}
              >
                {showManagePlayers ? 'Done' : 'Manage Players'}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.historyCount, { color: theme.colors.textMuted }]}>
              {filteredHistory.length} games
            </Text>
          </View>
        </View>

        {/* Manage Players Directory Card */}
        {showManagePlayers && (
          <LiquidGlassCard style={styles.manageCard}>
            <View style={styles.manageHeaderRow}>
              <Text style={[styles.manageTitle, { color: theme.colors.textPrimary }]}>
                Player Directory ({players.length})
              </Text>
              {players.length > 0 && (
                <TouchableOpacity onPress={handleClearAllPlayers}>
                  <Text style={[styles.clearAllLink, { color: theme.colors.scoreNegative }]}>
                    Delete All
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {players.length === 0 ? (
              <Text style={[styles.noPlayersText, { color: theme.colors.textMuted }]}>
                No saved players. Start a match to add players live!
              </Text>
            ) : (
              <View style={styles.manageList}>
                {players.map((p) => {
                  const isEditing = editingPlayerId === p.id;
                  if (isEditing) {
                    return (
                      <View key={p.id} style={[styles.manageEditRow, { borderColor: accentColor }]}>
                        <TextInput
                          value={editNameText}
                          onChangeText={setEditNameText}
                          autoFocus
                          placeholder="Edit name..."
                          placeholderTextColor={theme.colors.textMuted}
                          style={[styles.manageInput, { color: theme.colors.textPrimary }]}
                        />
                        <TouchableOpacity onPress={handleSaveEditPlayer} style={styles.manageActionBtn}>
                          <Check size={16} color="#10B981" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setEditingPlayerId(null)} style={styles.manageActionBtn}>
                          <X size={16} color="#F43F5E" />
                        </TouchableOpacity>
                      </View>
                    );
                  }

                  return (
                    <View key={p.id} style={[styles.managePlayerItem, { borderColor: theme.colors.borderGlass }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.managePlayerName, { color: theme.colors.textPrimary }]}>
                          {p.name}
                        </Text>
                        <Text style={[styles.managePlayerStats, { color: theme.colors.textMuted }]}>
                          {p.totalMatches} match(es) • {p.totalWins} win(s)
                        </Text>
                      </View>

                      {/* Edit Name Button */}
                      <TouchableOpacity
                        onPress={() => handleStartEditPlayer(p)}
                        style={[styles.manageIconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
                      >
                        <Edit2 size={14} color={theme.colors.accentSecondary} />
                      </TouchableOpacity>

                      {/* Delete Player Button */}
                      <TouchableOpacity
                        onPress={() => handleDeletePlayer(p.id)}
                        style={[styles.manageIconBtn, { backgroundColor: isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.06)' }]}
                      >
                        <Trash2 size={14} color="#F43F5E" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </LiquidGlassCard>
        )}

        {/* Filter by Player Chips */}
        {players.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              onPress={() => setSelectedPlayerFilter(null)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: !selectedPlayerFilter
                    ? theme.colors.accentPrimary
                    : theme.colors.surfaceGlass,
                  borderColor: !selectedPlayerFilter
                    ? theme.colors.accentPrimary
                    : theme.colors.borderGlass,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: !selectedPlayerFilter ? '#FFFFFF' : theme.colors.textSecondary },
                ]}
              >
                All Players
              </Text>
            </TouchableOpacity>

            {players.map((p) => {
              const isSelected = selectedPlayerFilter === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedPlayerFilter(isSelected ? null : p.id)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.accentPrimary
                        : theme.colors.surfaceGlass,
                      borderColor: isSelected
                        ? theme.colors.accentPrimary
                        : theme.colors.borderGlass,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: isSelected ? '#FFFFFF' : theme.colors.textSecondary },
                    ]}
                  >
                    {p.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* History Cards */}
        {filteredHistory.length === 0 ? (
          <LiquidGlassCard style={styles.emptyCard}>
            <Users size={32} color={theme.colors.textMuted} />
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
              {selectedPlayerFilter
                ? 'No games recorded for this player yet.'
                : 'No games recorded yet. Start your first 13-round match!'}
            </Text>
          </LiquidGlassCard>
        ) : (
          filteredHistory.map((match) => {
            const winner = match.players.find((p) => p.id === match.winnerId);
            const dateStr = new Date(match.startedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <LiquidGlassCard key={match.id} style={styles.historyCard}>
                <View style={styles.historyCardTop}>
                  <View style={styles.dateRow}>
                    <Calendar size={13} color={theme.colors.textMuted} />
                    <Text style={[styles.dateText, { color: theme.colors.textMuted }]}>
                      {dateStr}
                    </Text>
                  </View>
                  {winner && (
                    <View style={styles.winnerBadge}>
                      <Trophy size={13} color="#F59E0B" />
                      <Text style={styles.winnerBadgeText}>{winner.name} Won</Text>
                    </View>
                  )}
                </View>

                {/* Score breakdown per player */}
                <View style={styles.historyScoresGrid}>
                  {match.players.map((p) => {
                    const score = match.cumulativeScores[p.id] || 0;
                    return (
                      <View key={p.id} style={styles.historyPlayerItem}>
                        <Text style={[styles.historyPlayerName, { color: theme.colors.textSecondary }]}>
                          {p.name}
                        </Text>
                        <Text
                          style={[
                            styles.historyPlayerScore,
                            {
                              color:
                                score > 0
                                  ? theme.colors.scorePositive
                                  : score < 0
                                  ? theme.colors.scoreNegative
                                  : theme.colors.textPrimary,
                            },
                          ]}
                        >
                          {score > 0 ? `+${score}` : score}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </LiquidGlassCard>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroCard: {
    padding: 22,
    marginVertical: 12,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroSub: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  heroBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 16,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  activeMatchCard: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1.5,
  },
  activeMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeMatchTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  activeMatchTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activePlayersList: {
    fontSize: 13,
    marginBottom: 12,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resumeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  historySection: {
    marginVertical: 12,
    marginBottom: 40,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  historyHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  managePlayersToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  managePlayersToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  manageCard: {
    padding: 14,
    marginBottom: 14,
  },
  manageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  manageTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  clearAllLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  noPlayersText: {
    fontSize: 12,
    paddingVertical: 8,
  },
  manageList: {
    gap: 8,
  },
  managePlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  managePlayerName: {
    fontSize: 13,
    fontWeight: '700',
  },
  managePlayerStats: {
    fontSize: 11,
    marginTop: 2,
  },
  manageIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 8,
  },
  manageInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  manageActionBtn: {
    padding: 6,
  },
  historyCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  historyCard: {
    padding: 14,
    marginVertical: 6,
  },
  historyCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  winnerBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  historyScoresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyPlayerItem: {
    alignItems: 'center',
    flex: 1,
  },
  historyPlayerName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyPlayerScore: {
    fontSize: 15,
    fontWeight: '800',
  },
});
