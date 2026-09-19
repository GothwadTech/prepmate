import React from 'react';
import { ScoreBreakdown, UserStats } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  TrophyIcon,
  ClockIcon,
  CheckIcon,
  FlameIcon,
  SparklesIcon,
  XIcon,
  TargetIcon,
} from '../icons/SvgIcons';

interface ScoreExplanationModalProps {
  breakdown: ScoreBreakdown;
  stats: UserStats;
  weeklyHours: number;
  weeklyTasks: number;
  onClose: () => void;
}

export const ScoreExplanationModal: React.FC<ScoreExplanationModalProps> = ({
  breakdown,
  stats,
  weeklyHours,
  weeklyTasks,
  onClose,
}) => {
  return (
    <div
      className="modal-overlay"
      id="score-explanation-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="modal-content"
        id="score-explanation-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--surface)',
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(244, 180, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrophyIcon size={18} color="var(--warning)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Prep Score Formula
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Score Calculation & Leaderboard Ranking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Current Score Summary Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(4, 148, 244, 0.12) 0%, rgba(15, 157, 88, 0.12) 100%)',
              border: '1px solid rgba(4, 148, 244, 0.25)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px' }}>
              YOUR CURRENT PREP SCORE
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', margin: '4px 0' }}>
              <span style={{ fontSize: '38px', fontWeight: 900, color: 'var(--text-primary)' }}>
                {breakdown.totalScore}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 700 }}>/ 100</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
              <Badge variant="primary">Level {breakdown.level}: {breakdown.levelTitle}</Badge>
              <Badge variant="success">Top {breakdown.percentileRank}%</Badge>
            </div>
          </div>

          {/* Transparent Formula Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              How 100 Points Are Weighted:
            </h4>

            {/* 1. Study Hours (45 pts) */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClockIcon size={16} color="var(--primary)" />
                  <strong style={{ fontSize: '13px' }}>1. Weekly Study Hours</strong>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                  {breakdown.studyHoursPoints} / 45 pts
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                Weight: <strong>45%</strong>. Benchmark target: 38 hours/week (~5.5 hrs/day).
              </p>
              <div
                style={{
                  height: '6px',
                  backgroundColor: 'var(--border)',
                  borderRadius: 'var(--radius-pill)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(breakdown.studyHoursPoints / 45) * 100}%`,
                    backgroundColor: 'var(--primary)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>Current: {weeklyHours} hrs this week</span>
                <span>Formula: min(45, (hours / 38) × 45)</span>
              </div>
            </div>

            {/* 2. Tasks & MCQ Target (35 pts) */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckIcon size={16} color="var(--success)" />
                  <strong style={{ fontSize: '13px' }}>2. Syllabus Tasks & MCQs</strong>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--success)' }}>
                  {breakdown.tasksPoints} / 35 pts
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                Weight: <strong>35%</strong>. Benchmark target: 28 tasks/week (~4 syllabus tasks daily).
              </p>
              <div
                style={{
                  height: '6px',
                  backgroundColor: 'var(--border)',
                  borderRadius: 'var(--radius-pill)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(breakdown.tasksPoints / 35) * 100}%`,
                    backgroundColor: 'var(--success)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>Current: {weeklyTasks} tasks completed</span>
                <span>Formula: min(35, (tasks / 28) × 35)</span>
              </div>
            </div>

            {/* 3. Consistency Streak (20 pts) */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FlameIcon size={16} color="var(--flame)" />
                  <strong style={{ fontSize: '13px' }}>3. Consistency Streak</strong>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--flame)' }}>
                  {breakdown.streakPoints} / 20 pts
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                Weight: <strong>20%</strong>. Benchmark target: 14+ unbroken days of study.
              </p>
              <div
                style={{
                  height: '6px',
                  backgroundColor: 'var(--border)',
                  borderRadius: 'var(--radius-pill)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(breakdown.streakPoints / 20) * 100}%`,
                    backgroundColor: 'var(--flame)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>Current: 🔥 {stats.streakDays} day streak</span>
                <span>Formula: min(20, (streak / 14) × 20)</span>
              </div>
            </div>
          </div>

          {/* Pro Tips for NEET Aspirants */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(244, 180, 0, 0.08)',
              border: '1px solid rgba(244, 180, 0, 0.25)',
              display: 'flex',
              gap: '10px',
            }}
          >
            <SparklesIcon size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '11.5px', lineHeight: 1.45, color: 'var(--text-primary)' }}>
              <strong>Score Kaise Badhayein?</strong>
              <p style={{ margin: '3px 0 0 0', color: 'var(--text-secondary)' }}>
                1. Roz 5-6 Pomodoro sessions complete karein.<br />
                2. Physics numericals & Bio revision tasks mark karein.<br />
                3. Streak tootne na dein—streak shields ka use karein!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface-variant)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="primary" size="sm" onClick={onClose}>
            Got it, Let's Prep!
          </Button>
        </div>
      </div>
    </div>
  );
};
