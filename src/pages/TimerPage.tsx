import React, { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  ClockIcon,
  FlameIcon,
  Maximize2Icon,
  Minimize2Icon,
  Volume2Icon,
  VolumeXIcon,
  CheckIcon,
  TrashIcon,
  BookIcon,
  SparklesIcon,
  TasksIcon,
} from '../components/icons/SvgIcons';
import { useTimer } from '../context/TimerContext';
import { useData } from '../context/DataContext';
import { SubjectType, TimerMode } from '../types';
import { NEET_CHAPTERS } from '../data/neetSyllabus';

export const TimerPage: React.FC = () => {
  const {
    mode,
    subject,
    chapter,
    linkedTaskId,
    durationSeconds,
    remainingSeconds,
    isRunning,
    isPaused,
    isMuted,
    isFocusMode,
    customMinutesInput,
    todaySessionsCount,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopAndLogEarly,
    setTimerMode,
    setSubject,
    setChapter,
    setLinkedTaskId,
    setCustomMinutesInput,
    toggleFocusMode,
    toggleMute,
  } = useTimer();

  const { tasks, sessions, deleteSession, stats } = useData();
  const [showHistory, setShowHistory] = useState<boolean>(true);

  // Time format MM:SS or HH:MM:SS
  const hours = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  const timeFormatted =
    hours > 0
      ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Circular progress percentage
  const progress =
    mode === 'stopwatch'
      ? (remainingSeconds % 60) / 60 * 100
      : durationSeconds > 0
      ? Math.min(100, Math.max(0, ((durationSeconds - remainingSeconds) / durationSeconds) * 100))
      : 0;

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const getSubjectColor = (subj: SubjectType) => {
    if (subj === 'Physics') return 'var(--subject-physics)';
    if (subj === 'Chemistry') return 'var(--subject-chemistry)';
    return 'var(--subject-biology)';
  };

  const subjectColor = getSubjectColor(subject);

  // Today's sessions
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => (s.date || todayStr) === todayStr);

  // Today's tasks matching selected subject
  const availableTasks = tasks.filter((t) => !t.completed && (t.subject === subject || !subject));

  // Available chapters for selected subject
  const availableChapters = useMemo(() => {
    return NEET_CHAPTERS[subject] || [];
  }, [subject]);

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMinutesInput, 10);
    if (val && val > 0 && val <= 360) {
      setTimerMode('custom', val);
    }
  };

  return (
    <div
      id="dedicated-timer-page"
      className={isFocusMode ? 'focus-mode-overlay' : ''}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: isFocusMode ? 'fixed' : 'relative',
        inset: isFocusMode ? 0 : 'auto',
        zIndex: isFocusMode ? 1500 : 'auto',
        backgroundColor: isFocusMode ? 'var(--bg)' : 'transparent',
        padding: isFocusMode ? '24px 16px' : '0',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Header Overview & Stats Card */}
      {!isFocusMode && (
        <Card variant="hero" id="timer-overview-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-container)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(4, 148, 244, 0.15)',
                }}
              >
                <ClockIcon size={22} color="var(--primary)" />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  NEET Study Timer
                </h2>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Track study sprints, Pomodoro sessions & exam simulations
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <Badge variant="primary" style={{ padding: '6px 10px', fontSize: '11.5px', fontWeight: 800 }}>
                {stats.todayStudyMinutes} mins today
              </Badge>
              <Badge variant="success" style={{ padding: '6px 10px', fontSize: '11.5px', fontWeight: 800 }}>
                {todaySessionsCount} sessions
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* 2. Hero Interactive Timer Card */}
      <Card
        id="hero-timer-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '24px 16px',
          gap: '16px',
          border: isRunning ? `2px solid ${subjectColor}` : '1px solid var(--border)',
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Top Tools: Sound Mute & Zen Focus Mode */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: subjectColor,
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {subject} • {chapter || 'General Practice'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              id="timer-mute-toggle"
              onClick={toggleMute}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 8px',
                color: isMuted ? 'var(--text-tertiary)' : 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title={isMuted ? 'Unmute chimes' : 'Mute sound alerts'}
            >
              {isMuted ? <VolumeXIcon size={16} /> : <Volume2Icon size={16} />}
            </button>

            <button
              type="button"
              id="timer-focus-toggle"
              onClick={toggleFocusMode}
              style={{
                background: isFocusMode ? 'var(--primary)' : 'none',
                border: isFocusMode ? 'none' : '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 8px',
                color: isFocusMode ? '#FFFFFF' : 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
              }}
              title={isFocusMode ? 'Exit Zen Focus Mode' : 'Distraction-Free Zen Focus Mode'}
            >
              {isFocusMode ? <Minimize2Icon size={14} /> : <Maximize2Icon size={14} />}
              <span>{isFocusMode ? 'Exit Zen' : 'Zen Mode'}</span>
            </button>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div style={{ position: 'relative', width: '250px', height: '250px', margin: '8px 0' }}>
          <svg width="250" height="250" viewBox="0 0 250 250" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="125"
              cy="125"
              r={radius}
              stroke="var(--surface-variant)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="125"
              cy="125"
              r={radius}
              stroke={subjectColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
            />
          </svg>

          {/* Central Digits Display */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span
              id="timer-display-digits"
              style={{
                fontSize: hours > 0 ? '38px' : '48px',
                fontWeight: 800,
                fontFamily: 'monospace',
                letterSpacing: '-1px',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              {timeFormatted}
            </span>

            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: isRunning ? 'var(--success)' : isPaused ? 'var(--warning)' : 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              {isRunning
                ? 'Studying Now 🟢'
                : isPaused
                ? 'Session Paused ⏸️'
                : 'Ready to Start ⏱️'}
            </span>

            {mode === 'stopwatch' && (
              <span style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>
                Open-ended Stopwatch
              </span>
            )}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {!isRunning && !isPaused ? (
            <Button
              variant="primary"
              id="start-study-timer-btn"
              onClick={startTimer}
              style={{
                padding: '12px 32px',
                fontSize: '15px',
                fontWeight: 800,
                borderRadius: 'var(--radius-pill)',
                boxShadow: '0 4px 16px rgba(4, 148, 244, 0.35)',
              }}
            >
              <PlayIcon size={18} /> Start Studying
            </Button>
          ) : isRunning ? (
            <Button
              variant="secondary"
              id="pause-study-timer-btn"
              onClick={pauseTimer}
              style={{
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: 800,
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <PauseIcon size={18} /> Pause
            </Button>
          ) : (
            <Button
              variant="primary"
              id="resume-study-timer-btn"
              onClick={resumeTimer}
              style={{
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: 800,
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <PlayIcon size={18} /> Resume
            </Button>
          )}

          <Button
            variant="outline"
            id="reset-study-timer-btn"
            onClick={resetTimer}
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-pill)',
            }}
            title="Reset timer"
          >
            <RotateCcwIcon size={16} /> Reset
          </Button>

          {(isRunning || isPaused) && (
            <Button
              variant="outline"
              id="save-study-timer-early-btn"
              onClick={stopAndLogEarly}
              style={{
                padding: '12px 18px',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--success)',
                borderColor: 'var(--success)',
              }}
              title="Stop and save session to today's study log"
            >
              <CheckIcon size={16} /> Save Session
            </Button>
          )}
        </div>
      </Card>

      {/* 3. Timer Mode & Duration Presets (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <Card id="timer-presets-card" title="Select Study Mode">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            <button
              type="button"
              id="mode-pomodoro-btn"
              onClick={() => setTimerMode('pomodoro')}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: mode === 'pomodoro' ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: mode === 'pomodoro' ? 'var(--primary-container)' : 'var(--surface)',
                color: mode === 'pomodoro' ? 'var(--primary)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800 }}>Pomodoro</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>25 Mins Focus</span>
            </button>

            <button
              type="button"
              id="mode-deep-study-btn"
              onClick={() => setTimerMode('deep_study')}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: mode === 'deep_study' ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: mode === 'deep_study' ? 'var(--primary-container)' : 'var(--surface)',
                color: mode === 'deep_study' ? 'var(--primary)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800 }}>Deep Study</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>50 Mins Sprint</span>
            </button>

            <button
              type="button"
              id="mode-stopwatch-btn"
              onClick={() => setTimerMode('stopwatch')}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: mode === 'stopwatch' ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: mode === 'stopwatch' ? 'var(--primary-container)' : 'var(--surface)',
                color: mode === 'stopwatch' ? 'var(--primary)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800 }}>Stopwatch</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Count Up (Open)</span>
            </button>

            <button
              type="button"
              id="mode-short-break-btn"
              onClick={() => setTimerMode('short_break')}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: mode === 'short_break' ? '2px solid var(--success)' : '1px solid var(--border)',
                backgroundColor: mode === 'short_break' ? 'var(--success-container)' : 'var(--surface)',
                color: mode === 'short_break' ? 'var(--success)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800 }}>Short Break</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>5 Mins Rest</span>
            </button>

            <button
              type="button"
              id="mode-long-break-btn"
              onClick={() => setTimerMode('long_break')}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: mode === 'long_break' ? '2px solid var(--warning)' : '1px solid var(--border)',
                backgroundColor: mode === 'long_break' ? 'var(--warning-container)' : 'var(--surface)',
                color: mode === 'long_break' ? 'var(--warning)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800 }}>Long Break</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>15 Mins Recharge</span>
            </button>
          </div>

          {/* Custom Minutes Input */}
          <form
            onSubmit={handleCustomTimeSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              padding: '10px',
              backgroundColor: 'var(--surface-variant)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Custom Duration:
            </span>
            <input
              type="number"
              min="1"
              max="360"
              value={customMinutesInput}
              onChange={(e) => setCustomMinutesInput(e.target.value)}
              style={{
                width: '64px',
                padding: '6px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 700,
                textAlign: 'center',
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>mins</span>
            <Button variant="secondary" size="sm" type="submit">
              Apply
            </Button>
          </form>
        </Card>
      )}

      {/* 4. Subject & Chapter Assignment (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <Card id="timer-subject-config-card" title="Target Subject & Chapter">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Subject Selector Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['Physics', 'Chemistry', 'Biology'] as SubjectType[]).map((subj) => {
                const isSelected = subject === subj;
                const col = getSubjectColor(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    id={`timer-subject-select-${subj.toLowerCase()}`}
                    onClick={() => setSubject(subj)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? `2px solid ${col}` : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--surface-variant)' : 'var(--surface)',
                      color: isSelected ? col : 'var(--text-secondary)',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <span>{subj === 'Physics' ? '⚡' : subj === 'Chemistry' ? '⚗️' : '🧬'}</span>
                    <span>{subj}</span>
                  </button>
                );
              })}
            </div>

            {/* Chapter Selection Dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Chapter from NEET Syllabus:
              </label>
              <select
                id="timer-chapter-dropdown"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                {availableChapters.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.classGrade} - {c.weightage} Weightage)
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Link to Today's Task */}
            {availableTasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Link to Today&apos;s Task (Auto-advances progress when done):
                </label>
                <select
                  id="timer-linked-task-dropdown"
                  value={linkedTaskId || ''}
                  onChange={(e) => setLinkedTaskId(e.target.value || null)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  <option value="">-- No linked task (standalone session) --</option>
                  {availableTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.completedCount}/{t.targetCount} {t.type})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 5. Today's Completed Sessions History List */}
      {!isFocusMode && (
        <Card
          id="today-sessions-history-card"
          title={`Today's Completed Sessions (${todaySessions.length})`}
          subtitle="Real-time recorded sessions contributing to streak & analytics"
        >
          {todaySessions.length === 0 ? (
            <div
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
              }}
            >
              <ClockIcon size={28} color="var(--text-tertiary)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              No study sessions logged today yet. Start the timer to record your first study sprint!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todaySessions.map((s) => {
                const subjCol = getSubjectColor(s.subject);
                const sessionTime = new Date(s.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: 'var(--surface-variant)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: `4px solid ${subjCol}`,
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {s.subject}
                        </span>
                        {s.chapter && (
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            • {s.chapter}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        Completed at {sessionTime} ({s.mode})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <Badge variant="primary" style={{ fontWeight: 800 }}>
                        +{s.durationMinutes} mins
                      </Badge>
                      <button
                        type="button"
                        onClick={() => deleteSession(s.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-tertiary)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        title="Delete session"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
