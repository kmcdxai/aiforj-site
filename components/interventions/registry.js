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

// Phase 2 — Angry
const TIPPSkills = dynamic(() => import('./TIPPSkills'), { ssr: false });
const AngerIceberg = dynamic(() => import('./AngerIceberg'), { ssr: false });
const StopSkill = dynamic(() => import('./StopSkill'), { ssr: false });
const DearManScript = dynamic(() => import('./DearManScript'), { ssr: false });
const AngerCognitiveReframe = dynamic(() => import('./AngerCognitiveReframe'), { ssr: false });
const AngerValuesCheck = dynamic(() => import('./AngerValuesCheck'), { ssr: false });
const AngerSurfing = dynamic(() => import('./AngerSurfing'), { ssr: false });
const UnsentLetter = dynamic(() => import('./UnsentLetter'), { ssr: false });
const BoundaryPlanning = dynamic(() => import('./BoundaryPlanning'), { ssr: false });
const PerspectiveTaking = dynamic(() => import('./PerspectiveTaking'), { ssr: false });
const ForgivenessReadiness = dynamic(() => import('./ForgivenessReadiness'), { ssr: false });

// Phase 2 — Overwhelmed
const TheOneThing = dynamic(() => import('./TheOneThing'), { ssr: false });
const ContainerVisualization = dynamic(() => import('./ContainerVisualization'), { ssr: false });
const WindowOfTolerance = dynamic(() => import('./WindowOfTolerance'), { ssr: false });
const BrainDumpTriage = dynamic(() => import('./BrainDumpTriage'), { ssr: false });
const CopingAhead = dynamic(() => import('./CopingAhead'), { ssr: false });
const SensoryReset = dynamic(() => import('./SensoryReset'), { ssr: false });
const RadicalAcceptance = dynamic(() => import('./RadicalAcceptance'), { ssr: false });
const LifeAudit = dynamic(() => import('./LifeAudit'), { ssr: false });
const BurnoutRecovery = dynamic(() => import('./BurnoutRecovery'), { ssr: false });
const EnergyBudget = dynamic(() => import('./EnergyBudget'), { ssr: false });
const BoundaryInventoryOverwhelm = dynamic(() => import('./BoundaryInventoryOverwhelm'), { ssr: false });

// Phase 2 — Shame / Guilt
const ShameGuiltClarifier = dynamic(() => import('./ShameGuiltClarifier'), { ssr: false });
const DefusionSelfLabel = dynamic(() => import('./DefusionSelfLabel'), { ssr: false });
const CommonHumanity = dynamic(() => import('./CommonHumanity'), { ssr: false });
const CompassionateLetter = dynamic(() => import('./CompassionateLetter'), { ssr: false });
const ShameResilience = dynamic(() => import('./ShameResilience'), { ssr: false });
const GuiltRepair = dynamic(() => import('./GuiltRepair'), { ssr: false });
const InnerCriticCoach = dynamic(() => import('./InnerCriticCoach'), { ssr: false });
const ShameOriginMapping = dynamic(() => import('./ShameOriginMapping'), { ssr: false });
const SelfCompassionFull = dynamic(() => import('./SelfCompassionFull'), { ssr: false });
const ImposterDeconstruction = dynamic(() => import('./ImposterDeconstruction'), { ssr: false });

// Phase 2 — Grief / Loss
const GriefWave = dynamic(() => import('./GriefWave'), { ssr: false });
const ContinuingBonds = dynamic(() => import('./ContinuingBonds'), { ssr: false });
const DualProcess = dynamic(() => import('./DualProcess'), { ssr: false });
const MemoryJournal = dynamic(() => import('./MemoryJournal'), { ssr: false });
const LetterToLost = dynamic(() => import('./LetterToLost'), { ssr: false });
const GriefRights = dynamic(() => import('./GriefRights'), { ssr: false });
const MeaningReconstruction = dynamic(() => import('./MeaningReconstruction'), { ssr: false });
const LivingLegacy = dynamic(() => import('./LivingLegacy'), { ssr: false });
const AnniversaryPlanning = dynamic(() => import('./AnniversaryPlanning'), { ssr: false });
const IdentityAfterLoss = dynamic(() => import('./IdentityAfterLoss'), { ssr: false });

