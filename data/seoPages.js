const reviewed = "April 23, 2026";

const baseFeelingTools = {
  anxious: ["physiological-sigh", "54321-grounding", "thought-defusion"],
  sad: ["behavioral-activation", "self-compassion-break", "values-clarification"],
  angry: ["rage-spiral", "box-breathing", "thought-defusion"],
  overwhelmed: ["54321-grounding", "overwhelmed-at-work", "progressive-muscle-relaxation"],
  lonely: ["social-exhaustion", "self-compassion-break", "values-clarification"],
  numb: ["body-scan", "54321-grounding", "behavioral-activation"],
  stressed: ["progressive-muscle-relaxation", "box-breathing", "worry-time"],
  scared: ["54321-grounding", "physiological-sigh", "thought-defusion"],
  stuck: ["decision-paralysis", "values-clarification", "behavioral-activation"],
  "shame-guilt": ["self-compassion-break", "thought-defusion", "values-clarification"],
  "grief-loss": ["grief-wave", "self-compassion-break", "body-scan"],
  "self-destructive": ["54321-grounding", "physiological-sigh", "self-compassion-break"],
};

export const FEELING_PAGES = [
  ["anxious", "Anxious", "A fast reset for racing thoughts, worry, and body tension.", "Anxiety can make predictions feel like facts. This page offers short self-guided tools to slow the loop and come back to the next doable step."],
  ["sad", "Sad", "Gentle support for low, heavy, or tearful moments.", "Sadness often needs kindness before problem-solving. These tools help you move gently without pretending the feeling is not real."],
  ["angry", "Angry", "A pause for anger before it becomes a reaction you regret.", "Anger can be useful information and still need a safe container. Start with a body reset, then choose what the anger is protecting."],
  ["overwhelmed", "Overwhelmed", "A reset for when everything is too much at once.", "Overwhelm means your demands feel bigger than your current capacity. The goal is not to solve everything; it is to find one next foothold."],
  ["lonely", "Lonely", "A small bridge back toward connection.", "Loneliness is a human signal, not a personal failure. These tools focus on low-pressure connection and self-kindness."],
  ["numb", "Numb", "A gentle way back into sensation and choice.", "Numbness can show up when the nervous system is overloaded. Start with noticing, not forcing yourself to feel."],
  ["stressed", "Stressed", "A pressure-release reset for tense, overloaded days.", "Stress often lives in the gap between demand and capacity. These tools help reduce activation and sort what is actually controllable."],
  ["scared", "Scared", "Grounding for fear and threat-brain moments.", "Fear narrows attention. A here-and-now reset can help your body notice the room you are in before you decide what comes next."],
  ["stuck", "Stuck", "A next-step reset when you cannot choose.", "Feeling stuck usually gets worse when the decision is too large. These tools shrink the next move until it becomes workable."],
  ["shame-guilt", "Shame and guilt", "A gentler reset for self-blame and regret.", "Guilt can point to repair. Shame usually attacks your whole self. These tools help separate the two without dismissing accountability."],
  ["grief-loss", "Grief and loss", "Support for waves of missing, mourning, and change.", "Grief is not a problem to fix. These tools make room for the wave and help you stay connected to what matters."],
  ["self-destructive", "Self-destructive urges", "A safety-first page for urges to disappear, hurt yourself, or not be here.", "If you might act on an urge or cannot stay safe, use immediate human support now: call or text 988 in the U.S., text HOME to 741741, contact emergency services, or reach a trusted person who can stay with you."],
].map(([slug, title, description, intro]) => ({
  slug,
  title,
  description,
  intro,
  reviewed,
  tools: baseFeelingTools[slug] || ["54321-grounding", "physiological-sigh", "thought-defusion"],
  kind: "feelings",
}));

const momentTools = {
  "3am-spiral": ["body-scan", "thought-defusion", "box-breathing"],
  "panic-attack-help": ["physiological-sigh", "54321-grounding", "box-breathing"],
  "sunday-night-dread": ["worry-time", "values-clarification", "progressive-muscle-relaxation"],
  "cant-sleep": ["body-scan", "box-breathing", "thought-defusion"],
  "social-media-comparison": ["comparison-trap", "self-compassion-break", "values-clarification"],
  overthinking: ["thought-defusion", "worry-time", "cognitive-restructuring"],
  "burnout-recovery": ["progressive-muscle-relaxation", "values-clarification", "behavioral-activation"],
  "relationship-pain": ["thought-defusion", "self-compassion-break", "values-clarification"],
  "work-overwhelm": ["overwhelmed-at-work", "decision-paralysis", "box-breathing"],
  "morning-anxiety": ["morning-dread", "physiological-sigh", "54321-grounding"],
  "rejection-sensitivity": ["rejection-sensitivity", "self-compassion-break", "thought-defusion"],
  "day-after-breakdown": ["self-compassion-break", "body-scan", "behavioral-activation"],
};

export const MOMENT_PAGES = [
  ["3am-spiral", "3AM spiral", "A quiet reset for middle-of-the-night rumination.", "At 3AM, the brain often treats thoughts like emergencies. Start by lowering activation, then decide what can wait for daylight."],
  ["panic-attack-help", "Panic attack help", "A self-guided grounding page for panic sensations.", "Panic can feel dangerous even when the body is riding a stress wave. These tools focus on breathing, grounding, and immediate steadiness."],
  ["sunday-night-dread", "Sunday night dread", "A reset for the pressure before the week starts.", "Sunday dread often mixes future tasks with body tension. Separate the next real step from the whole imagined week."],
  ["cant-sleep", "Can't sleep", "A gentle wind-down when your mind will not stop.", "The goal is not to force sleep. It is to reduce pressure and give your body a safer rhythm to follow."],
  ["social-media-comparison", "Social media comparison", "A reset for the moment someone else's life makes yours feel smaller.", "Comparison narrows the frame. These tools help you return to values, context, and self-respect."],
  ["overthinking", "Overthinking", "A reset for repetitive thoughts that will not resolve.", "Overthinking feels productive because it is busy. The work is to unhook from the loop and choose the next useful action."],
  ["burnout-recovery", "Burnout recovery", "A small recovery step when you are depleted.", "Burnout is not solved by one productivity trick. Start with capacity, boundaries, and one sustainable next step."],
  ["relationship-pain", "Relationship pain", "A reset for conflict, longing, rejection, or rupture.", "Relationship pain hits deep needs for safety and belonging. Slow the reaction before choosing what to say."],
  ["work-overwhelm", "Work overwhelm", "A triage reset for too many tasks and not enough capacity.", "Work overwhelm needs sorting more than self-blame. Pull the load out of your head and choose one concrete action."],
  ["morning-anxiety", "Morning anxiety", "A reset for waking up already tense.", "Morning anxiety can make the day feel decided before it starts. Give your body a calmer first signal."],
  ["rejection-sensitivity", "Rejection sensitivity", "A reset for the sting of feeling unwanted or dismissed.", "Rejection pain can turn one cue into a whole identity story. These tools help separate the event from the verdict."],
  ["day-after-breakdown", "The day after a breakdown", "A soft landing for the morning after falling apart.", "After an intense emotional night, the goal is repair, hydration, softness, and one small stabilizing action."],
].map(([slug, title, description, intro]) => ({
  slug,
  title,
  description,
  intro,
  reviewed,
  tools: momentTools[slug] || ["54321-grounding", "physiological-sigh", "thought-defusion"],
  kind: "moments",
}));

export function getSeoPage(kind, slug) {
  const source = kind === "feelings" ? FEELING_PAGES : MOMENT_PAGES;
  return source.find((page) => page.slug === slug) || null;
}
