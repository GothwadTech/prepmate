import { SubjectType, TaskType } from '../types';

export interface ChapterInfo {
  name: string;
  weightage: 'High' | 'Medium' | 'Standard';
  classGrade: '11th' | '12th';
}

export const NEET_CHAPTERS: Record<SubjectType, ChapterInfo[]> = {
  Physics: [
    { name: 'Units & Measurements', weightage: 'Standard', classGrade: '11th' },
    { name: 'Motion in a Straight Line', weightage: 'Standard', classGrade: '11th' },
    { name: 'Motion in a Plane', weightage: 'Medium', classGrade: '11th' },
    { name: 'Laws of Motion', weightage: 'High', classGrade: '11th' },
    { name: 'Work, Energy & Power', weightage: 'High', classGrade: '11th' },
    { name: 'Rotational Motion', weightage: 'High', classGrade: '11th' },
    { name: 'Gravitation', weightage: 'Medium', classGrade: '11th' },
    { name: 'Mechanical Properties of Solids', weightage: 'Standard', classGrade: '11th' },
    { name: 'Mechanical Properties of Fluids', weightage: 'Medium', classGrade: '11th' },
    { name: 'Thermal Properties of Matter', weightage: 'Standard', classGrade: '11th' },
    { name: 'Thermodynamics', weightage: 'High', classGrade: '11th' },
    { name: 'Kinetic Theory of Gases', weightage: 'Standard', classGrade: '11th' },
    { name: 'Oscillations & SHM', weightage: 'Medium', classGrade: '11th' },
    { name: 'Waves', weightage: 'Medium', classGrade: '11th' },
    { name: 'Electrostatics & Potential', weightage: 'High', classGrade: '12th' },
    { name: 'Current Electricity', weightage: 'High', classGrade: '12th' },
    { name: 'Moving Charges & Magnetism', weightage: 'High', classGrade: '12th' },
    { name: 'Magnetism & Matter', weightage: 'Standard', classGrade: '12th' },
    { name: 'Electromagnetic Induction', weightage: 'Medium', classGrade: '12th' },
    { name: 'Alternating Current', weightage: 'Medium', classGrade: '12th' },
    { name: 'Electromagnetic Waves', weightage: 'Standard', classGrade: '12th' },
    { name: 'Ray Optics & Optical Instruments', weightage: 'High', classGrade: '12th' },
    { name: 'Wave Optics', weightage: 'Medium', classGrade: '12th' },
    { name: 'Dual Nature of Radiation & Matter', weightage: 'High', classGrade: '12th' },
    { name: 'Atoms & Nuclei', weightage: 'High', classGrade: '12th' },
    { name: 'Semiconductor Electronics', weightage: 'High', classGrade: '12th' },
  ],
  Chemistry: [
    { name: 'Some Basic Concepts of Chemistry', weightage: 'Medium', classGrade: '11th' },
    { name: 'Structure of Atom', weightage: 'High', classGrade: '11th' },
    { name: 'Classification of Elements & Periodicity', weightage: 'Medium', classGrade: '11th' },
    { name: 'Chemical Bonding & Molecular Structure', weightage: 'High', classGrade: '11th' },
    { name: 'Chemical Thermodynamics', weightage: 'High', classGrade: '11th' },
    { name: 'Equilibrium (Physical & Chemical)', weightage: 'High', classGrade: '11th' },
    { name: 'Redox Reactions', weightage: 'Standard', classGrade: '11th' },
    { name: 'Organic Chemistry: Some Basic Principles (GOC)', weightage: 'High', classGrade: '11th' },
    { name: 'Hydrocarbons', weightage: 'High', classGrade: '11th' },
    { name: 'Solutions', weightage: 'High', classGrade: '12th' },
    { name: 'Electrochemistry', weightage: 'High', classGrade: '12th' },
    { name: 'Chemical Kinetics', weightage: 'High', classGrade: '12th' },
    { name: 'd- and f-Block Elements', weightage: 'Medium', classGrade: '12th' },
    { name: 'Coordination Compounds', weightage: 'High', classGrade: '12th' },
    { name: 'Haloalkanes & Haloarenes', weightage: 'Medium', classGrade: '12th' },
    { name: 'Alcohols, Phenols & Ethers', weightage: 'High', classGrade: '12th' },
    { name: 'Aldehydes, Ketones & Carboxylic Acids', weightage: 'High', classGrade: '12th' },
    { name: 'Amines', weightage: 'Medium', classGrade: '12th' },
    { name: 'Biomolecules', weightage: 'High', classGrade: '12th' },
  ],
  Biology: [
    { name: 'The Living World', weightage: 'Standard', classGrade: '11th' },
    { name: 'Biological Classification', weightage: 'High', classGrade: '11th' },
    { name: 'Plant Kingdom', weightage: 'High', classGrade: '11th' },
    { name: 'Animal Kingdom', weightage: 'High', classGrade: '11th' },
    { name: 'Morphology of Flowering Plants', weightage: 'High', classGrade: '11th' },
    { name: 'Anatomy of Flowering Plants', weightage: 'Medium', classGrade: '11th' },
    { name: 'Structural Organisation in Animals', weightage: 'Medium', classGrade: '11th' },
    { name: 'Cell: The Unit of Life', weightage: 'High', classGrade: '11th' },
    { name: 'Biomolecules', weightage: 'High', classGrade: '11th' },
    { name: 'Cell Cycle and Cell Division', weightage: 'High', classGrade: '11th' },
    { name: 'Photosynthesis in Higher Plants', weightage: 'High', classGrade: '11th' },
    { name: 'Respiration in Plants', weightage: 'High', classGrade: '11th' },
    { name: 'Plant Growth and Development', weightage: 'Medium', classGrade: '11th' },
    { name: 'Breathing and Exchange of Gases', weightage: 'Medium', classGrade: '11th' },
    { name: 'Body Fluids and Circulation', weightage: 'High', classGrade: '11th' },
    { name: 'Excretory Products & Elimination', weightage: 'Medium', classGrade: '11th' },
    { name: 'Locomotion and Movement', weightage: 'Medium', classGrade: '11th' },
    { name: 'Neural Control and Coordination', weightage: 'Medium', classGrade: '11th' },
    { name: 'Chemical Coordination & Integration', weightage: 'High', classGrade: '11th' },
    { name: 'Sexual Reproduction in Flowering Plants', weightage: 'High', classGrade: '12th' },
    { name: 'Human Reproduction', weightage: 'High', classGrade: '12th' },
    { name: 'Reproductive Health', weightage: 'Medium', classGrade: '12th' },
    { name: 'Principles of Inheritance & Variation (Genetics I)', weightage: 'High', classGrade: '12th' },
    { name: 'Molecular Basis of Inheritance (Genetics II)', weightage: 'High', classGrade: '12th' },
    { name: 'Evolution', weightage: 'Medium', classGrade: '12th' },
    { name: 'Human Health and Disease', weightage: 'High', classGrade: '12th' },
    { name: 'Microbes in Human Welfare', weightage: 'Medium', classGrade: '12th' },
    { name: 'Biotechnology: Principles & Processes', weightage: 'High', classGrade: '12th' },
    { name: 'Biotechnology & Its Applications', weightage: 'High', classGrade: '12th' },
    { name: 'Organisms and Populations', weightage: 'Medium', classGrade: '12th' },
    { name: 'Ecosystem', weightage: 'Medium', classGrade: '12th' },
    { name: 'Biodiversity and Conservation', weightage: 'High', classGrade: '12th' },
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
    chapter: 'Genetics & Evolution',
    type: 'Test',
    targetCount: 90,
  },
  {
    title: 'Optics Ray Diagrams & Mirror Formula',
    subject: 'Physics',
    chapter: 'Ray Optics & Optical Instruments',
    type: 'MCQs',
    targetCount: 35,
  },
];
