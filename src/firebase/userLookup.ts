import { collection, query, where, getDocs } from 'firebase/firestore';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from './config';
import { UserProfile } from '../types';
import { LOCAL_STORAGE_USER_KEY } from './authTypes';

export const REGISTERED_USERS_KEY = 'prepmate_registered_users_list';

/**
 * Save user profile to persistent registered users directory
 */
export function saveToRegisteredUsersList(profile: UserProfile): void {
  try {
    const listRaw = localStorage.getItem(REGISTERED_USERS_KEY);
    const list: UserProfile[] = listRaw ? JSON.parse(listRaw) : [];
    const idx = list.findIndex(
      (u) => u.email?.toLowerCase().trim() === profile.email?.toLowerCase().trim()
    );
    if (idx >= 0) {
      list[idx] = profile;
    } else {
      list.push(profile);
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
  } catch {
    // ignore local storage error
  }
}

/**
 * Search for an existing user in Firestore or Firebase Auth by email or username
 */
export async function findUserByIdentifier(identifier: string): Promise<UserProfile | null> {
  const clean = identifier.trim();
  if (!clean) return null;

  // Check local accounts list (for local/offline mode or offline cache)
  const checkLocalStorage = (): UserProfile | null => {
    const listRaw = localStorage.getItem('prepmate_registered_users_list');
    if (listRaw) {
      try {
        const list = JSON.parse(listRaw) as UserProfile[];
        if (Array.isArray(list)) {
          for (const u of list) {
            if (clean.includes('@') && u.email?.toLowerCase().trim() === clean.toLowerCase()) {
              return u;
            }
            if (!clean.includes('@') && u.username?.toLowerCase().trim() === clean.replace(/^@/, '').toLowerCase()) {
              return u;
            }
          }
        }
      } catch {
        // ignore json error
      }
    }

    const saved = localStorage.getItem('prepmate_auth_user_demo') || localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        const u = JSON.parse(saved) as UserProfile;
        if (clean.includes('@') && u.email?.toLowerCase().trim() === clean.toLowerCase()) {
          return u;
        }
        if (!clean.includes('@') && u.username?.toLowerCase().trim() === clean.replace(/^@/, '').toLowerCase()) {
          return u;
        }
      } catch {
        // Fallback
      }
    }
    return null;
  };

  if (!isFirebaseConfigured) {
    return checkLocalStorage();
  }

  const isEmail = clean.includes('@');

  // 1. Try Firestore Lookup
  if (db) {
    try {
      const usersRef = collection(db, 'users');

      if (isEmail) {
        const cleanEmail = clean.toLowerCase();
        // Query lowercased email
        const qEmail = query(usersRef, where('email', '==', cleanEmail));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          return snapEmail.docs[0].data() as UserProfile;
        }

        // Query raw email in case it was stored with mixed case
        if (clean !== cleanEmail) {
          const qExact = query(usersRef, where('email', '==', clean));
          const snapExact = await getDocs(qExact);
          if (!snapExact.empty) {
            return snapExact.docs[0].data() as UserProfile;
          }
        }

        // Deep fallback scan: query collection to handle any custom casing or whitespace in stored profile
        const allSnap = await getDocs(usersRef);
        for (const docSnap of allSnap.docs) {
          const data = docSnap.data() as UserProfile;
          if (data?.email && data.email.trim().toLowerCase() === cleanEmail) {
            return data;
          }
        }
      } else {
        const cleanUsername = clean.replace(/^@/, '').toLowerCase();
        const qUser = query(usersRef, where('username', '==', cleanUsername));
        const snapUser = await getDocs(qUser);
        if (!snapUser.empty) {
          return snapUser.docs[0].data() as UserProfile;
        }

        // Fallback scan for username
        const allSnap = await getDocs(usersRef);
        for (const docSnap of allSnap.docs) {
          const data = docSnap.data() as UserProfile;
          if (data?.username && data.username.trim().toLowerCase() === cleanUsername) {
            return data;
          }
        }
      }
    } catch (err) {
      console.warn('Firestore lookup error in findUserByIdentifier:', err);
    }
  }

  // 2. Check local registered accounts cache as fallback in case Firestore had network/permission issues
  const localMatch = checkLocalStorage();
  if (localMatch) {
    return localMatch;
  }

  // 2. If it's an email and not yet found in Firestore, check Firebase Auth directly
  if (isEmail && auth) {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, clean.toLowerCase());
      if (methods && methods.length > 0) {
        return {
          uid: 'auth-user',
          email: clean.toLowerCase(),
          displayName: clean.split('@')[0],
          username: clean.split('@')[0],
          targetYear: '2026',
          targetScore: 680,
          createdAt: new Date().toISOString(),
        };
      }
    } catch (authErr) {
      // Ignore enumeration or method errors
    }
  }

  return null;
}

/**
 * Resolve an identifier (email or username) to the user's registered email
 */
export async function resolveIdentifierToEmail(identifier: string): Promise<string> {
  const cleanId = identifier.trim();
  if (!cleanId.includes('@')) {
    const user = await findUserByIdentifier(cleanId);
    if (user?.email) {
      return user.email.toLowerCase().trim();
    }
  }
  return cleanId.toLowerCase().trim();
}
