import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { TimerProvider, useTimer } from './context/TimerContext';
import { NavigationProvider, useNavigation, useBackHandler } from './context/NavigationContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { TasksPage } from './pages/TasksPage';
import { GoalsPage } from './pages/GoalsPage';
import { PartnersPage } from './pages/PartnersPage';
import { ProfilePage } from './pages/ProfilePage';
import { SyllabusPage } from './pages/SyllabusPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TimerPage } from './pages/TimerPage';
import { TermsPage } from './pages/legal/TermsPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { AppLoadingScreen } from './components/layout/AppLoadingScreen';
import { AppAuthFlow } from './components/layout/AppAuthFlow';
import { ToastContainer } from './components/common/Toast';
import { TimerModal } from './components/timer/TimerModal';
import { FloatingTimerBar } from './components/timer/FloatingTimerBar';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { NotificationCenterModal } from './components/notification/NotificationCenterModal';
import { SyncQueueInspectorModal } from './components/sync/SyncQueueInspectorModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppTab, AppTheme } from './types';

function MainApp() {
  const { user, loading, toasts, dismissToast } = useAuth();
  const {
    activeTab,
    navigateToTab,
    navigateBack,
    legalScreen,
    openLegalScreen,
    closeLegalScreen,
    authScreen,
    setAuthScreen,
    pendingAuthData,
    setPendingAuthData,
  } = useNavigation();

  const { isTimerOpen, closeTimer } = useTimer();

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

  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Register Back handlers so device back button closes open modals first
  useBackHandler(
    isTimerOpen,
    () => {
      closeTimer();
      return true;
    },
    100,
    'main-timer-modal'
  );

  useBackHandler(
    isNotifModalOpen,
    () => {
      setIsNotifModalOpen(false);
      return true;
    },
    100,
    'main-notif-modal'
  );

  useBackHandler(
    isSyncModalOpen,
    () => {
      setIsSyncModalOpen(false);
      return true;
    },
    100,
    'main-sync-modal'
  );

  // Theme state persisted in localStorage
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('prepmate_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Sync theme changes to html/body dataset
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('prepmate_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 1. Loading Splash Screen
  if (loading) {
    return <AppLoadingScreen />;
  }

  // 2. Legal Pages (Terms of Service & Privacy Policy)
  if (legalScreen === 'terms') {
    return (
      <div className="app-viewport" id="prepmate-viewport">
        <TermsPage onBack={navigateBack} />
      </div>
    );
  }

  if (legalScreen === 'privacy') {
    return (
      <div className="app-viewport" id="prepmate-viewport">
        <PrivacyPage onBack={navigateBack} />
      </div>
    );
  }

  // 3. Unauthenticated Protected View: Show Login, Signup, or Email Verification Page
  if (!user) {
    return (
      <AppAuthFlow
        authScreen={authScreen}
        setAuthScreen={setAuthScreen}
        pendingAuthData={pendingAuthData}
        setPendingAuthData={setPendingAuthData}
        onOpenTerms={() => openLegalScreen('terms')}
        onOpenPrivacy={() => openLegalScreen('privacy')}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // 4. Authenticated App Flow: 5 Protected Main Tabs
  return (
    <div className="app-viewport" id="prepmate-viewport">
      <div className="app-container" id="prepmate-app-container">
        {/* Sticky Google-Style Top Header */}
        <Header
          onOpenProfile={() => navigateToTab('profile')}
          isProfileActive={activeTab === 'profile'}
          onBack={navigateBack}
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
            <HomePage onNavigateTab={(tab) => navigateToTab(tab)} stats={stats} />
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

          {activeTab === 'timer' && <TimerPage />}

          {activeTab === 'partners' && <PartnersPage stats={stats} />}

          {activeTab === 'syllabus' && (
            <SyllabusPage onNavigateToTasks={() => navigateToTab('tasks')} />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              theme={theme}
              onToggleTheme={handleToggleTheme}
              stats={stats}
              onUpdateStats={updateStats}
              onBack={navigateBack}
              onNavigateToAnalytics={() => navigateToTab('analytics')}
              onOpenSyncInspector={() => setIsSyncModalOpen(true)}
              onOpenNotifications={() => setIsNotifModalOpen(true)}
              onOpenTerms={() => openLegalScreen('terms')}
              onOpenPrivacy={() => openLegalScreen('privacy')}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage onBack={navigateBack} />
          )}
        </main>

        {/* Floating Mini Timer bar when timer is running in background */}
        {activeTab !== 'timer' && (
          <FloatingTimerBar onNavigateToTimer={() => navigateToTab('timer')} />
        )}

        {/* 5-Tab Google/Play Store Style Bottom Navigation (Hidden on Profile & Analytics screen) */}
        {activeTab !== 'profile' && activeTab !== 'analytics' && (
          <BottomNav activeTab={activeTab} onSelectTab={(tab) => navigateToTab(tab)} />
        )}

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
            navigateToTab(tab);
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
            <NavigationProvider>
              <MainApp />
            </NavigationProvider>
          </TimerProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
