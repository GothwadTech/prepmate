import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PlusIcon } from '../icons/SvgIcons';

interface GoalsHeaderBannerProps {
  activeGoalsCount: number;
  completedGoalsCount: number;
  averageProgress: number;
  onOpenNewModal: () => void;
}

export const GoalsHeaderBanner: React.FC<GoalsHeaderBannerProps> = ({
  activeGoalsCount,
  completedGoalsCount,
  averageProgress,
  onOpenNewModal,
}) => {
  return (
    <Card variant="hero" id="neet-target-banner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
              🎯 Target NEET 2026: 680+ Aim
            </span>
            <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 8px' }}>
              🩺 AIIMS Target
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', letterSpacing: '-0.01em' }}>
            Study Goals & Syllabus Milestones
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '420px' }}>
            Chapter-wise targets aur high-yield revisions track karein. Consistency se exam hall mein high accuracy milti hai.
          </p>
        </div>
        <Button
          id="open-add-goal-top-btn"
          variant="primary"
          size="sm"
          leftIcon={<PlusIcon size={16} />}
          onClick={onOpenNewModal}
        >
          New Goal
        </Button>
      </div>

      {/* Quick Goal Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="stat-tile" style={{ padding: '8px 10px' }}>
          <span className="stat-value" style={{ fontSize: '18px', color: 'var(--primary)' }}>
            {activeGoalsCount}
          </span>
          <span className="stat-label" style={{ fontSize: '11px' }}>Active Goals</span>
        </div>

        <div className="stat-tile" style={{ padding: '8px 10px' }}>
          <span className="stat-value" style={{ fontSize: '18px', color: 'var(--success)' }}>
            {completedGoalsCount}
          </span>
          <span className="stat-label" style={{ fontSize: '11px' }}>Completed</span>
        </div>

        <div className="stat-tile" style={{ padding: '8px 10px' }}>
          <span className="stat-value" style={{ fontSize: '18px' }}>
            {averageProgress}%
          </span>
          <span className="stat-label" style={{ fontSize: '11px' }}>Avg. Progress</span>
        </div>
      </div>
    </Card>
  );
};
