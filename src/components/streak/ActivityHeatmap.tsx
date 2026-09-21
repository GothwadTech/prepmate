import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { generateHeatmapGrid, HeatmapDayCell, formatMinutesToHours } from '../../utils/streakUtils';
import { ActivityIcon } from '../icons/SvgIcons';
import { HeatmapDayModal } from './HeatmapDayModal';

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
          <HeatmapDayModal
            selectedDay={selectedDay}
            onClose={() => setSelectedDay(null)}
            reflectionText={reflectionText}
            setReflectionText={setReflectionText}
            isEditingReflection={isEditingReflection}
            setIsEditingReflection={setIsEditingReflection}
            isSaving={isSaving}
            onSaveReflection={handleSaveReflection}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