// Phase 2 — Numb / Disconnected
const SensoryActivation = dynamic(() => import('./SensoryActivation'), { ssr: false });
const MicroMovement = dynamic(() => import('./MicroMovement'), { ssr: false });
const EmotionalInventory = dynamic(() => import('./EmotionalInventory'), { ssr: false });
const SomaticTracking = dynamic(() => import('./SomaticTracking'), { ssr: false });
const SafePlace = dynamic(() => import('./SafePlace'), { ssr: false });
const EmotionalPriming = dynamic(() => import('./EmotionalPriming'), { ssr: false });
const PartsWorkShutdown = dynamic(() => import('./PartsWorkShutdown'), { ssr: false });
const ReEngagementPlan = dynamic(() => import('./ReEngagementPlan'), { ssr: false });

// Phase 2 — Lonely
const MicroConnection = dynamic(() => import('./MicroConnection'), { ssr: false });
const CommonHumanityMeditation = dynamic(() => import('./CommonHumanityMeditation'), { ssr: false });
const LonelinessThoughtCheck = dynamic(() => import('./LonelinessThoughtCheck'), { ssr: false });
const ConnectionInventory = dynamic(() => import('./ConnectionInventory'), { ssr: false });
const SocialSkillsLesson = dynamic(() => import('./SocialSkillsLesson'), { ssr: false });
const AttachmentExplorer = dynamic(() => import('./AttachmentExplorer'), { ssr: false });
const BelongingPlan = dynamic(() => import('./BelongingPlan'), { ssr: false });
const DigitalAudit = dynamic(() => import('./DigitalAudit'), { ssr: false });

// Phase 2 — Stressed / Burned Out
const TwoMinuteVacation = dynamic(() => import('./TwoMinuteVacation'), { ssr: false });
const PmrExpress = dynamic(() => import('./PmrExpress'), { ssr: false });
const StressInoculation = dynamic(() => import('./StressInoculation'), { ssr: false });
const StressSignature = dynamic(() => import('./StressSignature'), { ssr: false });
const MicroRecovery = dynamic(() => import('./MicroRecovery'), { ssr: false });
const DemandResourceAudit = dynamic(() => import('./DemandResourceAudit'), { ssr: false });
const BurnoutAssessment = dynamic(() => import('./BurnoutAssessment'), { ssr: false });
const ShouldAudit = dynamic(() => import('./ShouldAudit'), { ssr: false });
const StrategicRest = dynamic(() => import('./StrategicRest'), { ssr: false });
const NonNegotiables = dynamic(() => import('./NonNegotiables'), { ssr: false });

// Phase 2 — Scared / Fearful
const OrientingResponse = dynamic(() => import('./OrientingResponse'), { ssr: false });
const FearLadderPlacement = dynamic(() => import('./FearLadderPlacement'), { ssr: false });
const SafetyAnchor = dynamic(() => import('./SafetyAnchor'), { ssr: false });
const FearFactCheck = dynamic(() => import('./FearFactCheck'), { ssr: false });
const NervousSystemEducation = dynamic(() => import('./NervousSystemEducation'), { ssr: false });
const ExposureHierarchy = dynamic(() => import('./ExposureHierarchy'), { ssr: false });
const SafetyPlanProtocol = dynamic(() => import('./SafetyPlanProtocol'), { ssr: false });
const ResilienceLog = dynamic(() => import('./ResilienceLog'), { ssr: false });

// Phase 2 — Stuck / Lost
const MiracleQuestion = dynamic(() => import('./MiracleQuestion'), { ssr: false });
const ValuesSparkCheck = dynamic(() => import('./ValuesSparkCheck'), { ssr: false });
const LifeSatisfactionWheel = dynamic(() => import('./LifeSatisfactionWheel'), { ssr: false });
const DecisionalBalance = dynamic(() => import('./DecisionalBalance'), { ssr: false });
const ExperimentDesigner = dynamic(() => import('./ExperimentDesigner'), { ssr: false });
const EulogyExercise = dynamic(() => import('./EulogyExercise'), { ssr: false });
const FearSetting = dynamic(() => import('./FearSetting'), { ssr: false });
const FutureSelf = dynamic(() => import('./FutureSelf'), { ssr: false });

