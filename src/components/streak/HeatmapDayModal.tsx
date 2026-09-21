import React from 'react';
import { CalendarIcon, CloseIcon } from '../icons/SvgIcons';
import { HeatmapDayCell, formatMinutesToHours } from '../../utils/streakUtils';

interface HeatmapDayModalProps {
  selectedDay: HeatmapDayCell;
  onClose: () => void;
  reflectionText: string;
  setReflectionText: (v: string) => void;
  isEditingReflection: boolean;
  setIsEditingReflection: (v: boolean) => void;
  isSaving: boolean;
  onSaveReflection: () => void;
}

export const HeatmapDayModal: React.FC<HeatmapDayModalProps> = ({
  selectedDay,
  onClose,
  reflectionText,
  setReflectionText,
  isEditingReflection,
  setIsEditingReflection,
  isSaving,
  onSaveReflection,
}) => {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--surface-variant)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={16} color="var(--primary)" />
          <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {selectedDay.isToday && (
              <span
                style={{
                  marginLeft: '8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--primary-container)',
                  color: 'var(--primary)',
                }}
              >
                Today
              </span>
            )}
          </h4>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '2px',
          }}
        >
          <CloseIcon size={15} />
        </button>
      </div>

      {/* Quick stats grid for this day */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        <div style={statBoxStyle}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Total Study</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatMinutesToHours(selectedDay.studyMinutes)}
          </span>
        </div>

        <div style={statBoxStyle}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Tasks Done</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {selectedDay.tasksCompleted}
          </span>
        </div>

        <div style={statBoxStyle}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Streak Valid</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: selectedDay.isShieldUsed
                ? 'var(--primary)'
                : (selectedDay.studyMinutes >= 25 || selectedDay.tasksCompleted >= 1)
                ? 'var(--success)'
                : 'var(--text-tertiary)',
            }}
          >
            {selectedDay.isShieldUsed
              ? 'Shield'
              : (selectedDay.studyMinutes >= 25 || selectedDay.tasksCompleted >= 1)
              ? '✓ Yes'
              : 'No'}
          </span>
        </div>

        <div style={statBoxStyle}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Intensity</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Lvl {selectedDay.level}/4
          </span>
        </div>
      </div>

      {/* Reflection editor in heatmap panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Daily Notes / Journal:
          </span>
          {!isEditingReflection ? (
            <button
              type="button"
              onClick={() => {
                setReflectionText(selectedDay.notes || '');
                setIsEditingReflection(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '11px',
                color: 'var(--primary)',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {selectedDay.notes ? 'Edit Note' : '+ Add Note'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                disabled={isSaving}
                onClick={onSaveReflection}
                style={{
                  fontSize: '10.5px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingReflection(false)}
                style={{
                  fontSize: '10.5px',
                  padding: '2px 6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditingReflection ? (
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Record your preparation summary or doubts from this day..."
            rows={2}
            style={{
              width: '100%',
              fontSize: '11.5px',
              padding: '6px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />
        ) : selectedDay.notes ? (
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              backgroundColor: 'var(--surface)',
              padding: '6px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-subtle)',
              margin: 0,
            }}
          >
            &quot;{selectedDay.notes}&quot;
          </p>
        ) : (
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
            No study notes logged for this day.
          </p>
        )}
      </div>
    </div>
  );
};

const statBoxStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface)',
  padding: '6px 8px',
  borderRadius: 'var(--radius-xs)',
  border: '1px solid var(--border)',
};
