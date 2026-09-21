import React, { useState, useMemo } from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { GoalsIcon } from '../components/icons/SvgIcons';
import { GoalItem, SubjectType } from '../types';
import { NEET_PREMADE_GOAL_TEMPLATES, NEETGoalTemplate } from '../data/neetGoalTemplates';
import { useTimer } from '../context/TimerContext';
import { GoalsHeaderBanner } from '../components/goals/GoalsHeaderBanner';
import { GoalsFilterBar } from '../components/goals/GoalsFilterBar';
import { GoalCardItem } from '../components/goals/GoalCardItem';
import { GoalTemplatesSection } from '../components/goals/GoalTemplatesSection';
import { GoalFormModal } from '../components/goals/GoalFormModal';
import { GoalDeleteModal } from '../components/goals/GoalDeleteModal';

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

  // Overall statistics calculation
  const totalGoalsCount = goals.length;
  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const activeGoalsCount = totalGoalsCount - completedGoalsCount;
  const averageProgress =
    totalGoalsCount > 0
      ? Math.round(
          goals.reduce((acc, g) => acc + (g.completed ? 100 : g.progressPercent), 0) / totalGoalsCount
        )
      : 0;

  // Filter & sort goals
  const filteredGoals = useMemo(() => {
    return goals
      .filter((g) => {
        if (statusTab === 'active' && g.completed) return false;
        if (statusTab === 'completed' && !g.completed) return false;
        if (subjectFilter !== 'All' && g.subject !== subjectFilter) return false;

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

  return (
    <div id="goals-tracker-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Target Aim & Progress Overview Banner */}
      <GoalsHeaderBanner
        activeGoalsCount={activeGoalsCount}
        completedGoalsCount={completedGoalsCount}
        averageProgress={averageProgress}
        onOpenNewModal={() => handleOpenNewModal()}
      />

      {/* 2. Goal Filters & Tab Navigation */}
      <GoalsFilterBar
        statusTab={statusTab}
        setStatusTab={setStatusTab}
        activeGoalsCount={activeGoalsCount}
        completedGoalsCount={completedGoalsCount}
        totalGoalsCount={totalGoalsCount}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 3. Goals List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} id="goals-list-container">
        {filteredGoals.length === 0 ? (
          <EmptyState
            icon={<GoalsIcon size={28} color="var(--primary)" />}
            badge="Goals Milestone"
            title={
              statusTab === 'completed'
                ? 'No completed goals yet'
                : searchQuery
                ? 'No goals match your search'
                : 'No active goals in this view'
            }
            description={
              statusTab === 'completed'
                ? 'Keep studying! Apne active goals ko complete karein aur yahan unka track record dekhein.'
                : 'Choose a pre-made NEET syllabus goal template below or create your own target chapter goal.'
            }
            actionText="+ Create Study Goal"
            onAction={() => handleOpenNewModal()}
          />
        ) : (
          filteredGoals.map((goal) => (
            <GoalCardItem
              key={goal.id}
              goal={goal}
              onEdit={handleOpenEditModal}
              onDeleteRequest={setGoalToDelete}
              onNudgeProgress={handleNudgeProgress}
              onToggleComplete={onToggleGoalComplete}
              onOpenTimer={openTimer}
            />
          ))
        )}
      </div>

      {/* 4. Pre-Made NEET Goal Templates Section */}
      <GoalTemplatesSection
        templateSubjectFilter={templateSubjectFilter}
        setTemplateSubjectFilter={setTemplateSubjectFilter}
        filteredTemplates={filteredTemplates}
        onAdoptTemplate={handleAdoptTemplate}
        onCustomizeTemplate={handleCustomizeTemplate}
      />

      {/* 5. Add / Edit Goal Modal */}
      <GoalFormModal
        isOpen={isModalOpen}
        editingGoal={editingGoal}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formSubject={formSubject}
        setFormSubject={setFormSubject}
        formChapter={formChapter}
        setFormChapter={setFormChapter}
        formDeadline={formDeadline}
        setFormDeadline={setFormDeadline}
        formTargetMetric={formTargetMetric}
        setFormTargetMetric={setFormTargetMetric}
        formProgress={formProgress}
        setFormProgress={setFormProgress}
        onSubmit={handleSubmitGoal}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 6. Delete Confirmation Modal */}
      <GoalDeleteModal
        goal={goalToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setGoalToDelete(null)}
      />
    </div>
  );
};
