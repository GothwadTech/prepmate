import React, { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import {
  PlusIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  CloseIcon,
  EditIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
} from '../components/icons/SvgIcons';
import { TaskItem, SubjectType, TaskType } from '../types';
import { NEET_CHAPTERS, PRESET_TASK_TEMPLATES, QuickTemplate } from '../data/neetSyllabus';
import { useTimer } from '../context/TimerContext';

interface TasksPageProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed' | 'completedCount' | 'date'> & { date?: string }) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<TaskItem>) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
}) => {
  const { openTimer } = useTimer();

  // Selected date state (YYYY-MM-DD format)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [selectedSubject, setSelectedSubject] = useState<'All' | SubjectType>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState<SubjectType>('Physics');
  const [formChapter, setFormChapter] = useState('');
  const [formType, setFormType] = useState<TaskType>('MCQs');
  const [formTargetCount, setFormTargetCount] = useState('45');
  const [formDate, setFormDate] = useState(selectedDate);

  // Date helper functions
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const yesterdayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, []);

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleShiftDate = (days: number) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Filter tasks by currently selected date
  const dateTasks = useMemo(() => {
    return tasks.filter((t) => (t.date || todayStr) === selectedDate);
  }, [tasks, selectedDate, todayStr]);

  // Filter by subject
  const subjectFilteredTasks = useMemo(() => {
    if (selectedSubject === 'All') return dateTasks;
    return dateTasks.filter((t) => t.subject === selectedSubject);
  }, [dateTasks, selectedSubject]);

  // Calculation of metrics for the day
  const totalDateTasks = dateTasks.length;
  const completedDateTasks = dateTasks.filter((t) => t.completed).length;
  const progressPercent = totalDateTasks > 0 ? Math.round((completedDateTasks / totalDateTasks) * 100) : 0;

  // Subject breakdown for current date
  const physicsDateTasks = dateTasks.filter((t) => t.subject === 'Physics');
  const chemDateTasks = dateTasks.filter((t) => t.subject === 'Chemistry');
  const bioDateTasks = dateTasks.filter((t) => t.subject === 'Biology');

  const physicsDone = physicsDateTasks.filter((t) => t.completed).length;
  const chemDone = chemDateTasks.filter((t) => t.completed).length;
  const bioDone = bioDateTasks.filter((t) => t.completed).length;

  // Open modal for new task
  const handleOpenAddModal = (presetTemplate?: QuickTemplate) => {
    if (presetTemplate) {
      setFormTitle(presetTemplate.title);
      setFormSubject(presetTemplate.subject);
      setFormChapter(presetTemplate.chapter);
      setFormType(presetTemplate.type);
      setFormTargetCount(presetTemplate.targetCount.toString());
    } else {
      setFormTitle('');
      setFormSubject(selectedSubject === 'All' ? 'Physics' : selectedSubject);
      setFormChapter('');
      setFormType('MCQs');
      setFormTargetCount('45');
    }
    setFormDate(selectedDate);
    setEditingTask(null);
    setIsAddModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormSubject(task.subject);
    setFormChapter(task.chapter);
    setFormType(task.type);
    setFormTargetCount(task.targetCount.toString());
    setFormDate(task.date || selectedDate);
    setIsAddModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const count = parseInt(formTargetCount, 10) || 1;

    if (editingTask) {
      onUpdateTask(editingTask.id, {
        title: formTitle.trim(),
        subject: formSubject,
        chapter: formChapter.trim() || 'General',
        type: formType,
        targetCount: count,
        date: formDate,
      });
    } else {
      onAddTask({
        title: formTitle.trim(),
        subject: formSubject,
        chapter: formChapter.trim() || 'General',
        type: formType,
        targetCount: count,
        date: formDate,
      });
    }

    setIsAddModalOpen(false);
    setEditingTask(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteTask(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getSubjectBadgeVariant = (subj: SubjectType): 'physics' | 'chemistry' | 'biology' => {
    if (subj === 'Physics') return 'physics';
    if (subj === 'Chemistry') return 'chemistry';
    return 'biology';
  };

  return (
    <div id="tasks-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Date Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
        id="date-navigation-strip"
      >
        <button
          className="btn-icon"
          onClick={() => handleShiftDate(-1)}
          aria-label="Previous day"
          id="prev-day-btn"
          title="Previous day"
        >
          <ChevronLeftIcon size={18} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarIcon size={16} color="var(--primary)" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatDateDisplay(selectedDate)}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <button
          className="btn-icon"
          onClick={() => handleShiftDate(1)}
          aria-label="Next day"
          id="next-day-btn"
          title="Next day"
        >
          <ChevronRightIcon size={18} />
        </button>
      </div>

      {/* Date Quick Preset Buttons & Picker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`date-preset-pill ${selectedDate === yesterdayStr ? 'active' : ''}`}
            onClick={() => setSelectedDate(yesterdayStr)}
            id="date-preset-yesterday"
          >
            Yesterday
          </button>
          <button
            type="button"
            className={`date-preset-pill ${selectedDate === todayStr ? 'active' : ''}`}
            onClick={() => setSelectedDate(todayStr)}
            id="date-preset-today"
          >
            Today
          </button>
          <button
            type="button"
            className={`date-preset-pill ${selectedDate === tomorrowStr ? 'active' : ''}`}
            onClick={() => setSelectedDate(tomorrowStr)}
            id="date-preset-tomorrow"
          >
            Tomorrow
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            id="native-date-picker"
            aria-label="Select custom date"
          />
        </div>
      </div>

      {/* 2. Daily Progress Summary Card with Subject Meters */}
      <Card
        id="tasks-progress-card"
        title="Day's Target Completion"
        subtitle={`${completedDateTasks} of ${totalDateTasks} study tasks done`}
        action={
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
            {progressPercent}%
          </span>
        }
      >
        <div className="progress-bar-wrap">
          <div className="progress-track" style={{ height: '9px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                background:
                  progressPercent === 100
                    ? 'var(--success)'
                    : 'linear-gradient(90deg, var(--primary) 0%, #34A853 100%)',
              }}
            />
          </div>
        </div>

        {/* 3 Subject Micro Metrics for the Date */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--subject-physics)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--subject-physics)' }}>Physics</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {physicsDone}/{physicsDateTasks.length} Done
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--subject-chemistry)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--subject-chemistry)' }}>Chemistry</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {chemDone}/{chemDateTasks.length} Done
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--subject-biology)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--subject-biology)' }}>Biology</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {bioDone}/{bioDateTasks.length} Done
            </span>
          </div>
        </div>
      </Card>

      {/* 100% Celebration Banner */}
      {totalDateTasks > 0 && progressPercent === 100 && (
        <div className="task-celebration-banner" id="all-tasks-done-banner">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--success-container)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2Icon size={22} color="var(--success)" />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Shabash! Today's Target Completed 🎯
            </h4>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Aapne aaj ke saare study tasks achieve kar liye hain. NEET streak is safe!
            </p>
          </div>
        </div>
      )}

      {/* 3. Subject Filter Tabs */}
      <div className="segment-tabs" id="subject-filter-pills" role="tablist">
        {(
          [
            { key: 'All', label: `All (${dateTasks.length})` },
            { key: 'Physics', label: `Physics (${physicsDateTasks.length})` },
            { key: 'Chemistry', label: `Chemistry (${chemDateTasks.length})` },
            { key: 'Biology', label: `Biology (${bioDateTasks.length})` },
          ] as const
        ).map((item) => (
          <button
            key={item.key}
            id={`filter-${item.key.toLowerCase()}-btn`}
            className={`segment-btn ${selectedSubject === item.key ? 'active' : ''}`}
            onClick={() => setSelectedSubject(item.key)}
            role="tab"
            aria-selected={selectedSubject === item.key}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 4. Task List Grouped or Filtered */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} id="task-list-container">
        {subjectFilteredTasks.length === 0 ? (
          <div
            style={{
              padding: '36px 16px',
              textAlign: 'center',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border)',
            }}
            id="empty-tasks-placeholder"
          >
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedDate === todayStr ? 'Aaj ke liye koi task nahi hai!' : `${formatDateDisplay(selectedDate)} ke liye koi task nahi hai`}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Niche button daba kar target add karein ya quick NEET templates choose karein.
            </p>

            {/* Quick Preset Buttons for fast onboarding */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Quick High-Yield NEET Suggestions:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {PRESET_TASK_TEMPLATES.slice(0, 3).map((template, idx) => (
                  <div
                    key={idx}
                    className="template-chip"
                    onClick={() => handleOpenAddModal(template)}
                    id={`quick-template-${idx}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700 }}>+ {template.title}</span>
                      <Badge variant={getSubjectBadgeVariant(template.subject)}>{template.subject}</Badge>
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {template.chapter} • {template.type} ({template.targetCount})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          subjectFilteredTasks.map((task) => (
            <div key={task.id} className="task-item" id={`task-item-${task.id}`}>
              <div
                className="task-checkbox-wrap"
                onClick={() => onToggleTask(task.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onToggleTask(task.id)}
                style={{ flex: 1, minWidth: 0 }}
              >
                <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                  {task.completed && <CheckIcon size={14} color="#FFFFFF" />}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p className={`task-text ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Badge variant={getSubjectBadgeVariant(task.subject)}>
                      {task.subject}
                    </Badge>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {task.chapter} • {task.type} ({task.targetCount})
                    </span>
                    {task.completed && (
                      <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 700 }}>
                        ✓ Done
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Timer, Edit & Delete */}
              <div className="task-actions-wrap">
                <button
                  type="button"
                  className="task-action-btn"
                  onClick={() => openTimer({ subject: task.subject, chapter: task.chapter, id: task.id })}
                  title="Start Study Timer for this task"
                  aria-label={`Start timer for ${task.title}`}
                  id={`timer-task-btn-${task.id}`}
                >
                  <ClockIcon size={15} color="var(--primary)" />
                </button>
                <button
                  type="button"
                  className="task-action-btn"
                  onClick={() => handleOpenEditModal(task)}
                  title="Edit task"
                  aria-label={`Edit task ${task.title}`}
                  id={`edit-task-btn-${task.id}`}
                >
                  <EditIcon size={15} />
                </button>
                <button
                  type="button"
                  className="task-action-btn delete"
                  onClick={() => setDeleteConfirmId(task.id)}
                  title="Delete task"
                  aria-label={`Delete task ${task.title}`}
                  id={`delete-task-btn-${task.id}`}
                >
                  <TrashIcon size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Add Task Sticky Action Button */}
      <Button
        id="open-add-task-modal-btn"
        variant="primary"
        leftIcon={<PlusIcon size={18} />}
        onClick={() => handleOpenAddModal()}
        isFullWidth
        size="md"
      >
        + Naya Task Add Karein
      </Button>

      {/* 6. Add / Edit Task Modal Sheet */}
      {isAddModalOpen && (
        <div className="modal-overlay" id="task-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-sheet"
            id="task-modal-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
                  {editingTask ? 'Task Edit Karein' : 'Naya Daily Task Add Karein'}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Date: {formatDateDisplay(formDate)}
                </p>
              </div>
              <button className="btn-icon" onClick={() => setIsAddModalOpen(false)} aria-label="Close modal">
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Task Title */}
              <Input
                label="Task Description / Title *"
                placeholder="e.g. 50 MCQs solve karne hain"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                id="task-title-input"
              />

              {/* Subject Selection */}
              <div className="input-group">
                <label className="input-label">Subject</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(['Physics', 'Chemistry', 'Biology'] as SubjectType[]).map((subj) => (
                    <button
                      type="button"
                      key={subj}
                      className={`btn ${formSubject === subj ? 'btn-primary' : 'btn-outline'}`}
                      style={{
                        fontSize: '12px',
                        padding: '8px 4px',
                        borderColor: formSubject === subj ? 'var(--primary)' : 'var(--border)',
                      }}
                      onClick={() => {
                        setFormSubject(subj);
                        setFormChapter('');
                      }}
                      id={`select-subj-${subj.toLowerCase()}-btn`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter Name with Dropdown Autocomplete */}
              <div className="input-group">
                <label className="input-label">Chapter (NEET Syllabus)</label>
                <input
                  list="neet-chapters-list"
                  className="input-field"
                  placeholder="Chapter select ya type karein (e.g. Current Electricity)"
                  value={formChapter}
                  onChange={(e) => setFormChapter(e.target.value)}
                  id="task-chapter-input"
                />
                <datalist id="neet-chapters-list">
                  {NEET_CHAPTERS[formSubject].map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name} ({c.weightage} Weightage • {c.classGrade})
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Task Type & Target Quantity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="input-group">
                  <label className="input-label">Task Type</label>
                  <select
                    className="input-field"
                    value={formType}
                    onChange={(e) => {
                      const newType = e.target.value as TaskType;
                      setFormType(newType);
                      if (newType === 'MCQs' && formTargetCount === '1') setFormTargetCount('45');
                      if ((newType === 'Notes' || newType === 'Revision') && formTargetCount === '45') setFormTargetCount('1');
                    }}
                    id="task-type-select"
                  >
                    <option value="MCQs">MCQs Drill</option>
                    <option value="Notes">Notes / NCERT Reading</option>
                    <option value="Revision">Revision</option>
                    <option value="Lecture">Video Lecture</option>
                    <option value="Test">Mock / Unit Test</option>
                  </select>
                </div>

                <Input
                  label={formType === 'MCQs' ? 'MCQ Count' : formType === 'Lecture' ? 'Duration (mins)' : 'Target Count'}
                  type="number"
                  placeholder="e.g. 45"
                  value={formTargetCount}
                  onChange={(e) => setFormTargetCount(e.target.value)}
                  required
                  id="task-target-count-input"
                />
              </div>

              {/* Date Selector for Task */}
              <div className="input-group">
                <label className="input-label">Date for Task</label>
                <input
                  type="date"
                  className="input-field"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  id="task-form-date-input"
                />
              </div>

              {/* Quick Template Fillers if creating new */}
              {!editingTask && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                    Or click a preset template to auto-fill:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {PRESET_TASK_TEMPLATES.map((tmpl, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className="template-chip"
                        style={{ flexShrink: 0, fontSize: '10px' }}
                        onClick={() => {
                          setFormTitle(tmpl.title);
                          setFormSubject(tmpl.subject);
                          setFormChapter(tmpl.chapter);
                          setFormType(tmpl.type);
                          setFormTargetCount(tmpl.targetCount.toString());
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{tmpl.subject}</span>
                        <span>{tmpl.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" variant="primary" isFullWidth style={{ marginTop: '8px' }} id="save-task-submit-btn">
                {editingTask ? 'Update Task' : 'Save Task to Daily Plan'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Delete Confirmation Dialog Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" id="delete-confirm-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div
            className="modal-sheet"
            style={{ padding: '20px', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
            id="delete-confirm-sheet"
          >
            <div style={{ margin: '0 auto', color: 'var(--danger)' }}>
              <TrashIcon size={32} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: '8px' }}>Task Delete Karein?</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Kya aap is task ko remove karna chahte hain? Offline cache aur cloud se delete ho jayega.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} id="cancel-delete-btn">
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete} id="confirm-delete-btn">
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
