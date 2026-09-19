import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
  getWeekCalendarDays,
  calculateWeeklySubjectBreakdown,
  formatMinutesToHours,
  formatDateKey,
} from '../../utils/streakUtils';
import { FlameIcon, ShieldIcon, CalendarIcon, ChevronRightIcon, ChevronLeftIcon, CheckIcon } from '../icons/SvgIcons';
import { Badge } from '../common/Badge';

export const WeeklyCalendarView: React.FC = () => {
  const { dailyLogs, tasks, saveDailyReflection } = useData();
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey(new Date()));
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);

  // Reference date based on offset
  const referenceDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + currentWeekOffset * 7);
    return d;
  }, [currentWeekOffset]);

  // Generate 7 days for the week
  const weekDays = useMemo(() => {
    return getWeekCalendarDays(referenceDate, dailyLogs);
  }, [referenceDate, dailyLogs]);

  // Find active selected day
  const activeDay = useMemo(() => {
    return weekDays.find((d) => d.date === selectedDate) || weekDays[0];
  }, [weekDays, selectedDate]);

  // Subject breakdown for this week
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

  // Tasks associated with active selected day
  const activeDayTasks = useMemo(() => {
    return tasks.filter((t) => t.date === activeDay?.date);
  }, [tasks, activeDay?.date]);

  // Format week range title
  const weekRangeTitle = useMemo(() => {
    if (weekDays.length === 0) return '';
    const start = new Date(weekDays[0].date + 'T00:00:00');
    const end = new Date(weekDays[6].date + 'T00:00:00');
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [weekDays]);

  const handleSelectDay = (date: string) => {
    setSelectedDate(date);
    const day = weekDays.find((d) => d.date === date);
    setReflectionInput(day?.log?.notes || '');
    setIsEditingNote(false);
  };

  const handleSaveReflection = async () => {
    if (!activeDay) return;
    setIsSavingNote(true);
    await saveDailyReflection(activeDay.date, reflectionInput);
    setIsSavingNote(false);
    setIsEditingNote(false);
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
      {/* 1. Calendar Header with Navigation */}
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
            onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
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
              onClick={() => {
                setCurrentWeekOffset(0);
                setSelectedDate(formatDateKey(new Date()));
              }}
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
            onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
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

      {/* 2. 7 Days Grid Row */}
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
              onClick={() => handleSelectDay(day.date)}
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

      {/* 3. Selected Day Inspector Panel */}
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

        {/* 4. Weekly NEET Subject Balance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Weekly NEET Subject Balance:</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Total Week Study: <strong style={{ color: 'var(--text-primary)' }}>{formatMinutesToHours(totalWeekMinutes)}</strong>
            </span>
          </div>

          {totalWeekMinutes > 0 ? (
            <div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: 'var(--radius-pill)',
                  overflow: 'hidden',
                  display: 'flex',
                  backgroundColor: 'var(--border)',
                }}
              >
                <div
                  style={{
                    width: `${physicsPercent}%`,
                    backgroundColor: 'var(--subject-physics)',
                    transition: 'width 0.3s',
                  }}
                  title={`Physics: ${physicsMinutes}m (${physicsPercent}%)`}
                />
                <div
                  style={{
                    width: `${chemistryPercent}%`,
                    backgroundColor: 'var(--subject-chemistry)',
                    transition: 'width 0.3s',
                  }}
                  title={`Chemistry: ${chemistryMinutes}m (${chemistryPercent}%)`}
                />
                <div
                  style={{
                    width: `${biologyPercent}%`,
                    backgroundColor: 'var(--subject-biology)',
                    transition: 'width 0.3s',
                  }}
                  title={`Biology: ${biologyMinutes}m (${biologyPercent}%)`}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10.5px',
                  marginTop: '6px',
                  fontWeight: 600,
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                <span style={{ color: 'var(--subject-physics)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-physics)' }} />
                  Physics ({physicsPercent}% • {physicsMinutes}m)
                </span>
                <span style={{ color: 'var(--subject-chemistry)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-chemistry)' }} />
                  Chemistry ({chemistryPercent}% • {chemistryMinutes}m)
                </span>
                <span style={{ color: 'var(--subject-biology)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-biology)' }} />
                  Biology ({biologyPercent}% • {biologyMinutes}m)
                </span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
              No study sessions recorded for this week yet.
            </p>
          )}
        </div>

        {/* 5. Tasks list for this day if any */}
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

        {/* 6. Daily Reflection & Study Journal */}
        <div
          style={{
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Daily Reflection & Study Journal:
            </span>
            {!isEditingNote ? (
              <button
                type="button"
                onClick={() => {
                  setReflectionInput(activeDay.log?.notes || '');
                  setIsEditingNote(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11.5px',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {activeDay.log?.notes ? 'Edit Note' : '+ Write Reflection'}
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  disabled={isSavingNote}
                  onClick={handleSaveReflection}
                  style={{
                    fontSize: '11px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSavingNote ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingNote(false)}
                  style={{
                    fontSize: '11px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    padding: '3px 6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {isEditingNote ? (
            <textarea
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="What went well today? Any tricky questions or formulas to re-test tomorrow?"
              rows={2}
              style={{
                width: '100%',
                fontSize: '12px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
          ) : activeDay.log?.notes ? (
            <p
              style={{
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                backgroundColor: 'var(--surface)',
                padding: '8px 10px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)',
                margin: 0,
              }}
            >
              "{activeDay.log.notes}"
            </p>
          ) : (
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
              No notes logged for this day yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
