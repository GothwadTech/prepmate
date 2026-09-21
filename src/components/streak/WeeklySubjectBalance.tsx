import React from 'react';
import { formatMinutesToHours } from '../../utils/streakUtils';

interface WeeklySubjectBalanceProps {
  totalWeekMinutes: number;
  physicsMinutes: number;
  physicsPercent: number;
  chemistryMinutes: number;
  chemistryPercent: number;
  biologyMinutes: number;
  biologyPercent: number;
}

export const WeeklySubjectBalance: React.FC<WeeklySubjectBalanceProps> = ({
  totalWeekMinutes,
  physicsMinutes,
  physicsPercent,
  chemistryMinutes,
  chemistryPercent,
  biologyMinutes,
  biologyPercent,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Weekly NEET Subject Balance:</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Total Week Study: <strong style={{ color: 'var(--text-primary)' }}>{formatMinutesToHours(totalWeekMinutes)}</strong>
        </span>
      </div>

      {totalWeekMinutes > 0 ? (
        <div>
          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden',
              display: 'flex',
              backgroundColor: 'var(--border)',
            }}
          >
            <div
              style={{
                width: `${physicsPercent}%`,
                backgroundColor: 'var(--subject-physics)',
                transition: 'width 0.3s',
              }}
              title={`Physics: ${physicsMinutes}m (${physicsPercent}%)`}
            />
            <div
              style={{
                width: `${chemistryPercent}%`,
                backgroundColor: 'var(--subject-chemistry)',
                transition: 'width 0.3s',
              }}
              title={`Chemistry: ${chemistryMinutes}m (${chemistryPercent}%)`}
            />
            <div
              style={{
                width: `${biologyPercent}%`,
                backgroundColor: 'var(--subject-biology)',
                transition: 'width 0.3s',
              }}
              title={`Biology: ${biologyMinutes}m (${biologyPercent}%)`}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10.5px',
              marginTop: '6px',
              fontWeight: 600,
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <span style={{ color: 'var(--subject-physics)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-physics)' }} />
              Physics ({physicsPercent}% • {physicsMinutes}m)
            </span>
            <span style={{ color: 'var(--subject-chemistry)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-chemistry)' }} />
              Chemistry ({chemistryPercent}% • {chemistryMinutes}m)
            </span>
            <span style={{ color: 'var(--subject-biology)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-biology)' }} />
              Biology ({biologyPercent}% • {biologyMinutes}m)
            </span>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', margin: 0 }}>
          No study sessions recorded for this week yet.
        </p>
      )}
    </div>
  );
};
