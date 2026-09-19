import React, { useState, useMemo } from 'react';
import { LeaderboardEntry, LeaderboardFilter, UserStats, DailyStudyLog, PartnerProfile } from '../../types';
import { getWeeklyLeaderboard, calculatePrepScoreBreakdown } from '../../utils/scoreUtils';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ScoreExplanationModal } from './ScoreExplanationModal';
import {
  TrophyIcon,
  FlameIcon,
  ClockIcon,
  CheckIcon,
  SparklesIcon,
  AwardIcon,
  TargetIcon,
} from '../icons/SvgIcons';

interface LeaderboardViewProps {
  stats: UserStats;
  dailyLogs: DailyStudyLog[];
  partner: PartnerProfile | null;
  currentUser: {
    uid: string;
    displayName: string;
    username: string;
    targetYear?: string;
    targetScore?: number;
    avatarBg?: string;
  };
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  stats,
  dailyLogs,
  partner,
  currentUser,
}) => {
  const [filter, setFilter] = useState<LeaderboardFilter>('all');
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);

  // Compute current user's weekly study hours & tasks from dailyLogs or stats
  const { userWeeklyHours, userWeeklyTasks } = useMemo(() => {
    const recentLogs = dailyLogs.slice(0, 7);
    const loggedMinutes = recentLogs.reduce((acc, log) => acc + (log.studyMinutes || 0), 0);
    const loggedTasks = recentLogs.reduce((acc, log) => acc + (log.tasksCompleted || 0), 0);

    // Fallback based on today's minutes if logs are few
    const baseMinutes = loggedMinutes > 0 ? loggedMinutes : stats.todayStudyMinutes * 5.2;
    const baseTasks = loggedTasks > 0 ? loggedTasks : Math.max(stats.tasksCompletedToday * 5, 14);

    return {
      userWeeklyHours: Number((baseMinutes / 60).toFixed(1)),
      userWeeklyTasks: Math.round(baseTasks),
    };
  }, [dailyLogs, stats]);

  // Generate dynamic leaderboard
  const { entries, currentUserEntry, totalParticipants } = useMemo(() => {
    return getWeeklyLeaderboard(
      currentUser,
      stats,
      userWeeklyHours,
      userWeeklyTasks,
      partner,
      filter
    );
  }, [currentUser, stats, userWeeklyHours, userWeeklyTasks, partner, filter]);

  const scoreBreakdown = useMemo(() => {
    return calculatePrepScoreBreakdown(userWeeklyHours, userWeeklyTasks, stats.streakDays);
  }, [userWeeklyHours, userWeeklyTasks, stats.streakDays]);

  // Find person directly above current user to display competitive motivation
  const rankAbove = useMemo(() => {
    if (currentUserEntry.rank <= 1) return null;
    return entries.find((e) => e.rank === currentUserEntry.rank - 1);
  }, [entries, currentUserEntry]);

  // Top 3 Podium
  const topThree = entries.slice(0, 3);
  const remainingEntries = entries.slice(3);

  return (
    <div id="leaderboard-view-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Header Banner & Target Score Info */}
      <Card
        id="leaderboard-user-hero"
        style={{
          background: 'linear-gradient(135deg, rgba(4, 148, 244, 0.08) 0%, rgba(244, 180, 0, 0.08) 100%)',
          border: '1px solid rgba(4, 148, 244, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <TrophyIcon size={18} color="var(--warning)" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--warning)', letterSpacing: '0.5px' }}>
                WEEKLY NEET LEADERBOARD
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              National Aspirants Arena
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: 0 }}>
              Rankings reset every Sunday midnight IST. Top 50 win verified badges.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFormulaModal(true)}
            id="open-score-formula-btn"
            style={{ fontSize: '11px', padding: '6px 10px' }}
          >
            <SparklesIcon size={13} color="var(--warning)" /> How Score Works
          </Button>
        </div>

        {/* Current User Live Performance Bar */}
        <div
          style={{
            marginTop: '14px',
            padding: '12px 14px',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentUserEntry.avatarBg,
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '15px',
                flexShrink: 0,
              }}
            >
              #{currentUserEntry.rank}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Your Position
                </span>
                <Badge variant="primary">Rank #{currentUserEntry.rank}</Badge>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Top {scoreBreakdown.percentileRank}% • Level {scoreBreakdown.level}: {scoreBreakdown.levelTitle}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)' }}>
                {currentUserEntry.prepScore}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>/100</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {userWeeklyHours}h • {userWeeklyTasks} tasks
            </span>
          </div>
        </div>

        {/* Motivational Nudge if behind someone */}
        {rankAbove && (
          <div
            style={{
              marginTop: '8px',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FlameIcon size={14} color="var(--flame)" />
            <span>
              Aap <strong>{rankAbove.displayName}</strong> se sirf{' '}
              <strong style={{ color: 'var(--primary)' }}>
                {Math.max(1, rankAbove.prepScore - currentUserEntry.prepScore)} points
              </strong>{' '}
              peeche hain! 1 study session me lead le sakte ho.
            </span>
          </div>
        )}
      </Card>

      {/* 2. Filter Tabs (All / Streak Champions) */}
      <div
        id="leaderboard-filter-chips"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        <button
          type="button"
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            border: filter === 'all' ? '1px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: filter === 'all' ? 'var(--primary-container)' : 'var(--surface)',
            color: filter === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
          }}
        >
          <TrophyIcon size={13} />
          Overall Rank (Prep Score)
        </button>

        <button
          type="button"
          onClick={() => setFilter('streak')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            border: filter === 'streak' ? '1px solid var(--flame)' : '1px solid var(--border)',
            backgroundColor: filter === 'streak' ? 'var(--danger-container)' : 'var(--surface)',
            color: filter === 'streak' ? 'var(--flame)' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
          }}
        >
          <FlameIcon size={13} color="var(--flame)" />
          Streak Champions 🔥
        </button>
      </div>

      {/* 3. Top 3 Podium Section */}
      <div
        id="leaderboard-top-three-podium"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          alignItems: 'flex-end',
        }}
      >
        {topThree.map((item, idx) => {
          const isGold = item.rank === 1;
          const isSilver = item.rank === 2;
          const isBronze = item.rank === 3;
          const medalColor = isGold ? '#F4B400' : isSilver ? '#9AA0A6' : '#E37400';
          const medalEmoji = isGold ? '🥇' : isSilver ? '🥈' : '🥉';

          return (
            <div
              key={item.uid}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 8px',
                border: item.isCurrentUser
                  ? '2px solid var(--primary)'
                  : isGold
                  ? '1px solid rgba(244, 180, 0, 0.4)'
                  : '1px solid var(--border)',
                textAlign: 'center',
                boxShadow: isGold ? '0 4px 14px rgba(244, 180, 0, 0.15)' : 'none',
                position: 'relative',
              }}
            >
              {/* Crown for Rank 1 */}
              {isGold && (
                <div style={{ fontSize: '18px', marginBottom: '-4px' }} title="Current Leader">
                  👑
                </div>
              )}

              {/* Avatar */}
              <div
                style={{
                  width: isGold ? '44px' : '38px',
                  height: isGold ? '44px' : '38px',
                  borderRadius: '50%',
                  backgroundColor: item.avatarBg,
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: isGold ? '14px' : '12px',
                  margin: '0 auto',
                  position: 'relative',
                }}
              >
                {item.displayName.slice(0, 2).toUpperCase()}
                {item.isStudyingNow && (
                  <span
                    title="Studying right now"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '10px',
                      height: '10px',
                      backgroundColor: 'var(--success)',
                      borderRadius: '50%',
                      border: '2px solid var(--surface)',
                    }}
                  />
                )}
              </div>

              {/* Rank Medal */}
              <div
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: medalColor,
                  marginTop: '4px',
                }}
              >
                {medalEmoji} Rank #{item.rank}
              </div>

              {/* Name */}
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  margin: '2px 0 1px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'var(--text-primary)',
                }}
              >
                {item.isCurrentUser ? 'You' : item.displayName.split(' ')[0]}
              </p>

              {/* Score Badge */}
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  marginTop: '2px',
                }}
              >
                {item.prepScore} pts
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                {item.weeklyStudyHours}h • 🔥{item.streakDays}d
              </span>
            </div>
          );
        })}
      </div>

      {/* 4. Full Leaderboard List Table / Cards */}
      <Card
        id="leaderboard-full-list"
        title="Active Aspirants Rankings"
        subtitle={`Showing top competitors from a cohort of ${totalParticipants.toLocaleString()} NEET aspirants`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.map((item) => {
            const isTop3 = item.rank <= 3;
            return (
              <div
                key={item.uid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: item.isCurrentUser
                    ? 'var(--primary-container)'
                    : item.isPartner
                    ? 'rgba(15, 157, 88, 0.08)'
                    : 'var(--surface)',
                  border: item.isCurrentUser
                    ? '1.5px solid var(--primary)'
                    : item.isPartner
                    ? '1px solid rgba(15, 157, 88, 0.3)'
                    : '1px solid var(--border)',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {/* Left: Rank & User Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '24px',
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      color:
                        item.rank === 1
                          ? '#F4B400'
                          : item.rank === 2
                          ? '#9AA0A6'
                          : item.rank === 3
                          ? '#E37400'
                          : 'var(--text-secondary)',
                    }}
                  >
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                  </div>

                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: item.avatarBg,
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '12px',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    {item.displayName.slice(0, 2).toUpperCase()}
                    {item.isStudyingNow && (
                      <span
                        title="Studying Now"
                        style={{
                          position: 'absolute',
                          bottom: '-1px',
                          right: '-1px',
                          width: '9px',
                          height: '9px',
                          backgroundColor: 'var(--success)',
                          borderRadius: '50%',
                          border: '2px solid var(--surface)',
                        }}
                      />
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.displayName}
                      </span>
                      {item.isCurrentUser && <Badge variant="primary">YOU</Badge>}
                      {item.isPartner && <Badge variant="success">BUDDY 🤝</Badge>}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                      Target: {item.targetScore}+ • {item.location || 'NEET Aspirant'}
                    </div>
                  </div>
                </div>

                {/* Right: Stats & Prep Score */}
                <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 900,
                        color: 'var(--primary)',
                      }}
                    >
                      {item.prepScore}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>pts</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {item.weeklyStudyHours} hrs • 🔥{item.streakDays}d
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Score Formula Modal */}
      {showFormulaModal && (
        <ScoreExplanationModal
          breakdown={scoreBreakdown}
          stats={stats}
          weeklyHours={userWeeklyHours}
          weeklyTasks={userWeeklyTasks}
          onClose={() => setShowFormulaModal(false)}
        />
      )}
    </div>
  );
};
