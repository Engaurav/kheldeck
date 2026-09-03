import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../core/theme/ThemeContext';
import { useAuth } from '../core/auth/AuthContext';
import { CallBreakMatch, Player } from '../core/types';
import { getSavedPlayers } from '../core/storage/storage';
import { createInitialRounds } from '../games/callbreak/engine/scoring';
import { LiquidGlassCard } from '../components/common/LiquidGlassCard';
import { PlayerSelectModal } from '../components/common/PlayerSelectModal';
import {
  ArrowLeft,
  Play,
  Crown,
  Users,
  RotateCcw,
  UserCheck,
  ChevronDown,
  X,
  Plus,
} from 'lucide-react-native';

interface NewMatchScreenProps {
  onBack: () => void;
  onMatchCreated: (match: CallBreakMatch) => void;
}

export const NewMatchScreen: React.FC<NewMatchScreenProps> = ({ onBack, onMatchCreated }) => {
  const { theme, isDark, accentColor } = useTheme();
  const { user } = useAuth();

  // 4 Seats holding Player objects (null when empty)
  const [selectedSeats, setSelectedSeats] = useState<[Player | null, Player | null, Player | null, Player | null]>([
    null,
    null,
    null,
    null,
  ]);

  // Dropdown Picker state
  const [activeSeatIndex, setActiveSeatIndex] = useState<number | null>(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [savedDirectoryCount, setSavedDirectoryCount] = useState(0);

  useEffect(() => {
    getSavedPlayers(user?.uid).then((list) => setSavedDirectoryCount(list.length));
  }, [user]);

  const handleOpenSeatPicker = (index: number) => {
    setActiveSeatIndex(index);
    setPickerModalVisible(true);
  };

  const handleSelectPlayerForSeat = (player: Player) => {
    if (activeSeatIndex === null) return;
    const updated = [...selectedSeats] as [Player | null, Player | null, Player | null, Player | null];
    updated[activeSeatIndex] = player;
    setSelectedSeats(updated);
    setActiveSeatIndex(null);
  };

  const handleClearSeat = (index: number) => {
    const updated = [...selectedSeats] as [Player | null, Player | null, Player | null, Player | null];
    updated[index] = null;
    setSelectedSeats(updated);
  };

  const handleClearAll = () => {
    setSelectedSeats([null, null, null, null]);
  };

  // Check if all 4 seats have distinct players
  const isFormComplete =
    selectedSeats.every((p) => p !== null) &&
    new Set(selectedSeats.map((p) => p?.id)).size === 4;

  const handleStartGame = () => {
    if (!isFormComplete) return;

    const userId = user?.uid || 'guest';
    const finalPlayers = selectedSeats as [Player, Player, Player, Player];
    const initialRounds = createInitialRounds(finalPlayers);

    const initialCumulative: Record<string, number> = {};
    finalPlayers.forEach((p) => {
      initialCumulative[p.id] = 0;
    });

    const newMatch: CallBreakMatch = {
      id: 'match_' + Date.now(),
      userId,
      gameType: 'callbreak',
      startedAt: Date.now(),
      status: 'in_progress',
      totalRounds: 13,
      currentRoundNumber: 1,
      players: finalPlayers,
      rounds: initialRounds,
      cumulativeScores: initialCumulative,
    };

    onMatchCreated(newMatch);
  };

  const seatTitles = [
    { title: 'Seat 1 (Dealer 👑)', isDealer: true },
    { title: 'Seat 2', isDealer: false },
    { title: 'Seat 3', isDealer: false },
    { title: 'Seat 4', isDealer: false },
  ];

  // List of IDs selected in OTHER seats to disable in the picker
  const excludedIds = selectedSeats
    .filter((p, idx) => p !== null && idx !== activeSeatIndex)
    .map((p) => p!.id);

  const getPlayerInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              borderColor: theme.colors.borderGlass,
            },
          ]}
        >
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
            Call Break 13 Rounds
          </Text>
          <Text style={[styles.screenSub, { color: theme.colors.textMuted }]}>
            Select 4 players from dropdown ({selectedSeats.filter(Boolean).length}/4 selected)
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleClearAll}
          style={[
            styles.clearBtn,
            {
              backgroundColor: isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.06)',
              borderColor: 'rgba(244,63,94,0.3)',
            },
          ]}
        >
          <RotateCcw size={14} color="#F43F5E" />
          <Text style={styles.clearBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Seats with Searchable Dropdown Picker */}
      <View style={styles.seatsList}>
        {seatTitles.map((seat, idx) => {
          const selectedPlayer = selectedSeats[idx];
          const hasPlayer = selectedPlayer !== null;

          return (
            <LiquidGlassCard
              key={idx}
              highlightTop={idx === 0}
              glowColor={idx === 0 ? accentColor : undefined}
              style={styles.seatCard}
            >
              {/* Seat Header */}
              <View style={styles.seatCardHeader}>
                <View style={styles.seatTitleGroup}>
                  <View
                    style={[
                      styles.seatNumberBadge,
                      {
                        backgroundColor: hasPlayer
                          ? '#10B981'
                          : isDark
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(15,23,42,0.08)',
                      },
                    ]}
                  >
                    <Text style={styles.seatNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={[styles.seatCardTitle, { color: theme.colors.textPrimary }]}>
                    {seat.title}
                  </Text>
                </View>

                {seat.isDealer && (
                  <View style={[styles.dealerBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <Crown size={12} color="#F59E0B" />
                    <Text style={styles.dealerText}>DEALER</Text>
                  </View>
                )}
              </View>

              {/* Seat Selector Dropdown Trigger Button */}
              {hasPlayer ? (
                /* Selected Player State */
                <View
                  style={[
                    styles.selectedPlayerCard,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                      borderColor: accentColor,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleOpenSeatPicker(idx)}
                    style={styles.selectedPlayerTouch}
                  >
                    <View style={[styles.avatarBadge, { backgroundColor: accentColor }]}>
                      <Text style={styles.avatarText}>
                        {getPlayerInitials(selectedPlayer.name)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.selectedPlayerName, { color: theme.colors.textPrimary }]}>
                        {selectedPlayer.name}
                      </Text>
                      <Text style={[styles.selectedPlayerMeta, { color: theme.colors.textMuted }]}>
                        {selectedPlayer.totalMatches || 0} matches • {selectedPlayer.totalWins || 0} wins
                      </Text>
                    </View>
                    <ChevronDown size={16} color={theme.colors.textMuted} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleClearSeat(idx)}
                    style={styles.removePlayerBtn}
                  >
                    <X size={16} color="#F43F5E" />
                  </TouchableOpacity>
                </View>
              ) : (
                /* Empty Seat: Tap to Open Search Dropdown */
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleOpenSeatPicker(idx)}
                  style={[
                    styles.emptySeatTrigger,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)',
                      borderColor: theme.colors.borderGlass,
                    },
                  ]}
                >
                  <View style={[styles.emptyPlusIcon, { backgroundColor: `${accentColor}18` }]}>
                    <Plus size={16} color={accentColor} />
                  </View>
                  <Text style={[styles.emptySeatPlaceholder, { color: theme.colors.textMuted }]}>
                    Select Player from Dropdown...
                  </Text>
                  <ChevronDown size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              )}
            </LiquidGlassCard>
          );
        })}
      </View>

      {/* Start Button */}
      <View style={styles.bottomActionWrap}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!isFormComplete}
          onPress={handleStartGame}
          style={[
            styles.startBtn,
            {
              backgroundColor: isFormComplete ? accentColor : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              opacity: isFormComplete ? 1 : 0.6,
            },
            Platform.select({
              web: {
                boxShadow: isFormComplete ? `0 0 25px ${accentColor}50` : 'none',
              } as any,
            }),
          ]}
        >
          <Play size={18} color={isFormComplete ? '#FFFFFF' : theme.colors.textMuted} />
          <Text
            style={[
              styles.startBtnText,
              { color: isFormComplete ? '#FFFFFF' : theme.colors.textMuted },
            ]}
          >
            {isFormComplete ? 'Start 13-Round Match ➔' : 'Select All 4 Players to Start'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Searchable Player Select Modal */}
      {activeSeatIndex !== null && (
        <PlayerSelectModal
          visible={pickerModalVisible}
          title={`Select Player for Seat ${activeSeatIndex + 1}`}
          subtitle="Search existing players or create a new player live"
          excludePlayerIds={excludedIds}
          selectedPlayerId={selectedSeats[activeSeatIndex]?.id || null}
          onSelectPlayer={handleSelectPlayerForSeat}
          onClose={() => {
            setPickerModalVisible(false);
            setActiveSeatIndex(null);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  screenSub: {
    fontSize: 12,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F43F5E',
  },
  seatsList: {
    gap: 12,
    marginBottom: 24,
  },
  seatCard: {
    padding: 14,
  },
  seatCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seatTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seatNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatNumberText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  seatCardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  dealerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dealerText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#F59E0B',
  },
  emptySeatTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    paddingHorizontal: 14,
    gap: 10,
  },
  emptyPlusIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySeatPlaceholder: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  selectedPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    gap: 10,
  },
  selectedPlayerTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  selectedPlayerName: {
    fontSize: 14,
    fontWeight: '800',
  },
  selectedPlayerMeta: {
    fontSize: 11,
    marginTop: 1,
  },
  removePlayerBtn: {
    padding: 6,
  },
  bottomActionWrap: {
    marginBottom: 40,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
