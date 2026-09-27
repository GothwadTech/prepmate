import { SubjectType, TaskType } from '../types';
import class11Data from './neet_syllabus_class11.json';
import class12Data from './neet_syllabus_class12.json';

export type SyllabusGradeFilter = '11th' | '12th' | 'dropper';

export interface DetailedChapter {
  id: string;
  chapterNumber: number;
  unitNumber: number;
  unitName: string;
  name: string;
  subject: SubjectType;
  branch: string;
  classGrade: '11th' | '12th';
  weightage: 'High' | 'Medium' | 'Standard';
  expectedQuestions: string;
  highYield: boolean;
  topics: string[];
  keyConcepts: string;
}

export interface SyllabusDocument {
  classGrade: string;
  title: string;
  totalChapters: number;
  subjects: {
    Physics: DetailedChapter[];
    Chemistry: DetailedChapter[];
    Biology: DetailedChapter[];
  };
}

export const CLASS_11_SYLLABUS = class11Data as SyllabusDocument;
export const CLASS_12_SYLLABUS = class12Data as SyllabusDocument;

// Helper to get all chapters for a grade filter
export function getChaptersForGrade(filter: SyllabusGradeFilter): DetailedChapter[] {
  const list: DetailedChapter[] = [];

  if (filter === '11th' || filter === 'dropper') {
    list.push(...CLASS_11_SYLLABUS.subjects.Physics);
    list.push(...CLASS_11_SYLLABUS.subjects.Chemistry);
    list.push(...CLASS_11_SYLLABUS.subjects.Biology);
  }

  if (filter === '12th' || filter === 'dropper') {
    list.push(...CLASS_12_SYLLABUS.subjects.Physics);
    list.push(...CLASS_12_SYLLABUS.subjects.Chemistry);
    list.push(...CLASS_12_SYLLABUS.subjects.Biology);
  }

  return list;
}

export interface ChapterInfo {
  name: string;
  weightage: 'High' | 'Medium' | 'Standard';
  classGrade: '11th' | '12th';
}

// Backwards-compatible NEET_CHAPTERS mapping
export const NEET_CHAPTERS: Record<SubjectType, ChapterInfo[]> = {
  Physics: [
    ...CLASS_11_SYLLABUS.subjects.Physics.map((c) => ({
      name: c.name,
      weightage: c.weightage,
      classGrade: c.classGrade,
    })),
    ...CLASS_12_SYLLABUS.subjects.Physics.map((c) => ({
      name: c.name,
      weightage: c.weightage,
      classGrade: c.classGrade,
    })),
  ],
  Chemistry: [
    ...CLASS_11_SYLLABUS.subjects.Chemistry.map((c) => ({
      name: c.name,
      weightage: c.weightage,
      classGrade: c.classGrade,
    })),
    ...CLASS_12_SYLLABUS.subjects.Chemistry.map((c) => ({
      name: c.name,
      weightage: c.weightage,
      classGrade: c.classGrade,
    })),
  ],
  Biology: [
    ...CLASS_11_SYLLABUS.subjects.Biology.map((c) => ({
      name: c.name,
      weightage: c.weightage,
      classGrade: c.classGrade,
    })),
    ...CLASS_12_SYLLABUS.subjects.Biology.map((c) => ({
      name: c.name,
      weightage: c.weightage,
      classGrade: c.classGrade,
    })),
  ],
};

export interface QuickTemplate {
  title: string;
  subject: SubjectType;
  chapter: string;
  type: TaskType;
  targetCount: number;
}

export const PRESET_TASK_TEMPLATES: QuickTemplate[] = [
  {
    title: '45 Physics PYQs on Current Electricity',
    subject: 'Physics',
    chapter: 'Current Electricity',
    type: 'MCQs',
    targetCount: 45,
  },
  {
    title: 'NCERT Biology Line-by-Line Reading',
    subject: 'Biology',
    chapter: 'Molecular Basis of Inheritance',
    type: 'Notes',
    targetCount: 1,
  },
  {
    title: 'GOC Named Reactions & Acidic Strength Drills',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry: Some Basic Principles (GOC)',
    type: 'Revision',
    targetCount: 30,
  },
  {
    title: '90 MCQs Full Biology Unit Test',
    subject: 'Biology',
    chapter: 'Principles of Inheritance and Variation',
    type: 'Test',
    targetCount: 90,
  },
  {
    title: 'Optics Ray Diagrams & Mirror Formula',
    subject: 'Physics',
    chapter: 'Ray Optics and Optical Instruments',
    type: 'MCQs',
    targetCount: 35,
  },
];
