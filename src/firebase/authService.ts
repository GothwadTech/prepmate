import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { UserProfile } from '../types';
import { SignUpData, LOCAL_STORAGE_USER_KEY, sanitizeForFirestore } from './authTypes';
import { findUserByIdentifier, resolveIdentifierToEmail, saveToRegisteredUsersList } from './userLookup';

export type { SignUpData };
export { LOCAL_STORAGE_USER_KEY, sanitizeForFirestore };

export const authService = {
  findUserByIdentifier,
  resolveIdentifierToEmail,

  /**
   * Register with Email and Password
   */
  async signUp(data: SignUpData): Promise<UserProfile> {
    const cleanUsername = data.username.trim().replace(/^@/, '').toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!isFirebaseConfigured || !auth || !db) {
      const demoProfile: UserProfile = {
        uid: 'demo-aspirant-uid',
        email: cleanEmail,
        displayName: data.name.trim() || 'NEET Aspirant',
        username: cleanUsername,
        targetYear: data.targetYear || '2026',
        targetScore: Number(data.targetScore) || 685,
        createdAt: new Date().toISOString(),
      };
      saveToRegisteredUsersList(demoProfile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoProfile));
      localStorage.setItem('prepmate_auth_user_demo', JSON.stringify(demoProfile));
      return demoProfile;
    }

    // Verify username availability before creating account
    const existingWithUsername = await findUserByIdentifier(cleanUsername);
    if (existingWithUsername) {
      const err: any = new Error('This username is already taken. Please choose another username.');
      err.code = 'auth/username-already-in-use';
      throw err;
    }

    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
    const user = userCredential.user;

    // 2. Update display name in Firebase Auth
    await updateProfile(user, {
      displayName: data.name.trim(),
    });

    // 3. Send email verification link
    try {
      await sendEmailVerification(user);
    } catch (verifErr) {
      console.warn('Could not trigger verification email:', verifErr);
    }

    // 4. Create profile document in Firestore
    const rawProfile: UserProfile = {
      uid: user.uid,
      email: cleanEmail,
      displayName: data.name.trim(),
      username: cleanUsername,
      targetYear: data.targetYear || '2026',
      targetScore: Number(data.targetScore) || 680,
      createdAt: new Date().toISOString(),
      photoURL: user.photoURL || '',
    };

    const userProfile = sanitizeForFirestore(rawProfile);
    saveToRegisteredUsersList(userProfile);
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, userProfile);

    // Sign out unverified user so they must verify their email before accessing app
    await signOut(auth);

    return userProfile;
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string, password?: string): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      return;
    }
    if (auth.currentUser && auth.currentUser.email === email) {
      await sendEmailVerification(auth.currentUser);
      return;
    }
    if (password) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      await signOut(auth);
      return;
    }
    throw new Error('Please login to resend verification link.');
  },

  /**
   * Login with Identifier (Email or Username) and Password
   */
  async login(identifier: string, password: string): Promise<UserProfile> {
    const clean = identifier.trim();

    if (!isFirebaseConfigured || !auth || !db) {
      const saved = localStorage.getItem('prepmate_auth_user_demo') || localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fall through to create profile
        }
      }
      const cleanUsername = clean.includes('@') ? clean.split('@')[0] : clean.replace(/^@/, '').toLowerCase();
      const demoProfile: UserProfile = {
        uid: 'demo-aspirant-uid',
        email: clean.includes('@') ? clean : `${cleanUsername}@example.com`,
        displayName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1) || 'NEET Aspirant',
        username: cleanUsername,
        targetYear: '2026',
        targetScore: 685,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoProfile));
      localStorage.setItem('prepmate_auth_user_demo', JSON.stringify(demoProfile));
      return demoProfile;
    }

    let emailToUse = clean;

    // If identifier is username, resolve and verify existence in database first
    if (!clean.includes('@')) {
      const user = await findUserByIdentifier(clean);
      if (!user || !user.email) {
        const err: any = new Error('Incorrect email/username or password');
        err.code = 'auth/invalid-credential';
        throw err;
      }
      emailToUse = user.email;
    }

    const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);

    // Enforce email verification
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      const err: any = new Error('Email not verified. Please verify your email.');
      err.code = 'auth/email-not-verified';
      (err as any).email = emailToUse;
      throw err;
    }

    const profile = await this.getUserProfile(userCredential.user.uid);
    if (profile) {
      saveToRegisteredUsersList(profile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      return profile;
    }

    // Fallback if Firestore doc wasn't created yet
    const fallbackProfile: UserProfile = sanitizeForFirestore({
      uid: userCredential.user.uid,
      email: userCredential.user.email || emailToUse,
      displayName: userCredential.user.displayName || 'NEET Aspirant',
      username: (userCredential.user.email || 'user').split('@')[0],
      targetYear: '2026',
      targetScore: 680,
      createdAt: new Date().toISOString(),
      photoURL: userCredential.user.photoURL || '',
    });
    saveToRegisteredUsersList(fallbackProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackProfile));
    return fallbackProfile;
  },

  /**
   * Log out current user
   */
  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem('prepmate_auth_user_demo');
    if (auth && isFirebaseConfigured) {
      await signOut(auth);
    }
  },

  /**
   * Send Password Reset Email with strict user existence check
   */
  async sendPasswordReset(identifier: string): Promise<{ email: string }> {
    const clean = identifier.trim();
    if (!clean) {
      throw new Error('Please enter your registered email or username.');
    }

    if (!isFirebaseConfigured || !auth) {
      const demoUser = await findUserByIdentifier(clean);
      if (!demoUser) {
        const err: any = new Error(
          clean.includes('@')
            ? 'No account found with this email in Firebase. Please check your email or register.'
            : 'No account found with this username. Please check your username or register.'
        );
        (err as any).code = 'auth/user-not-found';
        throw err;
      }
      return { email: demoUser?.email || clean };
    }

    const isEmail = clean.includes('@');
    const existingUser = await findUserByIdentifier(clean);

    // If user is not found in Firestore or Firebase Auth, reject immediately!
    if (!existingUser) {
      const err: any = new Error(
        isEmail
          ? 'No account found with this email in Firebase. Please check your email or register.'
          : 'No account found with this username. Please check your username or register.'
      );
      (err as any).code = 'auth/user-not-found';
      throw err;
    }

    const emailToSend = (existingUser.email || clean).toLowerCase().trim();

    try {
      await sendPasswordResetEmail(auth, emailToSend);
    } catch (firebaseErr: any) {
      const code = String(firebaseErr.code || '').toLowerCase();
      if (code.includes('user-not-found')) {
        const err: any = new Error(
          isEmail
            ? 'No account found with this email in Firebase.'
            : 'No account found with this username.'
        );
        (err as any).code = 'auth/user-not-found';
        throw err;
      }
      throw firebaseErr;
    }

    return { email: emailToSend };
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
    await setDoc(userRef, sanitizeForFirestore(updates as any), { merge: true });
  },
};
