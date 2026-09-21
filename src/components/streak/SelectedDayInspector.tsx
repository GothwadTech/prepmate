import React from 'react';
import { WeekCalendarDay, formatMinutesToHours } from '../../utils/streakUtils';
import { TaskItem } from '../../types';
import { Badge } from '../common/Badge';
import { CheckIcon } from '../icons/SvgIcons';
import { WeeklySubjectBalance } from './WeeklySubjectBalance';
import { DayReflectionJournal } from './DayReflectionJournal';

interface SelectedDayInspectorProps {
  activeDay: WeekCalendarDay;
  activeDayTasks: TaskItem[];
  totalWeekMinutes: number;
  physicsMinutes: number;
  physicsPercent: number;
  chemistryMinutes: number;
  chemistryPercent: number;
  biologyMinutes: number;
  biologyPercent: number;
  onSaveReflection: (date: string, notes: string) => Promise<void>;
}

export const SelectedDayInspector: React.FC<SelectedDayInspectorProps> = ({
  activeDay,
  activeDayTasks,
  totalWeekMinutes,
  physicsMinutes,
  physicsPercent,
  chemistryMinutes,
  chemistryPercent,
  biologyMinutes,
  biologyPercent,
  onSaveReflection,
}) => {
  return (
    <div
      id="selected-day-inspector"
      style={{
        backgroundColor: 'var(--surface-variant)',
        borderRadius: 'var(--radius-sm)',
        padding: '14px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {new Date(activeDay.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h4>
            {activeDay.isToday && (
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--primary-container)',
                  color: 'var(--primary)',
                }}
              >
                Today
              </span>
            )}
          </div>

          <Badge
            variant={
              activeDay.isShieldUsed
                ? 'primary'
                : activeDay.isCompleted
                ? 'success'
                : 'neutral'
            }
          >
            {activeDay.isShieldUsed
              ? '🛡️ Shield Preserved'
              : activeDay.isCompleted
              ? '🔥 Streak Qualified'
              : 'Under 25m Threshold'}
          </Badge>
        </div>

        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
          Study: <strong style={{ color: 'var(--text-primary)' }}>{formatMinutesToHours(activeDay.studyMinutes)}</strong> • Tasks Completed:{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {activeDay.tasksCompleted}/{activeDay.tasksTotal || activeDay.tasksCompleted}
          </strong>
        </p>
      </div>

      {/* Weekly NEET Subject Balance */}
      <WeeklySubjectBalance
        totalWeekMinutes={totalWeekMinutes}
        physicsMinutes={physicsMinutes}
        physicsPercent={physicsPercent}
        chemistryMinutes={chemistryMinutes}
        chemistryPercent={chemistryPercent}
        biologyMinutes={biologyMinutes}
        biologyPercent={biologyPercent}
      />

      {/* Tasks list for this day if any */}
      {activeDayTasks.length > 0 && (
        <div
          style={{
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Tasks Scheduled / Completed for {activeDay.dayName}:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {activeDayTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckIcon
                    size={14}
                    color={t.completed ? 'var(--success)' : 'var(--text-tertiary)'}
                  />
                  <span
                    style={{
                      fontWeight: 600,
                      textDecoration: t.completed ? 'line-through' : 'none',
                      color: t.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    }}
                  >
                    {t.title}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-xs)',
                    fontWeight: 700,
                    backgroundColor: 'var(--surface-variant)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {t.subject}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Reflection & Study Journal */}
      <DayReflectionJournal
        activeDay={activeDay}
        onSaveReflection={onSaveReflection}
      />
    </div>
  );
};
