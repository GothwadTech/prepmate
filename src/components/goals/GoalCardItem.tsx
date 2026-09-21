import React from 'react';
import { Badge } from '../common/Badge';
import {
  CalendarIcon,
  EditIcon,
  TrashIcon,
  ClockIcon,
  CheckIcon,
  CheckCircle2Icon,
} from '../icons/SvgIcons';
import { GoalItem, SubjectType } from '../../types';
import { NEET_CHAPTERS } from '../../data/neetSyllabus';

interface GoalCardItemProps {
  goal: GoalItem;
  onEdit: (goal: GoalItem) => void;
  onDeleteRequest: (goal: GoalItem) => void;
  onNudgeProgress: (goal: GoalItem, delta: number) => void;
  onToggleComplete: (id: string) => void;
  onOpenTimer: (config: { subject?: SubjectType; chapter?: string }) => void;
}

export const GoalCardItem: React.FC<GoalCardItemProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onNudgeProgress,
  onToggleComplete,
  onOpenTimer,
}) => {
  const isCompleted = goal.completed || goal.progressPercent >= 100;

  // Helper for chapter weightage check
  const list = NEET_CHAPTERS[goal.subject] || [];
  const found = list.find((c) => c.name.toLowerCase() === goal.chapter.toLowerCase());
  const weightage = found ? found.weightage : null;

  const subjectIcon = goal.subject === 'Physics' ? '⚡' : goal.subject === 'Chemistry' ? '⚗️' : '🧬';

  const subjectColor =
    goal.subject === 'Physics'
      ? 'var(--subject-physics)'
      : goal.subject === 'Chemistry'
      ? 'var(--subject-chemistry)'
      : 'var(--subject-biology)';

  return (
    <div
      className={`card card-${goal.subject.toLowerCase()} goal-card ${isCompleted ? 'completed' : ''}`}
      id={`goal-card-${goal.id}`}
      style={{
        padding: '14px 16px',
      }}
    >
      {/* Header Row: Subject Badge + High Weightage + Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Badge
            variant={
              goal.subject === 'Physics'
                ? 'physics'
                : goal.subject === 'Chemistry'
                ? 'chemistry'
                : 'biology'
            }
          >
            {subjectIcon} {goal.subject}
          </Badge>

          {weightage === 'High' && (
            <span
              className="badge"
              style={{
                fontSize: '10px',
                background: 'rgba(255, 87, 34, 0.12)',
                color: 'var(--flame)',
                border: '1px solid rgba(255, 87, 34, 0.25)',
              }}
            >
              🔥 High-Yield NEET
            </span>
          )}

          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <CalendarIcon size={12} />
            {goal.deadline}
          </span>
        </div>

        {/* Actions: Edit & Delete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => onEdit(goal)}
            title="Edit goal"
            aria-label={`Edit ${goal.title}`}
          >
            <EditIcon size={14} color="var(--text-secondary)" />
          </button>
          <button
            type="button"
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => onDeleteRequest(goal)}
            title="Delete goal"
            aria-label={`Delete ${goal.title}`}
          >
            <TrashIcon size={14} color="var(--text-tertiary)" />
          </button>
        </div>
      </div>

      {/* Goal Title & Target info */}
      <div>
        <h4
          style={{
            fontSize: '15px',
            fontWeight: 700,
            marginTop: '4px',
            color: isCompleted ? 'var(--text-tertiary)' : 'var(--text-primary)',
            textDecoration: isCompleted ? 'line-through' : 'none',
          }}
        >
          {goal.title}
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            📖 {goal.chapter}
          </span>
          <span>•</span>
          <span>🎯 Target: {goal.targetMetric}</span>
        </div>
      </div>

      {/* Progress Bar & Interactive Steppers */}
      <div style={{ marginTop: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '4px' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            {isCompleted ? 'Completed 🎉' : goal.progressPercent >= 75 ? 'Almost Finished 🔥' : 'In Progress'}
          </span>
          <span style={{ fontWeight: 700, color: isCompleted ? 'var(--success)' : subjectColor }}>
            {isCompleted ? '100%' : `${goal.progressPercent}%`}
          </span>
        </div>

        <div className="progress-track" style={{ height: '8px', borderRadius: '4px' }}>
          <div
            className="progress-fill"
            style={{
              width: `${isCompleted ? 100 : goal.progressPercent}%`,
              backgroundColor: isCompleted ? 'var(--success)' : subjectColor,
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Quick Nudge Buttons & Steppers */}
        {!isCompleted && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Quick add:</span>
              <button
                type="button"
                className="goal-progress-btn"
                onClick={() => onNudgeProgress(goal, 10)}
                title="Add 10% progress"
              >
                +10%
              </button>
              <button
                type="button"
                className="goal-progress-btn"
                onClick={() => onNudgeProgress(goal, 25)}
                title="Add 25% progress"
              >
                +25%
              </button>
              {goal.progressPercent > 0 && (
                <button
                  type="button"
                  className="goal-progress-btn"
                  onClick={() => onNudgeProgress(goal, -10)}
                  title="Minus 10% progress"
                >
                  -10%
                </button>
              )}
            </div>

            {/* Launch Study Timer for this Goal */}
            <button
              type="button"
              className="btn btn-outline"
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                borderColor: subjectColor,
                color: subjectColor,
              }}
              onClick={() => onOpenTimer({ subject: goal.subject, chapter: goal.chapter })}
              title="Start Pomodoro Focus Session for this Goal"
            >
              <ClockIcon size={12} color={subjectColor} />
              Focus
            </button>
          </div>
        )}
      </div>

      {/* Bottom Complete Toggle Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
        <button
          type="button"
          className={`btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => onToggleComplete(goal.id)}
          style={{ fontSize: '11px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
          id={`toggle-complete-btn-${goal.id}`}
        >
          {isCompleted ? (
            <>
              <CheckIcon size={14} color="var(--success)" />
              Completed (Click to Reopen)
            </>
          ) : (
            <>
              <CheckCircle2Icon size={14} color="var(--primary)" />
              Mark Goal Completed
            </>
          )}
        </button>
      </div>
    </div>
  );
};
