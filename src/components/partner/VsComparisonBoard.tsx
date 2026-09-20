import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  FlameIcon,
  ClockIcon,
  CheckIcon,
  TrophyIcon,
  AwardIcon,
  SparklesIcon,
  TargetIcon,
  SendIcon,
} from '../icons/SvgIcons';
import { PartnerProfile, UserStats, DailyStudyLog } from '../../types';
import { getWeekCalendarDays } from '../../utils/streakUtils';

interface VsComparisonBoardProps {
  stats: UserStats;
  dailyLogs: DailyStudyLog[];
  partner: PartnerProfile;
  isConnected: boolean;
  onOpenProfile: () => void;
  onQuickCheer: (msg: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

type Timeframe = 'today' | 'weekly';

export const VsComparisonBoard: React.FC<VsComparisonBoardProps> = ({
  stats,
  dailyLogs,
  partner,
  isConnected,
  onOpenProfile,
  onQuickCheer,
  showToast,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('today');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Today's metrics
  const myTodayHours = Number((stats.todayStudyMinutes / 60).toFixed(1));
  const partnerTodayHours = partner.todayStudyHours;
  const myTodayTasks = stats.tasksCompletedToday;
  const partnerTodayTasks = partner.todayTasksCompleted;
  const myStreak = stats.streakDays;
  const partnerStreak = partner.streakDays;

  // Calculate Weekly metrics from dailyLogs
  const weeklyDays = useMemo(() => {
    return getWeekCalendarDays(new Date(), dailyLogs);
  }, [dailyLogs]);

  const myWeeklyStudyMinutes = useMemo(() => {
    return weeklyDays.reduce((acc, d) => acc + (d.studyMinutes || 0), 0);
  }, [weeklyDays]);

  const myWeeklyHours = Number((myWeeklyStudyMinutes / 60).toFixed(1));

  const myWeeklyTasks = useMemo(() => {
    return weeklyDays.reduce((acc, d) => acc + (d.tasksCompleted || 0), 0);
  }, [weeklyDays]);

  const partnerWeeklyHours = partner.weeklyHours || Number((partnerTodayHours * 5.8).toFixed(1));
  const partnerWeeklyTasks = Math.round(partnerTodayTasks * 5.5);

  // Subject hours breakdown for today & weekly
  const myTodayPhysicsHrs = Number(
    ((dailyLogs.find((l) => l.date === new Date().toISOString().split('T')[0])?.physicsMinutes || 90) / 60).toFixed(1)
  );
  const myTodayChemHrs = Number(
    ((dailyLogs.find((l) => l.date === new Date().toISOString().split('T')[0])?.chemistryMinutes || 60) / 60).toFixed(1)
  );
  const myTodayBioHrs = Number(
    ((dailyLogs.find((l) => l.date === new Date().toISOString().split('T')[0])?.biologyMinutes || 60) / 60).toFixed(1)
  );

  const partnerBreakdown = partner.subjectBreakdown || {
    physicsHours: Number((partnerTodayHours * 0.4).toFixed(1)),
    chemistryHours: Number((partnerTodayHours * 0.3).toFixed(1)),
    biologyHours: Number((partnerTodayHours * 0.3).toFixed(1)),
  };

  // Preparation Score Calculation (100 pts max)
  // Study Hours: 45 pts | Tasks Done: 35 pts | Consistency Streak: 20 pts
  const calculatePrepScore = (hours: number, targetHours: number, tasks: number, targetTasks: number, streak: number) => {
    const studyPts = Math.min(45, Math.round((hours / Math.max(1, targetHours)) * 45));
    const tasksPts = Math.min(35, Math.round((tasks / Math.max(1, targetTasks)) * 35));
    const streakPts = Math.min(20, Math.round(Math.min(10, streak) * 2));
    return Math.min(100, studyPts + tasksPts + streakPts);
  };

  const myTodayScore = calculatePrepScore(myTodayHours, 6.0, myTodayTasks, 4, myStreak);
  const partnerTodayScore = calculatePrepScore(partnerTodayHours, 6.0, partnerTodayTasks, 4, partnerStreak);

  const myWeeklyScore = calculatePrepScore(myWeeklyHours, 38.0, myWeeklyTasks, 25, myStreak);
  const partnerWeeklyScore = calculatePrepScore(partnerWeeklyHours, 38.0, partnerWeeklyTasks, 25, partnerStreak);

  const currentMyScore = timeframe === 'today' ? myTodayScore : myWeeklyScore;
  const currentPartnerScore = timeframe === 'today' ? partnerTodayScore : partnerWeeklyScore;

  const currentMyHours = timeframe === 'today' ? myTodayHours : myWeeklyHours;
  const currentPartnerHours = timeframe === 'today' ? partnerTodayHours : partnerWeeklyHours;

  const currentMyTasks = timeframe === 'today' ? myTodayTasks : myWeeklyTasks;
  const currentPartnerTasks = timeframe === 'today' ? partnerTodayTasks : partnerWeeklyTasks;

  const scoreDiff = currentMyScore - currentPartnerScore;
  const hoursDiff = Number((currentMyHours - currentPartnerHours).toFixed(1));
  const tasksDiff = currentMyTasks - currentPartnerTasks;

  const isUserLeading = scoreDiff > 0;
  const isTied = scoreDiff === 0;

  // Motivational Advice Engine based on winner & margin
  const motivationMessage = useMemo(() => {
    if (isUserLeading) {
      if (scoreDiff >= 15) {
        return `Shaandar! Aap ${scoreDiff} points se lead kar rahe hain 🏆. Is momentum ko mock test tak continue rakhein!`;
      }
      return `Good job! Aap ${scoreDiff} points se aage hain ✨. Partner bhi chase kar raha hai, consistent rahein!`;
    }
    if (isTied) {
      return `Kada muqabla! Dono aspirants ${currentMyScore} points par bilkul barabar hain ⚡. Ek extra revision quiz se lead mil sakti hai!`;
    }
    // Partner leading
    const deficit = Math.abs(scoreDiff);
    if (deficit <= 10) {
      return `${partner.name} aage hai (+${deficit} pts). Ek 45-minute focus session se aap lead le sakte hain! 💪`;
    }
    return `${partner.name} aage lead kar rahe hain (+${deficit} pts). Aaj ek extra physics/bio block complete karo aur gap kam karo! 🎯`;
  }, [isUserLeading, isTied, scoreDiff, currentMyScore, partner.name]);

  // Share / Brag Result
  const handleShareDuel = () => {
    const leaderText = isUserLeading
      ? `I'm leading by +${scoreDiff} points! 🏆`
      : isTied
      ? "We are tied neck-to-neck! ⚡"
      : `${partner.name} is leading by +${Math.abs(scoreDiff)} pts! 🎯`;

    const shareText = `⚔️ Prepmate NEET Study Duel (${timeframe === 'today' ? "Today" : "This Week"}) ⚔️
👤 Me: ${currentMyScore}/100 pts (${currentMyHours} hrs, ${currentMyTasks} tasks, 🔥 ${myStreak}d streak)
🤝 ${partner.name}: ${currentPartnerScore}/100 pts (${currentPartnerHours} hrs, ${currentPartnerTasks} tasks, 🔥 ${partnerStreak}d streak)
📢 Status: ${leaderText}
🚀 Target NEET 2026! Powered by Prepmate.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      showToast('Duel stats copied to clipboard! 📋 Share with friends', 'success');
      setTimeout(() => setCopiedShare(false), 3000);
    } else {
      showToast('Share text ready!', 'info');
    }
  };

  return (
    <div id="vs-comparison-board-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Timeframe Filter Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--surface-variant)',
          borderRadius: 'var(--radius-pill)',
          padding: '3px',
          alignSelf: 'center',
          width: '100%',
          maxWidth: '280px',
        }}
      >
        <button
          type="button"
          id="vs-timeframe-today"
          onClick={() => setTimeframe('today')}
          style={{
            flex: 1,
            padding: '7px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: timeframe === 'today' ? 'var(--surface)' : 'transparent',
            color: timeframe === 'today' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: timeframe === 'today' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
            transition: 'all var(--transition-fast)',
          }}
        >
          Today's Duel
        </button>
        <button
          type="button"
          id="vs-timeframe-weekly"
          onClick={() => setTimeframe('weekly')}
          style={{
            flex: 1,
            padding: '7px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: timeframe === 'weekly' ? 'var(--surface)' : 'transparent',
            color: timeframe === 'weekly' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: timeframe === 'weekly' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
            transition: 'all var(--transition-fast)',
          }}
        >
          This Week
        </button>
      </div>

      {/* Main Duel Card */}
      <Card
        id="vs-comparison-main-card"
        title="Head-to-Head Comparison Board"
        subtitle={timeframe === 'today' ? "Live preparation metrics for today" : "Cumulative progress for this week"}
        action={
          <Badge variant={isUserLeading ? 'primary' : isTied ? 'warning' : 'success'}>
            <TrophyIcon size={13} /> {isUserLeading ? 'You Lead 🏆' : isTied ? 'Tied ⚡' : `${partner.name} Leads 👑`}
          </Badge>
        }
      >
        {/* Head-to-Head Players Arena */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 10px',
            background: 'var(--surface-variant)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {/* Player 1: You */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px',
                margin: '0 auto',
                boxShadow: isUserLeading ? '0 0 0 3px var(--primary), 0 4px 12px rgba(4, 148, 244, 0.4)' : '0 2px 6px rgba(4, 148, 244, 0.2)',
                position: 'relative',
              }}
            >
              YOU
              {isUserLeading && (
                <span
                  title="Leading"
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-4px',
                    fontSize: '14px',
                  }}
                >
                  👑
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', fontWeight: 800, marginTop: '6px', marginBottom: '2px', color: 'var(--text-primary)' }}>
              You (Aspirant)
            </p>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
              Target {stats.targetScore || 685}+
            </span>
          </div>

          {/* VS Badge & Score Difference */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--danger-container)',
                color: 'var(--danger)',
                fontWeight: 900,
                fontSize: '13px',
                letterSpacing: '1px',
                boxShadow: '0 2px 6px rgba(234,67,53,0.15)',
              }}
            >
              VS
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: isUserLeading ? 'var(--primary)' : isTied ? 'var(--warning)' : 'var(--success)',
                whiteSpace: 'nowrap',
              }}
            >
              {isUserLeading ? `+${scoreDiff} pts` : isTied ? 'Tied' : `+${Math.abs(scoreDiff)} pts`}
            </span>
          </div>

          {/* Player 2: Partner */}
          <div
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={onOpenProfile}
            title="Click to view partner profile and cheers"
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: partner.avatarBg || '#0F9D58',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px',
                margin: '0 auto',
                boxShadow: !isUserLeading && !isTied ? '0 0 0 3px var(--success), 0 4px 12px rgba(15, 157, 88, 0.4)' : '0 2px 6px rgba(15, 157, 88, 0.2)',
                position: 'relative',
              }}
            >
              {partner.name.slice(0, 2).toUpperCase()}
              {!isUserLeading && !isTied && (
                <span
                  title="Leading"
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-4px',
                    fontSize: '14px',
                  }}
                >
                  👑
                </span>
              )}
              {partner.isStudyingNow && (
                <span
                  title="Studying Now"
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
            <p style={{ fontSize: '13px', fontWeight: 800, marginTop: '6px', marginBottom: '2px', color: 'var(--text-primary)' }}>
              {partner.name}
            </p>
            <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
              @{partner.username}
            </span>
          </div>
        </div>

        {/* 1. PREPARATION SCORE DUEL (OUT OF 100) */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrophyIcon size={15} color="var(--warning)" />
              {timeframe === 'today' ? "Today's Prep Score" : "Weekly Prep Score"}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Max 100 pts</span>
          </div>

          {/* Scores Side-by-Side */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)' }}>
                {currentMyScore}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}> /100 pts</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Badge variant={isUserLeading ? 'primary' : isTied ? 'warning' : 'success'}>
                {isUserLeading ? `You +${scoreDiff}` : isTied ? 'Draw' : `${partner.name} +${Math.abs(scoreDiff)}`}
              </Badge>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--success)' }}>
                {currentPartnerScore}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}> /100 pts</span>
            </div>
          </div>

          {/* Dual Bar Progress Gauge */}
          <div
            style={{
              height: '10px',
              borderRadius: 'var(--radius-pill)',
              display: 'flex',
              overflow: 'hidden',
              backgroundColor: 'var(--surface-variant)',
            }}
          >
            <div
              style={{
                width: `${(currentMyScore / (currentMyScore + currentPartnerScore || 1)) * 100}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.4s ease',
              }}
              title={`Your Share: ${currentMyScore} pts`}
            />
            <div
              style={{
                width: `${(currentPartnerScore / (currentMyScore + currentPartnerScore || 1)) * 100}%`,
                backgroundColor: 'var(--success)',
                transition: 'width 0.4s ease',
              }}
              title={`Partner Share: ${currentPartnerScore} pts`}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Study Hours (45 pts) • Tasks (35 pts) • Streak (20 pts)</span>
          </div>
        </div>

        {/* 2. STUDY HOURS DUEL */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
              {currentMyHours} hrs
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <ClockIcon size={15} /> Study Hours
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--success)' }}>
              {currentPartnerHours} hrs
            </span>
          </div>

          {/* Hours Relative Bar */}
          <div
            style={{
              height: '8px',
              borderRadius: 'var(--radius-pill)',
              display: 'flex',
              overflow: 'hidden',
              backgroundColor: 'var(--surface-variant)',
            }}
          >
            <div
              style={{
                width: `${(currentMyHours / (currentMyHours + currentPartnerHours || 1)) * 100}%`,
                backgroundColor: 'var(--primary)',
              }}
            />
            <div
              style={{
                width: `${(currentPartnerHours / (currentMyHours + currentPartnerHours || 1)) * 100}%`,
                backgroundColor: 'var(--success)',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>{hoursDiff > 0 ? `+${hoursDiff} hrs ahead` : hoursDiff < 0 ? `${hoursDiff} hrs behind` : 'Tied on study hours'}</span>
            <span>Target: {timeframe === 'today' ? '6.0h daily' : '38.0h weekly'}</span>
          </div>
        </div>

        {/* 3. SUBJECT-BY-SUBJECT BREAKDOWN DUEL */}
        <div
          style={{
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)' }}>
              Subject Breakdown Duel (Hours)
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>You vs {partner.name}</span>
          </div>

          {/* Physics */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary)', width: '45px' }}>
              {myTodayPhysicsHrs}h
            </span>
            <div style={{ flex: 1, padding: '0 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0494F4' }}>Physics ⚡</span>
              <div style={{ height: '5px', borderRadius: 'var(--radius-pill)', display: 'flex', backgroundColor: 'var(--surface)', marginTop: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(myTodayPhysicsHrs / (myTodayPhysicsHrs + partnerBreakdown.physicsHours || 1)) * 100}%`, backgroundColor: '#0494F4' }} />
                <div style={{ width: `${(partnerBreakdown.physicsHours / (myTodayPhysicsHrs + partnerBreakdown.physicsHours || 1)) * 100}%`, backgroundColor: 'var(--success)' }} />
              </div>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--success)', width: '45px', textAlign: 'right' }}>
              {partnerBreakdown.physicsHours}h
            </span>
          </div>

          {/* Chemistry */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary)', width: '45px' }}>
              {myTodayChemHrs}h
            </span>
            <div style={{ flex: 1, padding: '0 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#E91E63' }}>Chemistry ⚗️</span>
              <div style={{ height: '5px', borderRadius: 'var(--radius-pill)', display: 'flex', backgroundColor: 'var(--surface)', marginTop: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(myTodayChemHrs / (myTodayChemHrs + partnerBreakdown.chemistryHours || 1)) * 100}%`, backgroundColor: '#E91E63' }} />
                <div style={{ width: `${(partnerBreakdown.chemistryHours / (myTodayChemHrs + partnerBreakdown.chemistryHours || 1)) * 100}%`, backgroundColor: 'var(--success)' }} />
              </div>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--success)', width: '45px', textAlign: 'right' }}>
              {partnerBreakdown.chemistryHours}h
            </span>
          </div>

          {/* Biology */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary)', width: '45px' }}>
              {myTodayBioHrs}h
            </span>
            <div style={{ flex: 1, padding: '0 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F9D58' }}>Biology 🧬</span>
              <div style={{ height: '5px', borderRadius: 'var(--radius-pill)', display: 'flex', backgroundColor: 'var(--surface)', marginTop: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(myTodayBioHrs / (myTodayBioHrs + partnerBreakdown.biologyHours || 1)) * 100}%`, backgroundColor: '#0F9D58' }} />
                <div style={{ width: `${(partnerBreakdown.biologyHours / (myTodayBioHrs + partnerBreakdown.biologyHours || 1)) * 100}%`, backgroundColor: 'var(--success)' }} />
              </div>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--success)', width: '45px', textAlign: 'right' }}>
              {partnerBreakdown.biologyHours}h
            </span>
          </div>
        </div>

        {/* 4. TASKS COMPLETED & STREAK DUEL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
          {/* Tasks Done */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <CheckIcon size={14} /> Tasks Completed
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                {currentMyTasks}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>vs</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>
                {currentPartnerTasks}
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {tasksDiff > 0 ? `+${tasksDiff} more done` : tasksDiff < 0 ? `${Math.abs(tasksDiff)} fewer` : 'Identical tasks done'}
            </span>
          </div>

          {/* Consistency Streak */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <FlameIcon size={14} /> Consistency Streak
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flame)' }}>
                🔥 {myStreak}d
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>vs</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flame)' }}>
                🔥 {partnerStreak}d
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {myStreak >= partnerStreak ? 'Consistency Advantage' : `${partner.name} higher streak`}
            </span>
          </div>
        </div>

        {/* 5. WINNER SPOTLIGHT & MOTIVATION CALLOUT */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            background: isUserLeading
              ? 'rgba(4, 148, 244, 0.08)'
              : isTied
              ? 'rgba(244, 180, 0, 0.1)'
              : 'rgba(15, 157, 88, 0.08)',
            border: isUserLeading
              ? '1px solid rgba(4, 148, 244, 0.25)'
              : isTied
              ? '1px solid rgba(244, 180, 0, 0.3)'
              : '1px solid rgba(15, 157, 88, 0.25)',
            borderRadius: 'var(--radius-md)',
            marginTop: '10px',
          }}
        >
          <div style={{ marginTop: '2px' }}>
            <AwardIcon size={20} color={isUserLeading ? 'var(--primary)' : isTied ? 'var(--warning)' : 'var(--success)'} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
            <strong>{isUserLeading ? "Today's Leader: Aap Lead Me Hain! 🏆" : isTied ? "Barabar Muqabla! ⚡" : `Leader: ${partner.name} 👑`}</strong>
            <p style={{ margin: '3px 0 0 0', color: 'var(--text-secondary)' }}>{motivationMessage}</p>
          </div>
        </div>

        {/* 6. ACTION CONTROLS (SHARE & QUICK CHEER) */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareDuel}
            style={{ flex: 1, fontSize: '12px' }}
          >
            <SparklesIcon size={14} color="var(--warning)" />
            {copiedShare ? 'Copied! ✅' : 'Share / Brag Duel'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onQuickCheer("Bhai sath me physics numericals complete karte hain! 🚀")}
            style={{ flex: 1, fontSize: '12px' }}
          >
            <SendIcon size={14} /> Send Cheer
          </Button>
        </div>
      </Card>
    </div>
  );
};
