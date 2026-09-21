import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { UserProfile } from '../../types';

interface ProfileHeroCardProps {
  user: UserProfile | null;
  displayName: string;
  username: string;
  targetYear: string;
  targetScore: string;
  dreamCollege: string;
  bio: string;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  user,
  displayName,
  username,
  targetYear,
  targetScore,
  dreamCollege,
  bio,
}) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'GT';
  };

  return (
    <Card id="user-profile-hero-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, #0366D6 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(4, 148, 244, 0.3)',
            flexShrink: 0,
          }}
        >
          {getInitials(displayName || user?.displayName || 'Aspirant')}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {displayName || user?.displayName || 'Aspirant'}
            </h3>
            <Badge variant="primary">NEET {targetYear}</Badge>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            @{username} • {user?.email || 'aspirant@prepmate.ai'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-container)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              🏥 {dreamCollege}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--success)',
                backgroundColor: 'var(--success-container)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              🎯 Target: {targetScore}+ Marks
            </span>
          </div>
        </div>
      </div>

      {/* Bio quote / motto */}
      <p
        style={{
          fontSize: '12px',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          marginTop: '12px',
          marginBottom: 0,
          paddingTop: '8px',
          borderTop: '1px solid var(--border)',
        }}
      >
        &quot;{bio}&quot;
      </p>
    </Card>
  );
};
