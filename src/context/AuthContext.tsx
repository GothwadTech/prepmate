import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { authService, SignUpData } from '../firebase/authService';
import { UserProfile, ToastNotification } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const profile = await authService.getUserProfile(firebaseUser.uid);
            if (profile) {
              setUser(profile);
            } else {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'NEET Aspirant',
                username: (firebaseUser.email || 'user').split('@')[0],
                targetYear: '2026',
                targetScore: 680,
                createdAt: new Date().toISOString(),
                photoURL: firebaseUser.photoURL || undefined,
              });
            }
          } catch (err) {
            console.error('Error fetching user profile in auth listener:', err);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Demo Mode / Fallback: check localStorage
      const saved = localStorage.getItem('prepmate_auth_user_demo');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      const profile = await authService.login(email, pass);
      setUser(profile);
      showToast(`Welcome back, ${profile.displayName}!`, 'success');
    } catch (error: any) {
      let msg = error.message || 'Login failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      showToast(msg, 'error');
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const profile = await authService.signUp(data);
      setUser(profile);
      showToast('Account created successfully! Welcome to PrepMate.', 'success');
    } catch (error: any) {
      let msg = error.message || 'Signup failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please log in.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      showToast(msg, 'error');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const profile = await authService.loginWithGoogle();
      setUser(profile);
      showToast(`Signed in as ${profile.displayName}`, 'success');
    } catch (error: any) {
      let msg = error.message || 'Google sign in failed.';
      if (error.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign in was cancelled.';
      }
      showToast(msg, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      showToast('Logged out successfully', 'info');
    } catch (error: any) {
      showToast(error.message || 'Logout failed', 'error');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.sendPasswordReset(email);
      showToast(`Password reset link sent to ${email}`, 'success');
    } catch (error: any) {
      let msg = error.message || 'Failed to send reset link.';
      if (error.code === 'auth/user-not-found') {
        msg = 'No account found with this email.';
      }
      showToast(msg, 'error');
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await authService.updateUserProfile(user.uid, updates);
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
      showToast('Profile updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
        updateProfile,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
