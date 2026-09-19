import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './config';
import { UserProfile } from '../types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  username: string;
  targetYear: string;
  targetScore: number;
}

const LOCAL_STORAGE_USER_KEY = 'prepmate_auth_user_demo';

export const authService = {
  /**
   * Register with Email and Password
   */
  async signUp(data: SignUpData): Promise<UserProfile> {
    const cleanUsername = data.username.trim().replace(/^@/, '').toLowerCase();

    if (!isFirebaseConfigured || !auth || !db) {
      // Demo Mode fallback when keys not yet added
      const demoProfile: UserProfile = {
        uid: `demo-user-${Date.now()}`,
        email: data.email,
        displayName: data.name,
        username: cleanUsername,
        targetYear: data.targetYear || '2026',
        targetScore: Number(data.targetScore) || 680,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoProfile));
      return demoProfile;
    }

    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // 2. Update display name in Firebase Auth
    await updateProfile(user, {
      displayName: data.name,
    });

    // 3. Create profile document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: data.email,
      displayName: data.name,
      username: cleanUsername,
      targetYear: data.targetYear || '2026',
      targetScore: Number(data.targetScore) || 680,
      createdAt: new Date().toISOString(),
      photoURL: user.photoURL || undefined,
    };

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, userProfile);

    return userProfile;
  },

  /**
   * Login with Email and Password
   */
  async login(email: string, password: string): Promise<UserProfile> {
    if (!isFirebaseConfigured || !auth || !db) {
      // Check for saved demo user or create default
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      const demoProfile: UserProfile = {
        uid: 'demo-aspirant-1',
        email,
        displayName: 'NEET Aspirant',
        username: 'neet_aspirant26',
        targetYear: '2026',
        targetScore: 680,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoProfile));
      return demoProfile;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await this.getUserProfile(userCredential.user.uid);
    if (profile) return profile;

    // Fallback if Firestore doc wasn't created yet
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email || email,
      displayName: userCredential.user.displayName || 'NEET Aspirant',
      username: (userCredential.user.email || 'user').split('@')[0],
      targetYear: '2026',
      targetScore: 680,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Google One-Click Sign In
   */
  async loginWithGoogle(): Promise<UserProfile> {
    if (!isFirebaseConfigured || !auth || !db || !googleProvider) {
      const demoProfile: UserProfile = {
        uid: 'google-demo-user',
        email: 'aspirant@gmail.com',
        displayName: 'Google Aspirant',
        username: 'google_aspirant',
        targetYear: '2026',
        targetScore: 690,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoProfile));
      return demoProfile;
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if doc exists
    let profile = await this.getUserProfile(user.uid);
    if (!profile) {
      const generatedUsername = (user.displayName || 'aspirant')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .slice(0, 15);

      profile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'NEET Aspirant',
        username: generatedUsername,
        targetYear: '2026',
        targetScore: 680,
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || undefined,
      };

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, profile);
    }

    return profile;
  },

  /**
   * Log out current user
   */
  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    if (auth && isFirebaseConfigured) {
      await signOut(auth);
    }
  },

  /**
   * Send Password Reset Email
   */
  async sendPasswordReset(email: string): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      // Demo simulated success
      return;
    }
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Fetch user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!isFirebaseConfigured || !db) {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    }

    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile from Firestore:', err);
      return null;
    }
  },

  /**
   * Update user profile in Firestore
   */
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...parsed, ...updates };
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(merged));
      }
      return;
    }

    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, updates, { merge: true });
  },
};
