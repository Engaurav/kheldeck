import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../core/theme/ThemeContext';
import { X, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import { LiquidGlassCard } from '../../../components/common/LiquidGlassCard';

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }) => {
  const { theme, isDark } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: theme.colors.modalOverlay }]}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              borderColor: theme.colors.borderGlass,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.borderGlass }]}>
            <View>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                🃏 Authentic Call Break Rules
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Standard 13 Rounds • Offline Integer Scoring
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Quick Summary */}
            <LiquidGlassCard style={styles.card}>
              <Text style={[styles.sectionTitle, { color: theme.colors.accentSecondary }]}>
                1. Game Structure
              </Text>
              <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
                • Exactly <Text style={{ fontWeight: 'bold' }}>4 players</Text>.{'\n'}
                • Exactly <Text style={{ fontWeight: 'bold' }}>13 rounds</Text> per match.{'\n'}
                • 52 cards dealt equally (13 tricks per round).{'\n'}
                • Permanent Trump: <Text style={{ fontWeight: 'bold', color: theme.colors.accentPrimary }}>Spades (♠)</Text> always beats other suits.{'\n'}
                • Sum of tricks won in each round must equal exactly 13!
              </Text>
            </LiquidGlassCard>

            {/* Scoring Rule 1 */}
            <View style={[styles.ruleCard, { backgroundColor: theme.colors.scoreNegativeBg, borderColor: theme.colors.scoreNegative }]}>
              <View style={styles.ruleHeader}>
                <ShieldAlert size={20} color={theme.colors.scoreNegative} />
                <Text style={[styles.ruleTitle, { color: theme.colors.scoreNegative }]}>
                  Rule 1: Under-trick Penalty (Result &lt; Call)
                </Text>
              </View>
              <Text style={[styles.ruleFormula, { color: theme.colors.textPrimary }]}>
                Score = -(Call × 10)
              </Text>
              <Text style={[styles.exampleText, { color: theme.colors.textSecondary }]}>
                • Call 5, Won 4 ➔ <Text style={styles.boldRed}>-50 points</Text>{'\n'}
                • Call 4, Won 2 ➔ <Text style={styles.boldRed}>-40 points</Text>
              </Text>
            </View>

            {/* Scoring Rule 2 */}
            <View style={[styles.ruleCard, { backgroundColor: theme.colors.scorePositiveBg, borderColor: theme.colors.scorePositive }]}>
              <View style={styles.ruleHeader}>
                <CheckCircle2 size={20} color={theme.colors.scorePositive} />
                <Text style={[styles.ruleTitle, { color: theme.colors.scorePositive }]}>
                  Rule 2: Safe Win (Call ≤ Result ≤ Call + 2)
                </Text>
              </View>
              <Text style={[styles.ruleFormula, { color: theme.colors.textPrimary }]}>
                Score = Call × 10 + (Result - Call)
              </Text>
              <Text style={[styles.exampleText, { color: theme.colors.textSecondary }]}>
                • Call 4, Won 4 ➔ 40 + 0 = <Text style={styles.boldGreen}>+40 points</Text>{'\n'}
                • Call 4, Won 5 ➔ 40 + 1 = <Text style={styles.boldGreen}>+41 points</Text>{'\n'}
                • Call 4, Won 6 ➔ 40 + 2 = <Text style={styles.boldGreen}>+42 points</Text>
              </Text>
            </View>

            {/* Scoring Rule 3 */}
            <View style={[styles.ruleCard, { backgroundColor: theme.colors.scoreWarningBg, borderColor: theme.colors.scoreWarning }]}>
              <View style={styles.ruleHeader}>
                <AlertTriangle size={20} color={theme.colors.scoreWarning} />
                <Text style={[styles.ruleTitle, { color: theme.colors.scoreWarning }]}>
                  Rule 3: Over-trick Penalty (Result &gt; Call + 2)
                </Text>
              </View>
              <Text style={[styles.ruleFormula, { color: theme.colors.textPrimary }]}>
                Score = -(Call × 10 + (Result - Call))
              </Text>
              <Text style={[styles.exampleText, { color: theme.colors.textSecondary }]}>
                If you win more than 2 extra tricks beyond your call, it busts into a penalty!{'\n'}
                • Call 4, Won 7 (3 extra) ➔ -(40 + 3) = <Text style={styles.boldRed}>-43 points</Text>{'\n'}
                • Call 4, Won 8 (4 extra) ➔ -(40 + 4) = <Text style={styles.boldRed}>-44 points</Text>{'\n'}
                • Call 2, Won 5 (3 extra) ➔ -(20 + 3) = <Text style={styles.boldRed}>-23 points</Text>
              </Text>
            </View>
          </ScrollView>

          {/* Footer CTA */}
          <TouchableOpacity
            onPress={onClose}
            style={[styles.doneBtn, { backgroundColor: theme.colors.accentPrimary }]}
          >
            <Text style={styles.doneBtnText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '90%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    marginBottom: 16,
  },
  card: {
    marginVertical: 6,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  ruleCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginVertical: 8,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ruleTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  ruleFormula: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginVertical: 4,
  },
  exampleText: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  boldRed: {
    fontWeight: 'bold',
    color: '#EF4444',
  },
  boldGreen: {
    fontWeight: 'bold',
    color: '#10B981',
  },
  doneBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
