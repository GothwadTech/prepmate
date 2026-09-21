import React from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { CloseIcon } from '../icons/SvgIcons';
import { GoalItem, SubjectType } from '../../types';
import { NEET_CHAPTERS } from '../../data/neetSyllabus';

interface GoalFormModalProps {
  isOpen: boolean;
  editingGoal: GoalItem | null;
  formTitle: string;
  setFormTitle: (val: string) => void;
  formSubject: SubjectType;
  setFormSubject: (val: SubjectType) => void;
  formChapter: string;
  setFormChapter: (val: string) => void;
  formDeadline: string;
  setFormDeadline: (val: string) => void;
  formTargetMetric: string;
  setFormTargetMetric: (val: string) => void;
  formProgress: number;
  setFormProgress: (val: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const TARGET_METRIC_PRESETS = [
  '150 NCERT MCQs',
  '200 MCQs + PYQs',
  'Formula Sheet + Notes',
  'NCERT 3x Reading',
  'Full Chapter Mock Test',
];

const DEADLINE_PRESETS = ['3 Days', '5 Days', '1 Week', '2 Weeks', '1 Month'];

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  editingGoal,
  formTitle,
  setFormTitle,
  formSubject,
  setFormSubject,
  formChapter,
  setFormChapter,
  formDeadline,
  setFormDeadline,
  formTargetMetric,
  setFormTargetMetric,
  formProgress,
  setFormProgress,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
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
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
              {TARGET_METRIC_PRESETS.map((preset) => (
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
              {DEADLINE_PRESETS.map((dl) => (
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
              onClick={onClose}
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
  );
};
