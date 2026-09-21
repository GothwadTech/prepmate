import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
  getWeekCalendarDays,
  calculateWeeklySubjectBreakdown,
  formatDateKey,
} from '../../utils/streakUtils';
import { WeekDaysStrip } from './WeekDaysStrip';
import { SelectedDayInspector } from './SelectedDayInspector';

export const WeeklyCalendarView: React.FC = () => {
  const { dailyLogs, tasks, saveDailyReflection } = useData();
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey(new Date()));

  const referenceDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + currentWeekOffset * 7);
    return d;
  }, [currentWeekOffset]);

  const weekDays = useMemo(() => {
    return getWeekCalendarDays(referenceDate, dailyLogs);
  }, [referenceDate, dailyLogs]);

  const activeDay = useMemo(() => {
    return weekDays.find((d) => d.date === selectedDate) || weekDays[0];
  }, [weekDays, selectedDate]);

  const subjectBreakdown = useMemo(() => {
    return calculateWeeklySubjectBreakdown(weekDays);
  }, [weekDays]);

  const phyItem = subjectBreakdown.find((s) => s.subject === 'Physics');
  const chemItem = subjectBreakdown.find((s) => s.subject === 'Chemistry');
  const bioItem = subjectBreakdown.find((s) => s.subject === 'Biology');

  const totalWeekMinutes =
    (phyItem?.minutes || 0) + (chemItem?.minutes || 0) + (bioItem?.minutes || 0);
  const physicsMinutes = phyItem?.minutes || 0;
  const physicsPercent = phyItem?.percentage || 0;
  const chemistryMinutes = chemItem?.minutes || 0;
  const chemistryPercent = chemItem?.percentage || 0;
  const biologyMinutes = bioItem?.minutes || 0;
  const biologyPercent = bioItem?.percentage || 0;

  const activeDayTasks = useMemo(() => {
    return tasks.filter((t) => t.date === activeDay?.date);
  }, [tasks, activeDay?.date]);

  const weekRangeTitle = useMemo(() => {
    if (weekDays.length === 0) return '';
    const start = new Date(weekDays[0].date + 'T00:00:00');
    const end = new Date(weekDays[6].date + 'T00:00:00');
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [weekDays]);

  const handleSelectDay = (date: string) => {
    setSelectedDate(date);
  };

  const handleResetToday = () => {
    setCurrentWeekOffset(0);
    setSelectedDate(formatDateKey(new Date()));
  };

  if (!activeDay) return null;

  return (
    <div
      id="weekly-calendar-container"
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
      <WeekDaysStrip
        weekDays={weekDays}
        selectedDate={selectedDate}
        onSelectDay={handleSelectDay}
        currentWeekOffset={currentWeekOffset}
        onOffsetChange={setCurrentWeekOffset}
        onResetToday={handleResetToday}
        weekRangeTitle={weekRangeTitle}
      />

      <SelectedDayInspector
        activeDay={activeDay}
        activeDayTasks={activeDayTasks}
        totalWeekMinutes={totalWeekMinutes}
        physicsMinutes={physicsMinutes}
        physicsPercent={physicsPercent}
        chemistryMinutes={chemistryMinutes}
        chemistryPercent={chemistryPercent}
        biologyMinutes={biologyMinutes}
        biologyPercent={biologyPercent}
        onSaveReflection={saveDailyReflection}
      />
    </div>
  );
};
