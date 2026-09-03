import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { useAuth } from '../../core/auth/AuthContext';
import { Player } from '../../core/types';
import {
  getSavedPlayers,
  savePlayer,
  editPlayerName,
  deletePlayer,
} from '../../core/storage/storage';
import { LiquidGlassCard } from './LiquidGlassCard';
import {
  X,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  UserCheck,
  Users,
  ChevronRight,
} from 'lucide-react-native';

interface PlayerSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  title?: string;
  subtitle?: string;
  excludePlayerIds?: string[]; // IDs of players already picked for other seats
  selectedPlayerId?: string | null;
}

export const PlayerSelectModal: React.FC<PlayerSelectModalProps> = ({
  visible,
  onClose,
  onSelectPlayer,
  title = 'Select Player',
  subtitle = 'Choose from your saved player list or add a new one',
  excludePlayerIds = [],
  selectedPlayerId = null,
}) => {
  const { theme, isDark, accentColor } = useTheme();
  const { user } = useAuth();

  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    if (visible) {
      loadPlayers();
      setSearchQuery('');
      setIsAddingNew(false);
      setNewPlayerName('');
      setEditingPlayerId(null);
    }
  }, [visible, user]);

  const loadPlayers = async () => {
    const list = await getSavedPlayers(user?.uid);
    setPlayers(list);
  };

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleAddNewPlayer = async () => {
    const nameToAdd = newPlayerName.trim() || searchQuery.trim();
    if (!nameToAdd) return;

    const userId = user?.uid || 'guest';
    const created = await savePlayer(nameToAdd, userId);
    await loadPlayers();
    setNewPlayerName('');
    setSearchQuery('');
    setIsAddingNew(false);
    onSelectPlayer(created);
    onClose();
  };

  const handleStartEdit = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditNameText(player.name);
  };

  const handleSaveEdit = async () => {
    if (!editingPlayerId || !editNameText.trim()) return;
    await editPlayerName(editingPlayerId, editNameText.trim());
    setEditingPlayerId(null);
    setEditNameText('');
    await loadPlayers();
  };

  const handleDelete = async (playerId: string) => {
    await deletePlayer(playerId);
    await loadPlayers();
  };

  const getPlayerInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.colors.modalOverlay }]}>
        <LiquidGlassCard style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
                {title}
              </Text>
              <Text style={[styles.headerSub, { color: theme.colors.textMuted }]}>
                {subtitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass },
              ]}
            >
              <X size={18} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View
            style={[
              styles.searchWrap,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                borderColor: theme.colors.borderGlass,
              },
            ]}
          >
            <Search size={16} color={theme.colors.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search or type player name..."
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.searchInput, { color: theme.colors.textPrimary }]}
              autoCapitalize="words"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <X size={14} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* If search term doesn't match an exact player, offer quick "+ Add & Select" button */}
          {searchQuery.trim().length > 0 &&
            !players.some(
              (p) => p.name.toLowerCase() === searchQuery.trim().toLowerCase()
            ) && (
              <TouchableOpacity
                onPress={handleAddNewPlayer}
                style={[styles.quickAddBtn, { backgroundColor: `${accentColor}18`, borderColor: accentColor }]}
              >
                <Plus size={16} color={accentColor} />
                <Text style={[styles.quickAddText, { color: accentColor }]}>
                  + Add &amp; Select <Text style={{ fontWeight: '900' }}>"{searchQuery.trim()}"</Text>
                </Text>
              </TouchableOpacity>
            )}

          {/* Players List Scroll */}
          <ScrollView style={styles.playerListScroll} showsVerticalScrollIndicator={false}>
            {filteredPlayers.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Users size={32} color={theme.colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                  No players found
                </Text>
                <Text style={[styles.emptyDesc, { color: theme.colors.textMuted }]}>
                  {searchQuery
                    ? `Tap the button above to add "${searchQuery.trim()}" as a new player.`
                    : 'Your player directory is empty. Add your first player below!'}
                </Text>
              </View>
            ) : (
              filteredPlayers.map((p) => {
                const isExcluded = excludePlayerIds.includes(p.id);
                const isCurrent = selectedPlayerId === p.id;
                const isEditing = editingPlayerId === p.id;

                if (isEditing) {
                  return (
                    <View
                      key={p.id}
                      style={[styles.editRow, { borderColor: accentColor, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
                    >
                      <TextInput
                        value={editNameText}
                        onChangeText={setEditNameText}
                        autoFocus
                        style={[styles.editInput, { color: theme.colors.textPrimary }]}
                      />
                      <TouchableOpacity onPress={handleSaveEdit} style={styles.actionBtn}>
                        <Check size={16} color="#10B981" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setEditingPlayerId(null)}
                        style={styles.actionBtn}
                      >
                        <X size={16} color="#F43F5E" />
                      </TouchableOpacity>
                    </View>
                  );
                }

                return (
                  <View
                    key={p.id}
                    style={[
                      styles.playerItemCard,
                      {
                        backgroundColor: isCurrent
                          ? `${accentColor}18`
                          : isDark
                          ? 'rgba(255, 255, 255, 0.04)'
                          : 'rgba(15, 23, 42, 0.03)',
                        borderColor: isCurrent ? accentColor : theme.colors.borderGlass,
                        opacity: isExcluded && !isCurrent ? 0.45 : 1,
                      },
                    ]}
                  >
                    {/* Clickable Area to Select */}
                    <TouchableOpacity
                      disabled={isExcluded && !isCurrent}
                      onPress={() => {
                        onSelectPlayer(p);
                        onClose();
                      }}
                      style={styles.playerSelectTouch}
                    >
                      <View
                        style={[
                          styles.avatarBadge,
                          {
                            backgroundColor: isCurrent
                              ? accentColor
                              : isDark
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.08)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.avatarText,
                            { color: isCurrent ? '#FFFFFF' : theme.colors.textPrimary },
                          ]}
                        >
                          {getPlayerInitials(p.name)}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.playerNameText,
                            {
                              color: isCurrent
                                ? accentColor
                                : theme.colors.textPrimary,
                            },
                          ]}
                        >
                          {p.name}
                        </Text>
                        <Text style={[styles.playerStatsText, { color: theme.colors.textMuted }]}>
                          {p.totalMatches || 0} matches • {p.totalWins || 0} wins
                        </Text>
                      </View>

                      {isExcluded && !isCurrent && (
                        <View style={styles.alreadyPickedBadge}>
                          <Text style={styles.alreadyPickedText}>Picked in other seat</Text>
                        </View>
                      )}

                      {isCurrent && (
                        <View style={[styles.selectedBadge, { backgroundColor: accentColor }]}>
                          <Check size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Edit & Delete Action Icons */}
                    <View style={styles.playerItemActions}>
                      <TouchableOpacity
                        onPress={() => handleStartEdit(p)}
                        style={styles.actionBtn}
                      >
                        <Edit2 size={13} color={theme.colors.accentSecondary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDelete(p.id)}
                        style={styles.actionBtn}
                      >
                        <Trash2 size={13} color="#F43F5E" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Quick Manual Add Field */}
          <View style={styles.footerWrap}>
            {isAddingNew ? (
              <View
                style={[
                  styles.addNewRow,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                    borderColor: accentColor,
                  },
                ]}
              >
                <TextInput
                  value={newPlayerName}
                  onChangeText={setNewPlayerName}
                  placeholder="Enter new player name..."
                  placeholderTextColor={theme.colors.textMuted}
                  autoFocus
                  style={[styles.addNewInput, { color: theme.colors.textPrimary }]}
                />
                <TouchableOpacity
                  onPress={handleAddNewPlayer}
                  disabled={!newPlayerName.trim()}
                  style={[styles.addNewSubmitBtn, { backgroundColor: accentColor }]}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.addNewSubmitText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsAddingNew(false)}
                  style={styles.actionBtn}
                >
                  <X size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsAddingNew(true)}
                style={[
                  styles.openAddNewBtn,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                    borderColor: theme.colors.borderGlass,
                  },
                ]}
              >
                <Plus size={16} color={accentColor} />
                <Text style={[styles.openAddNewText, { color: theme.colors.textPrimary }]}>
                  Add New Player to Directory
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LiquidGlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '85%',
    padding: 20,
    borderRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.2,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  clearSearchBtn: {
    padding: 4,
  },
  quickAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.2,
    marginBottom: 10,
  },
  quickAddText: {
    fontSize: 13,
    fontWeight: '700',
  },
  playerListScroll: {
    maxHeight: 320,
    marginVertical: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 16,
  },
  playerItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  playerSelectTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  avatarBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
  },
  playerNameText: {
    fontSize: 14,
    fontWeight: '800',
  },
  playerStatsText: {
    fontSize: 11,
    marginTop: 1,
  },
  alreadyPickedBadge: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  alreadyPickedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F43F5E',
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  playerItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.08)',
    paddingLeft: 6,
  },
  actionBtn: {
    padding: 6,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    gap: 8,
  },
  editInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 2,
  },
  footerWrap: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  openAddNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  openAddNewText: {
    fontSize: 13,
    fontWeight: '700',
  },
  addNewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 8,
  },
  addNewInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 4,
  },
  addNewSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addNewSubmitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
