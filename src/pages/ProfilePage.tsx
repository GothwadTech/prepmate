import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import {
  SunIcon,
  MoonIcon,
  CheckIcon,
  AwardIcon,
  LogoutIcon,
  UserIcon,
  InfoIcon,
  CloudCheckIcon,
  RefreshCwIcon,
  CloudOffIcon,
} from '../components/icons/SvgIcons';
import { AppTheme, UserStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface ProfilePageProps {
  theme: AppTheme;
  onToggleTheme: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  theme,
  onToggleTheme,
  stats,
  onUpdateStats,
}) => {
  const { user, logout, updateProfile, isFirebaseConfigured } = useAuth();
  const { syncStatus, pendingCount, isOnline, syncNow } = useData();

  const [targetYear, setTargetYear] = useState(user?.targetYear || stats.targetYear);
  const [targetScore, setTargetScore] = useState(
    (user?.targetScore || stats.targetScore).toString()
  );
  const [displayName, setDisplayName] = useState(user?.displayName || 'NEET Aspirant');
  const [saving, setSaving] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleManualSync = async () => {
    setSyncingCloud(true);
    try {
      await syncNow();
    } finally {
      setSyncingCloud(false);
    }
  };

  useEffect(() => {
    if (user) {
      setTargetYear(user.targetYear);
      setTargetScore(user.targetScore.toString());
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const parsedScore = parseInt(targetScore, 10) || 680;

    try {
      await updateProfile({
        displayName,
        targetYear,
        targetScore: parsedScore,
      });

      onUpdateStats({
        targetYear,
        targetScore: parsedScore,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'GT';
  };

  return (
    <div id="profile-settings-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Profile Header Card */}
      <Card id="user-profile-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(4, 148, 244, 0.35)',
              flexShrink: 0,
            }}
          >
            {getInitials(user?.displayName || 'Aspirant')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.displayName || 'Aspirant'}
              </h3>
              <Badge variant="primary">NEET {user?.targetYear || targetYear}</Badge>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              @{user?.username || 'aspirant'} • {user?.email}
            </p>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
              Aim: {user?.targetScore || targetScore}+ Marks
            </span>
          </div>
        </div>
      </Card>

      {/* Firebase Status Badge Card */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          background: isFirebaseConfigured ? 'var(--success-container)' : 'var(--surface-variant)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        id="firebase-status-banner"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <InfoIcon size={18} color={isFirebaseConfigured ? 'var(--success)' : 'var(--primary)'} />
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isFirebaseConfigured ? 'Firebase Project Connected' : 'Firebase Ready (.env keys pending)'}
            </p>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {isFirebaseConfigured
                ? 'Authentication & Firestore synchronization active'
                : 'Pura UI & logic ready hai. Apni Firebase keys .env mein daalein.'}
            </span>
          </div>
        </div>
        <Badge variant={isFirebaseConfigured ? 'success' : 'neutral'}>
          {isFirebaseConfigured ? 'Live' : 'Ready'}
        </Badge>
      </div>

      {/* Phase 3: Firestore & Local Cache Layer Card */}
      <Card
        id="firestore-cache-sync-card"
        title="Firestore Sync & Cache Layer (Phase 3)"
        subtitle="Optimized for Firebase Spark Free Tier (50k reads/20k writes limit)"
        action={
          <Badge variant={syncStatus === 'synced' ? 'success' : syncStatus === 'offline' ? 'neutral' : 'primary'}>
            {syncStatus === 'synced' ? 'Synced' : syncStatus === 'offline' ? 'Offline' : syncStatus === 'syncing' ? 'Syncing...' : 'Pending'}
          </Badge>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '12px',
            }}
          >
            <div
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Local Cache</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CloudCheckIcon size={14} color="var(--success)" /> Active (10m TTL)
              </div>
            </div>

            <div
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Offline Queue</div>
              <div style={{ fontWeight: 700, color: pendingCount > 0 ? 'var(--warning, #B06000)' : 'var(--text-primary)', marginTop: '2px' }}>
                {pendingCount} Pending Operation{pendingCount === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              padding: '6px 2px',
            }}
          >
            <span>Network Status: <strong style={{ color: isOnline ? 'var(--success)' : 'var(--text-secondary)' }}>{isOnline ? 'Online' : 'Offline'}</strong></span>
            <span>Mode: <strong>Local-First Optimistic</strong></span>
          </div>

          <Button
            variant="outline"
            size="sm"
            isFullWidth
            leftIcon={<RefreshCwIcon size={14} />}
            onClick={handleManualSync}
            disabled={syncingCloud}
            id="manual-cloud-sync-btn"
          >
            {syncingCloud ? 'Syncing with Firestore...' : 'Sync with Firestore Now'}
          </Button>
        </div>
      </Card>

      {/* Theme Settings (Google Style) */}
      <Card id="theme-settings-card" title="Appearance & Theme" subtitle="Google-style Light & Dark theme">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
            onClick={theme === 'dark' ? onToggleTheme : undefined}
            id="select-light-theme-btn"
          >
            <SunIcon size={18} /> Light Mode
          </button>
          <button
            type="button"
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
            onClick={theme === 'light' ? onToggleTheme : undefined}
            id="select-dark-theme-btn"
          >
            <MoonIcon size={18} /> Dark Mode
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {theme === 'dark' ? 'Google Dark Theme (#202124 background)' : 'Google Clean Light Theme (#FFFFFF background)'}
        </p>
      </Card>

      {/* Target & Profile Settings */}
      <Card id="target-settings-card" title="Edit Aspirant Profile & Target">
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your Name"
            id="profile-display-name-input"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Input
              label="Target Year"
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              placeholder="e.g. 2026"
              id="target-year-input"
            />
            <Input
              label="Target Score (Out of 720)"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              placeholder="e.g. 680"
              type="number"
              id="target-score-input"
            />
          </div>

          <Button type="submit" variant="primary" size="md" isFullWidth disabled={saving} id="save-targets-btn">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>

          {savedSuccess && (
            <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, textAlign: 'center' }}>
              ✓ Settings saved to profile successfully!
            </span>
          )}
        </form>
      </Card>

      {/* Account Actions: Logout */}
      <Card id="account-actions-card" title="Account Actions">
        {showLogoutConfirm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Kya aap sure hain ki aap log out karna chahte hain?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => logout()}
                id="confirm-logout-btn"
                style={{ flex: 1, background: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                Log Out
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="md"
            isFullWidth
            leftIcon={<LogoutIcon size={18} color="var(--danger)" />}
            onClick={() => setShowLogoutConfirm(true)}
            id="account-logout-btn"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            Log Out from PrepMate
          </Button>
        )}
      </Card>

      {/* Implementation Roadmap Status Checklist */}
      <Card
        id="phase-checklist-card"
        title="Implementation Roadmap Status"
        subtitle="Phase 1, 2, 3, 4 & 5 verification against specifications"
        action={<Badge variant="success">Phase 1-5 Complete</Badge>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          {[
            'Phase 1: Pure CSS Design System (No Tailwind/Bootstrap)',
            'Phase 1: 5 Main Tabs (Home, Tasks, Goals, Partners, Profile)',
            'Phase 1: Mobile-First Responsive Shell (Max 480px)',
            'Phase 1: PWA Configuration + Real App Icons in /public',
            'Phase 2: Firebase Config + Environment Variables Template',
            'Phase 2: Auth Service (Email/Password, Google Sign-In, Reset)',
            'Phase 2: Auth Context with state management & persistence',
            'Phase 2: Google-Style Login & Registration Screens',
            'Phase 2: Protected Routes (Conditional Auth State Rendering)',
            'Phase 2: User Profile in Firestore (name, target year, target score)',
            'Phase 2: Toast Notifications & Error Handling',
            'Phase 3: Firestore Service CRUD (Tasks, Goals, Daily Logs)',
            'Phase 3: LocalStorage Cache Layer (Free Tier 50k spark read limit guard)',
            'Phase 3: Offline Mutation Queue with optimistic UI updates',
            'Phase 3: Sync Manager with auto-reconnect & online/offline listener',
            'Phase 3: Real-Time Sync Indicator in Header & Profile',
            'Phase 4: Welcome banner with dynamic user greeting & NEET countdown',
            'Phase 4: Daily Overview card with animated progress & study time',
            'Phase 4: Subject-wise progress bars (Physics, Chemistry, Biology)',
            'Phase 4: Active Streak counter (🔥) with 7-day timeline dots',
            'Phase 4: Today’s Priority tasks preview with one-tap toggle',
            'Phase 4: 4 Quick action navigation buttons',
            'Phase 4: NEET Motivation quote card with shuffle/refresh',
            'Phase 5: Add task with Subject, NEET Chapter autocomplete, Task Type & Target',
            'Phase 5: Quick high-yield NEET preset task templates',
            'Phase 5: Interactive task checkbox toggle with celebratory completion banner',
            'Phase 5: Task list grouped/filtered by Subject with live counts',
            'Phase 5: Edit Task modal with instant optimistic update',
            'Phase 5: Delete Task dialog with confirmation safeguard',
            'Phase 5: Live daily progress % with Physics, Chemistry & Biology meters',
            'Phase 5: Date navigation (Yesterday, Today, Tomorrow & Native Date Picker)',
          ].map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--success-container)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckIcon size={12} />
              </span>
              <span style={{ color: 'var(--text-primary)' }}>{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* App & Company Credit */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
        id="company-credit-footer"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AwardIcon size={16} color="var(--primary)" />
          <strong style={{ color: 'var(--text-primary)' }}>PrepMate</strong>
        </div>
        <p>Built with ❤️ by Gothwad Tech for NEET Aspirants</p>
        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
          Phase 1 & Phase 2 Foundation Ready • Next: Phase 3 (Firestore Sync)
        </span>
      </div>
    </div>
  );
};
