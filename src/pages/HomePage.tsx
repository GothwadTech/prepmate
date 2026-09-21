import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppTab, UserStats, SubjectType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTimer } from '../context/TimerContext';
import { StreakMilestonesModal } from '../components/streak/StreakMilestonesModal';
import { HomeWelcomeStrip } from '../components/home/HomeWelcomeStrip';
import { HomeOverviewRoutineHub } from '../components/home/HomeOverviewRoutineHub';
import { HomeSubjectCards } from '../components/home/HomeSubjectCards';
import { HomePriorityTasks } from '../components/home/HomePriorityTasks';
import { HomeTimerSection } from '../components/home/HomeTimerSection';
import { HomeActiveGoals } from '../components/home/HomeActiveGoals';
import { HomeQuickActions } from '../components/home/HomeQuickActions';
import { HomeMotivationQuote } from '../components/home/HomeMotivationQuote';

interface HomePageProps {
  onNavigateTab: (tab: AppTab) => void;
  stats: UserStats;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateTab, stats }) => {
  const { user } = useAuth();
  const { tasks, toggleTask, goals, streakStats, useStreakShield } = useData();
  const {
    openTimer,
    isRunning,
    remainingSeconds,
    subject: activeSubject,
    setSubject,
  } = useTimer();

  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [shieldActivating, setShieldActivating] = useState(false);

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  const currentStreak = streakStats?.currentStreak || stats.streakDays || 0;
  const shieldsAvailable = stats.streakShields ?? 1;

  const handleUseShield = async () => {
    setShieldActivating(true);
    try {
      await useStreakShield();
    } finally {
      setShieldActivating(false);
    }
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

  const handleSelectSubject = (subj: SubjectType) => {
    setSubject(subj);
    openTimer({ subject: subj });
  };

  return (
    <div id="home-dashboard-page" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Sleek, Slim & Lightweight Top Welcome Strip */}
      <HomeWelcomeStrip user={user} stats={stats} />

      {/* 2. Combined Daily Overview & Habit Routine Hub */}
      <HomeOverviewRoutineHub
        stats={stats}
        currentStreak={currentStreak}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        overallProgress={overallProgress}
        shieldsAvailable={shieldsAvailable}
        streakStats={streakStats}
        shieldActivating={shieldActivating}
        onUseShield={handleUseShield}
        onOpenTimer={() => openTimer()}
        onOpenMilestones={() => setShowMilestonesModal(true)}
      />

      {/* 4. Three Distinct Subject Prep Cards (Physics, Chemistry, Biology) */}
      <HomeSubjectCards
        physicsProg={physicsProg}
        chemistryProg={chemistryProg}
        biologyProg={biologyProg}
        onSelectSubject={handleSelectSubject}
      />

      {/* 5. Today's Priorities / Quick Tasks Snippet */}
      <HomePriorityTasks
        tasks={tasks}
        onToggleTask={toggleTask}
        onNavigateTab={onNavigateTab}
      />

      {/* 6. Study Timer & Focus Section */}
      <HomeTimerSection
        isRunning={isRunning}
        timeFormatted={timeFormatted}
        activeSubject={activeSubject}
        onOpenTimer={openTimer}
      />

      {/* 7. Active Study Goals Preview */}
      <HomeActiveGoals goals={goals} onNavigateTab={onNavigateTab} />

      {/* 8. Quick Action Buttons */}
      <HomeQuickActions
        onOpenTimer={() => openTimer()}
        onNavigateTab={onNavigateTab}
      />

      {/* 9. Motivation Quote Card */}
      <HomeMotivationQuote />

      {/* 10. Milestones Modal */}
      <AnimatePresence>
        {showMilestonesModal && (
          <StreakMilestonesModal
            milestones={streakStats?.allMilestones || []}
            currentStreak={currentStreak}
            onClose={() => setShowMilestonesModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
