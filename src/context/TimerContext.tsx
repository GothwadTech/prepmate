import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SubjectType, TimerMode, TaskItem } from '../types';
import { useData } from './DataContext';
import { soundAlert } from '../utils/audioAlert';

interface TimerContextType {
  mode: TimerMode;
  subject: SubjectType;
  chapter: string;
  linkedTaskId: string | null;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isFocusMode: boolean;
  isTimerOpen: boolean;
  customMinutesInput: string;
  todaySessionsCount: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  stopAndLogEarly: () => Promise<void>;
  setTimerMode: (mode: TimerMode, customMins?: number) => void;
  setSubject: (subject: SubjectType) => void;
  setChapter: (chapter: string) => void;
  setLinkedTaskId: (id: string | null) => void;
  setCustomMinutesInput: (val: string) => void;
  openTimer: (taskContext?: { subject?: SubjectType; chapter?: string; id?: string }) => void;
  closeTimer: () => void;
  toggleFocusMode: () => void;
  toggleMute: () => void;
}

const MODE_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  deep_study: 50 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
  custom: 30 * 60,
  stopwatch: 0,
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logStudySession, sessions, tasks } = useData();

  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [subject, setSubject] = useState<SubjectType>('Physics');
  const [chapter, setChapter] = useState<string>('Current Electricity');
  const [linkedTaskId, setLinkedTaskId] = useState<string | null>(null);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('30');

  const [durationSeconds, setDurationSeconds] = useState<number>(MODE_DURATIONS.pomodoro);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(MODE_DURATIONS.pomodoro);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedSecRef = useRef<number>(0);

  // Today's sessions calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessionsCount = sessions.filter((s) => (s.date || todayStr) === todayStr).length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSessionFinished = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);

    if (!isMuted) {
      soundAlert.playSessionCompleteChime();
    }

    // Only log if it was a study session, not a break
    const isStudyMode = mode === 'pomodoro' || mode === 'deep_study' || mode === 'custom' || mode === 'stopwatch';
    if (isStudyMode) {
      const minutesSpent = Math.max(1, Math.round(durationSeconds / 60));
      await logStudySession({
        subject,
        chapter: chapter.trim() || undefined,
        durationMinutes: minutesSpent,
        mode,
        linkedTaskId: linkedTaskId || undefined,
        notes: `Completed ${mode} session`,
      });
    }

    // Reset remaining seconds
    setRemainingSeconds(durationSeconds);
  }, [durationSeconds, isMuted, mode, subject, chapter, linkedTaskId, logStudySession]);

  // Main countdown tick effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setRemainingSeconds((prev) => prev + 1);
        } else {
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              handleSessionFinished();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, mode, handleSessionFinished]);

  const startTimer = () => {
    if (!isMuted) soundAlert.playTick();
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    if (!isMuted) soundAlert.playTick();
    setIsPaused(true);
  };

  const resumeTimer = () => {
    if (!isMuted) soundAlert.playTick();
    setIsPaused(false);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(durationSeconds);
  };

  const stopAndLogEarly = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsedSeconds = mode === 'stopwatch' ? remainingSeconds : Math.max(0, durationSeconds - remainingSeconds);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);

    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(durationSeconds);

    if (elapsedMinutes >= 1) {
      await logStudySession({
        subject,
        chapter: chapter.trim() || undefined,
        durationMinutes: elapsedMinutes,
        mode,
        linkedTaskId: linkedTaskId || undefined,
        notes: `Early logged session (${elapsedMinutes}m)`,
      });
    }
  };

  const setTimerMode = (newMode: TimerMode, customMins?: number) => {
    resetTimer();
    setMode(newMode);
    let seconds = MODE_DURATIONS[newMode];
    if (newMode === 'custom') {
      const mins = customMins || parseInt(customMinutesInput, 10) || 30;
      seconds = mins * 60;
    }
    setDurationSeconds(seconds);
    setRemainingSeconds(newMode === 'stopwatch' ? 0 : seconds);
  };

  const openTimer = (taskContext?: { subject?: SubjectType; chapter?: string; id?: string }) => {
    if (taskContext) {
      if (taskContext.subject) setSubject(taskContext.subject);
      if (taskContext.chapter) setChapter(taskContext.chapter);
      if (taskContext.id) setLinkedTaskId(taskContext.id);
    }
    setIsTimerOpen(true);
  };

  const closeTimer = () => {
    setIsTimerOpen(false);
    setIsFocusMode(false);
  };

  const toggleFocusMode = () => {
    setIsFocusMode((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        subject,
        chapter,
        linkedTaskId,
        durationSeconds,
        remainingSeconds,
        isRunning,
        isPaused,
        isMuted,
        isFocusMode,
        isTimerOpen,
        customMinutesInput,
        todaySessionsCount,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        stopAndLogEarly,
        setTimerMode,
        setSubject,
        setChapter,
        setLinkedTaskId,
        setCustomMinutesInput,
        openTimer,
        closeTimer,
        toggleFocusMode,
        toggleMute,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
