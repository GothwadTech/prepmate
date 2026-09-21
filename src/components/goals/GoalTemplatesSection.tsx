import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SubjectType } from '../../types';
import { NEETGoalTemplate } from '../../data/neetGoalTemplates';

interface GoalTemplatesSectionProps {
  templateSubjectFilter: 'All' | SubjectType;
  setTemplateSubjectFilter: (subj: 'All' | SubjectType) => void;
  filteredTemplates: NEETGoalTemplate[];
  onAdoptTemplate: (tpl: NEETGoalTemplate) => void;
  onCustomizeTemplate: (tpl: NEETGoalTemplate) => void;
}

export const GoalTemplatesSection: React.FC<GoalTemplatesSectionProps> = ({
  templateSubjectFilter,
  setTemplateSubjectFilter,
  filteredTemplates,
  onAdoptTemplate,
  onCustomizeTemplate,
}) => {
  return (
    <Card
      id="neet-goal-templates-section"
      title="Pre-Made NEET Goal Templates"
      subtitle="1-tap import for syllabus mastery & chapter drills"
      action={
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['All', 'Biology', 'Physics', 'Chemistry'] as Array<'All' | SubjectType>).map((subj) => (
            <button
              type="button"
              key={subj}
              className={`segment-btn ${templateSubjectFilter === subj ? 'active' : ''}`}
              style={{ fontSize: '10px', padding: '2px 8px' }}
              onClick={() => setTemplateSubjectFilter(subj)}
            >
              {subj}
            </button>
          ))}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTemplates.slice(0, 6).map((tpl) => (
          <div key={tpl.id} className="goal-template-card" id={`template-${tpl.id}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <Badge
                    variant={
                      tpl.subject === 'Physics'
                        ? 'physics'
                        : tpl.subject === 'Chemistry'
                        ? 'chemistry'
                        : 'biology'
                    }
                  >
                    {tpl.subject}
                  </Badge>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {tpl.classGrade} • {tpl.deadline}
                  </span>
                </div>
                <h5 style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 0 0' }}>
                  {tpl.title}
                </h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {tpl.chapter} • <strong style={{ color: 'var(--text-primary)' }}>{tpl.targetMetric}</strong>
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
                  {tpl.description}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAdoptTemplate(tpl)}
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                  id={`adopt-tpl-btn-${tpl.id}`}
                >
                  + Adopt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCustomizeTemplate(tpl)}
                  style={{ fontSize: '10px', padding: '3px 8px' }}
                >
                  Customize
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
