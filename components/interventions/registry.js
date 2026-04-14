"use client";

import dynamic from 'next/dynamic';

// Phase 1 — Anxious Quick
const SensoryGrounding = dynamic(() => import('./SensoryGrounding'), { ssr: false });
const PhysiologicalSigh = dynamic(() => import('./PhysiologicalSigh'), { ssr: false });
const NameTheStory = dynamic(() => import('./NameTheStory'), { ssr: false });

// Phase 2 — Anxious Medium
const WorryDecisionTree = dynamic(() => import('./WorryDecisionTree'), { ssr: false });
const ThoughtRecordLite = dynamic(() => import('./ThoughtRecordLite'), { ssr: false });
const AnxietyBodyMap = dynamic(() => import('./AnxietyBodyMap'), { ssr: false });
const Decatastrophizing = dynamic(() => import('./Decatastrophizing'), { ssr: false });
const SafetyBehaviorsExperiment = dynamic(() => import('./SafetyBehaviorsExperiment'), { ssr: false });

// Phase 2 — Anxious Deep
const FullCognitiveRestructuring = dynamic(() => import('./FullCognitiveRestructuring'), { ssr: false });
const WorryPostponement = dynamic(() => import('./WorryPostponement'), { ssr: false });
const ValuesBasedAction = dynamic(() => import('./ValuesBasedAction'), { ssr: false });
const AnxietyPatternMapper = dynamic(() => import('./AnxietyPatternMapper'), { ssr: false });

// Phase 2 — Sad/Low Quick
const BAMicroTask = dynamic(() => import('./BAMicroTask'), { ssr: false });
const SelfCompassionBreak = dynamic(() => import('./SelfCompassionBreak'), { ssr: false });
const OppositeActionSad = dynamic(() => import('./OppositeActionSad'), { ssr: false });
const GratitudeReframe = dynamic(() => import('./GratitudeReframe'), { ssr: false });

// Phase 2 — Sad/Low Medium
const PleasantActivityMenu = dynamic(() => import('./PleasantActivityMenu'), { ssr: false });
const EmotionalValidation = dynamic(() => import('./EmotionalValidation'), { ssr: false });
const MoodBehaviorTracker = dynamic(() => import('./MoodBehaviorTracker'), { ssr: false });
const ConnectionPrompt = dynamic(() => import('./ConnectionPrompt'), { ssr: false });

// Phase 2 — Sad/Low Deep
const DepressionThoughtRecord = dynamic(() => import('./DepressionThoughtRecord'), { ssr: false });
const MeaningMakingJournal = dynamic(() => import('./MeaningMakingJournal'), { ssr: false });
const BAFullPlanner = dynamic(() => import('./BAFullPlanner'), { ssr: false });
const ValuesCompass = dynamic(() => import('./ValuesCompass'), { ssr: false });

// Maps technique slugs to custom interactive intervention components.
// If a slug is listed here, InterventionClient renders the custom component
// instead of the generic TechniqueClient step-based renderer.
export const interventionComponents = {
  // Phase 1 — Anxious Quick
  '54321-grounding': SensoryGrounding,
  'physiological-sigh': PhysiologicalSigh,
  'thought-defusion': NameTheStory,
  'grounding-54321': SensoryGrounding,
  'name-the-story': NameTheStory,

  // Phase 2 — Anxious Medium
  'worry-decision-tree': WorryDecisionTree,
  'thought-record-lite': ThoughtRecordLite,
  'anxiety-body-map': AnxietyBodyMap,
  'decatastrophizing': Decatastrophizing,
  'safety-behaviors-experiment': SafetyBehaviorsExperiment,

  // Phase 2 — Anxious Deep
  'full-cognitive-restructuring': FullCognitiveRestructuring,
  'worry-postponement': WorryPostponement,
  'values-based-action': ValuesBasedAction,
  'anxiety-pattern-mapper': AnxietyPatternMapper,

  // Phase 2 — Sad/Low Quick
  'ba-micro-task': BAMicroTask,
  'self-compassion-break': SelfCompassionBreak,
  'opposite-action-sad': OppositeActionSad,
  'gratitude-reframe': GratitudeReframe,

  // Phase 2 — Sad/Low Medium
  'pleasant-activity-menu': PleasantActivityMenu,
  'emotional-validation': EmotionalValidation,
  'mood-behavior-tracker': MoodBehaviorTracker,
  'connection-prompt': ConnectionPrompt,

  // Phase 2 — Sad/Low Deep
  'depression-thought-record': DepressionThoughtRecord,
  'meaning-making-journal': MeaningMakingJournal,
  'ba-full-planner': BAFullPlanner,
  'values-compass': ValuesCompass,

  // Named exports for component field lookups
  SensoryGrounding,
  PhysiologicalSigh,
  NameTheStory,
  WorryDecisionTree,
  ThoughtRecordLite,
  AnxietyBodyMap,
  Decatastrophizing,
  SafetyBehaviorsExperiment,
  FullCognitiveRestructuring,
  WorryPostponement,
  ValuesBasedAction,
  AnxietyPatternMapper,
  BAMicroTask,
  SelfCompassionBreak,
  OppositeActionSad,
  GratitudeReframe,
  PleasantActivityMenu,
  EmotionalValidation,
  MoodBehaviorTracker,
  ConnectionPrompt,
  DepressionThoughtRecord,
  MeaningMakingJournal,
  BAFullPlanner,
  ValuesCompass,
};
