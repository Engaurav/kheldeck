import { doc, setDoc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { GoogleUserProfile, CallBreakMatch, Player } from '../types';

/**
 * Saves or updates a user profile in Firestore under /users/{uid}
 */
export async function syncUserProfileToFirestore(user: GoogleUserProfile): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        authProvider: user.authProvider || 'google',
        lastLoginAt: Date.now(),
        updatedAt: Date.now(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Firestore user sync error:', err);
    return false;
  }
}

/**
 * Saves a single Call Break match under /users/{userId}/matches/{matchId}
 */
export async function syncMatchToFirestore(userId: string, match: CallBreakMatch): Promise<boolean> {
  try {
    const matchRef = doc(db, 'users', userId, 'matches', match.id);
    await setDoc(matchRef, {
      ...match,
      syncedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.error('Firestore match sync error:', err);
    return false;
  }
}

/**
 * Syncs all local matches to Firestore for a user
 */
export async function syncAllMatchesToFirestore(userId: string, matches: CallBreakMatch[]): Promise<number> {
  let count = 0;
  for (const match of matches) {
    const ok = await syncMatchToFirestore(userId, match);
    if (ok) count++;
  }
  return count;
}

/**
 * Fetches all saved matches for a user from Firestore
 */
export async function fetchUserMatchesFromFirestore(userId: string): Promise<CallBreakMatch[]> {
  try {
    const matchesRef = collection(db, 'users', userId, 'matches');
    const q = query(matchesRef, orderBy('startedAt', 'desc'));
    const snapshot = await getDocs(q);

    const matches: CallBreakMatch[] = [];
    snapshot.forEach((docSnap) => {
      matches.push(docSnap.data() as CallBreakMatch);
    });

    return matches;
  } catch (err) {
    console.error('Firestore fetch matches error:', err);
    return [];
  }
}

/**
 * Saves a player under /users/{userId}/players/{playerId}
 */
export async function syncPlayerToFirestore(userId: string, player: Player): Promise<boolean> {
  try {
    const playerRef = doc(db, 'users', userId, 'players', player.id);
    await setDoc(playerRef, {
      ...player,
      syncedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.error('Firestore player sync error:', err);
    return false;
  }
}
