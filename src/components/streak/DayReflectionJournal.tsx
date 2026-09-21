import React, { useState, useEffect } from 'react';
import { WeekCalendarDay } from '../../utils/streakUtils';

interface DayReflectionJournalProps {
  activeDay: WeekCalendarDay;
  onSaveReflection: (date: string, notes: string) => Promise<void>;
}

export const DayReflectionJournal: React.FC<DayReflectionJournalProps> = ({
  activeDay,
  onSaveReflection,
}) => {
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);

  useEffect(() => {
    setReflectionInput(activeDay.log?.notes || '');
    setIsEditingNote(false);
  }, [activeDay.date, activeDay.log?.notes]);

  const handleSave = async () => {
    setIsSavingNote(true);
    await onSaveReflection(activeDay.date, reflectionInput);
    setIsSavingNote(false);
    setIsEditingNote(false);
  };

  return (
    <div
      style={{
        paddingTop: '8px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Daily Reflection & Study Journal:
        </span>
        {!isEditingNote ? (
          <button
            type="button"
            onClick={() => {
              setReflectionInput(activeDay.log?.notes || '');
              setIsEditingNote(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '11.5px',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {activeDay.log?.notes ? 'Edit Note' : '+ Write Reflection'}
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              disabled={isSavingNote}
              onClick={handleSave}
              style={{
                fontSize: '11px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isSavingNote ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditingNote(false)}
              style={{
                fontSize: '11px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                padding: '3px 6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {isEditingNote ? (
        <textarea
          value={reflectionInput}
          onChange={(e) => setReflectionInput(e.target.value)}
          placeholder="What went well today? Any tricky questions or formulas to re-test tomorrow?"
          rows={2}
          style={{
            width: '100%',
            fontSize: '12px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
          }}
        />
      ) : activeDay.log?.notes ? (
        <p
          style={{
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            backgroundColor: 'var(--surface)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)',
            margin: 0,
          }}
        >
          &ldquo;{activeDay.log.notes}&rdquo;
        </p>
      ) : (
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
          No notes logged for this day yet.
        </p>
      )}
    </div>
  );
};
