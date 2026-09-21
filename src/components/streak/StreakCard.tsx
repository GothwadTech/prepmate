import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { FlameIcon, ShieldIcon, TrophyIcon, ActivityIcon } from '../icons/SvgIcons';
import { STREAK_MILESTONES } from '../../utils/streakUtils';
import { Badge } from '../common/Badge';
import { StreakMilestonesModal } from './StreakMilestonesModal';

export const StreakCard: React.FC = () => {
  const { streakStats, stats, dailyLogs, useStreakShield } = useData();
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [shieldActivating, setShieldActivating] = useState(false);

  const todayLog = dailyLogs.find((l) => l.date === new Date().toISOString().split('T')[0]);
  const isTodayQualifying = streakStats.todayCompleted;
  const currentStreak = streakStats.currentStreak;
  const longestStreak = streakStats.longestStreak;
  const shieldsAvailable = stats.streakShields ?? 1;

  // Next milestone
  const nextMilestone =
    STREAK_MILESTONES.find((m) => m.days > currentStreak) ||
    STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const progressToNext = Math.min(100, Math.round((currentStreak / nextMilestone.days) * 100));

  const handleUseShield = async () => {
    setShieldActivating(true);
    await useStreakShield();
    setShieldActivating(false);
  };

  return (
    <div
      id="streak-card-container"
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'all var(--transition-fast)',
      }}
    >
      {/* 1. Header Row: Flame Icon + Streak Count + Status + Shields */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Flame Icon Container */}
          <div
            style={{
              position: 'relative',
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isTodayQualifying ? 'var(--flame)' : 'rgba(255, 109, 0, 0.12)',
              color: isTodayQualifying ? '#FFFFFF' : 'var(--flame)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isTodayQualifying ? '0 4px 12px rgba(255, 109, 0, 0.35)' : 'none',
              flexShrink: 0,
            }}
          >
            <FlameIcon size={26} color={isTodayQualifying ? '#FFFFFF' : 'var(--flame)'} />
            {isTodayQualifying && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'var(--success)',
                  border: '2px solid var(--surface)',
                  borderRadius: '50%',
                }}
              />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.3px',
                }}
              >
                {currentStreak} Day{currentStreak === 1 ? '' : 's'} Streak
              </h3>

              <Badge
                variant={
                  streakStats.streakStatus === 'active_today'
                    ? 'success'
                    : streakStats.streakStatus === 'at_risk'
                    ? 'danger'
                    : 'warning'
                }
              >
                {streakStats.streakStatus === 'active_today'
                  ? 'Active Today'
                  : streakStats.streakStatus === 'at_risk'
                  ? 'Streak At Risk'
                  : 'Pending Today'}
              </Badge>
            </div>

            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Personal Best: <strong style={{ color: 'var(--text-primary)' }}>{longestStreak} days</strong> • Total Active:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{streakStats.totalActiveDays} days</strong>
            </p>
          </div>
        </div>

        {/* Shields Quick Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(26, 115, 232, 0.1)',
            border: '1px solid rgba(26, 115, 232, 0.25)',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <ShieldIcon size={15} color="var(--primary)" />
          <span>{shieldsAvailable} Shield{shieldsAvailable === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* 2. Daily Streak Qualification Goal Status Box */}
      <div
        style={{
          backgroundColor: 'var(--surface-variant)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ActivityIcon size={14} color="var(--primary)" />
            Today&apos;s Streak Qualification
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: isTodayQualifying ? 'var(--success)' : 'var(--warning)',
            }}
          >
            {isTodayQualifying ? '✓ Qualified (+1 Streak Day)' : 'In Progress (25m study or 1 task)'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--surface)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border)',
              fontSize: '11.5px',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Study Time:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {todayLog?.studyMinutes || 0} / 25 mins
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--surface)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border)',
              fontSize: '11.5px',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Tasks Done:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {todayLog?.tasksCompleted || 0} / 1 required
            </span>
          </div>
        </div>
      </div>

      {/* 3. Next Milestone Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <TrophyIcon size={14} color="var(--warning)" />
            Next Milestone: <strong style={{ color: 'var(--text-primary)' }}>{nextMilestone.title} ({nextMilestone.days}d)</strong>
          </span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {currentStreak}/{nextMilestone.days} days ({progressToNext}%)
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: '7px',
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: `${progressToNext}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #FF9E40 0%, #FF6D00 100%)',
              borderRadius: 'var(--radius-pill)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* 4. Footer Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle)',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => setShowMilestonesModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          View All Badges ({STREAK_MILESTONES.filter((m) => m.unlocked).length}/{STREAK_MILESTONES.length})
        </button>

        {shieldsAvailable > 0 && !isTodayQualifying && (
          <button
            type="button"
            disabled={shieldActivating}
            onClick={handleUseShield}
            style={{
              backgroundColor: 'rgba(26, 115, 232, 0.12)',
              border: '1px solid rgba(26, 115, 232, 0.3)',
              color: 'var(--primary)',
              fontSize: '11.5px',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldIcon size={14} color="var(--primary)" />
            {shieldActivating ? 'Activating...' : 'Activate Shield Today'}
          </button>
        )}
      </div>

      {/* 5. Milestones Modal */}
      <AnimatePresence>
        {showMilestonesModal && (
          <StreakMilestonesModal
            milestones={streakStats.allMilestones}
            currentStreak={currentStreak}
            onClose={() => setShowMilestonesModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
