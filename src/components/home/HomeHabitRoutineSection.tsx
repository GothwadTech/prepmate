import React, { useState } from 'react';
import { WeeklyCalendarView } from '../streak/WeeklyCalendarView';
import { ActivityHeatmap } from '../streak/ActivityHeatmap';

export const HomeHabitRoutineSection: React.FC = () => {
  const [streakCalendarView, setStreakCalendarView] = useState<'weekly' | 'heatmap'>('weekly');

  return (
    <div
      id="calendar-streak-section"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Habit & Study Routine
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--surface-variant)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setStreakCalendarView('weekly')}
            style={{
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: streakCalendarView === 'weekly' ? 'var(--surface)' : 'transparent',
              color: streakCalendarView === 'weekly' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: streakCalendarView === 'weekly' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Weekly Routine
          </button>
          <button
            type="button"
            onClick={() => setStreakCalendarView('heatmap')}
            style={{
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: streakCalendarView === 'heatmap' ? 'var(--surface)' : 'transparent',
              color: streakCalendarView === 'heatmap' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: streakCalendarView === 'heatmap' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            14-Week Heatmap
          </button>
        </div>
      </div>

      {streakCalendarView === 'weekly' ? (
        <WeeklyCalendarView />
      ) : (
        <ActivityHeatmap />
      )}
    </div>
  );
};
