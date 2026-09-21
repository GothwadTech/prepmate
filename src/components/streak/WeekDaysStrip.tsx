import React from 'react';
import { WeekCalendarDay } from '../../utils/streakUtils';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, FlameIcon, ShieldIcon } from '../icons/SvgIcons';

interface WeekDaysStripProps {
  weekDays: WeekCalendarDay[];
  selectedDate: string;
  onSelectDay: (date: string) => void;
  currentWeekOffset: number;
  onOffsetChange: (updater: (prev: number) => number) => void;
  onResetToday: () => void;
  weekRangeTitle: string;
}

export const WeekDaysStrip: React.FC<WeekDaysStripProps> = ({
  weekDays,
  selectedDate,
  onSelectDay,
  currentWeekOffset,
  onOffsetChange,
  onResetToday,
  weekRangeTitle,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Calendar Header with Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-container)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarIcon size={18} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Weekly Routine & Calendar
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              {weekRangeTitle}{' '}
              {currentWeekOffset === 0 && (
                <span style={{ color: 'var(--primary)', fontWeight: 700, marginLeft: '4px' }}>
                  (Current Week)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Prev / Next Week Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => onOffsetChange((prev) => prev - 1)}
            style={{
              padding: '6px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Previous Week"
          >
            <ChevronLeftIcon size={15} />
          </button>

          {currentWeekOffset !== 0 && (
            <button
              type="button"
              onClick={onResetToday}
              style={{
                fontSize: '11px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 700,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-container)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Today
            </button>
          )}

          <button
            type="button"
            disabled={currentWeekOffset >= 0}
            onClick={() => onOffsetChange((prev) => prev + 1)}
            style={{
              padding: '6px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-secondary)',
              cursor: currentWeekOffset >= 0 ? 'not-allowed' : 'pointer',
              opacity: currentWeekOffset >= 0 ? 0.35 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Next Week"
          >
            <ChevronRightIcon size={15} />
          </button>
        </div>
      </div>

      {/* 7 Days Grid Row */}
      <div
        id="weekly-days-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
        }}
      >
        {weekDays.map((day) => {
          const isSelected = day.date === selectedDate;
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDay(day.date)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected
                  ? '2px solid var(--primary)'
                  : day.isToday
                  ? '1.5px solid var(--primary)'
                  : '1px solid var(--border)',
                backgroundColor: isSelected
                  ? 'var(--primary)'
                  : day.isToday
                  ? 'var(--primary-container)'
                  : 'var(--surface-variant)',
                color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: isSelected ? '0 2px 8px rgba(4, 148, 244, 0.3)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--text-tertiary)',
                }}
              >
                {day.dayName}
              </span>

              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  margin: '2px 0',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                }}
              >
                {day.dateNum}
              </span>

              {/* Status indicator */}
              <div
                style={{
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {day.isShieldUsed ? (
                  <ShieldIcon size={12} color={isSelected ? '#FFFFFF' : 'var(--primary)'} />
                ) : day.isCompleted ? (
                  <FlameIcon size={13} color={isSelected ? '#FFFFFF' : 'var(--flame)'} />
                ) : day.studyMinutes > 0 ? (
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#FFFFFF' : 'var(--success)',
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.4)' : 'var(--border)',
                    }}
                  />
                )}
              </div>

              {/* Study time badge */}
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  marginTop: '2px',
                  color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)',
                }}
              >
                {day.studyMinutes > 0 ? `${day.studyMinutes}m` : '0m'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
