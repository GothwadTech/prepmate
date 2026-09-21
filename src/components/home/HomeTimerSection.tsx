import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PlayIcon } from '../icons/SvgIcons';
import { SubjectType } from '../../types';

interface HomeTimerSectionProps {
  isRunning: boolean;
  timeFormatted: string;
  activeSubject: string;
  onOpenTimer: (config?: { subject?: SubjectType }) => void;
}

export const HomeTimerSection: React.FC<HomeTimerSectionProps> = ({
  isRunning,
  timeFormatted,
  activeSubject,
  onOpenTimer,
}) => {
  return (
    <Card
      id="study-timer-home-card"
      title="Study Timer & Focus"
      subtitle="Pomodoro focus cycles with automatic time logging"
      action={
        <Button
          size="sm"
          variant={isRunning ? 'primary' : 'outline'}
          onClick={() => onOpenTimer()}
          id="open-timer-modal-btn"
        >
          {isRunning ? `Running (${timeFormatted})` : 'Launch Timer'}
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
          {isRunning ? (
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
              {activeSubject} session in progress ({timeFormatted}). Keep your focus strong! 🩺
            </span>
          ) : (
            'Start a 25-minute Pomodoro cycle to build unstoppable NEET exam stamina:'
          )}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              borderColor: 'var(--subject-physics)',
              color: 'var(--subject-physics)',
              padding: '8px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
            onClick={() => onOpenTimer({ subject: 'Physics' })}
            id="home-quick-start-physics"
          >
            <PlayIcon size={12} color="var(--subject-physics)" />
            Physics
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              borderColor: 'var(--subject-chemistry)',
              color: 'var(--subject-chemistry)',
              padding: '8px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
            onClick={() => onOpenTimer({ subject: 'Chemistry' })}
            id="home-quick-start-chemistry"
          >
            <PlayIcon size={12} color="var(--subject-chemistry)" />
            Chemistry
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              borderColor: 'var(--subject-biology)',
              color: 'var(--subject-biology)',
              padding: '8px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
            onClick={() => onOpenTimer({ subject: 'Biology' })}
            id="home-quick-start-biology"
          >
            <PlayIcon size={12} color="var(--subject-biology)" />
            Biology
          </button>
        </div>
      </div>
    </Card>
  );
};
