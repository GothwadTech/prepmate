import React, { useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useData } from '../../context/DataContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  CloseIcon,
  ClockIcon,
  FlameIcon,
  Maximize2Icon,
  Minimize2Icon,
  Volume2Icon,
  VolumeXIcon,
  CheckIcon,
  TrashIcon,
} from '../icons/SvgIcons';
import { SubjectType, TimerMode } from '../../types';
import { NEET_CHAPTERS } from '../../data/neetSyllabus';

export const TimerModal: React.FC = () => {
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
    isTimerOpen,
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
    closeTimer,
    toggleFocusMode,
    toggleMute,
  } = useTimer();

  const { tasks, sessions, deleteSession, stats } = useData();
  const [showHistory, setShowHistory] = useState(false);

  if (!isTimerOpen) return null;

  // Format time MM:SS
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Calculate circular progress
  const progress =
    mode === 'stopwatch'
      ? (remainingSeconds % 60) / 60 * 100
      : durationSeconds > 0
      ? Math.min(100, Math.max(0, ((durationSeconds - remainingSeconds) / durationSeconds) * 100))
      : 0;

  const radius = 105;
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

  // Filter tasks for today that match selected subject
  const availableTasks = tasks.filter((t) => !t.completed && (t.subject === subject || !subject));

  return (
    <div
      className={`modal-overlay ${isFocusMode ? 'focus-mode-overlay' : ''}`}
      id="timer-modal-overlay"
      onClick={closeTimer}
      style={{ zIndex: 1200 }}
    >
      <div
        className={`modal-sheet ${isFocusMode ? 'focus-mode-sheet' : ''}`}
        id="timer-modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: isFocusMode ? '100vh' : '92vh',
          height: isFocusMode ? '100vh' : 'auto',
          borderRadius: isFocusMode ? '0' : undefined,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          overflowY: 'auto',
        }}
      >
        {/* Modal Handle */}
        {!isFocusMode && <div className="modal-drag-handle" />}

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary-container)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ClockIcon size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>NEET Study Timer</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                {todaySessionsCount} Sessions logged today • {stats.todayStudyMinutes}m total
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Sound Toggle */}
            <button
              type="button"
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={toggleMute}
              title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
              id="timer-mute-btn"
            >
              {isMuted ? <VolumeXIcon size={16} /> : <Volume2Icon size={16} />}
            </button>

            {/* Zen Focus Mode Toggle */}
            <button
              type="button"
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={toggleFocusMode}
              title={isFocusMode ? 'Exit Zen Mode' : 'Zen Focus Mode (Fullscreen)'}
              id="timer-focus-mode-btn"
            >
              {isFocusMode ? <Minimize2Icon size={16} /> : <Maximize2Icon size={16} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={closeTimer}
              id="timer-close-btn"
              aria-label="Close timer"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {/* 1. Mode Switcher Tabs */}
        <div className="segment-tabs" id="timer-mode-tabs" role="tablist">
          <button
            type="button"
            className={`segment-btn ${mode === 'pomodoro' ? 'active' : ''}`}
            onClick={() => setTimerMode('pomodoro')}
            id="timer-mode-pomodoro"
          >
            Pomodoro (25m)
          </button>
          <button
            type="button"
            className={`segment-btn ${mode === 'deep_study' ? 'active' : ''}`}
            onClick={() => setTimerMode('deep_study')}
            id="timer-mode-deep"
          >
            Deep Study (50m)
          </button>
          <button
            type="button"
            className={`segment-btn ${mode === 'short_break' ? 'active' : ''}`}
            onClick={() => setTimerMode('short_break')}
            id="timer-mode-short-break"
          >
            Short Break (5m)
          </button>
          <button
            type="button"
            className={`segment-btn ${mode === 'custom' ? 'active' : ''}`}
            onClick={() => setTimerMode('custom')}
            id="timer-mode-custom"
          >
            Custom
          </button>
          <button
            type="button"
            className={`segment-btn ${mode === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setTimerMode('stopwatch')}
            id="timer-mode-stopwatch"
          >
            Stopwatch
          </button>
        </div>

        {/* Custom duration inputs if Custom mode selected */}
        {mode === 'custom' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Set Duration:</span>
            <input
              type="number"
              min="1"
              max="180"
              value={customMinutesInput}
              onChange={(e) => {
                setCustomMinutesInput(e.target.value);
                const val = parseInt(e.target.value, 10);
                if (val && val > 0) setTimerMode('custom', val);
              }}
              style={{
                width: '64px',
                padding: '4px 8px',
                textAlign: 'center',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: 'var(--surface-variant)',
                color: 'var(--text-primary)',
              }}
              id="custom-timer-mins-input"
            />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Minutes</span>
          </div>
        )}

        {/* 2. Subject Selection Chips (Hidden during breaks for clean UI) */}
        {mode !== 'short_break' && mode !== 'long_break' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Subject Focus
              </span>
              {chapter && (
                <span style={{ fontSize: '11px', color: subjectColor, fontWeight: 700 }}>
                  {chapter}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['Physics', 'Chemistry', 'Biology'] as SubjectType[]).map((subj) => {
                const isCurrent = subject === subj;
                return (
                  <button
                    key={subj}
                    type="button"
                    className={`btn ${isCurrent ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      fontSize: '12px',
                      padding: '8px 4px',
                      fontWeight: 700,
                      borderColor: isCurrent ? getSubjectColor(subj) : 'var(--border)',
                      backgroundColor: isCurrent ? getSubjectColor(subj) : 'var(--surface)',
                      color: isCurrent ? '#FFFFFF' : 'var(--text-primary)',
                    }}
                    onClick={() => {
                      setSubject(subj);
                      if (NEET_CHAPTERS[subj]?.length) {
                        setChapter(NEET_CHAPTERS[subj][0].name);
                      }
                    }}
                    id={`timer-subj-${subj.toLowerCase()}-btn`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>

            {/* Chapter selection autocomplete */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                list="timer-chapters-list"
                className="input-field"
                placeholder="Topic / Chapter name..."
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                style={{ fontSize: '12px', padding: '8px 12px' }}
                id="timer-chapter-input"
              />
              <datalist id="timer-chapters-list">
                {NEET_CHAPTERS[subject].map((c, i) => (
                  <option key={i} value={c.name} />
                ))}
              </datalist>
            </div>

            {/* Link to Today's Task if available */}
            {availableTasks.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>Link to Task:</span>
                <select
                  className="input-field"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  value={linkedTaskId || ''}
                  onChange={(e) => setLinkedTaskId(e.target.value || null)}
                  id="timer-linked-task-select"
                >
                  <option value="">None (General Study)</option>
                  {availableTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.completedCount}/{t.targetCount})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* 3. Circular Timer Visual Display */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 0',
            position: 'relative',
          }}
          id="circular-timer-display"
        >
          <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="240" height="240" viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Track */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                stroke="var(--surface-variant)"
                strokeWidth="12"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                stroke={mode.includes('break') ? 'var(--success)' : subjectColor}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.8s ease',
                  filter: isRunning && !isPaused ? 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.35))' : 'none',
                }}
              />
            </svg>

            {/* Inner Content */}
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '2px',
              }}
            >
              <Badge
                variant={
                  mode.includes('break')
                    ? 'success'
                    : subject === 'Physics'
                    ? 'physics'
                    : subject === 'Chemistry'
                    ? 'chemistry'
                    : 'biology'
                }
              >
                {mode.includes('break') ? 'Break Time' : `${subject} Focus`}
              </Badge>

              <span
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  marginTop: '4px',
                }}
                id="timer-clock-digits"
              >
                {timeFormatted}
              </span>

              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mode === 'stopwatch'
                  ? 'Elapsed Time'
                  : isRunning && !isPaused
                  ? 'Deep Focus Mode'
                  : isPaused
                  ? 'Timer Paused'
                  : 'Ready to Start'}
              </span>

              {/* Flame / Target mini indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: 'var(--flame)' }}>
                <FlameIcon size={14} />
                <span style={{ fontSize: '10px', fontWeight: 800 }}>NEET 2026 Target</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Controls: Play/Pause, Reset, Log Early */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
          {/* Reset Button */}
          <button
            type="button"
            className="btn-icon"
            onClick={resetTimer}
            title="Reset timer"
            aria-label="Reset timer"
            style={{ width: '44px', height: '44px', background: 'var(--surface-variant)' }}
            id="timer-reset-btn"
          >
            <RotateCcwIcon size={20} color="var(--text-secondary)" />
          </button>

          {/* Main Play / Pause Action Button */}
          {!isRunning || isPaused ? (
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(66, 133, 244, 0.4)',
              }}
              onClick={isRunning ? resumeTimer : startTimer}
              id="timer-play-btn"
              aria-label={isRunning ? 'Resume timer' : 'Start timer'}
            >
              <PlayIcon size={24} color="#FFFFFF" />
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--flame)',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 4px 14px rgba(255, 109, 0, 0.4)',
              }}
              onClick={pauseTimer}
              id="timer-pause-btn"
              aria-label="Pause timer"
            >
              <PauseIcon size={24} color="#FFFFFF" />
            </button>
          )}

          {/* Stop and Log Early Button */}
          <button
            type="button"
            className="btn-icon"
            onClick={stopAndLogEarly}
            title="Stop & Log session now"
            aria-label="Stop and log session"
            style={{ width: '44px', height: '44px', background: 'var(--surface-variant)' }}
            id="timer-log-early-btn"
          >
            <CheckIcon size={20} color="var(--success)" />
          </button>
        </div>

        {/* 5. Today's Sessions Log & Toggle */}
        <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => setShowHistory((prev) => !prev)}
            id="toggle-session-history-btn"
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Today's Completed Sessions ({todaySessions.length})
            </span>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
              {showHistory ? 'Hide ▲' : 'View ▼'}
            </span>
          </div>

          {showHistory && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {todaySessions.length === 0 ? (
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', margin: '8px 0' }}>
                  No completed sessions yet today. Start your first 25m Pomodoro!
                </p>
              ) : (
                todaySessions.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'var(--surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                    }}
                    id={`session-log-${s.id}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: getSubjectColor(s.subject),
                        }}
                      />
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {s.subject} • {s.durationMinutes} mins
                        </span>
                        {s.chapter && (
                          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0 }}>
                            {s.chapter}
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Badge variant="neutral">{s.mode}</Badge>
                      <button
                        type="button"
                        className="task-action-btn delete"
                        onClick={() => deleteSession(s.id)}
                        title="Delete session"
                        aria-label="Delete session"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
