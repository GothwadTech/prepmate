import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { UserProfile } from '../types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  username: string;
  targetYear: string;
  targetScore: number;
}

const LOCAL_STORAGE_USER_KEY = 'prepmate_auth_user_active';

/**
 * Clean data so undefined properties are never passed to Firestore setDoc/updateDoc
 */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      clean[k] = v;
    }
  }
  return clean;
}

export const authService = {
  /**
   * Search for an existing user in Firestore by email or username
   */
  async findUserByIdentifier(identifier: string): Promise<UserProfile | null> {
    if (!isFirebaseConfigured || !db) return null;
    const clean = identifier.trim();
    if (!clean) return null;

    try {
      const usersRef = collection(db, 'users');
      const isEmail = clean.includes('@');

      if (isEmail) {
        const cleanEmail = clean.toLowerCase();
        const qEmail = query(usersRef, where('email', '==', cleanEmail));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          return snapEmail.docs[0].data() as UserProfile;
        }

        // Check exact match fallback
        if (clean !== cleanEmail) {
          const qExact = query(usersRef, where('email', '==', clean));
          const snapExact = await getDocs(qExact);
          if (!snapExact.empty) {
            return snapExact.docs[0].data() as UserProfile;
          }
        }
        return null;
      } else {
        const cleanUsername = clean.replace(/^@/, '').toLowerCase();
        const qUser = query(usersRef, where('username', '==', cleanUsername));
        const snapUser = await getDocs(qUser);
        if (!snapUser.empty) {
          return snapUser.docs[0].data() as UserProfile;
        }
        return null;
      }
    } catch (err) {
      console.warn('Error querying Firestore for user identifier:', err);
      return null;
    }
  },

  /**
   * Resolve an identifier (email, username, or phone) to the user's registered email
   */
  async resolveIdentifierToEmail(identifier: string): Promise<string> {
    const cleanId = identifier.trim();
    if (!cleanId.includes('@')) {
      const user = await this.findUserByIdentifier(cleanId);
      if (user?.email) {
        return user.email;
      }
    }
    return cleanId;
  },

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
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoProfile));
      localStorage.setItem('prepmate_auth_user_demo', JSON.stringify(demoProfile));
      return demoProfile;
    }

    // Verify username availability before creating account
    const existingWithUsername = await this.findUserByIdentifier(cleanUsername);
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

    // 4. Create profile document in Firestore (strictly sanitizing undefined values)
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
          const parsed = JSON.parse(saved);
          return parsed;
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
      const user = await this.findUserByIdentifier(clean);
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
      err.email = emailToUse;
      throw err;
    }

    const profile = await this.getUserProfile(userCredential.user.uid);
    if (profile) {
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
   * Send Password Reset Email with verified existence check
   */
  async sendPasswordReset(identifier: string): Promise<{ email: string }> {
    const clean = identifier.trim();
    if (!clean) {
      throw new Error('Please enter your registered email or username.');
    }

    if (!isFirebaseConfigured || !auth || !db) {
      return { email: clean.includes('@') ? clean : `${clean}@example.com` };
    }

    const isEmail = clean.includes('@');

    // Strictly verify whether this email or username actually exists in our database!
    const existingUser = await this.findUserByIdentifier(clean);
    if (!existingUser || !existingUser.email) {
      const err: any = new Error(
        isEmail
          ? 'No account found with this email address.'
          : 'No account found with this username.'
      );
      err.code = 'auth/user-not-found';
      throw err;
    }

    await sendPasswordResetEmail(auth, existingUser.email);
    return { email: existingUser.email };
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
