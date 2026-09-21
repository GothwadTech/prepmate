import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CheckIcon, ChevronRightIcon } from '../icons/SvgIcons';
import { TaskItem, AppTab } from '../../types';

interface HomePriorityTasksProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onNavigateTab: (tab: AppTab) => void;
}

export const HomePriorityTasks: React.FC<HomePriorityTasksProps> = ({
  tasks,
  onToggleTask,
  onNavigateTab,
}) => {
  return (
    <Card
      id="today-priority-tasks-card"
      title="Today's Priority Tasks"
      subtitle="Tap checkbox to toggle completion instantly"
      action={
        <button
          type="button"
          className="btn-text"
          onClick={() => onNavigateTab('tasks')}
          style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}
          id="see-all-tasks-link"
        >
          See All ({tasks.length}) <ChevronRightIcon size={14} />
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className={`priority-task-tile ${task.completed ? 'completed' : ''}`}
            id={`priority-task-${task.id}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <button
                type="button"
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => onToggleTask(task.id)}
                id={`home-toggle-task-${task.id}`}
                aria-label={`Toggle task ${task.title}`}
              >
                {task.completed && <CheckIcon size={14} />}
              </button>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {task.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color:
                        task.subject === 'Physics'
                          ? 'var(--subject-physics)'
                          : task.subject === 'Chemistry'
                          ? 'var(--subject-chemistry)'
                          : 'var(--subject-biology)',
                    }}
                  >
                    {task.subject}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>•</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {task.type} ({task.targetCount})
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant={
                task.subject === 'Physics'
                  ? 'physics'
                  : task.subject === 'Chemistry'
                  ? 'chemistry'
                  : 'biology'
              }
            >
              {task.subject}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
