export const DAILY_FEELINGS = [
  { id: "anxious", label: "Anxious" },
  { id: "low", label: "Low" },
  { id: "angry", label: "Angry" },
  { id: "overwhelmed", label: "Overwhelmed" },
  { id: "lonely", label: "Lonely" },
  { id: "numb", label: "Numb" },
  { id: "stressed", label: "Stressed" },
  { id: "grieving", label: "Grieving" },
  { id: "scared", label: "Scared" },
  { id: "stuck", label: "Stuck" },
  { id: "self_critical", label: "Self-critical" },
  { id: "okay_growth", label: "Okay, want to grow" },
];

export const DAILY_TIME_OPTIONS = [
  { id: "30s", label: "30 seconds", seconds: 30, durationBucket: "under_30s" },
  { id: "2m", label: "2 minutes", seconds: 120, durationBucket: "30s_to_2m" },
  { id: "5m", label: "5 minutes", seconds: 300, durationBucket: "2_to_5m" },
  { id: "10m", label: "10 minutes", seconds: 600, durationBucket: "5_to_10m" },
];

export const DAILY_NEEDS = [
  { id: "calm_down", label: "Calm down" },
  { id: "think_clearly", label: "Think clearly" },
  { id: "sleep", label: "Sleep" },
  { id: "start_something", label: "Start something" },
  { id: "stop_spiraling", label: "Stop spiraling" },
  { id: "reach_out", label: "Reach out" },
  { id: "make_decision", label: "Make a decision" },
];

const TOOL_BY_FEELING = {
  anxious: ["physiological-sigh", "A two-minute breath reset", "Use the double inhale and long exhale to give your body a steadier rhythm."],
  low: ["behavioral-activation", "A tiny action starter", "Pick one small action that creates a little movement before waiting for motivation."],
  angry: ["rage-spiral", "A heat-to-clarity pause", "Give the charge somewhere safe to go before choosing what to say or do next."],
  overwhelmed: ["54321-grounding", "A sensory grounding reset", "Name what is here now so your attention has less to carry at once."],
  lonely: ["social-exhaustion", "A small connection bridge", "Choose one low-pressure reach-out that does not ask you to perform being okay."],
  numb: ["body-scan", "A body-noticing reset", "Track simple sensations without forcing a feeling to appear."],
  stressed: ["progressive-muscle-relaxation", "A tension release reset", "Tense and release one area at a time so pressure has an exit ramp."],
  grieving: ["grief-wave", "A grief wave practice", "Make room for the wave without turning it into a problem you have to solve."],
  scared: ["54321-grounding", "A here-and-now anchor", "Let your senses help your body notice the room you are actually in."],
  stuck: ["decision-paralysis", "A next-step chooser", "Shrink the decision until one workable next move is visible."],
  self_critical: ["self-compassion-break", "A kinder inner voice reset", "Name the pain, remember common humanity, and choose one gentler sentence."],
  okay_growth: ["values-clarification", "A values check", "Use a good moment to choose what you want to keep practicing."],
};

const NEED_OVERRIDES = {
  sleep: ["body-scan", "A sleep wind-down scan", "Move attention through the body slowly and lower the pressure to fall asleep."],
  stop_spiraling: ["thought-defusion", "A thought defusion reset", "Practice seeing the thought as a thought instead of an instruction."],
  think_clearly: ["cognitive-restructuring", "A facts-versus-story check", "Separate what happened, what your mind predicts, and what you can do next."],
  start_something: ["behavioral-activation", "A five-minute start", "Choose an action so small it can begin before motivation shows up."],
  reach_out: ["social-exhaustion", "A low-pressure reach-out", "Send one specific, gentle line to someone safe enough."],
  make_decision: ["decision-paralysis", "A decision-lightener", "Name the smallest reversible choice and the cost of waiting."],
};

const FALLBACK_TOOLS = [
  ["box-breathing", "Box breathing", "A steady inhale-hold-exhale-hold rhythm for a calmer next minute."],
  ["54321-grounding", "5-4-3-2-1 grounding", "A simple senses-based reset when everything feels like too much."],
  ["thought-defusion", "Thought defusion", "A quick way to unhook from a sticky thought without arguing with it."],
];

export function getDailyCalmDrop(date = new Date()) {
  const drops = [
    "Unclench your jaw, drop your shoulders, and lengthen one exhale.",
    "Name one thing you can postpone without abandoning it.",
    "Put both feet on the floor and find three straight lines in the room.",
    "Ask: what is the next kind thing, not the perfect thing?",
    "Make your next action smaller than your resistance.",
    "Send one no-pressure check-in to someone safe enough.",
    "Let the feeling be data for one minute, not a verdict.",
  ];
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  return drops[Math.abs(day) % drops.length];
}

export function buildDailyPlan({ feeling = "anxious", time = "2m", need = "calm_down" } = {}) {
  const primarySource = NEED_OVERRIDES[need] || TOOL_BY_FEELING[feeling] || TOOL_BY_FEELING.anxious;
  const backupSource = FALLBACK_TOOLS.find(([slug]) => slug !== primarySource[0]) || FALLBACK_TOOLS[0];
  const timeOption = DAILY_TIME_OPTIONS.find((option) => option.id === time) || DAILY_TIME_OPTIONS[1];

  const primary = {
    slug: primarySource[0],
    title: primarySource[1],
    body: primarySource[2],
    href: `/techniques/${primarySource[0]}`,
    durationLabel: timeOption.label,
  };

  const backup = {
    slug: backupSource[0],
    title: backupSource[1],
    body: backupSource[2],
    href: `/techniques/${backupSource[0]}`,
    durationLabel: timeOption.label,
  };

  return {
    feeling,
    time,
    need,
    durationBucket: timeOption.durationBucket,
    seconds: timeOption.seconds,
    primary,
    backup,
  };
}
