import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTheme } from '../core/theme/ThemeContext';
import { useAuth } from '../core/auth/AuthContext';
import { Player } from '../core/types';
import {
  getSavedPlayers,
  savePlayer,
  editPlayerName,
  deletePlayer,
  clearAllSavedPlayers,
} from '../core/storage/storage';
import { LiquidGlassCard } from '../components/common/LiquidGlassCard';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  Users,
  Search,
  Trophy,
} from 'lucide-react-native';

interface PlayersDirectoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PlayersDirectoryModal: React.FC<PlayersDirectoryModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme, isDark, accentColor } = useTheme();
  const { user } = useAuth();

  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');

  useEffect(() => {
    if (visible) {
      loadPlayers();
      setSearchQuery('');
      setNewPlayerName('');
      setEditingPlayerId(null);
    }
  }, [visible, user]);

  const loadPlayers = async () => {
    const list = await getSavedPlayers(user?.uid);
    setPlayers(list);
  };

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) return;
    const userId = user?.uid || 'guest';
    await savePlayer(newPlayerName.trim(), userId);
    setNewPlayerName('');
    await loadPlayers();
  };

  const handleStartEdit = (p: Player) => {
    setEditingPlayerId(p.id);
    setEditNameText(p.name);
  };

  const handleSaveEdit = async () => {
    if (!editingPlayerId || !editNameText.trim()) return;
    await editPlayerName(editingPlayerId, editNameText.trim());
    setEditingPlayerId(null);
    setEditNameText('');
    await loadPlayers();
  };

  const handleDelete = async (id: string) => {
    await deletePlayer(id);
    await loadPlayers();
  };

  const handleClearAll = async () => {
    await clearAllSavedPlayers();
    setPlayers([]);
  };

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.colors.modalOverlay }]}>
        <LiquidGlassCard style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18` }]}>
                <Users size={20} color={accentColor} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
                  Global Players Directory
                </Text>
                <Text style={[styles.headerSub, { color: theme.colors.textMuted }]}>
                  Manage players across all games ({players.length} total)
                </Text>
              </View>
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

          {/* Add New Player Input Box */}
          <View
            style={[
              styles.addPlayerCard,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)',
                borderColor: theme.colors.borderGlass,
              },
            ]}
          >
            <TextInput
              value={newPlayerName}
              onChangeText={setNewPlayerName}
              placeholder="Enter new player name (e.g. Rahul)..."
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.addInput, { color: theme.colors.textPrimary }]}
            />
            <TouchableOpacity
              onPress={handleAddPlayer}
              disabled={!newPlayerName.trim()}
              style={[
                styles.addBtn,
                {
                  backgroundColor: newPlayerName.trim() ? accentColor : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  opacity: newPlayerName.trim() ? 1 : 0.5,
                },
              ]}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Search Filter Bar */}
          {players.length > 3 && (
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)',
                  borderColor: theme.colors.borderGlass,
                },
              ]}
            >
              <Search size={15} color={theme.colors.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search players..."
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.searchInput, { color: theme.colors.textPrimary }]}
              />
            </View>
          )}

          {/* Player List */}
          <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
            {filtered.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Users size={32} color={theme.colors.textMuted} />
                <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                  {searchQuery ? 'No players match your search.' : 'No players added yet.'}
                </Text>
              </View>
            ) : (
              filtered.map((p) => {
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
                      styles.playerRow,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)',
                        borderColor: theme.colors.borderGlass,
                      },
                    ]}
                  >
                    <View style={[styles.avatarBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                      <Text style={[styles.avatarText, { color: theme.colors.textPrimary }]}>
                        {getInitials(p.name)}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.playerName, { color: theme.colors.textPrimary }]}>
                        {p.name}
                      </Text>
                      <Text style={[styles.playerStats, { color: theme.colors.textMuted }]}>
                        {p.totalMatches || 0} match(es) • {p.totalWins || 0} win(s)
                      </Text>
                    </View>

                    <View style={styles.actionGroup}>
                      <TouchableOpacity
                        onPress={() => handleStartEdit(p)}
                        style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
                      >
                        <Edit2 size={14} color={theme.colors.accentSecondary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDelete(p.id)}
                        style={[styles.actionBtn, { backgroundColor: isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.06)' }]}
                      >
                        <Trash2 size={14} color="#F43F5E" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Footer with Clear All */}
          {players.length > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
                <Text style={[styles.clearAllText, { color: theme.colors.scoreNegative }]}>
                  Delete All Players
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    maxWidth: 480,
    maxHeight: '88%',
    padding: 22,
    borderRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  addPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 14,
    borderWidth: 1.2,
    marginBottom: 12,
    gap: 8,
  },
  addInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  listScroll: {
    maxHeight: 340,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
  },
  playerName: {
    fontSize: 14,
    fontWeight: '800',
  },
  playerStats: {
    fontSize: 11,
    marginTop: 2,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  footer: {
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  clearAllBtn: {
    padding: 6,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
