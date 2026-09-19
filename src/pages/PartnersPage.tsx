import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  PartnersIcon,
  SearchIcon,
  InboxIcon,
  FlameIcon,
  ClockIcon,
  CheckIcon,
  AwardIcon,
  TargetIcon,
  SparklesIcon,
  UserCheckIcon,
  UserXIcon,
  TrophyIcon,
} from '../components/icons/SvgIcons';
import { PartnerProfile, UserStats } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { PartnerSearchCard } from '../components/partner/PartnerSearchCard';
import { PartnerRequestsList } from '../components/partner/PartnerRequestsList';
import { PartnerProfileModal } from '../components/partner/PartnerProfileModal';
import { VsComparisonBoard } from '../components/partner/VsComparisonBoard';
import { LeaderboardView } from '../components/partner/LeaderboardView';
import { PartnerChallengesView } from '../components/partner/PartnerChallengesView';

interface PartnersPageProps {
  stats: UserStats;
}

type PartnerTabMode = 'vs' | 'leaderboard' | 'challenges' | 'search' | 'requests';

export const PartnersPage: React.FC<PartnersPageProps> = ({ stats }) => {
  const {
    activePartner,
    activePartnership,
    receivedRequests,
    sentRequests,
    endCurrentPartnership,
    dailyLogs,
    sendPartnerCheer,
  } = useData();

  const { user, showToast } = useAuth();

  const [activeMode, setActiveMode] = useState<PartnerTabMode>(() => {
    // If user has received requests and no active partner, default to requests to let them see it
    if (receivedRequests.length > 0 && !activePartner) {
      return 'requests';
    }
    return 'vs';
  });

  const [showEndConfirm, setShowEndConfirm] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Fallback demo partner for VS preview if none is connected yet
  const displayPartner: PartnerProfile = activePartner || {
    id: 'demo-sample',
    name: 'Aman Sharma',
    username: 'amansharma_aiims',
    targetYear: '2026',
    targetScore: 690,
    todayStudyHours: 5.5,
    todayTasksCompleted: 4,
    streakDays: 6,
    avatarBg: '#0F9D58',
    bio: 'AIIMS New Delhi Dream | Daily 6+ hrs physics & bio practice',
    isStudyingNow: true,
    currentSubject: 'Physics',
    lastActive: 'Studying Now 🟢',
    weeklyHours: 36.5,
    subjectBreakdown: {
      physicsHours: 15.0,
      chemistryHours: 9.5,
      biologyHours: 12.0,
    },
  };

  const isActuallyConnected = Boolean(activePartnership && activePartner);

  const handleDisconnect = async () => {
    await endCurrentPartnership();
    setShowEndConfirm(false);
    setShowProfileModal(false);
  };

  return (
    <div id="partners-competition-page" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* X-Factor Banner */}
      <div className="banner-box" id="partner-xfactor-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PartnersIcon size={20} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                X-Factor Feature
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
              Study Partner & Real-Time Sync
            </h2>
          </div>
          <Badge variant={isActuallyConnected ? 'success' : 'primary'}>
            {isActuallyConnected ? 'Live Sync ⚡' : 'Phase 10'}
          </Badge>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {isActuallyConnected
            ? `Aap aur ${displayPartner.name} live study competition me hain! Sath me daily targets complete karo aur real-time cheers bhejo.`
            : 'Apne dost ko partner banayein, daily padhai ke ghante aur tasks compare karein aur ek dusre ko motivate karein!'}
        </p>
      </div>

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
      {isActuallyConnected && (
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
                backgroundColor: displayPartner.avatarBg || '#0F9D58',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px',
                position: 'relative',
              }}
            >
              {displayPartner.name.slice(0, 2).toUpperCase()}
              {displayPartner.isStudyingNow && (
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
                  {displayPartner.name}
                </h4>
                <Badge variant="success">
                  {displayPartner.isStudyingNow ? 'Studying Now 🟢' : 'Active Buddy'}
                </Badge>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                @{displayPartner.username} • Target {displayPartner.targetScore}+
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
      {showEndConfirm && (
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
              End Partnership with {displayPartner.name}?
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
      {showProfileModal && (
        <PartnerProfileModal
          partner={displayPartner}
          partnership={activePartnership}
          onClose={() => setShowProfileModal(false)}
          onEndPartnership={handleDisconnect}
        />
      )}

      {/* TAB 1: VS COMPARISON BOARD */}
      {activeMode === 'vs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isActuallyConnected && (
            <div
              style={{
                backgroundColor: 'var(--surface-variant)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>
                  Previewing VS Board (Demo Partner)
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Apne dost ko connect karne ke liye Find Partner ya Requests check karein.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button variant="primary" size="sm" onClick={() => setActiveMode('search')}>
                  Find Partner 🔍
                </Button>
                {receivedRequests.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setActiveMode('requests')}>
                    Requests ({receivedRequests.length}) 📥
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Dedicated Rich VS Comparison Board */}
          <VsComparisonBoard
            stats={stats}
            dailyLogs={dailyLogs}
            partner={displayPartner}
            isConnected={isActuallyConnected}
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
        </div>
      )}

      {/* TAB 2: NATIONAL WEEKLY LEADERBOARD */}
      {activeMode === 'leaderboard' && (
        <LeaderboardView
          stats={stats}
          dailyLogs={dailyLogs}
          partner={isActuallyConnected ? activePartner : displayPartner}
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
        <PartnerChallengesView
          partner={displayPartner}
          stats={stats}
          showToast={showToast}
        />
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
