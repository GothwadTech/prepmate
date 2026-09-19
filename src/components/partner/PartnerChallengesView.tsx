import React, { useState, useEffect } from 'react';
import { PartnerChallenge, PartnerProfile, UserStats } from '../../types';
import { getStoredChallenges, saveChallenges } from '../../utils/challengeUtils';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CreateChallengeModal } from './CreateChallengeModal';
import {
  TrophyIcon,
  FlameIcon,
  ClockIcon,
  CheckIcon,
  PlusIcon,
  SparklesIcon,
  AwardIcon,
  TargetIcon,
} from '../icons/SvgIcons';

interface PartnerChallengesViewProps {
  partner: PartnerProfile;
  stats: UserStats;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const PartnerChallengesView: React.FC<PartnerChallengesViewProps> = ({
  partner,
  stats,
  showToast,
}) => {
  const [challenges, setChallenges] = useState<PartnerChallenge[]>(() => getStoredChallenges());
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'available' | 'completed'>('active');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Sync with storage on mount
  useEffect(() => {
    const list = getStoredChallenges();
    setChallenges(list);
  }, []);

  const handleUpdateProgress = (challengeId: string, delta: number) => {
    setChallenges((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== challengeId) return c;
        const newProgress = Math.min(c.targetMetric, c.userProgress + delta);
        const isDone = newProgress >= c.targetMetric;
        return {
          ...c,
          userProgress: newProgress,
          status: isDone ? ('completed' as const) : c.status,
          completedAt: isDone ? new Date().toISOString() : c.completedAt,
        };
      });
      saveChallenges(updated);
      return updated;
    });

    showToast(`Progress logged! +${delta} units added 🔥`, 'success');
  };

  const handleAcceptChallenge = (challengeId: string) => {
    setChallenges((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== challengeId) return c;
        return {
          ...c,
          status: 'active' as const,
        };
      });
      saveChallenges(updated);
      return updated;
    });

    showToast('Challenge accepted! Best of luck in the duel 🚀', 'success');
  };

  const handleClaimReward = (challenge: PartnerChallenge) => {
    showToast(`Claimed ${challenge.rewardXp} XP & ${challenge.rewardBadge}! 🏆`, 'success');
  };

  const filteredChallenges = challenges.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.status === activeFilter;
  });

  const activeCount = challenges.filter((c) => c.status === 'active').length;
  const availableCount = challenges.filter((c) => c.status === 'available').length;
  const completedCount = challenges.filter((c) => c.status === 'completed').length;

  return (
    <div id="partner-challenges-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Motivational Header Banner */}
      <Card
        id="challenges-header-card"
        style={{
          background: 'linear-gradient(135deg, rgba(234, 67, 53, 0.08) 0%, rgba(244, 180, 0, 0.08) 100%)',
          border: '1px solid rgba(234, 67, 53, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <TrophyIcon size={18} color="var(--danger)" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--danger)', letterSpacing: '0.5px' }}>
                STUDY DUELS & MILESTONES
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Partner Challenges with {partner.name}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: 0 }}>
              Compete in high-yield NEET drills or combine weekly study hours to earn badges and XP!
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            id="open-create-challenge-btn"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <PlusIcon size={14} /> New Challenge
          </Button>
        </div>

        {/* Quick Stats Counter */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginTop: '14px',
          }}
        >
          <div
            style={{
              padding: '8px 10px',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700 }}>ACTIVE</span>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>{activeCount}</div>
          </div>

          <div
            style={{
              padding: '8px 10px',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700 }}>AVAILABLE</span>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--warning)' }}>{availableCount}</div>
          </div>

          <div
            style={{
              padding: '8px 10px',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700 }}>COMPLETED</span>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--success)' }}>{completedCount}</div>
          </div>
        </div>
      </Card>

      {/* 2. Filter Tabs */}
      <div
        id="challenge-filter-tabs"
        style={{
          display: 'flex',
          backgroundColor: 'var(--surface-variant)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
          gap: '4px',
        }}
      >
        {(['active', 'available', 'completed', 'all'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeFilter === tab ? 'var(--surface)' : 'transparent',
              color: activeFilter === tab ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeFilter === tab ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Challenges List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredChallenges.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '36px 16px',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border)',
            }}
          >
            <TrophyIcon size={32} color="var(--text-secondary)" style={{ opacity: 0.5, margin: '0 auto 8px' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              No {activeFilter} challenges right now
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '14px' }}>
              Create a custom study duel with {partner.name} to boost your NEET preparation!
            </p>
            <Button size="sm" variant="primary" onClick={() => setShowCreateModal(true)}>
              <PlusIcon size={14} /> Create Challenge
            </Button>
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const isVs = challenge.mode === 'vs';
            const userPct = Math.min(100, Math.round((challenge.userProgress / challenge.targetMetric) * 100));
            const partnerPct = Math.min(100, Math.round((challenge.partnerProgress / challenge.targetMetric) * 100));
            const combinedPct = Math.min(
              100,
              Math.round(((challenge.userProgress + challenge.partnerProgress) / challenge.targetMetric) * 100)
            );

            return (
              <Card
                key={challenge.id}
                id={`challenge-card-${challenge.id}`}
                style={{
                  border: challenge.status === 'completed' ? '1px solid rgba(15, 157, 88, 0.4)' : '1px solid var(--border)',
                }}
              >
                {/* Challenge Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <Badge variant={isVs ? 'danger' : 'success'}>
                        {isVs ? '⚔️ VS Duel Race' : '🤝 Co-op Team Target'}
                      </Badge>
                      <Badge variant="outline">
                        {challenge.rewardXp} XP • {challenge.rewardBadge}
                      </Badge>
                      {challenge.status === 'active' && (
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          ⏳ {challenge.daysRemaining}d left
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {challenge.title}
                    </h4>
                  </div>

                  {challenge.status === 'completed' && (
                    <Badge variant="success">Completed 🏆</Badge>
                  )}
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '6px 0 12px 0' }}>
                  {challenge.description}
                </p>

                {/* Progress Visuals */}
                {isVs ? (
                  /* VS Race Progress Bars */
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: 'var(--surface-variant)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {/* You */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          You: {challenge.userProgress} / {challenge.targetMetric} {challenge.metricUnit}
                        </span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{userPct}%</span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          backgroundColor: 'var(--border)',
                          borderRadius: 'var(--radius-pill)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${userPct}%`,
                            backgroundColor: 'var(--primary)',
                            borderRadius: 'var(--radius-pill)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Partner */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                          {partner.name}: {challenge.partnerProgress} / {challenge.targetMetric} {challenge.metricUnit}
                        </span>
                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>{partnerPct}%</span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          backgroundColor: 'var(--border)',
                          borderRadius: 'var(--radius-pill)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${partnerPct}%`,
                            backgroundColor: 'var(--success)',
                            borderRadius: 'var(--radius-pill)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Co-op Progress Bar */
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--surface-variant)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        Team Progress: {challenge.userProgress + challenge.partnerProgress} / {challenge.targetMetric}{' '}
                        {challenge.metricUnit}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--success)' }}>{combinedPct}%</span>
                    </div>
                    <div
                      style={{
                        height: '7px',
                        backgroundColor: 'var(--border)',
                        borderRadius: 'var(--radius-pill)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${combinedPct}%`,
                          backgroundColor: 'var(--success)',
                          borderRadius: 'var(--radius-pill)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                  {challenge.status === 'active' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProgress(challenge.id, 1)}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        +1 {challenge.metricUnit.slice(0, 4)}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateProgress(challenge.id, challenge.metricUnit.toLowerCase().includes('hour') ? 2 : 5)}
                        style={{ fontSize: '11px', padding: '4px 10px' }}
                      >
                        +Log Progress 🔥
                      </Button>
                    </>
                  )}

                  {challenge.status === 'available' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptChallenge(challenge.id)}
                      style={{ fontSize: '11px', padding: '4px 12px' }}
                    >
                      Accept Challenge ⚔️
                    </Button>
                  )}

                  {challenge.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClaimReward(challenge)}
                      style={{ fontSize: '11px', padding: '4px 10px', color: 'var(--success)', borderColor: 'var(--success)' }}
                    >
                      <AwardIcon size={13} color="var(--success)" /> Claimed ({challenge.rewardBadge})
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Custom Challenge Modal */}
      {showCreateModal && (
        <CreateChallengeModal
          partnerName={partner.name}
          onClose={() => setShowCreateModal(false)}
          onCreated={(newChallenge) => {
            setChallenges((prev) => [newChallenge, ...prev]);
            setShowCreateModal(false);
            showToast('Challenge created and sent to partner! 🚀', 'success');
          }}
        />
      )}
    </div>
  );
};
