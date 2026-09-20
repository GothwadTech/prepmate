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
  signUp: (data: SignUpData) => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (identifier: string) => Promise<{ email: string }>;
  resendVerification: (email: string, password?: string) => Promise<void>;
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
          // If email is not verified, do not allow entry into the app
          if (!firebaseUser.emailVerified) {
            setUser(null);
            setLoading(false);
            return;
          }

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
      throw error;
    }
  };

  const signUp = async (data: SignUpData): Promise<UserProfile> => {
    try {
      const profile = await authService.signUp(data);
      return profile;
    } catch (error: any) {
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

  const resetPassword = async (identifier: string): Promise<{ email: string }> => {
    try {
      const result = await authService.sendPasswordReset(identifier);
      return result;
    } catch (error: any) {
      throw error;
    }
  };

  const resendVerification = async (email: string, password?: string) => {
    try {
      await authService.resendVerificationEmail(email, password);
    } catch (error: any) {
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
        logout,
        resetPassword,
        resendVerification,
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
