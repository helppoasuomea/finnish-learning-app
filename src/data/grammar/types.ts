export interface MorphBreakdown {
  token: string;
  role: 'stem' | 'gradation' | 'ending' | 'other';
  note?: string;
}

export interface Morphology {
  surface: string;
  stem?: string;
  ending?: string;
  gradation?: string;
  breakdown: MorphBreakdown[];
}

export interface Example { fi: string; en: string; }

export interface Section {
  id: string;
  title: string;
  question?: string;
  questionEn?: string;
  grammarPattern?: string;
  caseMarker?: string;
  formula?: string;
  morphology?: Morphology;
  examples: Example[];
  relativeExamples?: Example[];
  datePattern?: { label?: string; fi: string; en: string; note?: string };
  specialNote?: { fi: string; en: string };
  verbNote?: { fi: string; en: string };
  commonPitfalls?: string[];
  tags?: string[];
}

export interface Drill {
  id: string;
  kind: 'fill' | 'mc' | 'transform' | 'builder' | 'spot-error' | 'translate' | 'listen' | 'table';
  sectionId: string;
  data: Record<string, any>;
}

export interface GrammarIndexRow {
  pattern: string;
  use: string;
  examples?: string[];
  sectionRef?: string;
}

export interface Source {
  label: string;
  url?: string;
  citation?: string;
  license?: string;
}

export interface GrammarTopic {
  id: string;
  version: string;
  title: string;
  subtitle?: string;
  language: string;
  targetLanguage: string;
  level: string;
  estimatedMin: number;
  prerequisites: string[];
  tags: string[];
  overview: {
    theme: string;
    grammarFocus: string[];
    whyItMatters: string;
  };
  sections: Section[];
  grammarIndex: GrammarIndexRow[];
  drills: Drill[];
  sources: Source[];
  isStub?: boolean;
  category?: string;
}

export interface CatalogEntry {
  id: string;
  category: string;
  level: string;
  title: string;
  subtitle: string;
  prerequisites: string[];
  published: boolean;
}

export interface TopicProgress {
  topicId: string;
  masteryPct: number;
  attemptsTotal: number;
  attemptsCorrect: number;
  bySection: Record<string, { seen: number; correct: number; masteryPct: number }>;
  status: 'available' | 'in-progress' | 'mastered';
  lastStudiedAt: string | null;
}
