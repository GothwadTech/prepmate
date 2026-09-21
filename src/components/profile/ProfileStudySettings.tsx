import React from 'react';
import { Card } from '../common/Card';
import { SunIcon, MoonIcon } from '../icons/SvgIcons';
import { AppTheme } from '../../types';

interface ProfileStudySettingsProps {
  theme: AppTheme;
  onToggleTheme: () => void;
  dailyGoalHours: number;
  onSelectGoalHours: (hours: number) => void;
  notifications: {
    morningReminder: boolean;
    streakWarning: boolean;
    partnerAlerts: boolean;
    dailySummary: boolean;
  };
  onToggleNotification: (key: 'morningReminder' | 'streakWarning' | 'partnerAlerts' | 'dailySummary') => void;
  hasBrowserNotificationPermission: boolean;
  requestNotificationPermission: () => void;
  sendTestNotification: (type: 'daily_reminder' | 'streak_warning' | 'partner_activity') => void;
}

export const ProfileStudySettings: React.FC<ProfileStudySettingsProps> = ({
  theme,
  onToggleTheme,
  dailyGoalHours,
  onSelectGoalHours,
  notifications,
  onToggleNotification,
  hasBrowserNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
}) => {
  return (
    <Card id="aspirant-settings-card" title="Aspirant Study Settings" subtitle="Daily goal hours, theme & reminders">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Theme Settings (Google Style) */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
            App Theme
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
              onClick={theme === 'dark' ? onToggleTheme : undefined}
              id="select-light-theme-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              <SunIcon size={16} /> Light Theme
            </button>
            <button
              type="button"
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
              onClick={theme === 'light' ? onToggleTheme : undefined}
              id="select-dark-theme-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              <MoonIcon size={16} /> Dark Theme
            </button>
          </div>
        </div>

        {/* Daily Goal Hours */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Target Daily Study Hours:
            </label>
            <span style={{ fontSize: '13px', fontWeight: 900, color: 'var(--primary)' }}>
              {dailyGoalHours} Hours / Day
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {[4, 6, 8, 10, 12].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => onSelectGoalHours(hours)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  border: dailyGoalHours === hours ? '2px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: dailyGoalHours === hours ? 'var(--primary-container)' : 'var(--surface-variant)',
                  color: dailyGoalHours === hours ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {hours}h
              </button>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', marginBottom: 0 }}>
            Recommended for NEET 2026: 6 to 8 hours daily for consistent AIR & GMC qualification.
          </p>
        </div>

        {/* Notifications & Reminders */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Study Notifications & Reminders
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  🌅 Morning Study Kickoff (7:00 AM)
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                  Daily reminder to start your high-priority NEET tasks
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.morningReminder}
                onChange={() => onToggleNotification('morningReminder')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  🔥 Evening Streak Saver Alert (9:00 PM)
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                  Warning alert if daily goals are pending to save streak
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.streakWarning}
                onChange={() => onToggleNotification('streakWarning')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  🤝 Partner Cheers & VS Challenge Updates
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                  Notify when study partner starts studying or sends cheer
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.partnerAlerts}
                onChange={() => onToggleNotification('partnerAlerts')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Quick Test & Browser Alert Row */}
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface-variant)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                🔔 System & Browser Push:
              </span>
              <button
                type="button"
                onClick={requestNotificationPermission}
                style={{
                  backgroundColor: hasBrowserNotificationPermission ? 'var(--success)' : 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '3px 8px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                id="profile-enable-browser-notif-btn"
              >
                {hasBrowserNotificationPermission ? '✓ Enabled' : 'Enable Device Alerts'}
              </button>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Test alerts instantly:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => sendTestNotification('daily_reminder')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🌅 Test 7:00 AM Kickoff
              </button>
              <button
                type="button"
                onClick={() => sendTestNotification('streak_warning')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🔥 Test 9:00 PM Streak Alert
              </button>
              <button
                type="button"
                onClick={() => sendTestNotification('partner_activity')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🤝 Test Partner Cheer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
