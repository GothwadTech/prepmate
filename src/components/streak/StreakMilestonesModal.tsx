import React from 'react';
import { TrophyIcon, CloseIcon } from '../icons/SvgIcons';
import { StreakMilestone } from '../../types';

interface StreakMilestonesModalProps {
  milestones: StreakMilestone[];
  currentStreak: number;
  onClose: () => void;
}

export const StreakMilestonesModal: React.FC<StreakMilestonesModalProps> = ({
  milestones,
  currentStreak,
  onClose,
}) => {
  return (
    <div
      id="milestones-modal-overlay"
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
        id="milestones-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '440px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(249, 171, 0, 0.12)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrophyIcon size={18} color="var(--warning)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                NEET Streak Hall of Fame
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Consistency beats intensity for medical entrance
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
            <CloseIcon size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
          {milestones.map((milestone) => (
            <div
              key={milestone.days}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: milestone.unlocked ? '1px solid rgba(249, 171, 0, 0.35)' : '1px solid var(--border)',
                backgroundColor: milestone.unlocked ? 'rgba(249, 171, 0, 0.08)' : 'var(--surface-variant)',
                opacity: milestone.unlocked ? 1 : 0.65,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{milestone.badge}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {milestone.title}
                    </h4>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {milestone.days} Days
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    {milestone.description}
                  </p>
                </div>
              </div>

              <div>
                {milestone.unlocked ? (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--success)',
                      backgroundColor: 'rgba(15, 157, 88, 0.12)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    Unlocked
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                    {milestone.days - currentStreak}d left
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
