import React, { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import {
  GoalsIcon,
  PlusIcon,
  CheckIcon,
  CloseIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  TargetIcon,
  SparklesIcon,
  CheckCircle2Icon,
  CalendarIcon,
  PlayIcon,
} from '../components/icons/SvgIcons';
import { GoalItem, SubjectType } from '../types';
import { NEET_CHAPTERS } from '../data/neetSyllabus';
import { NEET_PREMADE_GOAL_TEMPLATES, NEETGoalTemplate } from '../data/neetGoalTemplates';
import { useTimer } from '../context/TimerContext';

interface GoalsPageProps {
  goals: GoalItem[];
  onAddGoal: (goal: Omit<GoalItem, 'id' | 'completed' | 'progressPercent'> & { progressPercent?: number }) => void;
  onToggleGoalComplete: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoal: (id: string, updates: Partial<GoalItem>) => void;
}

export const GoalsPage: React.FC<GoalsPageProps> = ({
  goals,
  onAddGoal,
  onToggleGoalComplete,
  onDeleteGoal,
  onUpdateGoal,
}) => {
  const { openTimer } = useTimer();

  // Status Filter: 'active' | 'completed' | 'all'
  const [statusTab, setStatusTab] = useState<'active' | 'completed' | 'all'>('active');

  // Subject Filter: 'All' | 'Physics' | 'Chemistry' | 'Biology'
  const [subjectFilter, setSubjectFilter] = useState<'All' | SubjectType>('All');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Sort by
  const [sortBy, setSortBy] = useState<'deadline' | 'progress' | 'subject'>('deadline');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<GoalItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState<SubjectType>('Biology');
  const [formChapter, setFormChapter] = useState('');
  const [formDeadline, setFormDeadline] = useState('7 Days');
  const [formTargetMetric, setFormTargetMetric] = useState('200 MCQs + Notes');
  const [formProgress, setFormProgress] = useState(0);

  // Template section filter
  const [templateSubjectFilter, setTemplateSubjectFilter] = useState<'All' | SubjectType>('All');

  // Presets for quick form inputs
  const targetMetricPresets = [
    '150 NCERT MCQs',
    '200 MCQs + PYQs',
    'Formula Sheet + Notes',
    'NCERT 3x Reading',
    'Full Chapter Mock Test',
  ];

  const deadlinePresets = ['3 Days', '5 Days', '1 Week', '2 Weeks', '1 Month'];

  // Overall statistics calculation
  const totalGoalsCount = goals.length;
  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const activeGoalsCount = totalGoalsCount - completedGoalsCount;
  const averageProgress = totalGoalsCount > 0
    ? Math.round(goals.reduce((acc, g) => acc + (g.completed ? 100 : g.progressPercent), 0) / totalGoalsCount)
    : 0;

  // Filter & sort goals
  const filteredGoals = useMemo(() => {
    return goals
      .filter((g) => {
        // Status filter
        if (statusTab === 'active' && g.completed) return false;
        if (statusTab === 'completed' && !g.completed) return false;

        // Subject filter
        if (subjectFilter !== 'All' && g.subject !== subjectFilter) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = g.title.toLowerCase().includes(q);
          const matchChapter = g.chapter.toLowerCase().includes(q);
          const matchMetric = g.targetMetric.toLowerCase().includes(q);
          if (!matchTitle && !matchChapter && !matchMetric) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'progress') {
          return b.progressPercent - a.progressPercent;
        }
        if (sortBy === 'subject') {
          return a.subject.localeCompare(b.subject);
        }
        // Default: deadline / completed state
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return a.deadline.localeCompare(b.deadline);
      });
  }, [goals, statusTab, subjectFilter, searchQuery, sortBy]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (templateSubjectFilter === 'All') return NEET_PREMADE_GOAL_TEMPLATES;
    return NEET_PREMADE_GOAL_TEMPLATES.filter((t) => t.subject === templateSubjectFilter);
  }, [templateSubjectFilter]);

  // Open modal for new goal
  const handleOpenNewModal = (defaultSubj?: SubjectType) => {
    setEditingGoal(null);
    setFormTitle('');
    setFormSubject(defaultSubj || (subjectFilter !== 'All' ? subjectFilter : 'Biology'));
    setFormChapter('');
    setFormDeadline('7 Days');
    setFormTargetMetric('200 MCQs + Notes');
    setFormProgress(0);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (goal: GoalItem) => {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormSubject(goal.subject);
    setFormChapter(goal.chapter);
    setFormDeadline(goal.deadline);
    setFormTargetMetric(goal.targetMetric);
    setFormProgress(goal.progressPercent);
    setIsModalOpen(true);
  };

  // Handle submit (create or edit)
  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingGoal) {
      onUpdateGoal(editingGoal.id, {
        title: formTitle.trim(),
        subject: formSubject,
        chapter: formChapter.trim() || 'General',
        deadline: formDeadline.trim() || '7 Days',
        targetMetric: formTargetMetric.trim() || 'General Target',
        progressPercent: formProgress,
      });
    } else {
      onAddGoal({
        title: formTitle.trim(),
        subject: formSubject,
        chapter: formChapter.trim() || 'General',
        deadline: formDeadline.trim() || '7 Days',
        targetMetric: formTargetMetric.trim() || 'General Target',
        progressPercent: formProgress,
      });
    }

    setIsModalOpen(false);
  };

  // Quick adopt template
  const handleAdoptTemplate = (tpl: NEETGoalTemplate) => {
    onAddGoal({
      title: tpl.title,
      subject: tpl.subject,
      chapter: tpl.chapter,
      deadline: tpl.deadline,
      targetMetric: tpl.targetMetric,
      progressPercent: tpl.defaultProgress || 0,
    });
  };

  // Customize template in modal
  const handleCustomizeTemplate = (tpl: NEETGoalTemplate) => {
    setEditingGoal(null);
    setFormTitle(tpl.title);
    setFormSubject(tpl.subject);
    setFormChapter(tpl.chapter);
    setFormDeadline(tpl.deadline);
    setFormTargetMetric(tpl.targetMetric);
    setFormProgress(tpl.defaultProgress || 0);
    setIsModalOpen(true);
  };

  // Nudge progress by delta
  const handleNudgeProgress = (goal: GoalItem, delta: number) => {
    const newProgress = Math.min(100, Math.max(0, goal.progressPercent + delta));
    onUpdateGoal(goal.id, {
      progressPercent: newProgress,
      completed: newProgress >= 100,
    });
  };

  // Confirm delete goal
  const handleConfirmDelete = () => {
    if (goalToDelete) {
      onDeleteGoal(goalToDelete.id);
      setGoalToDelete(null);
    }
  };

  // Helper for chapter weightage check
  const getChapterWeightage = (subject: SubjectType, chapterName: string): 'High' | 'Medium' | 'Standard' | null => {
    const list = NEET_CHAPTERS[subject] || [];
    const found = list.find((c) => c.name.toLowerCase() === chapterName.toLowerCase());
    return found ? found.weightage : null;
  };

  return (
    <div id="goals-tracker-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Target Aim & Progress Overview Banner */}
      <div className="banner-box" id="neet-target-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                🎯 Target NEET 2026: 680+ Aim
              </span>
              <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 8px' }}>
                Phase 7 Active
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
            onClick={() => handleOpenNewModal()}
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
      </div>

      {/* 2. Goal Filters & Tab Navigation */}
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

      {/* 3. Goals List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} id="goals-list-container">
        {filteredGoals.length === 0 ? (
          <Card id="empty-goals-card">
            <div style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--surface-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <GoalsIcon size={24} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
                {statusTab === 'completed'
                  ? 'No completed goals yet'
                  : searchQuery
                  ? 'No goals match your search'
                  : 'No active goals in this view'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, maxWidth: '320px' }}>
                {statusTab === 'completed'
                  ? 'Keep studying! Apne active goals ko complete karein aur yahan unka track record dekhein.'
                  : 'Choose a pre-made NEET syllabus goal template below or create your own target chapter goal.'}
              </p>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon size={16} />}
                onClick={() => handleOpenNewModal()}
                style={{ marginTop: '6px' }}
              >
                Create Study Goal
              </Button>
            </div>
          </Card>
        ) : (
          filteredGoals.map((goal) => {
            const isCompleted = goal.completed || goal.progressPercent >= 100;
            const weightage = getChapterWeightage(goal.subject, goal.chapter);

            // Progress bar color based on subject
            const subjectColor =
              goal.subject === 'Physics'
                ? 'var(--subject-physics)'
                : goal.subject === 'Chemistry'
                ? 'var(--subject-chemistry)'
                : 'var(--subject-biology)';

            return (
              <div
                key={goal.id}
                className={`card goal-card ${isCompleted ? 'completed' : ''}`}
                id={`goal-card-${goal.id}`}
                style={{
                  padding: '14px 16px',
                  borderLeft: `4px solid ${subjectColor}`,
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
                      {goal.subject}
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
                      onClick={() => handleOpenEditModal(goal)}
                      title="Edit goal"
                      aria-label={`Edit ${goal.title}`}
                    >
                      <EditIcon size={14} color="var(--text-secondary)" />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => setGoalToDelete(goal)}
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
                          onClick={() => handleNudgeProgress(goal, 10)}
                          title="Add 10% progress"
                        >
                          +10%
                        </button>
                        <button
                          type="button"
                          className="goal-progress-btn"
                          onClick={() => handleNudgeProgress(goal, 25)}
                          title="Add 25% progress"
                        >
                          +25%
                        </button>
                        {goal.progressPercent > 0 && (
                          <button
                            type="button"
                            className="goal-progress-btn"
                            onClick={() => handleNudgeProgress(goal, -10)}
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
                        onClick={() => openTimer({ subject: goal.subject, chapter: goal.chapter })}
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
                    onClick={() => onToggleGoalComplete(goal.id)}
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
          })
        )}
      </div>

      {/* 4. Pre-Made NEET Goal Templates Section */}
      <Card
        id="neet-goal-templates-section"
        title="Pre-Made NEET Goal Templates"
        subtitle="1-tap import for syllabus mastery & chapter drills"
        action={
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['All', 'Biology', 'Physics', 'Chemistry'] as Array<'All' | SubjectType>).map((subj) => (
              <button
                type="button"
                key={subj}
                className={`segment-btn ${templateSubjectFilter === subj ? 'active' : ''}`}
                style={{ fontSize: '10px', padding: '2px 8px' }}
                onClick={() => setTemplateSubjectFilter(subj)}
              >
                {subj}
              </button>
            ))}
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTemplates.slice(0, 6).map((tpl) => (
            <div key={tpl.id} className="goal-template-card" id={`template-${tpl.id}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <Badge
                      variant={
                        tpl.subject === 'Physics'
                          ? 'physics'
                          : tpl.subject === 'Chemistry'
                          ? 'chemistry'
                          : 'biology'
                      }
                    >
                      {tpl.subject}
                    </Badge>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {tpl.classGrade} • {tpl.deadline}
                    </span>
                  </div>
                  <h5 style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 0 0' }}>
                    {tpl.title}
                  </h5>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    {tpl.chapter} • <strong style={{ color: 'var(--text-primary)' }}>{tpl.targetMetric}</strong>
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
                    {tpl.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdoptTemplate(tpl)}
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                    id={`adopt-tpl-btn-${tpl.id}`}
                  >
                    + Adopt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCustomizeTemplate(tpl)}
                    style={{ fontSize: '10px', padding: '3px 8px' }}
                  >
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Add / Edit Goal Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
            <div className="modal-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700 }}>
                  {editingGoal ? 'Edit Study Goal' : 'Set New NEET Goal'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  Define chapter milestone, practice target, and deadline
                </p>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitGoal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Goal Title */}
              <Input
                label="Goal Title"
                placeholder="e.g. Master Cell Cycle & Division 100 MCQs"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />

              {/* Subject Selector */}
              <div className="input-group">
                <label className="input-label">Subject</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(['Physics', 'Chemistry', 'Biology'] as SubjectType[]).map((subj) => {
                    const isSelected = formSubject === subj;
                    return (
                      <button
                        type="button"
                        key={subj}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        style={{
                          fontSize: '12px',
                          padding: '8px 4px',
                          borderColor:
                            subj === 'Physics'
                              ? 'var(--subject-physics)'
                              : subj === 'Chemistry'
                              ? 'var(--subject-chemistry)'
                              : 'var(--subject-biology)',
                          color: isSelected
                            ? undefined
                            : subj === 'Physics'
                            ? 'var(--subject-physics)'
                            : subj === 'Chemistry'
                            ? 'var(--subject-chemistry)'
                            : 'var(--subject-biology)',
                        }}
                        onClick={() => {
                          setFormSubject(subj);
                          // Suggest first chapter of new subject if empty
                          if (!formChapter) {
                            const firstChap = NEET_CHAPTERS[subj]?.[0]?.name;
                            if (firstChap) setFormChapter(firstChap);
                          }
                        }}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chapter Selector with Autocomplete suggestions */}
              <div className="input-group">
                <label className="input-label">Chapter Name (NEET Syllabus)</label>
                <Input
                  placeholder="e.g. Rotational Motion, Genetics, etc."
                  value={formChapter}
                  onChange={(e) => setFormChapter(e.target.value)}
                />
                {/* Quick Chapter Suggestions from Syllabus */}
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Quick select:</span>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
                    {NEET_CHAPTERS[formSubject]?.slice(0, 6).map((ch) => (
                      <button
                        type="button"
                        key={ch.name}
                        className="goal-progress-btn"
                        style={{
                          fontSize: '10px',
                          borderColor: ch.weightage === 'High' ? 'var(--flame)' : undefined,
                        }}
                        onClick={() => setFormChapter(ch.name)}
                      >
                        {ch.weightage === 'High' ? '🔥 ' : ''}
                        {ch.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Metric with Presets */}
              <div className="input-group">
                <label className="input-label">Target Metric</label>
                <Input
                  placeholder="e.g. 150 MCQs + Notes"
                  value={formTargetMetric}
                  onChange={(e) => setFormTargetMetric(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '6px', paddingBottom: '2px' }}>
                  {targetMetricPresets.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      className="goal-progress-btn"
                      style={{ fontSize: '10px' }}
                      onClick={() => setFormTargetMetric(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Deadline */}
              <div className="input-group">
                <label className="input-label">Target Deadline</label>
                <Input
                  placeholder="e.g. 5 Days or 2026-05-01"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '6px' }}>
                  {deadlinePresets.map((dl) => (
                    <button
                      type="button"
                      key={dl}
                      className="goal-progress-btn"
                      style={{ fontSize: '10px' }}
                      onClick={() => setFormDeadline(dl)}
                    >
                      {dl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Slider */}
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label">Current Progress ({formProgress}%)</label>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {formProgress >= 100 ? 'Goal Completed 🎉' : `${100 - formProgress}% remaining`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={formProgress}
                  onChange={(e) => setFormProgress(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  <span>0% (Just started)</span>
                  <span>50% (Halfway)</span>
                  <span>100% (Completed)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  style={{ flex: 2 }}
                  id="submit-goal-btn"
                >
                  {editingGoal ? 'Update Goal' : 'Save Goal'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="modal-overlay" onClick={() => setGoalToDelete(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Delete Goal?</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Kya aap sach me &quot;<strong>{goalToDelete.title}</strong>&quot; goal ko remove karna chahte hain?
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Button
                variant="outline"
                onClick={() => setGoalToDelete(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                style={{ flex: 1 }}
                id="confirm-delete-goal-btn"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
