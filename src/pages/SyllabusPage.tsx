import React, { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import {
  BookIcon,
  CheckIcon,
  FlameIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  AwardIcon,
  SparklesIcon,
} from '../components/icons/SvgIcons';
import {
  getChaptersForGrade,
  DetailedChapter,
  SyllabusGradeFilter,
  CLASS_11_SYLLABUS,
  CLASS_12_SYLLABUS,
} from '../data/neetSyllabus';
import { SubjectType } from '../types';
import { useData } from '../context/DataContext';

interface SyllabusPageProps {
  onNavigateToTasks?: () => void;
}

export const SyllabusPage: React.FC<SyllabusPageProps> = ({ onNavigateToTasks }) => {
  const { addTask } = useData();

  // Grade filter: 11th, 12th, or Dropper (11+12)
  const [selectedGrade, setSelectedGrade] = useState<SyllabusGradeFilter>(() => {
    try {
      const saved = localStorage.getItem('prepmate_syllabus_grade');
      if (saved === '11th' || saved === '12th' || saved === 'dropper') return saved;
    } catch {
      // ignore
    }
    return 'dropper';
  });

  const [selectedSubject, setSelectedSubject] = useState<'All' | SubjectType>('All');
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  // Persist completed chapters in localStorage
  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('prepmate_completed_chapters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleSelectGrade = (grade: SyllabusGradeFilter) => {
    setSelectedGrade(grade);
    try {
      localStorage.setItem('prepmate_syllabus_grade', grade);
    } catch {
      // ignore
    }
  };

  const toggleChapterComplete = (chapterId: string) => {
    setCompletedChapters((prev) => {
      const updated = { ...prev, [chapterId]: !prev[chapterId] };
      try {
        localStorage.setItem('prepmate_completed_chapters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Get active chapters based on selected grade (11th, 12th, or Dropper)
  const currentGradeChapters = useMemo(() => {
    return getChaptersForGrade(selectedGrade);
  }, [selectedGrade]);

  // Filtered chapters based on search, subject, and high yield
  const filteredChapters = useMemo(() => {
    return currentGradeChapters.filter((chap) => {
      if (selectedSubject !== 'All' && chap.subject !== selectedSubject) return false;
      if (highYieldOnly && !chap.highYield) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = chap.name.toLowerCase().includes(q);
        const matchesUnit = chap.unitName.toLowerCase().includes(q);
        const matchesSubject = chap.subject.toLowerCase().includes(q);
        const matchesBranch = chap.branch.toLowerCase().includes(q);
        const matchesTopics = chap.topics.some((t) => t.toLowerCase().includes(q));
        return matchesName || matchesUnit || matchesSubject || matchesBranch || matchesTopics;
      }
      return true;
    });
  }, [currentGradeChapters, selectedSubject, highYieldOnly, searchQuery]);

  // Stats for the active grade selection
  const totalCount = currentGradeChapters.length;
  const completedCount = currentGradeChapters.filter((c) => completedChapters[c.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const physicsChapters = currentGradeChapters.filter((c) => c.subject === 'Physics');
  const physicsDone = physicsChapters.filter((c) => completedChapters[c.id]).length;
  const physicsPercent = physicsChapters.length > 0 ? Math.round((physicsDone / physicsChapters.length) * 100) : 0;

  const chemistryChapters = currentGradeChapters.filter((c) => c.subject === 'Chemistry');
  const chemistryDone = chemistryChapters.filter((c) => completedChapters[c.id]).length;
  const chemistryPercent = chemistryChapters.length > 0 ? Math.round((chemistryDone / chemistryChapters.length) * 100) : 0;

  const biologyChapters = currentGradeChapters.filter((c) => c.subject === 'Biology');
  const biologyDone = biologyChapters.filter((c) => completedChapters[c.id]).length;
  const biologyPercent = biologyChapters.length > 0 ? Math.round((biologyDone / biologyChapters.length) * 100) : 0;

  const handleQuickAddTask = async (chap: DetailedChapter) => {
    const today = new Date().toISOString().split('T')[0];
    await addTask({
      title: `Solve 30 NCERT MCQs on ${chap.name}`,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-container)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(4, 148, 244, 0.15)',
                }}
              >
                <BookIcon size={22} color="var(--primary)" />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  NEET UG Syllabus Tracker
                </h2>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Official NTA Updated Syllabus with Subtopics & Key Concepts
                </p>
              </div>
            </div>

            <Badge variant="primary" style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 800 }}>
              {completedCount} / {totalCount} Done ({progressPercent}%)
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
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {/* Subject Progress Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px' }}>
            <div
              style={{
                backgroundColor: 'var(--surface-variant)',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-physics)' }} />
                <span style={{ color: 'var(--subject-physics)', fontWeight: 700 }}>Physics</span>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {physicsDone}/{physicsChapters.length} ({physicsPercent}%)
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--surface-variant)',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-chemistry)' }} />
                <span style={{ color: 'var(--subject-chemistry)', fontWeight: 700 }}>Chemistry</span>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {chemistryDone}/{chemistryChapters.length} ({chemistryPercent}%)
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--surface-variant)',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--subject-biology)' }} />
                <span style={{ color: 'var(--subject-biology)', fontWeight: 700 }}>Biology</span>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {biologyDone}/{biologyChapters.length} ({biologyPercent}%)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. SYLLABUS GRADE SELECTOR (11th, 12th, Dropper) */}
      <div
        id="syllabus-grade-segmented-control"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          backgroundColor: 'var(--surface-variant)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
          gap: '4px',
          border: '1px solid var(--border)',
        }}
      >
        <button
          type="button"
          id="syllabus-tab-11th"
          onClick={() => handleSelectGrade('11th')}
          style={{
            padding: '9px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            backgroundColor: selectedGrade === '11th' ? 'var(--primary)' : 'transparent',
            color: selectedGrade === '11th' ? '#FFFFFF' : 'var(--text-secondary)',
            boxShadow: selectedGrade === '11th' ? '0 2px 8px rgba(4, 148, 244, 0.3)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
          }}
        >
          <span>Class 11</span>
          <span style={{ fontSize: '9.5px', opacity: selectedGrade === '11th' ? 0.9 : 0.7, fontWeight: 600 }}>
            {CLASS_11_SYLLABUS.totalChapters} Chapters
          </span>
        </button>

        <button
          type="button"
          id="syllabus-tab-12th"
          onClick={() => handleSelectGrade('12th')}
          style={{
            padding: '9px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            backgroundColor: selectedGrade === '12th' ? 'var(--primary)' : 'transparent',
            color: selectedGrade === '12th' ? '#FFFFFF' : 'var(--text-secondary)',
            boxShadow: selectedGrade === '12th' ? '0 2px 8px rgba(4, 148, 244, 0.3)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
          }}
        >
          <span>Class 12</span>
          <span style={{ fontSize: '9.5px', opacity: selectedGrade === '12th' ? 0.9 : 0.7, fontWeight: 600 }}>
            {CLASS_12_SYLLABUS.totalChapters} Chapters
          </span>
        </button>

        <button
          type="button"
          id="syllabus-tab-dropper"
          onClick={() => handleSelectGrade('dropper')}
          style={{
            padding: '9px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            backgroundColor: selectedGrade === 'dropper' ? 'var(--primary)' : 'transparent',
            color: selectedGrade === 'dropper' ? '#FFFFFF' : 'var(--text-secondary)',
            boxShadow: selectedGrade === 'dropper' ? '0 2px 8px rgba(4, 148, 244, 0.3)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
          }}
        >
          <span>Dropper (11+12)</span>
          <span style={{ fontSize: '9.5px', opacity: selectedGrade === 'dropper' ? 0.9 : 0.7, fontWeight: 600 }}>
            {CLASS_11_SYLLABUS.totalChapters + CLASS_12_SYLLABUS.totalChapters} Chapters
          </span>
        </button>
      </div>

      {/* 3. Search and Subject Filters Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chapter, unit, topics (e.g. Optics, Genetics, Thermodynamics)..."
          id="syllabus-search-input"
        />

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {(['All', 'Physics', 'Chemistry', 'Biology'] as const).map((subj) => (
              <button
                key={subj}
                type="button"
                id={`filter-subject-${subj.toLowerCase()}`}
                onClick={() => setSelectedSubject(subj)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  border: '1px solid var(--border)',
                  backgroundColor: selectedSubject === subj ? 'var(--primary)' : 'var(--surface)',
                  color: selectedSubject === subj ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  boxShadow: selectedSubject === subj ? '0 2px 6px rgba(4, 148, 244, 0.25)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {subj}
              </button>
            ))}
          </div>

          <button
            type="button"
            id="filter-high-yield-btn"
            onClick={() => setHighYieldOnly((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px',
              fontWeight: 700,
              border: highYieldOnly ? '1.5px solid var(--flame)' : '1px solid var(--border)',
              backgroundColor: highYieldOnly ? 'rgba(255, 109, 0, 0.12)' : 'var(--surface)',
              color: highYieldOnly ? 'var(--flame)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <FlameIcon size={13} color={highYieldOnly ? 'var(--flame)' : 'currentColor'} />
            High Yield Only
          </button>
        </div>
      </div>

      {/* 4. CHAPTERS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)', padding: '0 4px' }}>
          <span>Showing {filteredChapters.length} chapter{filteredChapters.length === 1 ? '' : 's'}</span>
          <span>{filteredChapters.filter((c) => completedChapters[c.id]).length} marked completed</span>
        </div>

        {filteredChapters.length === 0 ? (
          <div
            style={{
              padding: '36px 16px',
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <p style={{ fontSize: '13px', margin: 0, fontWeight: 600 }}>Koi chapter match nahi hua.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedSubject('All');
                setHighYieldOnly(false);
                setSearchQuery('');
              }}
              style={{
                marginTop: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredChapters.map((chap) => {
            const isCompleted = Boolean(completedChapters[chap.id]);
            const isExpanded = expandedChapterId === chap.id;
            const subjColor =
              chap.subject === 'Physics'
                ? 'var(--subject-physics)'
                : chap.subject === 'Chemistry'
                ? 'var(--subject-chemistry)'
                : 'var(--subject-biology)';
            const subjIcon = chap.subject === 'Physics' ? '⚡' : chap.subject === 'Chemistry' ? '⚗️' : '🧬';

            return (
              <div
                key={chap.id}
                id={`syllabus-chapter-${chap.id}`}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  border: isCompleted ? '1.5px solid var(--success)' : '1px solid var(--border)',
                  borderLeft: `4px solid ${subjColor}`,
                  boxShadow: 'var(--shadow-sm)',
                  opacity: isCompleted ? 0.92 : 1,
                  transition: 'all var(--transition-fast)',
                  overflow: 'hidden',
                }}
              >
                {/* Main Chapter Summary Row */}
                <div
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  {/* Left: Completion Checkbox + Title & Badges */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
                    <button
                      type="button"
                      id={`toggle-chap-${chap.id}`}
                      onClick={() => toggleChapterComplete(chap.id)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '7px',
                        border: isCompleted ? 'none' : '2px solid var(--border)',
                        backgroundColor: isCompleted ? 'var(--success)' : 'transparent',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        marginTop: '2px',
                        transition: 'all var(--transition-fast)',
                      }}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {isCompleted && <CheckIcon size={14} color="#FFFFFF" />}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--surface-variant)',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          Ch {chap.chapterNumber}
                        </span>
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

                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
                        Unit {chap.unitNumber}: {chap.unitName}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
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
                          {subjIcon} {chap.subject} • {chap.branch}
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

                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--surface-variant)',
                            color: 'var(--primary)',
                          }}
                        >
                          {chap.expectedQuestions}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Add Task + Toggle Expand Topics */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button
                      type="button"
                      id={`add-task-chap-${chap.id}`}
                      onClick={() => handleQuickAddTask(chap)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 9px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface-variant)',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                      }}
                      title="Add daily study task for this chapter"
                    >
                      <PlusIcon size={12} color="var(--primary)" />
                      Task
                    </button>

                    <button
                      type="button"
                      id={`expand-chap-${chap.id}`}
                      onClick={() => setExpandedChapterId(isExpanded ? null : chap.id)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border)',
                        backgroundColor: isExpanded ? 'var(--primary-container)' : 'var(--surface-variant)',
                        color: isExpanded ? 'var(--primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={isExpanded ? 'Hide topics' : 'Show NTA syllabus topics'}
                    >
                      {isExpanded ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Detailed NTA Syllabus Topics & Key Concepts */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--surface-variant)',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        NTA Syllabus Topics:
                      </span>
                      <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {chap.topics.map((t, idx) => (
                          <li key={idx} style={{ marginBottom: '3px' }}>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {chap.keyConcepts && (
                      <div
                        style={{
                          backgroundColor: 'var(--surface)',
                          borderRadius: 'var(--radius-xs)',
                          padding: '8px 10px',
                          border: '1px solid var(--border)',
                          fontSize: '11.5px',
                        }}
                      >
                        <span style={{ fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '2px' }}>
                          ⚡ High-Yield Focus / Key Concepts:
                        </span>
                        <span style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                          {chap.keyConcepts}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
