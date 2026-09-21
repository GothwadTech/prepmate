import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CheckIcon } from '../icons/SvgIcons';
import { AchievementBadge } from '../../types';

interface ProfileBadgesSectionProps {
  badges: AchievementBadge[];
}

export const ProfileBadgesSection: React.FC<ProfileBadgesSectionProps> = ({ badges }) => {
  const [activeBadgeTab, setActiveBadgeTab] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  const filteredBadges = useMemo(() => {
    if (activeBadgeTab === 'unlocked') return badges.filter((b) => b.unlocked);
    if (activeBadgeTab === 'in_progress') return badges.filter((b) => !b.unlocked);
    return badges;
  }, [badges, activeBadgeTab]);

  return (
    <Card
      id="achievement-badges-card"
      title="Achievement Badges"
      subtitle={`${unlockedBadgesCount} of ${badges.length} Badges Unlocked`}
      action={
        <div style={{ display: 'flex', gap: '3px' }}>
          {(['all', 'unlocked', 'in_progress'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveBadgeTab(tab)}
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 7px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border)',
                backgroundColor: activeBadgeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeBadgeTab === tab ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'in_progress' ? 'Locked' : tab}
            </button>
          ))}
        </div>
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
        }}
        id="badges-grid-container"
      >
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: badge.unlocked ? 'var(--surface-variant)' : 'var(--surface)',
              border: badge.unlocked ? '1px solid var(--primary)' : '1px solid var(--border)',
              opacity: badge.unlocked ? 1 : 0.65,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                lineHeight: 1,
                filter: badge.unlocked ? 'none' : 'grayscale(1)',
              }}
            >
              {badge.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <strong
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {badge.title}
                </strong>
                {badge.unlocked && <CheckIcon size={12} color="var(--success)" />}
              </div>

              <p
                style={{
                  fontSize: '10.5px',
                  color: 'var(--text-secondary)',
                  margin: '2px 0 4px 0',
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {badge.description}
              </p>

              {/* Progress bar */}
              <div
                style={{
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--border)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${badge.unlocked ? 100 : Math.min(100, Math.round(((badge.currentProgress || 0) / (badge.targetProgress || 1)) * 100))}%`,
                    height: '100%',
                    backgroundColor: badge.unlocked ? 'var(--success)' : 'var(--primary)',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Badge Details Modal Dialog */}
      {selectedBadge && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setSelectedBadge(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              maxWidth: '360px',
              width: '100%',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>
              {selectedBadge.icon}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {selectedBadge.title}
            </h3>
            <Badge variant={selectedBadge.unlocked ? 'success' : 'neutral'}>
              {selectedBadge.unlocked ? '✓ Unlocked' : 'Locked'} • {selectedBadge.rarity || 'Common'}
            </Badge>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '12px 0', lineHeight: 1.45 }}>
              {selectedBadge.description}
            </p>

            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-variant)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '16px',
              }}
            >
              Requirement: {selectedBadge.progressLabel || `${selectedBadge.targetProgress} target`}
            </div>

            <Button variant="primary" size="sm" isFullWidth onClick={() => setSelectedBadge(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
