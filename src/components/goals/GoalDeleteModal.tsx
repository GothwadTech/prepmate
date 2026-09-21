import React from 'react';
import { Button } from '../common/Button';
import { GoalItem } from '../../types';

interface GoalDeleteModalProps {
  goal: GoalItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const GoalDeleteModal: React.FC<GoalDeleteModalProps> = ({ goal, onConfirm, onCancel }) => {
  if (!goal) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Delete Goal?</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Kya aap sach me &quot;<strong>{goal.title}</strong>&quot; goal ko remove karna chahte hain?
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <Button
            variant="outline"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            style={{ flex: 1 }}
            id="confirm-delete-goal-btn"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
