import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/core/theme/ThemeContext';
import { AuthProvider, useAuth } from './src/core/auth/AuthContext';
import { CallBreakMatch } from './src/core/types';
import { getActiveMatch } from './src/core/storage/storage';
import { AuroraBackground } from './src/components/common/AuroraBackground';
import { FloatingNavbar } from './src/components/common/FloatingNavbar';
import { GamesHubScreen } from './src/screens/GamesHubScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { NewMatchScreen } from './src/screens/NewMatchScreen';
import { ActiveMatchScreen } from './src/screens/ActiveMatchScreen';
import { TeenPattiScreen } from './src/screens/TeenPattiScreen';
import { UniversalTrackerScreen } from './src/screens/UniversalTrackerScreen';
import { RulesModal } from './src/games/callbreak/components/RulesModal';
import { GoogleSignInModal } from './src/screens/GoogleSignInModal';
import { PlayersDirectoryModal } from './src/screens/PlayersDirectoryModal';
import { ThemeCustomizerDrawer } from './src/components/common/ThemeCustomizerDrawer';

export type ScreenState =
  | 'hub'
  | 'callbreak-dashboard'
  | 'callbreak-new'
  | 'callbreak-active'
  | 'teenpatti'
  | 'universal';

function MainApp() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  // Navigation state: Default to Games Hub
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('hub');
  const [activeMatch, setActiveMatch] = useState<CallBreakMatch | null>(null);

  // Modals
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [showPlayersModal, setShowPlayersModal] = useState<boolean>(false);
  const [pendingGameToLaunch, setPendingGameToLaunch] = useState<string | null>(null);

  // Load active match
  useEffect(() => {
    getActiveMatch().then((match) => {
      if (match && match.status === 'in_progress') {
        setActiveMatch(match);
      }
    });
  }, [currentScreen]);

  // Game selection handler
  // Game selection handler - completely allows guest and authenticated users
  const handleSelectGame = (gameId: string) => {
    launchGameScreen(gameId);
  };

  const launchGameScreen = (gameId: string) => {
    if (gameId === 'callbreak') {
      setCurrentScreen('callbreak-dashboard');
    } else if (gameId === 'teenpatti') {
      setCurrentScreen('teenpatti');
    } else if (gameId === 'universal') {
      setCurrentScreen('universal');
    }
  };

  const handleGoogleAuthSuccess = () => {
    if (pendingGameToLaunch) {
      launchGameScreen(pendingGameToLaunch);
      setPendingGameToLaunch(null);
    }
  };

  const handleResumeCallBreak = () => {
    if (activeMatch) {
      setCurrentScreen('callbreak-active');
    } else {
      setCurrentScreen('callbreak-dashboard');
    }
  };

  return (
    <AuroraBackground>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        {/* Sleek Anchored Full-Width Top Glass Header */}
        <FloatingNavbar
          currentScreen={currentScreen}
          onOpenRules={() => setShowRules(true)}
          onOpenGoogleProfile={() => setShowGoogleModal(true)}
          onOpenPlayers={() => setShowPlayersModal(true)}
          onGoHome={() => setCurrentScreen('hub')}
        />

        <View style={styles.appWrapper}>
          {/* Dynamic Screen Container */}
          <View style={styles.content}>
            {/* 1. ACETERNITY BENTO GAMES HUB */}
            {currentScreen === 'hub' && (
              <GamesHubScreen
                onSelectGame={handleSelectGame}
                hasActiveCallBreak={!!activeMatch}
                onResumeCallBreak={handleResumeCallBreak}
                onOpenGoogleAuth={() => setShowGoogleModal(true)}
                onOpenRules={() => setShowRules(true)}
              />
            )}

            {/* 2. CALL BREAK DASHBOARD */}
            {currentScreen === 'callbreak-dashboard' && (
              <DashboardScreen
                onStartNewGame={() => setCurrentScreen('callbreak-new')}
                onResumeGame={(m) => {
                  setActiveMatch(m);
                  setCurrentScreen('callbreak-active');
                }}
                onOpenRules={() => setShowRules(true)}
              />
            )}

            {/* 3. CALL BREAK NEW MATCH (EMPTY INITIAL PLAYERS) */}
            {currentScreen === 'callbreak-new' && (
              <NewMatchScreen
                onBack={() => setCurrentScreen('callbreak-dashboard')}
                onMatchCreated={(m) => {
                  setActiveMatch(m);
                  setCurrentScreen('callbreak-active');
                }}
              />
            )}

            {/* 4. CALL BREAK ACTIVE 13-ROUND MATCH */}
            {currentScreen === 'callbreak-active' && activeMatch && (
              <ActiveMatchScreen
                initialMatch={activeMatch}
                onGoHome={() => setCurrentScreen('callbreak-dashboard')}
              />
            )}

            {/* 5. TEEN PATTI SCREEN */}
            {currentScreen === 'teenpatti' && (
              <TeenPattiScreen onBack={() => setCurrentScreen('hub')} />
            )}

            {/* 6. UNIVERSAL GAME SCOREKEEPER */}
            {currentScreen === 'universal' && (
              <UniversalTrackerScreen onBack={() => setCurrentScreen('hub')} />
            )}
          </View>

          {/* Call Break Offline Rules Guide Modal */}
          <RulesModal visible={showRules} onClose={() => setShowRules(false)} />

          {/* Google Sign-In & Google Docs JSON Cloud Sync Modal */}
          <GoogleSignInModal
            visible={showGoogleModal}
            onClose={() => {
              setShowGoogleModal(false);
              setPendingGameToLaunch(null);
            }}
            onSuccess={handleGoogleAuthSuccess}
            reason={pendingGameToLaunch ? 'Please sign in with Google before launching this game.' : undefined}
          />
          {/* Global Players Directory Modal */}
          <PlayersDirectoryModal
            visible={showPlayersModal}
            onClose={() => setShowPlayersModal(false)}
          />
          {/* Aesthetics & Theme Studio Drawer (DesignPrompts.dev Presets) */}
          <ThemeCustomizerDrawer />
        </View>
      </SafeAreaView>
    </AuroraBackground>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },
});
