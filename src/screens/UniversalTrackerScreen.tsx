import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../core/theme/ThemeContext';
import { LiquidGlassCard } from '../components/common/LiquidGlassCard';
import { ArrowLeft, Plus, Users, Trophy, Check } from 'lucide-react-native';

interface UniversalTrackerScreenProps {
  initialTitle?: string;
  onBack: () => void;
}

export const UniversalTrackerScreen: React.FC<UniversalTrackerScreenProps> = ({
  initialTitle = 'Custom Game',
  onBack,
}) => {
  const { theme, isDark } = useTheme();

  const [gameTitle, setGameTitle] = useState(initialTitle);
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [rounds, setRounds] = useState<{ roundNumber: number; scores: Record<string, number> }[]>([]);
  const [currentRoundScores, setCurrentRoundScores] = useState<Record<string, string>>({});

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers([...players, { id: 'p_' + Date.now(), name: newPlayerName.trim() }]);
    setNewPlayerName('');
  };

  const handleScoreChange = (playerId: string, val: string) => {
    setCurrentRoundScores({ ...currentRoundScores, [playerId]: val });
  };

  const handleAddRound = () => {
    const scoresNumeric: Record<string, number> = {};
    players.forEach((p) => {
      scoresNumeric[p.id] = parseInt(currentRoundScores[p.id] || '0', 10) || 0;
    });

    const newRnd = {
      roundNumber: rounds.length + 1,
      scores: scoresNumeric,
    };
    setRounds([...rounds, newRnd]);
    setCurrentRoundScores({});
  };

  // Compute totals
  const totals: Record<string, number> = {};
  players.forEach((p) => {
    totals[p.id] = 0;
  });
  rounds.forEach((r) => {
    players.forEach((p) => {
      totals[p.id] = (totals[p.id] || 0) + (r.scores[p.id] || 0);
    });
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
        >
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
          <Text style={[styles.backBtnText, { color: theme.colors.textPrimary }]}>All Games</Text>
        </TouchableOpacity>
      </View>

      {/* Game Title Card */}
      <LiquidGlassCard style={styles.titleCard}>
        <Text style={[styles.titleLabel, { color: theme.colors.accentSecondary }]}>UNIVERSAL SCOREKEEPER</Text>
        <TextInput
          value={gameTitle}
          onChangeText={setGameTitle}
          placeholder="Game Name (e.g. Indian Rummy, Uno)"
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.titleInput, { color: theme.colors.textPrimary }]}
        />
      </LiquidGlassCard>

      {/* Players Setup */}
      <LiquidGlassCard style={styles.playersCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Players ({players.length}):
        </Text>

        {players.length === 0 ? (
          <Text style={[styles.emptyHint, { color: theme.colors.textMuted }]}>
            No players added yet. Type your friends' names below to get started!
          </Text>
        ) : (
          <View style={styles.playersChipWrap}>
            {players.map((p) => (
              <View key={p.id} style={[styles.playerChip, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}>
                <Text style={[styles.playerChipText, { color: theme.colors.textPrimary }]}>{p.name}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.addPlayerRow}>
          <TextInput
            value={newPlayerName}
            onChangeText={setNewPlayerName}
            placeholder="Add player name..."
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)', borderColor: theme.colors.borderGlass, color: theme.colors.textPrimary }]}
          />
          <TouchableOpacity onPress={handleAddPlayer} style={[styles.addBtn, { backgroundColor: theme.colors.accentPrimary }]}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LiquidGlassCard>

      {/* Score Input for New Round */}
      {players.length >= 2 && (
        <LiquidGlassCard style={styles.roundInputCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Enter Round {rounds.length + 1} Points:
          </Text>

          <View style={styles.scoreInputsGrid}>
            {players.map((p) => (
              <View key={p.id} style={styles.playerScoreInputItem}>
                <Text style={[styles.inputPlayerName, { color: theme.colors.textSecondary }]}>{p.name}</Text>
                <TextInput
                  value={currentRoundScores[p.id] || ''}
                  onChangeText={(val) => handleScoreChange(p.id, val)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.scoreInput, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)', borderColor: theme.colors.borderGlass, color: theme.colors.textPrimary }]}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleAddRound}
            style={[styles.submitRoundBtn, { backgroundColor: theme.colors.scorePositive }]}
          >
            <Check size={18} color="#FFFFFF" />
            <Text style={styles.submitRoundText}>Record Round {rounds.length + 1}</Text>
          </TouchableOpacity>
        </LiquidGlassCard>
      )}

      {/* Scoreboard Table */}
      {rounds.length > 0 && (
        <LiquidGlassCard style={styles.scoreboardCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 12 }]}>
            Cumulative Scoreboard:
          </Text>

          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: theme.colors.borderGlass }]}>
            <Text style={[styles.colRnd, { color: theme.colors.textMuted }]}>Rnd</Text>
            {players.map((p) => (
              <Text key={p.id} style={[styles.colPlayer, { color: theme.colors.textPrimary }]}>{p.name}</Text>
            ))}
          </View>

          {/* Table Rows */}
          {rounds.map((r) => (
            <View key={r.roundNumber} style={[styles.tableRow, { borderBottomColor: theme.colors.borderGlass }]}>
              <Text style={[styles.colRnd, { color: theme.colors.textSecondary }]}>#{r.roundNumber}</Text>
              {players.map((p) => (
                <Text key={p.id} style={[styles.colPlayer, { color: theme.colors.textPrimary }]}>
                  {r.scores[p.id] ?? 0}
                </Text>
              ))}
            </View>
          ))}

          {/* Total Row */}
          <View style={[styles.tableRow, styles.totalRow, { borderTopColor: theme.colors.borderGlass }]}>
            <Text style={[styles.colRnd, { color: theme.colors.accentSecondary, fontWeight: '800' }]}>TOTAL</Text>
            {players.map((p) => (
              <Text key={p.id} style={[styles.colPlayer, { color: theme.colors.scorePositive, fontWeight: '900', fontSize: 15 }]}>
                {totals[p.id]}
              </Text>
            ))}
          </View>
        </LiquidGlassCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBar: {
    marginVertical: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  titleCard: {
    padding: 18,
    marginBottom: 12,
  },
  titleLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '900',
  },
  playersCard: {
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    marginVertical: 6,
  },
  playersChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  playerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  playerChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  addPlayerRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundInputCard: {
    padding: 16,
    marginBottom: 12,
  },
  scoreInputsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  playerScoreInputItem: {
    flex: 1,
    minWidth: '45%',
  },
  inputPlayerName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
  },
  submitRoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  submitRoundText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  scoreboardCard: {
    padding: 16,
    marginBottom: 40,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  tableHeader: {
    paddingBottom: 8,
  },
  colRnd: {
    width: 50,
    fontSize: 12,
    fontWeight: '700',
  },
  colPlayer: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  totalRow: {
    borderTopWidth: 2,
    marginTop: 6,
    paddingTop: 10,
  },
});
