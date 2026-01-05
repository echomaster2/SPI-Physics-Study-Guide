
export type AssessmentQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: string;
  xpReward?: number;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  category: string;
};

export type FlashcardProgress = {
  id: string;
  status: 'learning' | 'mastered' | 'new';
  reviewCount: number;
  lastReviewed: number;
};

export type Topic = {
  id: string;
  title: string;
  contentBody: string;
  estTime: string;
  xpReward: number;
  coinReward: number;
  assessment: AssessmentQuestion[];
  visualType: string;
  roadmap: string;
  mnemonic: string;
  negation: string;
  analogy: string;
  practicalApplication: string;
  activeLearningPromise: string;
  mindsetShift: string;
  assessmentCTA: string;
  isSecret?: boolean;
  narrativeHook?: string;
  timeSaverHook?: string;
  professorPersona?: 'Charon' | 'Puck' | 'Kore' | 'Zephyr';
};

export type Module = {
  id: string;
  title: string;
  depth: number;
  pressure: string;
  description: string;
  topics: Topic[];
};

export type Artifact = {
  id: string;
  name: string;
  description: string;
  visualType: string;
  boardTrap: string;
  fix: string;
};

export type FormulaVariable = {
  name: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  description: string;
};

export type Formula = {
  id: string;
  name: string;
  category: string;
  formula: string;
  variables: FormulaVariable[];
  relationships: { var: string; type: 'direct' | 'inverse' | 'none' }[];
  calculate: (vars: Record<string, number>) => number;
  deepDive: string;
};

export type ShopItem = {
  id: string;
  name: string;
  type: 'booster' | 'cosmetic' | 'access';
  cost: number;
  description: string;
  icon: 'Zap' | 'Shield' | 'Star' | 'Target' | 'Brain' | 'Flame' | 'Rocket';
  benefit?: string;
};

export type PodcastTrack = {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
  type: 'song' | 'lecture';
  description: string;
  tags: string[];
};

// Dummy data exports to satisfy components
export const courseData: Module[] = [
  {
    id: 'm1',
    title: 'I. Physics Fundamentals',
    depth: 1000,
    pressure: 'Low',
    description: 'The foundation of acoustic science.',
    topics: [
      {
        id: 't1',
        title: 'Longitudinal Waves',
        contentBody: 'Sound is a longitudinal wave.',
        estTime: '10m',
        xpReward: 100,
        coinReward: 10,
        visualType: 'LongitudinalWaveVisual',
        roadmap: 'Definitions;Wave Motion;Particle Interaction',
        mnemonic: 'Parallel Push',
        negation: 'Sound is not a transverse wave.',
        analogy: 'A slinky in motion.',
        practicalApplication: 'Tissue compression.',
        activeLearningPromise: 'Master wave direction.',
        mindsetShift: 'See the pressure.',
        assessmentCTA: 'Validate your wave logic.',
        assessment: [{
          question: 'What type of wave is sound?',
          options: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Shear'],
          correctAnswer: 1,
          explanation: 'Sound requires a medium and moves via compression.',
          domain: 'Fundamentals'
        }]
      }
    ]
  }
];

export const flashcards: Flashcard[] = [
  { id: 'f1', front: 'Frequency', back: 'Cycles per second (Hz)', category: 'Fundamentals' }
];

export const artifactVault: Artifact[] = [
  {
    id: 'a1',
    name: 'Reverberation',
    description: 'Multiple reflections.',
    visualType: 'ArtifactsVisual',
    boardTrap: 'Mistaking rungs for real anatomy.',
    fix: 'Change angle of incidence.'
  }
];

export const highYieldFormulas: Formula[] = [
  {
    id: 'h1',
    name: 'Frequency',
    category: 'Fundamentals',
    formula: 'f = 1 / T',
    variables: [{ name: 'T', label: 'Period', unit: 's', min: 0.1, max: 10, step: 0.1, description: 'Time for one cycle' }],
    relationships: [{ var: 'T', type: 'inverse' }],
    calculate: (v) => 1 / v.T,
    deepDive: 'Reciprocal relationship defines the pulse.'
  }
];

export const mockExamBank: AssessmentQuestion[] = [
  {
    question: 'Define Period.',
    options: ['Time per cycle', 'Cycles per second', 'Distance per cycle', 'Speed of sound'],
    correctAnswer: 0,
    explanation: 'Period is the temporal duration of a single cycle.',
    domain: 'Fundamentals'
  }
];

export const shopItems: ShopItem[] = [
  { id: 's1', name: 'Neural Boost', type: 'booster', cost: 100, description: 'Double XP for 1 hour', icon: 'Zap' }
];

export const podcastTracks: PodcastTrack[] = [
  { id: 'p1', title: 'Acoustic Intro', artist: 'Harvey', url: '#', duration: '3:00', type: 'lecture', description: 'Intro to sound.', tags: ['Intro'] }
];
