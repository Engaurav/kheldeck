import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useTheme } from '../core/theme/ThemeContext';
import { LiquidGlassCard } from '../components/common/LiquidGlassCard';
import { PlayerSelectModal } from '../components/common/PlayerSelectModal';
import { Player } from '../core/types';
import { ArrowLeft, Coins, Crown, RotateCcw, Plus, Users, Flame } from 'lucide-react-native';

interface PlayerPotState {
  id: string;
  name: string;
  chips: number;
  isBlind: boolean;
  hasPacked: boolean;
  currentBet: number;
}

interface TeenPattiScreenProps {
  onBack: () => void;
}

export const TeenPattiScreen: React.FC<TeenPattiScreenProps> = ({ onBack }) => {
  const { theme, isDark } = useTheme();

  const [bootAmount, setBootAmount] = useState<number>(10);
  const [pot, setPot] = useState<number>(0);
  const [players, setPlayers] = useState<PlayerPotState[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>('');
  const [handNumber, setHandNumber] = useState<number>(1);
  const [winnerMessage, setWinnerMessage] = useState<string>('');
  const [showPickerModal, setShowPickerModal] = useState<boolean>(false);

  const handleSelectFromDirectory = (p: Player) => {
    if (players.some((pl) => pl.name.toLowerCase() === p.name.toLowerCase())) return;
    const newP: PlayerPotState = {
      id: p.id,
      name: p.name,
      chips: 500,
      isBlind: true,
      hasPacked: false,
      currentBet: 0,
    };
    setPlayers([...players, newP]);
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newP: PlayerPotState = {
      id: 'tp_' + Date.now() + Math.random().toString(36).substring(2, 5),
      name: newPlayerName.trim(),
      chips: 500,
      isBlind: true,
      hasPacked: false,
      currentBet: 0,
    };
    setPlayers([...players, newP]);
    setNewPlayerName('');
  };

  const startNewHand = () => {
    if (players.length < 2) {
      alert('Add at least 2 players to start Teen Patti!');
      return;
    }
    const initialPot = players.length * bootAmount;
    setPot(initialPot);
    setWinnerMessage('');

    setPlayers(
      players.map((p) => ({
        ...p,
        chips: p.chips - bootAmount,
        isBlind: true,
        hasPacked: false,
        currentBet: bootAmount,
      }))
    );
    setHandNumber(handNumber + 1);
  };

  const handleBetChaal = (playerId: string, multiplier: number) => {
    const betVal = bootAmount * multiplier;
    setPot((prev) => prev + betVal);
    setPlayers(
      players.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            chips: p.chips - betVal,
            currentBet: p.currentBet + betVal,
          };
        }
        return p;
      })
    );
  };

  const handlePack = (playerId: string) => {
    setPlayers(
      players.map((p) => (p.id === playerId ? { ...p, hasPacked: true } : p))
    );
  };

  const handleDeclareWinner = (playerId: string) => {
    const winner = players.find((p) => p.id === playerId);
    if (!winner) return;
    setPlayers(
      players.map((p) => (p.id === playerId ? { ...p, chips: p.chips + pot } : p))
    );
    setWinnerMessage(`${winner.name} won the pot of ${pot} chips! 🎉`);
    setPot(0);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
        >
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
          <Text style={[styles.backBtnText, { color: theme.colors.textPrimary }]}>All Games</Text>
        </TouchableOpacity>

        <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
          <Text style={[styles.badgeText, { color: '#EF4444' }]}>Hand #{handNumber}</Text>
        </View>
      </View>

      {/* Pot Banner */}
      <LiquidGlassCard style={styles.potCard}>
        <View style={styles.potRow}>
          <Coins size={36} color="#F59E0B" />
          <View>
            <Text style={[styles.potLabel, { color: theme.colors.textMuted }]}>CURRENT POT</Text>
            <Text style={[styles.potAmount, { color: '#F59E0B' }]}>{pot} Chips</Text>
          </View>
        </View>

        {winnerMessage ? (
          <View style={[styles.winnerAlert, { backgroundColor: theme.colors.scorePositiveBg }]}>
            <Text style={[styles.winnerText, { color: theme.colors.scorePositive }]}>
              {winnerMessage}
            </Text>
          </View>
        ) : null}

        <View style={styles.bootRow}>
          <Text style={[styles.bootLabel, { color: theme.colors.textSecondary }]}>Boot Amount:</Text>
          <View style={styles.bootChips}>
            {[10, 20, 50, 100].map((amt) => (
              <TouchableOpacity
                key={amt}
                onPress={() => setBootAmount(amt)}
                style={[
                  styles.bootChip,
                  {
                    backgroundColor: bootAmount === amt ? '#EF4444' : theme.colors.surfaceGlass,
                    borderColor: bootAmount === amt ? '#EF4444' : theme.colors.borderGlass,
                  },
                ]}
              >
                <Text style={{ color: bootAmount === amt ? '#FFFFFF' : theme.colors.textPrimary, fontWeight: '700', fontSize: 12 }}>
                  {amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={startNewHand}
          style={[styles.startHandBtn, { backgroundColor: '#EF4444' }]}
        >
          <Flame size={18} color="#FFFFFF" />
          <Text style={styles.startHandBtnText}>Start New Hand (Collect Boot)</Text>
        </TouchableOpacity>
      </LiquidGlassCard>

      {/* Players List & Betting Controls */}
      <View style={styles.playersSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Players ({players.length}):
        </Text>

        {players.length === 0 ? (
          <LiquidGlassCard style={styles.emptyCard}>
            <Users size={32} color={theme.colors.textMuted} />
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
              No players added yet. Add your friends below to start playing Teen Patti!
            </Text>
          </LiquidGlassCard>
        ) : (
          players.map((player) => (
            <LiquidGlassCard
              key={player.id}
              style={[
                styles.playerCard,
                player.hasPacked && { opacity: 0.5 },
              ]}
            >
              <View style={styles.playerCardTop}>
                <View>
                  <Text style={[styles.playerName, { color: theme.colors.textPrimary }]}>
                    {player.name} {player.hasPacked ? '(Packed)' : ''}
                  </Text>
                  <Text style={[styles.chipCount, { color: theme.colors.scorePositive }]}>
                    Balance: {player.chips} chips
                  </Text>
                </View>

                {!player.hasPacked && pot > 0 && (
                  <TouchableOpacity
                    onPress={() => handleDeclareWinner(player.id)}
                    style={[styles.winnerBtn, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}
                  >
                    <Crown size={14} color="#F59E0B" />
                    <Text style={{ color: '#F59E0B', fontSize: 12, fontWeight: '700' }}>Won Pot</Text>
                  </TouchableOpacity>
                )}
              </View>

              {!player.hasPacked && pot > 0 && (
                <View style={styles.chaalRow}>
                  <TouchableOpacity
                    onPress={() => handleBetChaal(player.id, 1)}
                    style={[styles.chaalBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
                  >
                    <Text style={[styles.chaalBtnText, { color: theme.colors.textPrimary }]}>Chaal 1x (+{bootAmount})</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleBetChaal(player.id, 2)}
                    style={[styles.chaalBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
                  >
                    <Text style={[styles.chaalBtnText, { color: theme.colors.textPrimary }]}>Chaal 2x (+{bootAmount * 2})</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handlePack(player.id)}
                    style={[styles.packBtn, { borderColor: theme.colors.scoreNegative }]}
                  >
                    <Text style={{ color: theme.colors.scoreNegative, fontSize: 12, fontWeight: '700' }}>Pack</Text>
                  </TouchableOpacity>
                </View>
              )}
            </LiquidGlassCard>
          ))
        )}

        {/* Add Player Input */}
        <View style={styles.addPlayerRow}>
          <TextInput
            value={newPlayerName}
            onChangeText={setNewPlayerName}
            placeholder="Add player name..."
            placeholderTextColor={theme.colors.textMuted}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.04)',
                borderColor: theme.colors.borderGlass,
                color: theme.colors.textPrimary,
              },
            ]}
          />
          <TouchableOpacity
            onPress={handleAddPlayer}
            style={[styles.addBtn, { backgroundColor: '#EF4444' }]}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Pick from Saved Players Button */}
        <TouchableOpacity
          onPress={() => setShowPickerModal(true)}
          style={[
            styles.pickFromDirectoryBtn,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
              borderColor: theme.colors.borderGlass,
            },
          ]}
        >
          <Users size={14} color="#EF4444" />
          <Text style={[styles.pickFromDirectoryText, { color: theme.colors.textPrimary }]}>
            Pick from Saved Players Directory...
          </Text>
        </TouchableOpacity>
      </View>

      <PlayerSelectModal
        visible={showPickerModal}
        title="Select Player for Teen Patti"
        subtitle="Search and pick player from your directory"
        excludePlayerIds={players.map((p) => p.id)}
        onSelectPlayer={handleSelectFromDirectory}
        onClose={() => setShowPickerModal(false)}
      />
    </ScrollView>
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
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  potCard: {
    padding: 20,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  potRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  potLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  potAmount: {
    fontSize: 32,
    fontWeight: '900',
  },
  winnerAlert: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  winnerText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  bootRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  bootLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  bootChips: {
    flexDirection: 'row',
    gap: 6,
  },
  bootChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  startHandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  startHandBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  playersSection: {
    marginVertical: 14,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  playerCard: {
    padding: 14,
    marginVertical: 6,
  },
  playerCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '800',
  },
  chipCount: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  winnerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chaalRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  chaalBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  chaalBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  packBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  addPlayerRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
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
  pickFromDirectoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  pickFromDirectoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
