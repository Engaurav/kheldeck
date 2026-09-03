import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleUserProfile } from '../types';
import { getStoredGoogleUser, saveStoredGoogleUser } from '../storage/storage';
import { loadGoogleGsiScript } from './GoogleAuthService';
import { syncUserProfileToFirestore } from '../firebase/firestoreService';

interface AuthContextType {
  user: GoogleUserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  signInWithGoogle: (email?: string, name?: string, photo?: string) => Promise<boolean>;
  setVerifiedGoogleUser: (profile: GoogleUserProfile) => Promise<void>;
  continueAsGuest: () => void;
  signOutGoogle: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isGuest: true,
  signInWithGoogle: async () => false,
  setVerifiedGoogleUser: async () => {},
  continueAsGuest: () => {},
  signOutGoogle: async () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Load saved user from local storage
    getStoredGoogleUser()
      .then((saved) => {
        if (saved) {
          setUser(saved);
        }
      })
      .finally(() => setLoading(false));

    // 2. Pre-load official Google GSI script on Web
    loadGoogleGsiScript().catch(() => {});
  }, []);

  const signInWithGoogle = async (
    customEmail?: string,
    customName?: string,
    customPhoto?: string
  ): Promise<boolean> => {
    try {
      const email = customEmail?.trim() || 'user@gmail.com';
      const name = customName?.trim() || email.split('@')[0] || 'Player';
      const photoURL =
        customPhoto ||
        `https://lh3.googleusercontent.com/a/ACg8ocL${Math.random().toString(36).substring(2, 8)}`;

      const googleUser: GoogleUserProfile = {
        uid: 'g_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        email,
        displayName: name,
        photoURL,
        authProvider: 'google',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };

      setUser(googleUser);
      await saveStoredGoogleUser(googleUser);
      // Auto-sync user profile to Cloud Firestore
      syncUserProfileToFirestore(googleUser).catch(() => {});
      return true;
    } catch (err) {
      console.error('Google Sign-In error:', err);
      return false;
    }
  };

  const setVerifiedGoogleUser = async (profile: GoogleUserProfile): Promise<void> => {
    setUser(profile);
    await saveStoredGoogleUser(profile);
    syncUserProfileToFirestore(profile).catch(() => {});
  };

  const continueAsGuest = (): void => {
    const guestUser: GoogleUserProfile = {
      uid: 'guest_' + Date.now(),
      email: '',
      displayName: 'Guest Player',
      authProvider: 'guest' as any,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };
    setUser(guestUser);
  };

  const signOutGoogle = async (): Promise<void> => {
    setUser(null);
    await saveStoredGoogleUser(null);
  };

  const isGuest = !user || user.authProvider === 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.authProvider !== 'guest',
        isGuest,
        signInWithGoogle,
        setVerifiedGoogleUser,
        continueAsGuest,
        signOutGoogle,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
