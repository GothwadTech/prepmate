import React from 'react';
import { UserStats } from '../../types';
import { STREAK_MILESTONES } from '../../utils/streakUtils';
import { FlameIcon, ClockIcon, ShieldIcon, TrophyIcon } from '../icons/SvgIcons';

interface HomeHubOverviewPanelProps {
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
  onViewWeekly: () => void;
}

export const HomeHubOverviewPanel: React.FC<HomeHubOverviewPanelProps> = ({
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
  onViewWeekly,
}) => {
  const nextMilestone =
    STREAK_MILESTONES.find((m) => m.days > currentStreak) ||
    STREAK_MILESTONES[STREAK_MILESTONES.length - 1];

  const studyHours = Math.floor(stats.todayStudyMinutes / 60);
  const studyMins = stats.todayStudyMinutes % 60;

  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Progress Track & Count */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            {completedTasks} of {totalTasks} daily study tasks completed
          </span>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: overallProgress === 100 ? 'var(--success)' : 'var(--primary)',
            }}
          >
            {overallProgress}% Done
          </span>
        </div>
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
      </div>

      {/* 4 Metric Badges */}
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
            <FlameIcon size={14} color="var(--flame)" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--flame)' }}>
              {currentStreak}d
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {streakStats?.todayCompleted ? 'Active 🔥' : 'Pending'}
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
              {studyHours}h{studyMins}m
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
            <ShieldIcon size={13} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
              {shieldsAvailable}
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Shields
          </span>
        </div>
      </div>

      {/* Milestone Strip + Action Buttons */}
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

      {/* Quick jump to Weekly view */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
        <button
          type="button"
          onClick={onViewWeekly}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>View full weekly routine & NEET subject breakdown</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>→</span>
        </button>
      </div>
    </div>
  );
};
