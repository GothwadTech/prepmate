import React from 'react';
import { FlameIcon, ClockIcon, ShieldIcon, TrophyIcon, ActivityIcon } from '../icons/SvgIcons';
import { UserStats } from '../../types';
import { STREAK_MILESTONES } from '../../utils/streakUtils';

interface HomeCombinedStreakCardProps {
  stats: UserStats;
  currentStreak: number;
  completedTasks: number;
  totalTasks: number;
  overallProgress: number;
  shieldsAvailable: number;
  streakStats?: {
    todayCompleted?: boolean;
    currentStreak?: number;
  };
  shieldActivating: boolean;
  onUseShield: () => void;
  onOpenTimer: () => void;
  onOpenMilestones: () => void;
}

export const HomeCombinedStreakCard: React.FC<HomeCombinedStreakCardProps> = ({
  stats,
  currentStreak,
  completedTasks,
  totalTasks,
  overallProgress,
  shieldsAvailable,
  streakStats,
  shieldActivating,
  onUseShield,
  onOpenTimer,
  onOpenMilestones,
}) => {
  const nextMilestone =
    STREAK_MILESTONES.find((m) => m.days > currentStreak) ||
    STREAK_MILESTONES[STREAK_MILESTONES.length - 1];

  return (
    <div
      id="today-streak-combined-card"
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        padding: '14px 16px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header: Title + Overall % Done */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              flexShrink: 0,
            }}
          >
            <ActivityIcon size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Today&apos;s Overview & Streak
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
              Daily preparation & streak protection
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: overallProgress === 100 ? 'var(--success)' : 'var(--primary)',
            backgroundColor: overallProgress === 100 ? 'var(--success-container)' : 'var(--primary-container)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)',
          }}
        >
          {overallProgress}% Done
        </span>
      </div>

      {/* Sleek Progress Track */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="progress-track" style={{ height: '6px', borderRadius: '3px' }}>
          <div
            className="progress-fill"
            style={{
              width: `${overallProgress}%`,
              borderRadius: '3px',
              background:
                overallProgress === 100
                  ? 'var(--success)'
                  : 'linear-gradient(90deg, var(--primary) 0%, #34A853 100%)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {completedTasks} of {totalTasks} daily study tasks done
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: overallProgress === 100 ? 'var(--success)' : 'var(--primary)',
            }}
          >
            {overallProgress === 100 ? 'Goal Crushed! 🏆' : overallProgress >= 50 ? 'Great Momentum 🚀' : 'Keep Pushing 📚'}
          </span>
        </div>
      </div>

      {/* 4-Stat Balanced Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {/* Day Streak */}
        <div
          style={{
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 4px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--flame)' }}>
            <FlameIcon size={15} color="var(--flame)" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--flame)' }}>
              {currentStreak}d
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {streakStats?.todayCompleted ? 'Active' : 'Pending'}
          </span>
        </div>

        {/* Tasks Done */}
        <div
          style={{
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 4px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {completedTasks}/{totalTasks}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Tasks Done
          </span>
        </div>

        {/* Study Time */}
        <div
          onClick={onOpenTimer}
          style={{
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 4px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            cursor: 'pointer',
          }}
          title="Tap to open Study Timer"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ClockIcon size={12} color="var(--primary)" />
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {Math.floor(stats.todayStudyMinutes / 60)}h{stats.todayStudyMinutes % 60}m
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>
            Timer ⏱️
          </span>
        </div>

        {/* Shields */}
        <div
          style={{
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 4px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--primary)' }}>
            <ShieldIcon size={14} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
              {shieldsAvailable}
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Shields
          </span>
        </div>
      </div>

      {/* Milestone & Shield Action Footer Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          backgroundColor: 'var(--surface-variant)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <TrophyIcon size={14} color="var(--warning)" />
          <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Next: <strong style={{ color: 'var(--text-primary)' }}>{nextMilestone.title} ({currentStreak}/{nextMilestone.days}d)</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {shieldsAvailable > 0 && !streakStats?.todayCompleted && (
            <button
              type="button"
              onClick={onUseShield}
              disabled={shieldActivating}
              style={{
                background: 'rgba(26, 115, 232, 0.15)',
                border: '1px solid rgba(26, 115, 232, 0.3)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px 8px',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {shieldActivating ? 'Freezing...' : 'Use Shield'}
            </button>
          )}

          <button
            type="button"
            onClick={onOpenMilestones}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '2px 4px',
            }}
          >
            Milestones →
          </button>
        </div>
      </div>
    </div>
  );
};
