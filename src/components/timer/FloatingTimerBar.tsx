import React from 'react';
import { useTimer } from '../../context/TimerContext';
import { PlayIcon, PauseIcon, ClockIcon } from '../icons/SvgIcons';
import { SubjectType } from '../../types';

export const FloatingTimerBar: React.FC = () => {
  const {
    isRunning,
    isPaused,
    remainingSeconds,
    durationSeconds,
    subject,
    mode,
    openTimer,
    pauseTimer,
    resumeTimer,
    isTimerOpen,
  } = useTimer();

  // If timer is not running or modal is already open, do not show floating bar
  if ((!isRunning && !isPaused) || isTimerOpen) {
    return null;
  }

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const progress = durationSeconds > 0 ? Math.min(100, Math.max(0, ((durationSeconds - remainingSeconds) / durationSeconds) * 100)) : 0;

  const getSubjectColor = (subj: SubjectType) => {
    if (subj === 'Physics') return 'var(--subject-physics)';
    if (subj === 'Chemistry') return 'var(--subject-chemistry)';
    return 'var(--subject-biology)';
  };

  const subjectColor = getSubjectColor(subject);

  return (
    <div
      id="floating-mini-timer"
      className="floating-mini-timer"
      onClick={() => openTimer()}
      role="button"
      tabIndex={0}
      aria-label="Open full study timer"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Micro Circular Ring */}
        <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="16"
              cy="16"
              r="13"
              stroke="var(--surface-variant)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="16"
              cy="16"
              r="13"
              stroke={subjectColor}
              strokeWidth="3"
              fill="none"
              strokeDasharray={2 * Math.PI * 13}
              strokeDashoffset={2 * Math.PI * 13 * (1 - progress / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', color: subjectColor }}>
            <ClockIcon size={14} />
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {timeFormatted}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: subjectColor,
                textTransform: 'uppercase',
              }}
            >
              {subject}
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
            {isPaused ? 'Paused • Tap to resume' : `${mode === 'pomodoro' ? 'Pomodoro' : mode} in progress`}
          </span>
        </div>
      </div>

      {/* Play/Pause Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          className="btn-icon"
          style={{ width: '32px', height: '32px', background: 'var(--surface-variant)' }}
          onClick={(e) => {
            e.stopPropagation();
            if (isPaused) resumeTimer();
            else pauseTimer();
          }}
          aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
        >
          {isPaused ? <PlayIcon size={14} color="var(--primary)" /> : <PauseIcon size={14} color="var(--primary)" />}
        </button>
      </div>
    </div>
  );
};