// Phase 2 — Self-Destructive
const UrgeSurfing = dynamic(() => import('./UrgeSurfing'), { ssr: false });
const ProsConsMoment = dynamic(() => import('./ProsConsMoment'), { ssr: false });
const DelayDistract = dynamic(() => import('./DelayDistract'), { ssr: false });
const TriggerChainAnalysis = dynamic(() => import('./TriggerChainAnalysis'), { ssr: false });
const ValuesVsUrges = dynamic(() => import('./ValuesVsUrges'), { ssr: false });
const AlternativeBehavior = dynamic(() => import('./AlternativeBehavior'), { ssr: false });
const RelapsePrevention = dynamic(() => import('./RelapsePrevention'), { ssr: false });
const SelfSabotageMapper = dynamic(() => import('./SelfSabotageMapper'), { ssr: false });
const FutureImpact = dynamic(() => import('./FutureImpact'), { ssr: false });

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

  // Phase 2 — Angry
  'tipp-skills': TIPPSkills,
  'anger-iceberg': AngerIceberg,
  'stop-skill': StopSkill,
  'dear-man-script': DearManScript,
  'anger-cognitive-reframe': AngerCognitiveReframe,
  'anger-values-check': AngerValuesCheck,
  'anger-surfing': AngerSurfing,
  'unsent-letter': UnsentLetter,
  'boundary-planning': BoundaryPlanning,
  'perspective-taking': PerspectiveTaking,
  'forgiveness-readiness': ForgivenessReadiness,

  // Phase 2 — Overwhelmed
  'the-one-thing': TheOneThing,
  'container-visualization': ContainerVisualization,
  'window-of-tolerance': WindowOfTolerance,
  'brain-dump-triage': BrainDumpTriage,
  'coping-ahead': CopingAhead,
  'sensory-reset': SensoryReset,
  'radical-acceptance': RadicalAcceptance,
  'life-audit': LifeAudit,
  'burnout-recovery': BurnoutRecovery,
  'energy-budget': EnergyBudget,
  'boundary-inventory-overwhelm': BoundaryInventoryOverwhelm,

  // Phase 2 — Shame / Guilt
  'shame-guilt-clarifier': ShameGuiltClarifier,
  'defusion-self-label': DefusionSelfLabel,
  'common-humanity': CommonHumanity,
  'compassionate-letter': CompassionateLetter,
  'shame-resilience': ShameResilience,
  'guilt-repair': GuiltRepair,
  'inner-critic-coach': InnerCriticCoach,
  'shame-origin-mapping': ShameOriginMapping,
  'self-compassion-full': SelfCompassionFull,
  'imposter-deconstruction': ImposterDeconstruction,

  // Phase 2 — Grief / Loss
  'grief-wave': GriefWave,
  'continuing-bonds': ContinuingBonds,
  'dual-process': DualProcess,
  'memory-journal': MemoryJournal,
  'letter-to-lost': LetterToLost,
  'grief-rights': GriefRights,
  'meaning-reconstruction': MeaningReconstruction,
  'living-legacy': LivingLegacy,
  'anniversary-planning': AnniversaryPlanning,
  'identity-after-loss': IdentityAfterLoss,

  // Phase 2 — Numb / Disconnected
  'sensory-activation': SensoryActivation,
  'micro-movement': MicroMovement,
  'emotional-inventory': EmotionalInventory,
  'somatic-tracking': SomaticTracking,
  'safe-place': SafePlace,
  'emotional-priming': EmotionalPriming,
  'parts-work-shutdown': PartsWorkShutdown,
  're-engagement-plan': ReEngagementPlan,

  // Phase 2 — Lonely
  'micro-connection': MicroConnection,
  'common-humanity-meditation': CommonHumanityMeditation,
  'loneliness-thought-check': LonelinessThoughtCheck,
  'connection-inventory': ConnectionInventory,
  'social-skills-lesson': SocialSkillsLesson,
  'attachment-explorer': AttachmentExplorer,
  'belonging-plan': BelongingPlan,
  'digital-audit': DigitalAudit,

  // Phase 2 — Stressed / Burned Out
  'two-min-vacation': TwoMinuteVacation,
  'pmr-express': PmrExpress,
  'stress-inoculation': StressInoculation,
  'stress-signature': StressSignature,
  'micro-recovery': MicroRecovery,
  'demand-resource-audit': DemandResourceAudit,
  'burnout-assessment': BurnoutAssessment,
  'should-audit': ShouldAudit,
  'strategic-rest': StrategicRest,
  'non-negotiables': NonNegotiables,

  // Phase 2 — Scared / Fearful
  'orienting-response': OrientingResponse,
  'fear-ladder-placement': FearLadderPlacement,
  'safety-anchor': SafetyAnchor,
  'fear-fact-check': FearFactCheck,
  'nervous-system-education': NervousSystemEducation,
  'exposure-hierarchy': ExposureHierarchy,
  'safety-plan-protocol': SafetyPlanProtocol,
  'resilience-log': ResilienceLog,

  // Phase 2 — Stuck / Lost
  'miracle-question': MiracleQuestion,
  'values-spark-check': ValuesSparkCheck,
  'life-satisfaction-wheel': LifeSatisfactionWheel,
  'decisional-balance': DecisionalBalance,
  'experiment-designer': ExperimentDesigner,
  'eulogy-exercise': EulogyExercise,
  'fear-setting': FearSetting,
  'future-self': FutureSelf,

  // Phase 2 — Self-Destructive
  'urge-surfing': UrgeSurfing,
  'pros-cons-moment': ProsConsMoment,
  'delay-distract': DelayDistract,
  'trigger-chain-analysis': TriggerChainAnalysis,
  'values-vs-urges': ValuesVsUrges,
  'alternative-behavior': AlternativeBehavior,
  'relapse-prevention': RelapsePrevention,
  'self-sabotage-mapper': SelfSabotageMapper,
  'future-impact': FutureImpact,

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
  TIPPSkills,
  AngerIceberg,
  StopSkill,
  DearManScript,
  AngerCognitiveReframe,
  AngerValuesCheck,
  AngerSurfing,
  UnsentLetter,
  BoundaryPlanning,
  PerspectiveTaking,
  ForgivenessReadiness,
  TheOneThing,
  ContainerVisualization,
  WindowOfTolerance,
  BrainDumpTriage,
  CopingAhead,
  SensoryReset,
  RadicalAcceptance,
  LifeAudit,
  BurnoutRecovery,
  EnergyBudget,
  BoundaryInventoryOverwhelm,
  ShameGuiltClarifier,
  DefusionSelfLabel,
  CommonHumanity,
  CompassionateLetter,
  ShameResilience,
  GuiltRepair,
  InnerCriticCoach,
  ShameOriginMapping,
  SelfCompassionFull,
  ImposterDeconstruction,
  GriefWave,
  ContinuingBonds,
  DualProcess,
  MemoryJournal,
  LetterToLost,
  GriefRights,
  MeaningReconstruction,
  LivingLegacy,
  AnniversaryPlanning,
  IdentityAfterLoss,
  SensoryActivation,
  MicroMovement,
  EmotionalInventory,
  SomaticTracking,
  SafePlace,
  EmotionalPriming,
  PartsWorkShutdown,
  ReEngagementPlan,
  MicroConnection,
  CommonHumanityMeditation,
  LonelinessThoughtCheck,
  ConnectionInventory,
  SocialSkillsLesson,
  AttachmentExplorer,
  BelongingPlan,
  DigitalAudit,
  TwoMinuteVacation,
  PmrExpress,
  StressInoculation,
  StressSignature,
  MicroRecovery,
  DemandResourceAudit,
  BurnoutAssessment,
  ShouldAudit,
  StrategicRest,
  NonNegotiables,
  OrientingResponse,
  FearLadderPlacement,
  SafetyAnchor,
  FearFactCheck,
  NervousSystemEducation,
  ExposureHierarchy,
  SafetyPlanProtocol,
  ResilienceLog,
  MiracleQuestion,
  ValuesSparkCheck,
  LifeSatisfactionWheel,
  DecisionalBalance,
  ExperimentDesigner,
  EulogyExercise,
  FearSetting,
  FutureSelf,
  UrgeSurfing,
  ProsConsMoment,
  DelayDistract,
  TriggerChainAnalysis,
  ValuesVsUrges,
  AlternativeBehavior,
  RelapsePrevention,
  SelfSabotageMapper,
  FutureImpact,
};
