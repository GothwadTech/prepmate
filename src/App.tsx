import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { TimerProvider } from './context/TimerContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { TasksPage } from './pages/TasksPage';
import { GoalsPage } from './pages/GoalsPage';
import { PartnersPage } from './pages/PartnersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ToastContainer } from './components/common/Toast';
import { TimerModal } from './components/timer/TimerModal';
import { FloatingTimerBar } from './components/timer/FloatingTimerBar';
import { AppTab, AppTheme, UserStats } from './types';

function MainApp() {
  const { user, loading, toasts, dismissToast } = useAuth();
  const {
    tasks,
    goals,
    stats,
    syncStatus,
    pendingCount,
    syncNow,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskItem,
    addGoal,
    toggleGoal,
    deleteGoal,
    updateGoalItem,
    updateStats,
  } = useData();

  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');

  // Theme state persisted in localStorage
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('prepmate_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Sync theme changes to html/body dataset
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('prepmate_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const getTabTitle = (tab: AppTab) => {
    switch (tab) {
      case 'home':
        return 'Dashboard';
      case 'tasks':
        return 'Daily Tasks';
      case 'goals':
        return 'Goals Tracker';
      case 'partners':
        return 'Partners';
      case 'profile':
        return 'Profile';
    }
  };

  // 1. Loading Splash Screen
  if (loading) {
    return (
      <div className="app-viewport" id="prepmate-viewport">
        <div
          className="app-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            minHeight: '100vh',
            background: 'var(--bg)',
          }}
        >
          <img
            src="/icon-192.png"
            alt="PrepMate Logo"
            style={{ width: '64px', height: '64px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.4px' }}>
              PrepMate
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Loading your study dashboard...
            </p>
          </div>
          <div
            style={{
              width: '120px',
              height: '3px',
              background: 'var(--surface-variant)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '60%',
                height: '100%',
                background: 'var(--primary)',
                borderRadius: '9999px',
                animation: 'pulse 1.2s infinite ease-in-out',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Protected View: Show Login or Signup Page
  if (!user) {
    return (
      <div className="app-viewport" id="prepmate-viewport">
        <div className="app-container" id="prepmate-auth-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {authScreen === 'login' ? (
            <LoginPage
              onNavigateToSignup={() => setAuthScreen('signup')}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          ) : (
            <SignupPage
              onNavigateToLogin={() => setAuthScreen('login')}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          )}
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div>
      </div>
    );
  }

  // 3. Authenticated App Flow: 5 Protected Main Tabs
  return (
    <div className="app-viewport" id="prepmate-viewport">
      <div className="app-container" id="prepmate-app-container">
        {/* Sticky Google-Style Top Header */}
        <Header
          theme={theme}
          onToggleTheme={handleToggleTheme}
          activeTabTitle={getTabTitle(activeTab)}
          syncStatus={syncStatus}
          pendingCount={pendingCount}
          onSyncClick={syncNow}
        />

        {/* Dynamic Page Content */}
        <main className="main-content" id="prepmate-main-content">
          {activeTab === 'home' && (
            <HomePage onNavigateTab={(tab) => setActiveTab(tab)} stats={stats} />
          )}

          {activeTab === 'tasks' && (
            <TasksPage
              tasks={tasks}
              onToggleTask={toggleTask}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTaskItem}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsPage
              goals={goals}
              onAddGoal={addGoal}
              onToggleGoalComplete={toggleGoal}
              onDeleteGoal={deleteGoal}
              onUpdateGoal={updateGoalItem}
            />
          )}

          {activeTab === 'partners' && <PartnersPage stats={stats} />}

          {activeTab === 'profile' && (
            <ProfilePage
              theme={theme}
              onToggleTheme={handleToggleTheme}
              stats={stats}
              onUpdateStats={updateStats}
            />
          )}
        </main>

        {/* Floating Mini Timer bar when timer is running in background */}
        <FloatingTimerBar />

        {/* 5-Tab Google/Play Store Style Bottom Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

        {/* Full Study Timer Modal / Sheet */}
        <TimerModal />

        {/* Global Floating Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <TimerProvider>
          <MainApp />
        </TimerProvider>
      </DataProvider>
    </AuthProvider>
  );
}
