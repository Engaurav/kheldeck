import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../core/theme/ThemeContext';
import { useAuth } from '../core/auth/AuthContext';
import { generateGoogleBackupJson, restoreGoogleBackupJson, getMatchHistory, saveCompletedMatch } from '../core/storage/storage';
import { launchGoogleOAuthPopup, launchNativeGoogleSignIn, GOOGLE_CLIENT_ID } from '../core/auth/GoogleAuthService';
import { syncUserProfileToFirestore, syncAllMatchesToFirestore, fetchUserMatchesFromFirestore } from '../core/firebase/firestoreService';
import { LiquidGlassCard } from '../components/common/LiquidGlassCard';
import { X, Copy, Check, Download, Upload, LogOut, ShieldCheck, Sparkles, FileText, User, AlertCircle, Key, Cloud, RefreshCw, Database } from 'lucide-react-native';

interface GoogleSignInModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reason?: string;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  visible,
  onClose,
  onSuccess,
  reason,
}) => {
  const { theme, isDark } = useTheme();
  const { user, isAuthenticated, signInWithGoogle, setVerifiedGoogleUser, continueAsGuest, signOutGoogle } = useAuth();

  const [oauthError, setOauthError] = useState<string | null>(null);
  const [syncingFirebase, setSyncingFirebase] = useState(false);
  const [firebaseMsg, setFirebaseMsg] = useState<string | null>(null);
  const [exportedJson, setExportedJson] = useState<string>('');
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'account' | 'firebase' | 'export'>('account');

  const handleSyncToFirebase = async () => {
    if (!user) return;
    setSyncingFirebase(true);
    setFirebaseMsg(null);
    try {
      // 1. Sync User Profile
      await syncUserProfileToFirestore(user);

      // 2. Sync All Local Matches
      const localMatches = await getMatchHistory(user.uid);
      const syncedCount = await syncAllMatchesToFirestore(user.uid, localMatches);

      setFirebaseMsg(`Success! Synced profile and ${syncedCount} match(es) to Firebase Firestore (app-gossip).`);
    } catch (e: any) {
      setFirebaseMsg('Sync failed: ' + (e.message || 'Check connection'));
    } finally {
      setSyncingFirebase(false);
    }
  };

  const handleRestoreFromFirebase = async () => {
    if (!user) return;
    setSyncingFirebase(true);
    setFirebaseMsg(null);
    try {
      const cloudMatches = await fetchUserMatchesFromFirestore(user.uid);
      for (const m of cloudMatches) {
        await saveCompletedMatch(m);
      }
      setFirebaseMsg(`Success! Restored ${cloudMatches.length} match(es) from Firebase Firestore to local device.`);
    } catch (e: any) {
      setFirebaseMsg('Restore failed: ' + (e.message || 'Check connection'));
    } finally {
      setSyncingFirebase(false);
    }
  };

  const handleRealGoogleOAuth = () => {
    setOauthError(null);
    
    if (Platform.OS === 'web') {
      launchGoogleOAuthPopup(
        GOOGLE_CLIENT_ID,
        async (profile) => {
          await setVerifiedGoogleUser(profile);
          if (onSuccess) onSuccess();
          onClose();
        },
        (err) => {
          setOauthError(err);
        }
      );
    } else {
      launchNativeGoogleSignIn(
        async (profile) => {
          await setVerifiedGoogleUser(profile);
          if (onSuccess) onSuccess();
          onClose();
        },
        (err) => {
          setOauthError(err);
        }
      );
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleExportJson = async () => {
    if (!user) return;
    const json = await generateGoogleBackupJson(user);
    setExportedJson(json);
  };

  const handleCopyJson = () => {
    if (Platform.OS === 'web' && navigator?.clipboard) {
      navigator.clipboard.writeText(exportedJson);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleImportJson = async () => {
    if (!importJsonText.trim()) return;
    const ok = await restoreGoogleBackupJson(importJsonText);
    if (ok) {
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        setImportJsonText('');
        onClose();
      }, 1500);
    } else {
      alert('Invalid Google Backup JSON format. Please check and try again.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.colors.modalOverlay }]}>
        <LiquidGlassCard style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.googleGContainer}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <View>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  {isAuthenticated ? 'Google Account Connected' : 'Sign in with Google'}
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                  Firebase Cloud Sync &amp; Score Tracking
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
            >
              <X size={18} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Optional reason banner */}
          {reason && !isAuthenticated && (
            <View style={[styles.reasonBanner, { backgroundColor: 'rgba(56, 189, 248, 0.12)', borderColor: '#38BDF8' }]}>
              <Sparkles size={16} color="#38BDF8" />
              <Text style={[styles.reasonText, { color: theme.colors.textPrimary }]}>{reason}</Text>
            </View>
          )}

          {/* Navigation Tabs if Authenticated */}
          {isAuthenticated && (
            <View style={styles.tabRow}>
              {[
                { id: 'account', label: '👤 Account' },
                { id: 'firebase', label: '🔥 Firebase Cloud' },
                { id: 'export', label: '📁 JSON Backup' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as any)}
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor: activeTab === tab.id ? theme.colors.accentPrimary : theme.colors.surfaceGlass,
                      borderColor: activeTab === tab.id ? theme.colors.accentPrimary : theme.colors.borderGlass,
                    },
                  ]}
                >
                  <Text style={[styles.tabButtonText, { color: activeTab === tab.id ? '#FFFFFF' : theme.colors.textSecondary }]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} style={styles.bodyScroll}>
            {/* TAB 1: SIGN IN / PROFILE */}
            {activeTab === 'account' && (
              <View>
                {isAuthenticated ? (
                  /* Profile Details */
                  <View style={styles.profileSection}>
                    <View style={styles.avatarRow}>
                      {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={styles.largeAvatar} />
                      ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.accentPrimary }]}>
                          <User size={28} color="#FFFFFF" />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.profileName, { color: theme.colors.textPrimary }]}>
                          {user?.displayName}
                        </Text>
                        <Text style={[styles.profileEmail, { color: theme.colors.textMuted }]}>
                          {user?.email}
                        </Text>
                        <View style={styles.verifiedRow}>
                          <ShieldCheck size={14} color={theme.colors.scorePositive} />
                          <Text style={[styles.verifiedText, { color: theme.colors.scorePositive }]}>
                            Verified Google Account
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.syncStatusCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)', borderColor: theme.colors.borderGlass }]}>
                      <Text style={[styles.syncStatusTitle, { color: theme.colors.textPrimary }]}>
                        Auto-Sync &amp; Backup:
                      </Text>
                      <Text style={[styles.syncStatusDesc, { color: theme.colors.textSecondary }]}>
                        Your offline Call Break matches, Teen Patti pots, and player scores are securely saved under this account.
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={signOutGoogle}
                      style={[styles.signOutBtn, { borderColor: theme.colors.scoreNegative }]}
                    >
                      <LogOut size={16} color={theme.colors.scoreNegative} />
                      <Text style={[styles.signOutText, { color: theme.colors.scoreNegative }]}>
                        Sign Out of Google
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.signInSection}>
                    <Text style={[styles.signInPrompt, { color: theme.colors.textSecondary }]}>
                      Sign in with your Google account to save match history, sync across devices, and manage custom player stats.
                    </Text>

                    {/* OAuth Error / Info Banner */}
                    {oauthError && (
                      <View style={[styles.alertBanner, { backgroundColor: isDark ? 'rgba(244, 63, 94, 0.12)' : 'rgba(225, 29, 72, 0.08)', borderColor: theme.colors.scoreNegative }]}>
                        <AlertCircle size={16} color={theme.colors.scoreNegative} />
                        <Text style={[styles.alertText, { color: theme.colors.scoreNegative }]}>{oauthError}</Text>
                      </View>
                    )}

                    {/* OPTION 1: Official Styled Google SSO Button */}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={handleRealGoogleOAuth}
                      style={styles.googleRealBtn}
                    >
                      <View style={styles.googleGLogo}>
                        <Text style={styles.googleGIcon}>G</Text>
                      </View>
                      <Text style={styles.googleRealBtnText}>Sign in with Google</Text>
                    </TouchableOpacity>

                    <Text style={[styles.ssoBenefitText, { color: theme.colors.textMuted }]}>
                      ✓ Saves 13-round match history • Firebase Cloud Sync • Multi-device access
                    </Text>

                    <View style={styles.dividerRow}>
                      <View style={[styles.dividerLine, { backgroundColor: theme.colors.borderGlass }]} />
                      <Text style={[styles.dividerText, { color: theme.colors.textMuted }]}>OR</Text>
                      <View style={[styles.dividerLine, { backgroundColor: theme.colors.borderGlass }]} />
                    </View>

                    {/* OPTION 2: Continue as Guest */}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={handleContinueAsGuest}
                      style={[
                        styles.guestBtn,
                        {
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.04)',
                          borderColor: theme.colors.borderGlass,
                        },
                      ]}
                    >
                      <User size={16} color={theme.colors.textPrimary} />
                      <Text style={[styles.guestBtnText, { color: theme.colors.textPrimary }]}>
                        Continue as Guest
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.guestWarningText, { color: isDark ? '#F87171' : '#E11D48' }]}>
                      ⚠️ Guest mode: Match history, scorecards, and cloud backups will NOT be saved.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* TAB 2: FIREBASE CLOUD SYNC */}
            {activeTab === 'firebase' && (
              <View style={styles.exportSection}>
                {/* Firebase Connection Card */}
                <View style={[styles.cloudInfoCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)', borderColor: theme.colors.borderGlass }]}>
                  <View style={styles.cloudHeaderRow}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
                    <Text style={[styles.cloudProjectText, { color: theme.colors.textPrimary }]}>
                      Firebase Firestore: <Text style={{ color: '#F59E0B', fontWeight: '800' }}>app-gossip</Text>
                    </Text>
                  </View>
                  <Text style={[styles.cloudDesc, { color: theme.colors.textSecondary }]}>
                    All your 13-round matches, custom players, and scoreboard stats are saved in Google Cloud Firestore under your Google Account ID ({user?.uid}).
                  </Text>
                </View>

                {/* Cloud Status / Feedback Message */}
                {firebaseMsg && (
                  <View style={[styles.alertBanner, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.10)', borderColor: '#10B981', marginTop: 12 }]}>
                    <Check size={16} color="#10B981" />
                    <Text style={[styles.alertText, { color: isDark ? '#34D399' : '#059669' }]}>{firebaseMsg}</Text>
                  </View>
                )}

                {/* Cloud Action Buttons */}
                <View style={{ gap: 10, marginTop: 14 }}>
                  <TouchableOpacity
                    disabled={syncingFirebase}
                    onPress={handleSyncToFirebase}
                    style={[styles.cloudBtn, { backgroundColor: theme.colors.accentPrimary }]}
                  >
                    <Cloud size={18} color="#FFFFFF" />
                    <Text style={styles.cloudBtnText}>
                      {syncingFirebase ? 'Syncing to Firebase...' : 'Backup Matches to Firebase Cloud'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={syncingFirebase}
                    onPress={handleRestoreFromFirebase}
                    style={[styles.cloudBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderColor: theme.colors.borderGlass, borderWidth: 1 }]}
                  >
                    <RefreshCw size={18} color={theme.colors.textPrimary} />
                    <Text style={[styles.cloudBtnText, { color: theme.colors.textPrimary }]}>
                      {syncingFirebase ? 'Restoring...' : 'Restore Matches from Firebase Cloud'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* TAB 3: OFFLINE JSON BACKUP */}
            {activeTab === 'export' && (
              <View style={styles.exportSection}>
                <Text style={[styles.exportInfo, { color: theme.colors.textSecondary }]}>
                  Offline JSON snapshot of your matches and players:
                </Text>

                <TouchableOpacity
                  onPress={handleExportJson}
                  style={[styles.generateBtn, { backgroundColor: theme.colors.accentSecondary }]}
                >
                  <Download size={16} color="#FFFFFF" />
                  <Text style={styles.generateBtnText}>Generate Offline JSON</Text>
                </TouchableOpacity>

                {exportedJson !== '' && (
                  <View style={styles.jsonPreviewWrap}>
                    <View style={styles.jsonHeader}>
                      <Text style={[styles.jsonTitle, { color: theme.colors.textPrimary }]}>
                        Backup JSON Ready ({exportedJson.length} bytes):
                      </Text>
                      <TouchableOpacity
                        onPress={handleCopyJson}
                        style={[styles.copyBtn, { backgroundColor: copied ? theme.colors.scorePositive : theme.colors.surfaceGlass, borderColor: theme.colors.borderGlass }]}
                      >
                        {copied ? <Check size={14} color="#FFFFFF" /> : <Copy size={14} color={theme.colors.textPrimary} />}
                        <Text style={[styles.copyBtnText, { color: copied ? '#FFFFFF' : theme.colors.textPrimary }]}>
                          {copied ? 'Copied!' : 'Copy'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      value={exportedJson}
                      editable={false}
                      multiline
                      style={[styles.jsonTextArea, { backgroundColor: isDark ? '#05070E' : '#F1F5F9', color: theme.colors.textPrimary, borderColor: theme.colors.borderGlass }]}
                    />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
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
    maxHeight: '90%',
    padding: 20,
    borderRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  googleGContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  googleG: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4285F4',
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bodyScroll: {
    maxHeight: 460,
  },
  signInSection: {
    marginVertical: 6,
  },
  signInPrompt: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  cloudInfoCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  cloudHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cloudProjectText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cloudDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  cloudBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    borderRadius: 12,
  },
  cloudBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  ssoBenefitText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.2,
  },
  guestBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  guestWarningText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  googleRealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADCE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  googleGLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleGIcon: {
    fontSize: 15,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleRealBtnText: {
    color: '#3C4043',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Roboto, sans-serif' : undefined,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  submitLoginBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitLoginText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  profileSection: {
    marginVertical: 6,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  largeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
  },
  syncStatusCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  syncStatusTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  syncStatusDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '800',
  },
  exportSection: {
    marginVertical: 6,
  },
  exportInfo: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  jsonPreviewWrap: {
    marginTop: 6,
  },
  jsonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  jsonTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  jsonTextArea: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  importSection: {
    marginVertical: 6,
  },
  jsonInputArea: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    marginBottom: 12,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  importBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
