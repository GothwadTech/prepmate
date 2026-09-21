import React from 'react';
import { Card } from '../common/Card';

interface ProfileLevelXpCardProps {
  currentLevel: number;
  levelTitle: string;
  currentXp: number;
  xpProgressInLevel: number;
  xpNeededForNext: number;
  xpProgressPercent: number;
  studyHoursPoints: number;
  tasksPoints: number;
  streakPoints: number;
}

export const ProfileLevelXpCard: React.FC<ProfileLevelXpCardProps> = ({
  currentLevel,
  levelTitle,
  currentXp,
  xpProgressInLevel,
  xpNeededForNext,
  xpProgressPercent,
  studyHoursPoints,
  tasksPoints,
  streakPoints,
}) => {
  return (
    <Card
      id="level-xp-card"
      title={`Level ${currentLevel}: ${levelTitle}`}
      subtitle={`${currentXp.toLocaleString()} Total XP Accumulated`}
      action={
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--secondary)',
            backgroundColor: 'var(--secondary-container)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          Level {currentLevel}/10
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>XP to Level {currentLevel + 1}:</span>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            {xpProgressInLevel} / {xpNeededForNext} XP ({xpProgressPercent}%)
          </span>
        </div>

        {/* XP Progress Bar */}
        <div
          style={{
            height: '10px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--border)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${xpProgressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--secondary) 0%, #9C27B0 100%)',
              borderRadius: 'var(--radius-pill)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* XP Breakdown Earned */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            marginTop: '6px',
            textAlign: 'center',
            fontSize: '11px',
          }}
        >
          <div style={{ padding: '6px 4px', background: 'var(--surface-variant)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Study Hours</div>
            <strong style={{ color: 'var(--primary)' }}>+{studyHoursPoints * 25} XP</strong>
          </div>
          <div style={{ padding: '6px 4px', background: 'var(--surface-variant)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Daily Tasks</div>
            <strong style={{ color: 'var(--success)' }}>+{tasksPoints * 20} XP</strong>
          </div>
          <div style={{ padding: '6px 4px', background: 'var(--surface-variant)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Streak Bonus</div>
            <strong style={{ color: 'var(--flame, #FF6B4A)' }}>+{streakPoints * 30} XP</strong>
          </div>
        </div>
      </div>
    </Card>
  );
};
