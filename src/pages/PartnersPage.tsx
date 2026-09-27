import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  FlameIcon,
  TrophyIcon,
  SearchIcon,
  InboxIcon,
  TargetIcon,
  SparklesIcon,
  PartnersIcon,
  ClockIcon,
  CheckIcon,
} from '../components/icons/SvgIcons';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { PartnerProfile, ActivePartnership } from '../types';
import { VsComparisonBoard } from '../components/partner/VsComparisonBoard';
import { LeaderboardView } from '../components/partner/LeaderboardView';
import { PartnerChallengesView } from '../components/partner/PartnerChallengesView';
import { PartnerSearchCard } from '../components/partner/PartnerSearchCard';
import { PartnerRequestsList } from '../components/partner/PartnerRequestsList';
import { PartnerProfileModal } from '../components/partner/PartnerProfileModal';
import { useBackHandler } from '../context/NavigationContext';

interface PartnersPageProps {
  stats?: any;
}

export const PartnersPage: React.FC<PartnersPageProps> = () => {
  const { user, showToast } = useAuth();
  const {
    stats,
    dailyLogs,
    activePartnership,
    activePartner,
    receivedRequests,
    endCurrentPartnership,
    sendPartnerCheer,
  } = useData();

  const [activeMode, setActiveMode] = useState<
    'vs' | 'leaderboard' | 'challenges' | 'search' | 'requests'
  >('vs');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showEndConfirm, setShowEndConfirm] = useState<boolean>(false);

  // If user has incoming requests and no partner, default to requests or search
  useEffect(() => {
    if (!activePartner && receivedRequests.length > 0 && activeMode === 'vs') {
      // Keep VS or let user choose
    }
  }, [receivedRequests.length, activePartner]);

  // Back handler for end partnership confirmation modal
  useBackHandler(
    showEndConfirm,
    () => {
      setShowEndConfirm(false);
      return true;
    },
    110,
    'partner-end-confirm-modal'
  );

  // Back handler for partner profile modal
  useBackHandler(
    showProfileModal,
    () => {
      setShowProfileModal(false);
      return true;
    },
    100,
    'partner-profile-modal'
  );

  const isActuallyConnected = Boolean(activePartnership && activePartner);

  const handleDisconnect = async () => {
    await endCurrentPartnership();
    setShowEndConfirm(false);
    setShowProfileModal(false);
  };

  return (
    <div id="partners-competition-page" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Banner */}
      <Card variant="hero" id="partner-xfactor-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PartnersIcon size={20} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                NEET Study Partner & Live Sync
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
              Study Partner & Accountability
            </h2>
          </div>
          <Badge variant={isActuallyConnected ? 'success' : 'primary'}>
            {isActuallyConnected ? 'Live Sync ⚡' : '🩺 Study Partner'}
          </Badge>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {isActuallyConnected
            ? `Aap aur ${activePartner?.name} live study competition me hain! Sath me daily targets complete karein aur ek dusre ko motivate karein.`
            : 'Apne fellow NEET aspirant ko connect karein, daily padhai ke ghante aur tasks compare karein aur consistency maintain karein!'}
        </p>
      </Card>

      {/* Mode Navigation Tabs (Segmented Control) */}
      <div
        id="partner-tab-mode-selector"
        style={{
          display: 'flex',
          backgroundColor: 'var(--surface-variant)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
          gap: '3px',
          overflowX: 'auto',
          border: '1px solid var(--border)',
        }}
      >
        <button
          type="button"
          id="partner-mode-vs"
          onClick={() => setActiveMode('vs')}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeMode === 'vs' ? 'var(--surface)' : 'transparent',
            color: activeMode === 'vs' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeMode === 'vs' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)',
          }}
        >
          <FlameIcon size={14} color={activeMode === 'vs' ? 'var(--flame)' : 'currentColor'} />
          <span>VS Duel</span>
        </button>

        <button
          type="button"
          id="partner-mode-leaderboard"
          onClick={() => setActiveMode('leaderboard')}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeMode === 'leaderboard' ? 'var(--surface)' : 'transparent',
            color: activeMode === 'leaderboard' ? 'var(--warning)' : 'var(--text-secondary)',
            boxShadow: activeMode === 'leaderboard' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)',
          }}
        >
          <TrophyIcon size={14} color={activeMode === 'leaderboard' ? 'var(--warning)' : 'currentColor'} />
          <span>Ranks</span>
        </button>

        <button
          type="button"
          id="partner-mode-challenges"
          onClick={() => setActiveMode('challenges')}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeMode === 'challenges' ? 'var(--surface)' : 'transparent',
            color: activeMode === 'challenges' ? 'var(--danger)' : 'var(--text-secondary)',
            boxShadow: activeMode === 'challenges' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)',
          }}
        >
          <TargetIcon size={14} color={activeMode === 'challenges' ? 'var(--danger)' : 'currentColor'} />
          <span>Challenges</span>
        </button>

        <button
          type="button"
          id="partner-mode-search"
          onClick={() => setActiveMode('search')}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeMode === 'search' ? 'var(--surface)' : 'transparent',
            color: activeMode === 'search' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeMode === 'search' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)',
          }}
        >
          <SearchIcon size={14} />
          <span>Find</span>
        </button>

        <button
          type="button"
          id="partner-mode-requests"
          onClick={() => setActiveMode('requests')}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeMode === 'requests' ? 'var(--surface)' : 'transparent',
            color: activeMode === 'requests' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeMode === 'requests' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)',
          }}
        >
          <InboxIcon size={14} />
          <span>Requests</span>
          {receivedRequests.length > 0 && (
            <span
              style={{
                backgroundColor: 'var(--danger)',
                color: '#FFF',
                borderRadius: 'var(--radius-pill)',
                fontSize: '10px',
                fontWeight: 800,
                padding: '1px 5px',
                minWidth: '15px',
                textAlign: 'center',
              }}
            >
              {receivedRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Active Partner Connected Info Banner (if connected) */}
      {isActuallyConnected && activePartner && (
        <div
          id="active-partner-status-strip"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--success)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(15,157,88,0.08)',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => setShowProfileModal(true)}
            title="Click to view partner profile and cheers"
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: activePartner.avatarBg || '#0F9D58',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px',
                position: 'relative',
              }}
            >
              {activePartner.name.slice(0, 2).toUpperCase()}
              {activePartner.isStudyingNow && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: 'var(--success)',
                    border: '2px solid var(--surface)',
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {activePartner.name}
                </h4>
                <Badge variant="success">
                  {activePartner.isStudyingNow ? 'Studying Now 🟢' : 'Active Buddy'}
                </Badge>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                @{activePartner.username} • Target {activePartner.targetScore}+
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfileModal(true)}
              style={{ fontSize: '11px', padding: '5px 9px' }}
            >
              <SparklesIcon size={13} color="var(--warning)" /> Profile & Cheers
            </Button>
            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {showEndConfirm && activePartner && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              maxWidth: '360px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
              End Partnership with {activePartner.name}?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Kiya aap partnership disconnect karna chahte hain? Aap baad me naya partner search kar sakte hain.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <Button variant="outline" size="sm" onClick={() => setShowEndConfirm(false)}>
                Nahi, Rehne Do
              </Button>
              <Button variant="danger" size="sm" onClick={handleDisconnect}>
                Disconnect Karo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Profile Modal */}
      {showProfileModal && activePartner && (
        <PartnerProfileModal
          partner={activePartner}
          partnership={activePartnership}
          onClose={() => setShowProfileModal(false)}
          onEndPartnership={handleDisconnect}
        />
      )}

      {/* TAB 1: VS COMPARISON BOARD */}
      {activeMode === 'vs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isActuallyConnected && activePartner ? (
            <VsComparisonBoard
              stats={stats}
              dailyLogs={dailyLogs}
              partner={activePartner}
              isConnected={true}
              onOpenProfile={() => setShowProfileModal(true)}
              onQuickCheer={async (msg) => {
                try {
                  await sendPartnerCheer(msg);
                  showToast('Motivational cheer sent to partner! 🔥', 'success');
                } catch (e) {
                  showToast('Cheer sent!', 'info');
                }
              }}
              showToast={showToast}
            />
          ) : (
            /* Clean Production Empty State for VS Duel */
            <div
              id="vs-board-empty-state"
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: '32px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <PartnersIcon size={28} color="var(--primary)" />
              </div>

              <div style={{ maxWidth: '380px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  No Study Partner Connected Yet
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Apne dost ya fellow NEET aspirant ko connect karein. Aap dono ke daily study hours, completed questions aur consistency streak real-time me compare honge!
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="primary" onClick={() => setActiveMode('search')}>
                  <SearchIcon size={14} /> Find Study Partner
                </Button>
                {receivedRequests.length > 0 && (
                  <Button variant="outline" onClick={() => setActiveMode('requests')}>
                    <InboxIcon size={14} /> View Requests ({receivedRequests.length})
                  </Button>
                )}
              </div>

              {/* Value Proposition Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '10px',
                  width: '100%',
                  marginTop: '8px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--surface-variant)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <FlameIcon size={16} color="var(--flame)" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Live Study Duel
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                    Track who logged more study minutes and completed more NCERT questions today.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--surface-variant)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <TargetIcon size={16} color="var(--danger)" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Study Challenges
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                    Create custom 1-day or 3-day target challenges for mock tests and numerical drills.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NATIONAL WEEKLY LEADERBOARD */}
      {activeMode === 'leaderboard' && (
        <LeaderboardView
          stats={stats}
          dailyLogs={dailyLogs}
          partner={activePartner}
          currentUser={{
            uid: user?.uid || 'you-local',
            displayName: user?.displayName || 'You (Aspirant)',
            username: user?.username || 'you',
            targetYear: stats.targetYear || '2026',
            targetScore: stats.targetScore || 685,
            avatarBg: '#0494F4',
          }}
        />
      )}

      {/* TAB 3: PARTNER CHALLENGES */}
      {activeMode === 'challenges' && (
        isActuallyConnected && activePartner ? (
          <PartnerChallengesView
            partner={activePartner}
            stats={stats}
            showToast={showToast}
          />
        ) : (
          <div
            id="challenges-empty-state"
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '32px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(234, 67, 53, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--danger)',
              }}
            >
              <TargetIcon size={26} color="var(--danger)" />
            </div>
            <div style={{ maxWidth: '360px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                Connect a Partner to Unlock Challenges
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Study challenges allow you and your study partner to compete on mock test scores, 6-hour study marathons, and daily MCQ sprints!
              </p>
            </div>
            <Button variant="primary" onClick={() => setActiveMode('search')}>
              Find Partner 🔍
            </Button>
          </div>
        )
      )}

      {/* TAB 4: FIND PARTNER (SEARCH) */}
      {activeMode === 'search' && (
        <PartnerSearchCard onGoToRequests={() => setActiveMode('requests')} />
      )}

      {/* TAB 5: PARTNER REQUESTS (INBOX & SENT) */}
      {activeMode === 'requests' && (
        <PartnerRequestsList onFindPartnerClick={() => setActiveMode('search')} />
      )}
    </div>
  );
};
