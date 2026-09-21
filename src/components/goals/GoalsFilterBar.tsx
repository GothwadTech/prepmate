import React from 'react';
import { Input } from '../common/Input';
import { SearchIcon, CloseIcon } from '../icons/SvgIcons';
import { SubjectType } from '../../types';

interface GoalsFilterBarProps {
  statusTab: 'active' | 'completed' | 'all';
  setStatusTab: (tab: 'active' | 'completed' | 'all') => void;
  activeGoalsCount: number;
  completedGoalsCount: number;
  totalGoalsCount: number;
  subjectFilter: 'All' | SubjectType;
  setSubjectFilter: (subj: 'All' | SubjectType) => void;
  sortBy: 'deadline' | 'progress' | 'subject';
  setSortBy: (sort: 'deadline' | 'progress' | 'subject') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const GoalsFilterBar: React.FC<GoalsFilterBarProps> = ({
  statusTab,
  setStatusTab,
  activeGoalsCount,
  completedGoalsCount,
  totalGoalsCount,
  subjectFilter,
  setSubjectFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Status Segmented Tabs */}
      <div className="segment-tabs" style={{ width: '100%', display: 'flex' }}>
        <button
          type="button"
          className={`segment-btn ${statusTab === 'active' ? 'active' : ''}`}
          onClick={() => setStatusTab('active')}
          style={{ flex: 1, textAlign: 'center' }}
          id="goals-tab-active"
        >
          Active ({activeGoalsCount})
        </button>
        <button
          type="button"
          className={`segment-btn ${statusTab === 'completed' ? 'active' : ''}`}
          onClick={() => setStatusTab('completed')}
          style={{ flex: 1, textAlign: 'center' }}
          id="goals-tab-completed"
        >
          Completed ({completedGoalsCount})
        </button>
        <button
          type="button"
          className={`segment-btn ${statusTab === 'all' ? 'active' : ''}`}
          onClick={() => setStatusTab('all')}
          style={{ flex: 1, textAlign: 'center' }}
          id="goals-tab-all"
        >
          All Goals ({totalGoalsCount})
        </button>
      </div>

      {/* Subject Filter Chips & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {(['All', 'Biology', 'Physics', 'Chemistry'] as Array<'All' | SubjectType>).map((subj) => {
            const isSelected = subjectFilter === subj;
            return (
              <button
                type="button"
                key={subj}
                onClick={() => setSubjectFilter(subj)}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 600,
                  borderColor:
                    subj === 'Physics'
                      ? 'var(--subject-physics)'
                      : subj === 'Chemistry'
                      ? 'var(--subject-chemistry)'
                      : subj === 'Biology'
                      ? 'var(--subject-biology)'
                      : undefined,
                  color: isSelected
                    ? undefined
                    : subj === 'Physics'
                    ? 'var(--subject-physics)'
                    : subj === 'Chemistry'
                    ? 'var(--subject-chemistry)'
                    : subj === 'Biology'
                    ? 'var(--subject-biology)'
                    : undefined,
                }}
                id={`filter-goal-subj-${subj.toLowerCase()}`}
              >
                {subj === 'All' ? 'All Subjects' : subj}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field"
            style={{ padding: '4px 8px', fontSize: '11px', width: 'auto' }}
            aria-label="Sort goals"
          >
            <option value="deadline">Deadline</option>
            <option value="progress">Progress %</option>
            <option value="subject">Subject</option>
          </select>
        </div>
      </div>

      {/* Quick Search */}
      <div style={{ position: 'relative' }}>
        <Input
          placeholder="Search goals by title, chapter or metric..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<SearchIcon size={16} />}
        />
        {searchQuery && (
          <button
            type="button"
            className="btn-icon"
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px' }}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
