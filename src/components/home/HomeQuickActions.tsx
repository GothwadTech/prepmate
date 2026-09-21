import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
  ClockIcon,
  PlusIcon,
  GoalsIcon,
  PartnersIcon,
  BookIcon,
  BarChartIcon,
} from '../icons/SvgIcons';
import { AppTab } from '../../types';

interface HomeQuickActionsProps {
  onOpenTimer: () => void;
  onNavigateTab: (tab: AppTab) => void;
}

export const HomeQuickActions: React.FC<HomeQuickActionsProps> = ({
  onOpenTimer,
  onNavigateTab,
}) => {
  return (
    <Card id="quick-actions-card" title="Quick Actions" subtitle="One-tap navigation">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <Button
          id="action-study-timer-btn"
          variant="primary"
          leftIcon={<ClockIcon size={16} />}
          onClick={onOpenTimer}
          size="sm"
        >
          Study Timer
        </Button>
        <Button
          id="action-add-task-btn"
          variant="secondary"
          leftIcon={<PlusIcon size={16} />}
          onClick={() => onNavigateTab('tasks')}
          size="sm"
        >
          Add Daily Task
        </Button>
        <Button
          id="action-view-goals-btn"
          variant="outline"
          leftIcon={<GoalsIcon size={16} />}
          onClick={() => onNavigateTab('goals')}
          size="sm"
        >
          Goal Tracker
        </Button>
        <Button
          id="action-partners-btn"
          variant="outline"
          leftIcon={<PartnersIcon size={16} />}
          onClick={() => onNavigateTab('partners')}
          size="sm"
        >
          Partner & VS
        </Button>
        <Button
          id="action-syllabus-btn"
          variant="outline"
          leftIcon={<BookIcon size={16} />}
          onClick={() => onNavigateTab('syllabus')}
          size="sm"
        >
          Syllabus
        </Button>
        <Button
          id="action-analytics-btn"
          variant="outline"
          leftIcon={<BarChartIcon size={16} />}
          onClick={() => onNavigateTab('analytics')}
          size="sm"
        >
          Analytics
        </Button>
      </div>
    </Card>
  );
};
