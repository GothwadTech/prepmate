import React, { useState } from 'react';
import { ChallengeCategory, ChallengeMode, SubjectType, PartnerChallenge } from '../../types';
import { createNewChallenge } from '../../utils/challengeUtils';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  TrophyIcon,
  XIcon,
  FlameIcon,
  ClockIcon,
  CheckIcon,
  TargetIcon,
  SparklesIcon,
} from '../icons/SvgIcons';

interface CreateChallengeModalProps {
  partnerName: string;
  onClose: () => void;
  onCreated: (newChallenge: PartnerChallenge) => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  partnerName,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('physics');
  const [mode, setMode] = useState<ChallengeMode>('vs');
  const [targetMetric, setTargetMetric] = useState<number>(45);
  const [metricUnit, setMetricUnit] = useState<string>('MCQs');
  const [daysDuration, setDaysDuration] = useState<number>(4);
  const [subject, setSubject] = useState<SubjectType>('Physics');

  const handleCategoryChange = (cat: ChallengeCategory) => {
    setCategory(cat);
    if (cat === 'physics') {
      setSubject('Physics');
      setMetricUnit('MCQs');
      if (!title || title.includes('Marathon') || title.includes('Sprint')) {
        setTitle('Physics Mechanics Numericals Drill ⚡');
      }
      setTargetMetric(50);
    } else if (cat === 'chemistry') {
      setSubject('Chemistry');
      setMetricUnit('Problems');
      setTitle('Inorganic NCERT Revision Sprint ⚗️');
      setTargetMetric(40);
    } else if (cat === 'biology') {
      setSubject('Biology');
      setMetricUnit('Hours');
      setTitle('Genetics & Molecular Bio Marathon 🧬');
      setTargetMetric(8);
    } else if (cat === 'hours') {
      setMetricUnit('Study Hours');
      setTitle('Weekend Study Marathon ⏱️');
      setTargetMetric(20);
    } else if (cat === 'streak') {
      setMetricUnit('Days Streak');
      setTitle('5-Day Unbroken Study Streak 🔥');
      setTargetMetric(5);
    } else if (cat === 'mock_test') {
      setMetricUnit('Mock Tests');
      setTitle('Full Syllabus Mock Test Duel 🎯');
      setTargetMetric(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || `${subject || 'NEET'} Challenge with ${partnerName}`;
    const desc =
      mode === 'vs'
        ? `Head-to-head duel between you and ${partnerName}. First to finish ${targetMetric} ${metricUnit} wins!`
        : `Collaborative team target with ${partnerName}. Combine your study efforts to reach ${targetMetric} ${metricUnit}.`;

    const challenge = createNewChallenge({
      title: finalTitle,
      description: desc,
      category,
      mode,
      targetMetric: Math.max(1, targetMetric),
      metricUnit,
      daysDuration,
      subject: category === 'physics' || category === 'chemistry' || category === 'biology' ? subject : undefined,
    });

    onCreated(challenge);
  };

  return (
    <div
      className="modal-overlay"
      id="create-challenge-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="modal-content"
        id="create-challenge-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--surface)',
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(234, 67, 53, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrophyIcon size={18} color="var(--danger)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Create Partner Challenge
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Challenge {partnerName} to a focused NEET study target
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Select Challenge Domain
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { id: 'physics', label: 'Physics ⚡', color: 'var(--subject-physics)' },
                { id: 'chemistry', label: 'Chemistry ⚗️', color: 'var(--subject-chemistry)' },
                { id: 'biology', label: 'Biology 🧬', color: 'var(--subject-biology)' },
                { id: 'hours', label: 'Study Hours ⏱️', color: 'var(--primary)' },
                { id: 'streak', label: 'Daily Streak 🔥', color: 'var(--flame)' },
                { id: 'mock_test', label: 'Mock Test 🎯', color: 'var(--warning)' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleCategoryChange(c.id as ChallengeCategory)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-sm)',
                    border: category === c.id ? `2px solid ${c.color}` : '1px solid var(--border)',
                    backgroundColor: category === c.id ? 'var(--surface-variant)' : 'var(--surface)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: category === c.id ? c.color : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selector (VS Duel vs Co-op Team) */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Challenge Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setMode('vs')}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: mode === 'vs' ? '2px solid var(--danger)' : '1px solid var(--border)',
                  backgroundColor: mode === 'vs' ? 'var(--danger-container)' : 'var(--surface)',
                  color: mode === 'vs' ? 'var(--danger)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚔️ VS Duel Race</span>
                </div>
                <div style={{ fontSize: '10.5px', marginTop: '2px', opacity: 0.85 }}>
                  First to reach target wins the trophy
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('coop')}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: mode === 'coop' ? '2px solid var(--success)' : '1px solid var(--border)',
                  backgroundColor: mode === 'coop' ? 'var(--success-container)' : 'var(--surface)',
                  color: mode === 'coop' ? 'var(--success)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🤝 Co-op Team</span>
                </div>
                <div style={{ fontSize: '10.5px', marginTop: '2px', opacity: 0.85 }}>
                  Both combine scores to beat the goal
                </div>
              </button>
            </div>
          </div>

          {/* Challenge Title */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Challenge Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics Numerical Sprint ⚡"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-variant)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Target Quantity & Metric Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Target Number
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={targetMetric}
                onChange={(e) => setTargetMetric(Number(e.target.value))}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-variant)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Unit
              </label>
              <input
                type="text"
                value={metricUnit}
                onChange={(e) => setMetricUnit(e.target.value)}
                placeholder="MCQs, Hours, Days"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-variant)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Days Duration */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Duration: {daysDuration} Days
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[2, 3, 5, 7, 10].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDaysDuration(d)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: daysDuration === d ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: daysDuration === d ? 'var(--primary-container)' : 'var(--surface)',
                    color: daysDuration === d ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Launch Challenge 🚀
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
