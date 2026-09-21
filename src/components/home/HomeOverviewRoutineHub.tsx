import React, { useState } from 'react';
import { UserStats } from '../../types';
import { HomeHubHeader } from './HomeHubHeader';
import { HomeHubOverviewPanel } from './HomeHubOverviewPanel';
import { WeeklyCalendarView } from '../streak/WeeklyCalendarView';
import { ActivityHeatmap } from '../streak/ActivityHeatmap';

interface HomeOverviewRoutineHubProps {
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

export const HomeOverviewRoutineHub: React.FC<HomeOverviewRoutineHubProps> = ({
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
  const [activeTab, setActiveTab] = useState<'overview' | 'weekly' | 'heatmap'>('overview');

  return (
    <div
      id="home-unified-performance-hub"
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <HomeHubHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' && (
        <HomeHubOverviewPanel
          stats={stats}
          currentStreak={currentStreak}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          overallProgress={overallProgress}
          shieldsAvailable={shieldsAvailable}
          streakStats={streakStats}
          shieldActivating={shieldActivating}
          onUseShield={onUseShield}
          onOpenTimer={onOpenTimer}
          onOpenMilestones={onOpenMilestones}
          onViewWeekly={() => setActiveTab('weekly')}
        />
      )}

      {activeTab === 'weekly' && (
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <WeeklyCalendarView />
        </div>
      )}

      {activeTab === 'heatmap' && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px' }}>
          <ActivityHeatmap />
        </div>
      )}
    </div>
  );
};
