import React from 'react';
import { Card } from '../common/Card';
import { FlameIcon, CheckCircle2Icon, TrendingUpIcon } from '../icons/SvgIcons';

interface ProfileStatsSnapshotProps {
  streakDays: number;
  completedTasksCount: number;
  percentileRank: number;
}

export const ProfileStatsSnapshot: React.FC<ProfileStatsSnapshotProps> = ({
  streakDays,
  completedTasksCount,
  percentileRank,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }} id="profile-stats-grid">
      <Card id="stat-current-streak" style={{ textAlign: 'center', padding: '12px 6px' }}>
        <FlameIcon size={18} color="var(--flame, #FF6B4A)" style={{ margin: '0 auto 4px auto' }} />
        <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>
          {streakDays} <span style={{ fontSize: '11px', fontWeight: 600 }}>days</span>
        </div>
        <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Streak Flame</span>
      </Card>

      <Card id="stat-total-tasks" style={{ textAlign: 'center', padding: '12px 6px' }}>
        <CheckCircle2Icon size={18} color="var(--success)" style={{ margin: '0 auto 4px auto' }} />
        <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>
          {completedTasksCount} <span style={{ fontSize: '11px', fontWeight: 600 }}>tasks</span>
        </div>
        <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Completed</span>
      </Card>

      <Card id="stat-prep-percentile" style={{ textAlign: 'center', padding: '12px 6px' }}>
        <TrendingUpIcon size={18} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
        <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>
          Top {Math.max(1, 100 - percentileRank)}%
        </div>
        <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Percentile</span>
      </Card>
    </div>
  );
};
