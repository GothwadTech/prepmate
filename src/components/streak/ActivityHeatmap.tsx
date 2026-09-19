import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { generateHeatmapGrid, HeatmapDayCell, formatMinutesToHours } from '../../utils/streakUtils';
import { FlameIcon, ShieldIcon, CalendarIcon, ActivityIcon, CloseIcon } from '../icons/SvgIcons';
import { Badge } from '../common/Badge';

export const ActivityHeatmap: React.FC = () => {
  const { dailyLogs, streakStats, saveDailyReflection } = useData();
  const [selectedDay, setSelectedDay] = useState<HeatmapDayCell | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate 14-week grid
  const weeks = useMemo(() => {
    return generateHeatmapGrid(dailyLogs, 14);
  }, [dailyLogs]);

  // Aggregate stats over these 14 weeks
  const totalHeatmapStudyMins = useMemo(() => {
    return weeks.reduce(
      (sum, week) =>
        sum +
        week.days.reduce((dSum, d) => dSum + (d.studyMinutes || 0), 0),
      0
    );
  }, [weeks]);

  const activeDaysInPeriod = useMemo(() => {
    return weeks.reduce(
      (sum, week) =>
        sum +
        week.days.filter((d) => d.isShieldUsed || d.studyMinutes >= 25 || d.tasksCompleted >= 1).length,
      0
    );
  }, [weeks]);

  const handleSelectDay = (day: HeatmapDayCell) => {
    setSelectedDay(day);
    setReflectionText(day.notes || '');
    setIsEditingReflection(false);
  };

  const handleSaveReflection = async () => {
    if (!selectedDay) return;
    setIsSaving(true);
    await saveDailyReflection(selectedDay.date, reflectionText);
    setSelectedDay((prev: HeatmapDayCell | null) => (prev ? { ...prev, notes: reflectionText } : null));
    setIsSaving(false);
    setIsEditingReflection(false);
  };

  const getCellBgColor = (level: number) => {
    switch (level) {
      case 4:
        return 'var(--success)';
      case 3:
        return 'rgba(15, 157, 88, 0.8)';
      case 2:
        return 'rgba(15, 157, 88, 0.55)';
      case 1:
        return 'rgba(15, 157, 88, 0.3)';
      case 0:
      default:
        return 'var(--surface-variant)';
    }
  };

  return (
    <div
      id="activity-heatmap-container"
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* 1. Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
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
            <ActivityIcon size={18} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Study Consistency Matrix
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '6px' }}>
                (Last 14 Weeks / 98 Days)
              </span>
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              {formatMinutesToHours(totalHeatmapStudyMins)} logged • {activeDaysInPeriod} active days • {streakStats.currentStreak} day streak
            </p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '10px', marginRight: '2px' }}>Less</span>
          <span
            style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--surface-variant)', border: '1px solid var(--border)' }}
            title="0 mins"
          />
          <span
            style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(15, 157, 88, 0.3)' }}
            title="1-45 mins"
          />
          <span
            style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(15, 157, 88, 0.55)' }}
            title="46-90 mins"
          />
          <span
            style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(15, 157, 88, 0.8)' }}
            title="91-180 mins"
          />
          <span
            style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--success)' }}
            title="181+ mins"
          />
          <span style={{ fontSize: '10px', marginLeft: '2px' }}>More</span>
        </div>
      </div>

      {/* 2. Heatmap Grid Container with Horizontal Scroll */}
      <div style={{ overflowX: 'auto', paddingBottom: '6px', paddingTop: '4px' }}>
        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'flex-start' }}>
          {/* Day-of-week labels Column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '9.5px',
              fontWeight: 700,
              color: 'var(--text-tertiary)',
              paddingTop: '2px',
              userSelect: 'none',
              width: '14px',
            }}
          >
            <span style={{ height: '16px', lineHeight: '16px' }}>M</span>
            <span style={{ height: '16px', lineHeight: '16px', opacity: 0 }}>T</span>
            <span style={{ height: '16px', lineHeight: '16px' }}>W</span>
            <span style={{ height: '16px', lineHeight: '16px', opacity: 0 }}>T</span>
            <span style={{ height: '16px', lineHeight: '16px' }}>F</span>
            <span style={{ height: '16px', lineHeight: '16px', opacity: 0 }}>S</span>
            <span style={{ height: '16px', lineHeight: '16px' }}>S</span>
          </div>

          {/* 14 Weeks Columns */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {weeks.map((week, wIndex) => (
              <div key={wIndex} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {week.days.map((day) => {
                  const isSelected = selectedDay?.date === day.date;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '3px',
                        backgroundColor: getCellBgColor(day.level),
                        border: isSelected
                          ? '2px solid var(--text-primary)'
                          : day.isToday
                          ? '1.5px solid var(--primary)'
                          : day.level === 0
                          ? '1px solid var(--border)'
                          : 'none',
                        cursor: 'pointer',
                        padding: 0,
                        position: 'relative',
                        boxShadow: isSelected ? '0 0 6px rgba(0,0,0,0.3)' : 'none',
                        transform: isSelected ? 'scale(1.15)' : 'none',
                        zIndex: isSelected ? 2 : 1,
                        transition: 'transform 0.15s ease',
                      }}
                      title={`${day.date}: ${day.studyMinutes}m study, ${day.tasksCompleted} tasks done ${
                        day.isShieldUsed ? '(Shield Used)' : ''
                      }`}
                    >
                      {day.isShieldUsed && (
                        <span
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            color: 'var(--primary)',
                          }}
                        >
                          🛡
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Selected Day Inspector Deep Dive */}
      <AnimatePresence>
        {selectedDay && (
          <div
            id="heatmap-selected-day-panel"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface-variant)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {selectedDay.isToday && (
                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--primary-container)',
                        color: 'var(--primary)',
                      }}
                    >
                      Today
                    </span>
                  )}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <CloseIcon size={15} />
              </button>
            </div>

            {/* Quick stats grid for this day */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Total Study</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatMinutesToHours(selectedDay.studyMinutes)}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Tasks Done</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedDay.tasksCompleted}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Streak Valid</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: selectedDay.isShieldUsed
                      ? 'var(--primary)'
                      : (selectedDay.studyMinutes >= 25 || selectedDay.tasksCompleted >= 1)
                      ? 'var(--success)'
                      : 'var(--text-tertiary)',
                  }}
                >
                  {selectedDay.isShieldUsed
                    ? 'Shield'
                    : (selectedDay.studyMinutes >= 25 || selectedDay.tasksCompleted >= 1)
                    ? '✓ Yes'
                    : 'No'}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Intensity</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Lvl {selectedDay.level}/4
                </span>
              </div>
            </div>

            {/* Reflection editor in heatmap panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Daily Notes / Journal:
                </span>
                {!isEditingReflection ? (
                  <button
                    type="button"
                    onClick={() => {
                      setReflectionText(selectedDay.notes || '');
                      setIsEditingReflection(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '11px',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {selectedDay.notes ? 'Edit Note' : '+ Add Note'}
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveReflection}
                      style={{
                        fontSize: '10.5px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--primary)',
                        color: '#FFF',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingReflection(false)}
                      style={{
                        fontSize: '10.5px',
                        padding: '2px 6px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {isEditingReflection ? (
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Record your preparation summary or doubts from this day..."
                  rows={2}
                  style={{
                    width: '100%',
                    fontSize: '11.5px',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              ) : selectedDay.notes ? (
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    backgroundColor: 'var(--surface)',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    margin: 0,
                  }}
                >
                  "{selectedDay.notes}"
                </p>
              ) : (
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
                  No study notes logged for this day.
                </p>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
