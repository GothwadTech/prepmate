import React from 'react';
import { Card } from '../common/Card';
import { ChevronRightIcon } from '../icons/SvgIcons';
import { GoalItem, AppTab } from '../../types';

interface HomeActiveGoalsProps {
  goals: GoalItem[];
  onNavigateTab: (tab: AppTab) => void;
}

export const HomeActiveGoals: React.FC<HomeActiveGoalsProps> = ({ goals, onNavigateTab }) => {
  return (
    <Card
      id="home-active-goals-card"
      title="Target Study Goals"
      subtitle="Chapter milestones & syllabus progress"
      action={
        <button
          type="button"
          className="btn-text"
          onClick={() => onNavigateTab('goals')}
          style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}
          id="home-view-all-goals-btn"
        >
          All Goals ({goals.length}) <ChevronRightIcon size={14} />
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {goals.slice(0, 3).map((goal) => {
          const subjectColor =
            goal.subject === 'Physics'
              ? 'var(--subject-physics)'
              : goal.subject === 'Chemistry'
              ? 'var(--subject-chemistry)'
              : 'var(--subject-biology)';
          return (
            <div
              key={goal.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '8px 10px',
                background: 'var(--surface-variant)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
              onClick={() => onNavigateTab('goals')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: subjectColor,
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {goal.title}
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: goal.completed ? 'var(--success)' : subjectColor }}>
                  {goal.completed ? '100% Done' : `${goal.progressPercent}%`}
                </span>
              </div>
              <div className="progress-track" style={{ height: '5px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${goal.completed ? 100 : goal.progressPercent}%`,
                    backgroundColor: goal.completed ? 'var(--success)' : subjectColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
