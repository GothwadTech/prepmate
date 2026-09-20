import React, { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import {
  BookIcon,
  CheckIcon,
  SearchIcon,
  ClockIcon,
  FlameIcon,
  PlusIcon,
  SparklesIcon,
} from '../components/icons/SvgIcons';
import { NEET_CHAPTERS, ChapterInfo } from '../data/neetSyllabus';
import { SubjectType } from '../types';
import { useData } from '../context/DataContext';

interface SyllabusPageProps {
  onNavigateToTasks?: () => void;
}

export const SyllabusPage: React.FC<SyllabusPageProps> = ({ onNavigateToTasks }) => {
  const { addTask } = useData();
  const [selectedSubject, setSelectedSubject] = useState<'All' | SubjectType>('All');
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist completed chapters in localStorage
  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('prepmate_completed_chapters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleChapterComplete = (chapterName: string) => {
    setCompletedChapters((prev) => {
      const updated = { ...prev, [chapterName]: !prev[chapterName] };
      try {
        localStorage.setItem('prepmate_completed_chapters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Compile all chapters list with their subject
  const allChaptersWithSubject = useMemo(() => {
    const list: Array<ChapterInfo & { subject: SubjectType }> = [];
    (Object.keys(NEET_CHAPTERS) as SubjectType[]).forEach((subj) => {
      NEET_CHAPTERS[subj].forEach((chap) => {
        list.push({ ...chap, subject: subj });
      });
    });
    return list;
  }, []);

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    return allChaptersWithSubject.filter((chap) => {
      if (selectedSubject !== 'All' && chap.subject !== selectedSubject) return false;
      if (highYieldOnly && chap.weightage !== 'High') return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = chap.name.toLowerCase().includes(query);
        const matchesSubject = chap.subject.toLowerCase().includes(query);
        const matchesGrade = chap.classGrade.toLowerCase().includes(query);
        return matchesName || matchesSubject || matchesGrade;
      }
      return true;
    });
  }, [allChaptersWithSubject, selectedSubject, highYieldOnly, searchQuery]);

  // Statistics
  const totalCount = allChaptersWithSubject.length;
  const completedCount = allChaptersWithSubject.filter((c) => completedChapters[c.name]).length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  const physicsTotal = NEET_CHAPTERS.Physics.length;
  const physicsDone = NEET_CHAPTERS.Physics.filter((c) => completedChapters[c.name]).length;

  const chemistryTotal = NEET_CHAPTERS.Chemistry.length;
  const chemistryDone = NEET_CHAPTERS.Chemistry.filter((c) => completedChapters[c.name]).length;

  const biologyTotal = NEET_CHAPTERS.Biology.length;
  const biologyDone = NEET_CHAPTERS.Biology.filter((c) => completedChapters[c.name]).length;

  const handleQuickAddTask = async (chap: ChapterInfo & { subject: SubjectType }) => {
    const today = new Date().toISOString().split('T')[0];
    await addTask({
      title: `Revise & solve 30 MCQs on ${chap.name}`,
      subject: chap.subject,
      chapter: chap.name,
      type: 'MCQs',
      targetCount: 30,
      date: today,
    });
    if (onNavigateToTasks) {
      onNavigateToTasks();
    }
  };

  return (
    <div id="neet-syllabus-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Header Overview Card */}
      <Card id="syllabus-overview-card" variant="hero">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-container)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookIcon size={20} color="var(--primary)" />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  NEET Syllabus Tracker
                </h2>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Full NTA NEET UG Syllabus Checklist & High Yield Priority
                </p>
              </div>
            </div>

            <Badge variant="primary">
              {completedCount} / {totalCount} Chapters ({progressPercent}%)
            </Badge>
          </div>

          {/* Master Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--surface-variant)',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                borderRadius: 'var(--radius-pill)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Subject Pills Progress Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px' }}>
            <div
              style={{
                backgroundColor: 'var(--surface-variant)',
                padding: '6px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ color: 'var(--subject-physics)', fontWeight: 700 }}>Physics</span>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                {physicsDone}/{physicsTotal} ({Math.round((physicsDone / physicsTotal) * 100)}%)
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--surface-variant)',
                padding: '6px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ color: 'var(--subject-chemistry)', fontWeight: 700 }}>Chemistry</span>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                {chemistryDone}/{chemistryTotal} ({Math.round((chemistryDone / chemistryTotal) * 100)}%)
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--surface-variant)',
                padding: '6px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ color: 'var(--subject-biology)', fontWeight: 700 }}>Biology</span>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                {biologyDone}/{biologyTotal} ({Math.round((biologyDone / biologyTotal) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Search and Filters Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters (e.g. Thermodynamics, Genetics, Optics)..."
            id="syllabus-search-input"
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {(['All', 'Physics', 'Chemistry', 'Biology'] as const).map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  border: '1px solid var(--border)',
                  backgroundColor: selectedSubject === subj ? 'var(--primary)' : 'var(--surface)',
                  color: selectedSubject === subj ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {subj}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setHighYieldOnly((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px',
              fontWeight: 700,
              border: highYieldOnly ? '1px solid var(--flame)' : '1px solid var(--border)',
              backgroundColor: highYieldOnly ? 'rgba(255, 109, 0, 0.12)' : 'var(--surface)',
              color: highYieldOnly ? 'var(--flame)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <FlameIcon size={13} color={highYieldOnly ? 'var(--flame)' : 'currentColor'} />
            High Yield Only
          </button>
        </div>
      </div>

      {/* 3. Chapters List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)', padding: '0 4px' }}>
          <span>Showing {filteredChapters.length} chapter{filteredChapters.length === 1 ? '' : 's'}</span>
          <span>{filteredChapters.filter((c) => completedChapters[c.name]).length} completed</span>
        </div>

        {filteredChapters.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <p style={{ fontSize: '13px', margin: 0 }}>Koi chapter match nahi hua.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedSubject('All');
                setHighYieldOnly(false);
                setSearchQuery('');
              }}
              style={{
                marginTop: '8px',
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredChapters.map((chap) => {
            const isCompleted = Boolean(completedChapters[chap.name]);
            const subjColor =
              chap.subject === 'Physics'
                ? 'var(--subject-physics)'
                : chap.subject === 'Chemistry'
                ? 'var(--subject-chemistry)'
                : 'var(--subject-biology)';
            const subjIcon = chap.subject === 'Physics' ? '⚡' : chap.subject === 'Chemistry' ? '⚗️' : '🧬';

            return (
              <div
                key={chap.name}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: isCompleted ? '1px solid var(--success)' : '1px solid var(--border)',
                  borderLeft: `4px solid ${subjColor}`,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: isCompleted ? 0.88 : 1,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {/* Left: Completion Checkbox + Title & Tags */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
                  <button
                    type="button"
                    onClick={() => toggleChapterComplete(chap.name)}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: isCompleted ? 'none' : '2px solid var(--border)',
                      backgroundColor: isCompleted ? 'var(--success)' : 'transparent',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isCompleted && <CheckIcon size={14} color="#FFFFFF" />}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: subjColor,
                          flexShrink: 0,
                        }}
                      />
                      <h4
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 700,
                          margin: 0,
                          color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {chap.name}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--surface-variant)',
                          color: subjColor,
                        }}
                      >
                        {subjIcon} {chap.subject}
                      </span>

                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor:
                            chap.weightage === 'High'
                              ? 'rgba(255, 109, 0, 0.12)'
                              : chap.weightage === 'Medium'
                              ? 'rgba(249, 171, 0, 0.12)'
                              : 'var(--surface-variant)',
                          color:
                            chap.weightage === 'High'
                              ? 'var(--flame)'
                              : chap.weightage === 'Medium'
                              ? '#B06000'
                              : 'var(--text-tertiary)',
                        }}
                      >
                        {chap.weightage} Weightage
                      </span>

                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--surface-variant)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Class {chap.classGrade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Add Task button */}
                <div style={{ flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleQuickAddTask(chap)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface-variant)',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                    }}
                    title="Add daily task for this chapter"
                  >
                    <PlusIcon size={12} color="var(--primary)" />
                    Task
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
