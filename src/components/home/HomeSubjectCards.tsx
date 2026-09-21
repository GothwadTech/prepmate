import React from 'react';
import { Card } from '../common/Card';
import { SubjectType } from '../../types';

interface HomeSubjectCardsProps {
  physicsProg: number;
  chemistryProg: number;
  biologyProg: number;
  onSelectSubject: (subject: SubjectType) => void;
}

export const HomeSubjectCards: React.FC<HomeSubjectCardsProps> = ({
  physicsProg,
  chemistryProg,
  biologyProg,
  onSelectSubject,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} id="subject-cards-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Subject Breakdown & Focus
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Tap subject to launch timer ⏱️
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Physics Card */}
        <Card
          variant="physics"
          id="home-physics-card"
          clickable
          onClick={() => onSelectSubject('Physics')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--subject-physics-bg)',
                  color: 'var(--subject-physics)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--subject-physics)', margin: 0 }}>
                    Physics
                  </h4>
                  <span className="badge badge-physics" style={{ fontSize: '10px', padding: '1px 7px' }}>
                    180 Marks
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Mechanics, Optics, Modern Physics & Formulas
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--subject-physics)' }}>
                {physicsProg}%
              </span>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Today&apos;s Goal</div>
            </div>
          </div>
          <div className="progress-track" style={{ height: '7px', marginTop: '4px' }}>
            <div
              className="progress-fill"
              style={{ width: `${physicsProg}%`, background: 'var(--subject-physics)' }}
            />
          </div>
        </Card>

        {/* Chemistry Card */}
        <Card
          variant="chemistry"
          id="home-chemistry-card"
          clickable
          onClick={() => onSelectSubject('Chemistry')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--subject-chemistry-bg)',
                  color: 'var(--subject-chemistry)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ⚗️
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--subject-chemistry)', margin: 0 }}>
                    Chemistry
                  </h4>
                  <span className="badge badge-chemistry" style={{ fontSize: '10px', padding: '1px 7px' }}>
                    180 Marks
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Organic Mechanisms, Inorganic NCERT & Physical
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--subject-chemistry)' }}>
                {chemistryProg}%
              </span>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Today&apos;s Goal</div>
            </div>
          </div>
          <div className="progress-track" style={{ height: '7px', marginTop: '4px' }}>
            <div
              className="progress-fill"
              style={{ width: `${chemistryProg}%`, background: 'var(--subject-chemistry)' }}
            />
          </div>
        </Card>

        {/* Biology Card */}
        <Card
          variant="biology"
          id="home-biology-card"
          clickable
          onClick={() => onSelectSubject('Biology')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--subject-biology-bg)',
                  color: 'var(--subject-biology)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                🧬
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--subject-biology)', margin: 0 }}>
                    Biology
                  </h4>
                  <span className="badge badge-biology" style={{ fontSize: '10px', padding: '1px 7px' }}>
                    360 Marks 🎯
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Botany & Zoology NCERT Line-by-Line & Diagrams
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--subject-biology)' }}>
                {biologyProg}%
              </span>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Today&apos;s Goal</div>
            </div>
          </div>
          <div className="progress-track" style={{ height: '7px', marginTop: '4px' }}>
            <div
              className="progress-fill"
              style={{ width: `${biologyProg}%`, background: 'var(--subject-biology)' }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
