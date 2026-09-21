import React from 'react';
import { CalendarIcon } from '../icons/SvgIcons';
import { UserProfile, UserStats } from '../../types';

interface HomeWelcomeStripProps {
  user: UserProfile | null;
  stats: UserStats;
}

export const HomeWelcomeStrip: React.FC<HomeWelcomeStripProps> = ({ user, stats }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDaysToNeet = () => {
    const targetYearNum = parseInt(user?.targetYear || stats.targetYear || '2026', 10);
    const neetDate = new Date(targetYearNum, 4, 3); // May 3
    const today = new Date();
    const diffTime = neetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 230;
  };

  return (
    <div
      id="welcome-banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        backgroundColor: 'var(--surface)',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xs)',
        gap: '8px',
        minHeight: '38px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {getGreeting()}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>•</span>
          <h2 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.displayName ? `${user.displayName} 👋` : 'Doctor Sahab 👋'}
          </h2>
        </div>
        <span
          style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            display: 'none',
            whiteSpace: 'nowrap',
          }}
          className="sm:inline"
        >
          (Target {user?.targetScore || stats.targetScore}+)
        </span>
      </div>

      {/* Compact Countdown Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'var(--primary-container)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-pill)',
          padding: '3px 8px',
          flexShrink: 0,
        }}
        id="neet-countdown-strip"
      >
        <CalendarIcon size={12} color="var(--primary)" />
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
          {getDaysToNeet()}d left
        </span>
      </div>
    </div>
  );
};
