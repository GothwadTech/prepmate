import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  FlameIcon,
  PlusIcon,
  PartnersIcon,
  GoalsIcon,
  ClockIcon,
  CheckIcon,
  LightbulbIcon,
  RefreshCwIcon,
  CalendarIcon,
  ChevronRightIcon,
  ProfileIcon,
  TasksIcon,
  PlayIcon,
  BookIcon,
  BarChartIcon,
  ShieldIcon,
  TrophyIcon,
  ActivityIcon,
  CloseIcon,
} from '../components/icons/SvgIcons';
import { AppTab, UserStats, SubjectType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTimer } from '../context/TimerContext';
import { WeeklyCalendarView } from '../components/streak/WeeklyCalendarView';
import { ActivityHeatmap } from '../components/streak/ActivityHeatmap';
import { STREAK_MILESTONES } from '../utils/streakUtils';

interface HomePageProps {
  onNavigateTab: (tab: AppTab) => void;
  stats: UserStats;
}

const NEET_QUOTES = [
  {
    quote: 'Doctor banna koi aam baat nahi, har din ka ek-ek ghanta MBBS seat tak le jaata hai.',
    author: 'Prepmate Aspirant Wisdom',
    tag: 'Dedication',
  },
  {
    quote: 'NCERT ki har ek line ek question hai. Padho aise jaise NEET ka paper tumne hi banaya ho.',
    author: 'AIIMS Toppers Strategy',
    tag: 'Biology & Chem',
  },
  {
    quote: 'Consistency is more powerful than intensity. 6 hours daily beats 14 hours once a week.',
    author: 'Study Habit Rule',
    tag: 'Discipline',
  },
  {
    quote: 'Jab thak jao toh aaraam kar lo, par ruko mat. White coat and stethoscope are waiting for you.',
    author: 'Medical Dream',
    tag: 'Motivation',
  },
  {
    quote: 'Roz ke 45 Physics numericals solve karna exam hall me 180 marks ko possible bana deta hai.',
    author: 'Physics Drill',
    tag: 'Problem Solving',
  },
  {
    quote: 'Success in NEET is not an accident; it is hard work, perseverance, learning, and sacrifice.',
    author: 'NEET Mantra',
    tag: 'Focus',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigateTab, stats }) => {
  const { user } = useAuth();
  const { tasks, toggleTask, goals, streakStats, dailyLogs, useStreakShield } = useData();
  const {
    openTimer,
    isRunning,
    isPaused,
    remainingSeconds,
    subject: activeSubject,
    setSubject,
    startTimer,
  } = useTimer();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotatingQuote, setIsRotatingQuote] = useState(false);
  const [streakCalendarView, setStreakCalendarView] = useState<'weekly' | 'heatmap'>('weekly');
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [shieldActivating, setShieldActivating] = useState(false);

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  const currentStreak = streakStats?.currentStreak || stats.streakDays || 0;
  const shieldsAvailable = stats.streakShields ?? 1;

  const nextMilestone =
    STREAK_MILESTONES.find((m) => m.days > currentStreak) ||
    STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const progressToNext = Math.min(100, Math.round((currentStreak / nextMilestone.days) * 100));

  const handleUseShield = async () => {
    setShieldActivating(true);
    try {
      await useStreakShield();
    } finally {
      setShieldActivating(false);
    }
  };

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Days remaining calculation for NEET (approx May 2026 or chosen year)
  const getDaysToNeet = () => {
    const targetYearNum = parseInt(user?.targetYear || stats.targetYear || '2026', 10);
    // Typical NEET is first Sunday of May
    const neetDate = new Date(targetYearNum, 4, 3); // May 3
    const today = new Date();
    const diffTime = neetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 230;
  };

  const handleNextQuote = () => {
    setIsRotatingQuote(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % NEET_QUOTES.length);
      setIsRotatingQuote(false);
    }, 200);
  };

  // Dynamic progress calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Subject-wise live calculation
  const getSubjectProgress = (subject: SubjectType, fallback: number) => {
    const subTasks = tasks.filter((t) => t.subject === subject);
    if (subTasks.length === 0) return fallback;
    const done = subTasks.filter((t) => t.completed).length;
    return Math.round((done / subTasks.length) * 100);
  };

  const physicsProg = getSubjectProgress('Physics', stats.physicsProgress);
  const chemistryProg = getSubjectProgress('Chemistry', stats.chemistryProgress);
  const biologyProg = getSubjectProgress('Biology', stats.biologyProgress);

  // Today's date formatted
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const currentQuote = NEET_QUOTES[quoteIndex];

  return (
    <div id="home-dashboard-page" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Sleek, Slim & Lightweight Top Welcome Strip */}
      <div
        id="welcome-banner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {getGreeting()}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>•</span>
            <h2 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.displayName ? `${user.displayName} 👋` : 'Doctor Sahab 👋'}
            </h2>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            NEET {user?.targetYear || stats.targetYear} • Target {user?.targetScore || stats.targetScore}+ Marks
          </div>
        </div>

        {/* Compact Countdown Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'var(--primary-container)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-pill)',
            padding: '5px 10px',
            flexShrink: 0,
          }}
          id="neet-countdown-strip"
        >
          <CalendarIcon size={13} color="var(--primary)" />
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
            {getDaysToNeet()}d left
          </span>
        </div>
      </div>

      {/* 2. Combined Daily Overview & Streak Hub Card */}
      <div
        id="today-streak-combined-card"
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Header: Title + Overall % Done */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              <ActivityIcon size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Today's Overview & Streak
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Daily preparation & streak protection
              </p>
            </div>
          </div>

          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: overallProgress === 100 ? 'var(--success)' : 'var(--primary)',
              backgroundColor: overallProgress === 100 ? 'var(--success-container)' : 'var(--primary-container)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border)',
            }}
          >
            {overallProgress}% Done
          </span>
        </div>

        {/* Sleek Progress Track */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="progress-track" style={{ height: '6px', borderRadius: '3px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${overallProgress}%`,
                borderRadius: '3px',
                background:
                  overallProgress === 100
                    ? 'var(--success)'
                    : 'linear-gradient(90deg, var(--primary) 0%, #34A853 100%)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {completedTasks} of {totalTasks} daily study tasks done
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: overallProgress === 100 ? 'var(--success)' : 'var(--primary)',
              }}
            >
              {overallProgress === 100 ? 'Goal Crushed! 🏆' : overallProgress >= 50 ? 'Great Momentum 🚀' : 'Keep Pushing 📚'}
            </span>
          </div>
        </div>

        {/* 4-Stat Balanced Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
          }}
        >
          {/* Day Streak */}
          <div
            style={{
              backgroundColor: 'var(--surface-variant)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 4px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--flame)' }}>
              <FlameIcon size={15} color="var(--flame)" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--flame)' }}>
                {currentStreak}d
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {streakStats?.todayCompleted ? 'Active' : 'Pending'}
            </span>
          </div>

          {/* Tasks Done */}
          <div
            style={{
              backgroundColor: 'var(--surface-variant)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 4px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {completedTasks}/{totalTasks}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Tasks Done
            </span>
          </div>

          {/* Study Time */}
          <div
            onClick={() => openTimer()}
            style={{
              backgroundColor: 'var(--surface-variant)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 4px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              cursor: 'pointer',
            }}
            title="Tap to open Study Timer"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ClockIcon size={12} color="var(--primary)" />
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {Math.floor(stats.todayStudyMinutes / 60)}h{stats.todayStudyMinutes % 60}m
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>
              Timer ⏱️
            </span>
          </div>

          {/* Shields */}
          <div
            style={{
              backgroundColor: 'var(--surface-variant)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 4px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--primary)' }}>
              <ShieldIcon size={14} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                {shieldsAvailable}
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Shields
            </span>
          </div>
        </div>

        {/* Milestone & Shield Action Footer Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <TrophyIcon size={14} color="var(--warning)" />
            <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Next: <strong style={{ color: 'var(--text-primary)' }}>{nextMilestone.title} ({currentStreak}/{nextMilestone.days}d)</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {shieldsAvailable > 0 && !streakStats?.todayCompleted && (
              <button
                type="button"
                onClick={handleUseShield}
                disabled={shieldActivating}
                style={{
                  background: 'rgba(26, 115, 232, 0.15)',
                  border: '1px solid rgba(26, 115, 232, 0.3)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '2px 8px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {shieldActivating ? 'Freezing...' : 'Use Shield'}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowMilestonesModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              Milestones →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Milestones Modal */}
      {showMilestonesModal && (
        <div
          id="milestones-modal-overlay"
          onClick={() => setShowMilestonesModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            id="milestones-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '440px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(249, 171, 0, 0.12)',
                    color: 'var(--warning)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrophyIcon size={18} color="var(--warning)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    NEET Streak Hall of Fame
                  </h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    Consistency beats intensity for medical entrance
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMilestonesModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
              {(streakStats?.allMilestones || STREAK_MILESTONES).map((milestone) => (
                <div
                  key={milestone.days}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: milestone.unlocked ? '1px solid rgba(249, 171, 0, 0.35)' : '1px solid var(--border)',
                    backgroundColor: milestone.unlocked ? 'rgba(249, 171, 0, 0.08)' : 'var(--surface-variant)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{milestone.badge}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {milestone.title}
                        </span>
                        {milestone.unlocked && (
                          <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 700 }}>
                            ✓ Unlocked
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {milestone.description}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)' }}>
                    {milestone.days}d
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Habit Consistency: Weekly Routine & 14-Week Heatmap Matrix */}
      <div
        id="calendar-streak-section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 4px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Habit & Study Routine
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--surface-variant)',
              padding: '3px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              gap: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setStreakCalendarView('weekly')}
              style={{
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                backgroundColor: streakCalendarView === 'weekly' ? 'var(--surface)' : 'transparent',
                color: streakCalendarView === 'weekly' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: streakCalendarView === 'weekly' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Weekly Routine
            </button>
            <button
              type="button"
              onClick={() => setStreakCalendarView('heatmap')}
              style={{
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                backgroundColor: streakCalendarView === 'heatmap' ? 'var(--surface)' : 'transparent',
                color: streakCalendarView === 'heatmap' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: streakCalendarView === 'heatmap' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              14-Week Heatmap
            </button>
          </div>
        </div>

        {streakCalendarView === 'weekly' ? (
          <WeeklyCalendarView />
        ) : (
          <ActivityHeatmap />
        )}
      </div>

      {/* 4. Three Distinct Subject Prep Cards (Physics, Chemistry, Biology) */}
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
            onClick={() => {
              setSubject('Physics');
              openTimer({ subject: 'Physics' });
            }}
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
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Today's Goal</div>
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
            onClick={() => {
              setSubject('Chemistry');
              openTimer({ subject: 'Chemistry' });
            }}
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
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Today's Goal</div>
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
            onClick={() => {
              setSubject('Biology');
              openTimer({ subject: 'Biology' });
            }}
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
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Today's Goal</div>
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

      {/* 5. Today's Priorities / Quick Tasks Snippet */}
      <Card
        id="today-priority-tasks-card"
        title="Today's Priority Tasks"
        subtitle="Tap checkbox to toggle completion instantly"
        action={
          <button
            type="button"
            className="btn-text"
            onClick={() => onNavigateTab('tasks')}
            style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}
            id="see-all-tasks-link"
          >
            See All ({tasks.length}) <ChevronRightIcon size={14} />
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className={`priority-task-tile ${task.completed ? 'completed' : ''}`}
              id={`priority-task-${task.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <button
                  type="button"
                  className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  id={`home-toggle-task-${task.id}`}
                  aria-label={`Toggle task ${task.title}`}
                >
                  {task.completed && <CheckIcon size={14} />}
                </button>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color:
                          task.subject === 'Physics'
                            ? 'var(--subject-physics)'
                            : task.subject === 'Chemistry'
                            ? 'var(--subject-chemistry)'
                            : 'var(--subject-biology)',
                      }}
                    >
                      {task.subject}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>•</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {task.type} ({task.targetCount})
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  task.subject === 'Physics'
                    ? 'physics'
                    : task.subject === 'Chemistry'
                    ? 'chemistry'
                    : 'biology'
                }
              >
                {task.subject}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Phase 6: Study Timer & Focus Section */}
      <Card
        id="study-timer-home-card"
        title="Study Timer & Focus"
        subtitle="Pomodoro focus cycles with automatic time logging"
        action={
          <Button
            size="sm"
            variant={isRunning ? 'primary' : 'outline'}
            onClick={() => openTimer()}
            id="open-timer-modal-btn"
          >
            {isRunning ? `Running (${timeFormatted})` : 'Launch Timer'}
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            {isRunning ? (
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                {activeSubject} session in progress ({timeFormatted}). Keep your focus strong! 🩺
              </span>
            ) : (
              'Start a 25-minute Pomodoro cycle to build unstoppable NEET exam stamina:'
            )}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                borderColor: 'var(--subject-physics)',
                color: 'var(--subject-physics)',
                padding: '8px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
              onClick={() => {
                setSubject('Physics');
                openTimer({ subject: 'Physics' });
              }}
              id="home-quick-start-physics"
            >
              <PlayIcon size={12} color="var(--subject-physics)" />
              Physics
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                borderColor: 'var(--subject-chemistry)',
                color: 'var(--subject-chemistry)',
                padding: '8px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
              onClick={() => {
                setSubject('Chemistry');
                openTimer({ subject: 'Chemistry' });
              }}
              id="home-quick-start-chemistry"
            >
              <PlayIcon size={12} color="var(--subject-chemistry)" />
              Chemistry
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                borderColor: 'var(--subject-biology)',
                color: 'var(--subject-biology)',
                padding: '8px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
              onClick={() => {
                setSubject('Biology');
                openTimer({ subject: 'Biology' });
              }}
              id="home-quick-start-biology"
            >
              <PlayIcon size={12} color="var(--subject-biology)" />
              Biology
            </button>
          </div>
        </div>
      </Card>

      {/* 6. Active Study Goals Preview */}
      <Card
        id="home-active-goals-card"
        title="Target Study Goals"
        subtitle="Chapter milestones & syllabus progress"
        action={
          <button
            type="button"
            className="btn-text"
            onClick={() => onNavigateTab('goals')}
            style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}
            id="home-view-all-goals-btn"
          >
            All Goals ({goals.length}) <ChevronRightIcon size={14} />
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {goals.slice(0, 3).map((goal) => {
            const subjectColor =
              goal.subject === 'Physics'
                ? 'var(--subject-physics)'
                : goal.subject === 'Chemistry'
                ? 'var(--subject-chemistry)'
                : 'var(--subject-biology)';
            return (
              <div
                key={goal.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '8px 10px',
                  background: 'var(--surface-variant)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
                onClick={() => onNavigateTab('goals')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: subjectColor,
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {goal.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: goal.completed ? 'var(--success)' : subjectColor }}>
                    {goal.completed ? '100% Done' : `${goal.progressPercent}%`}
                  </span>
                </div>
                <div className="progress-track" style={{ height: '5px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${goal.completed ? 100 : goal.progressPercent}%`,
                      backgroundColor: goal.completed ? 'var(--success)' : subjectColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 7. Quick Action Buttons */}
      <Card id="quick-actions-card" title="Quick Actions" subtitle="One-tap navigation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <Button
            id="action-study-timer-btn"
            variant="primary"
            leftIcon={<ClockIcon size={16} />}
            onClick={() => openTimer()}
            size="sm"
          >
            Study Timer
          </Button>
          <Button
            id="action-add-task-btn"
            variant="secondary"
            leftIcon={<PlusIcon size={16} />}
            onClick={() => onNavigateTab('tasks')}
            size="sm"
          >
            Add Daily Task
          </Button>
          <Button
            id="action-view-goals-btn"
            variant="outline"
            leftIcon={<GoalsIcon size={16} />}
            onClick={() => onNavigateTab('goals')}
            size="sm"
          >
            Goal Tracker
          </Button>
          <Button
            id="action-partners-btn"
            variant="outline"
            leftIcon={<PartnersIcon size={16} />}
            onClick={() => onNavigateTab('partners')}
            size="sm"
          >
            Partner & VS
          </Button>
          <Button
            id="action-syllabus-btn"
            variant="outline"
            leftIcon={<BookIcon size={16} />}
            onClick={() => onNavigateTab('syllabus')}
            size="sm"
          >
            Syllabus
          </Button>
          <Button
            id="action-analytics-btn"
            variant="outline"
            leftIcon={<BarChartIcon size={16} />}
            onClick={() => onNavigateTab('analytics')}
            size="sm"
          >
            Analytics
          </Button>
        </div>
      </Card>

      {/* 7. Motivation Quote Card */}
      <div className="quote-box" id="daily-motivation-quote-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LightbulbIcon size={18} color="var(--primary)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              NEET Daily Inspiration
            </span>
            <Badge variant="neutral">{currentQuote.tag}</Badge>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={handleNextQuote}
            title="Next inspiring quote"
            aria-label="Refresh motivational quote"
            style={{ width: '28px', height: '28px' }}
            id="refresh-quote-btn"
          >
            <div style={{ transform: isRotatingQuote ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
              <RefreshCwIcon size={14} />
            </div>
          </button>
        </div>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-primary)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            margin: '4px 0 2px 0',
          }}
        >
          "{currentQuote.quote}"
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            — {currentQuote.author}
          </span>
        </div>
      </div>
    </div>
  );
};
