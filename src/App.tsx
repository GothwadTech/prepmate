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
import { SyllabusPage } from './pages/SyllabusPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { VerificationPage } from './pages/auth/VerificationPage';
import { ToastContainer } from './components/common/Toast';
import { TimerModal } from './components/timer/TimerModal';
import { FloatingTimerBar } from './components/timer/FloatingTimerBar';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { NotificationCenterModal } from './components/notification/NotificationCenterModal';
import { SyncQueueInspectorModal } from './components/sync/SyncQueueInspectorModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppTab, AppTheme, UserStats } from './types';

function MainApp() {
  const { user, loading, toasts, dismissToast } = useAuth();
  const {
    tasks,
    goals,
    stats,
    syncStatus,
    pendingCount,
    isOnline,
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
    // Phase 15
    notifications,
    unreadNotifCount,
    markNotifAsRead,
    markAllNotifsAsRead,
    deleteNotification,
    clearAllNotifs,
    sendTestNotification,
    requestNotificationPermission,
    hasBrowserNotificationPermission,
    // Phase 16
    isSimulatingOffline,
    toggleSimulateOffline,
    pendingQueueList,
    conflictLogs,
    removeQueueItem,
    clearQueue,
    clearConflictLogs,
  } = useData();

  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'verification'>('login');
  const [pendingAuthData, setPendingAuthData] = useState<{ email: string; password?: string }>({
    email: '',
    password: '',
  });
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

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
      case 'syllabus':
        return 'NEET Syllabus';
      case 'profile':
        return 'Profile';
      case 'analytics':
        return 'Study Analytics';
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
            alt="Prepmate Logo"
            style={{ width: '64px', height: '64px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.4px' }}>
              Prepmate
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

  // 2. Unauthenticated Protected View: Show Login, Signup, or Email Verification Page
  if (!user) {
    return (
      <div className="app-viewport" id="prepmate-viewport">
        <div className="app-container" id="prepmate-auth-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {authScreen === 'login' ? (
            <LoginPage
              onNavigateToSignup={() => setAuthScreen('signup')}
              onNavigateToVerification={(email, password) => {
                setPendingAuthData({ email, password });
                setAuthScreen('verification');
              }}
              prefilledIdentifier={pendingAuthData.email}
              prefilledPassword={pendingAuthData.password}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          ) : authScreen === 'signup' ? (
            <SignupPage
              onNavigateToLogin={() => setAuthScreen('login')}
              onNavigateToVerification={(email, password) => {
                setPendingAuthData({ email, password });
                setAuthScreen('verification');
              }}
              theme={theme}
              onToggleTheme={handleToggleTheme}
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
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          )}
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
          onOpenProfile={() => setActiveTab('profile')}
          isProfileActive={activeTab === 'profile'}
          onOpenNotifications={() => setIsNotifModalOpen(true)}
          unreadNotifCount={unreadNotifCount}
          onOpenSyncQueue={() => setIsSyncModalOpen(true)}
          syncStatus={syncStatus}
          isOnline={isOnline}
          pendingCount={pendingCount}
        />

        {/* Real-time Offline & Simulation Alert Banner (Phase 16) */}
        <OfflineBanner
          isOnline={isOnline}
          isSimulatingOffline={isSimulatingOffline}
          pendingCount={pendingCount}
          onOpenQueueInspector={() => setIsSyncModalOpen(true)}
          onToggleSimulateOffline={toggleSimulateOffline}
          onSyncNow={syncNow}
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

          {activeTab === 'syllabus' && (
            <SyllabusPage onNavigateToTasks={() => setActiveTab('tasks')} />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              theme={theme}
              onToggleTheme={handleToggleTheme}
              stats={stats}
              onUpdateStats={updateStats}
              onBack={() => setActiveTab('home')}
              onNavigateToAnalytics={() => setActiveTab('analytics')}
              onOpenSyncInspector={() => setIsSyncModalOpen(true)}
              onOpenNotifications={() => setIsNotifModalOpen(true)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage onBack={() => setActiveTab('home')} />
          )}
        </main>

        {/* Floating Mini Timer bar when timer is running in background */}
        <FloatingTimerBar />

        {/* 5-Tab Google/Play Store Style Bottom Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

        {/* Full Study Timer Modal / Sheet */}
        <TimerModal />

        {/* Notification Center Modal (Phase 15) */}
        <NotificationCenterModal
          isOpen={isNotifModalOpen}
          onClose={() => setIsNotifModalOpen(false)}
          notifications={notifications}
          unreadCount={unreadNotifCount}
          onMarkAsRead={markNotifAsRead}
          onMarkAllAsRead={markAllNotifsAsRead}
          onDeleteNotification={deleteNotification}
          onClearAll={clearAllNotifs}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setIsNotifModalOpen(false);
          }}
          onSendTestNotification={sendTestNotification}
          onRequestPermission={requestNotificationPermission}
          hasBrowserPermission={hasBrowserNotificationPermission}
        />

        {/* Sync Queue & Conflict Resolution Inspector Modal (Phase 16) */}
        <SyncQueueInspectorModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          syncStatus={syncStatus}
          isOnline={isOnline}
          isSimulatingOffline={isSimulatingOffline}
          onToggleSimulateOffline={toggleSimulateOffline}
          pendingQueue={pendingQueueList}
          conflictLogs={conflictLogs}
          onRemoveQueueItem={removeQueueItem}
          onClearQueue={clearQueue}
          onClearConflictLogs={clearConflictLogs}
          onSyncNow={syncNow}
        />

        {/* Global Floating Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <TimerProvider>
            <MainApp />
          </TimerProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
