import React from 'react';
import { LoginPage } from '../../pages/auth/LoginPage';
import { SignupPage } from '../../pages/auth/SignupPage';
import { VerificationPage } from '../../pages/auth/VerificationPage';
import { AppTheme } from '../../types';

interface AppAuthFlowProps {
  authScreen: 'login' | 'signup' | 'verification';
  setAuthScreen: (screen: 'login' | 'signup' | 'verification') => void;
  pendingAuthData: { email: string; password?: string };
  setPendingAuthData: React.Dispatch<React.SetStateAction<{ email: string; password?: string }>>;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const AppAuthFlow: React.FC<AppAuthFlowProps> = ({
  authScreen,
  setAuthScreen,
  pendingAuthData,
  setPendingAuthData,
  onOpenTerms,
  onOpenPrivacy,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="app-viewport" id="prepmate-viewport">
      <div
        className="app-container"
        id="prepmate-auth-container"
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {authScreen === 'login' ? (
          <LoginPage
            onNavigateToSignup={() => setAuthScreen('signup')}
            onNavigateToVerification={(email, password) => {
              setPendingAuthData({ email, password });
              setAuthScreen('verification');
            }}
            onOpenTerms={onOpenTerms}
            onOpenPrivacy={onOpenPrivacy}
            prefilledIdentifier={pendingAuthData.email}
            prefilledPassword={pendingAuthData.password}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
        ) : authScreen === 'signup' ? (
          <SignupPage
            onNavigateToLogin={() => setAuthScreen('login')}
            onNavigateToVerification={(email, password) => {
              setPendingAuthData({ email, password });
              setAuthScreen('verification');
            }}
            onOpenTerms={onOpenTerms}
            onOpenPrivacy={onOpenPrivacy}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
        ) : (
          <VerificationPage
            email={pendingAuthData.email}
            password={pendingAuthData.password}
            onNavigateToLogin={(autofillData) => {
              if (autofillData) {
                setPendingAuthData({
                  email: autofillData.email,
                  password: autofillData.password,
                });
              }
              setAuthScreen('login');
            }}
            onOpenTerms={onOpenTerms}
            onOpenPrivacy={onOpenPrivacy}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
        )}
      </div>
    </div>
  );
};
