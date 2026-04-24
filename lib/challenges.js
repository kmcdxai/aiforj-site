export const CHALLENGES = [
  {
    slug: "anxiety-reset",
    title: "7-Day Anxiety Reset",
    color: "#6B9B9E",
    days: [
      "One physiological sigh round",
      "Name the worry story",
      "Ground through five senses",
      "Schedule worry time",
      "Try one tiny exposure",
      "Make a calming cue",
      "Choose tomorrow's backup reset",
    ],
  },
  {
    slug: "sleep-wind-down",
    title: "7-Day Sleep Wind-Down",
    color: "#8B7DA8",
    days: [
      "Two-minute body scan",
      "Park tomorrow's tasks",
      "Dim one input",
      "Loosen jaw and shoulders",
      "Write a gentle closing line",
      "Repeat a steady breath",
      "Build a simple night routine",
    ],
  },
  {
    slug: "burnout-recovery",
    title: "7-Day Burnout Recovery",
    color: "#C4956A",
    days: [
      "Name one drain",
      "Name one recovery cue",
      "Drop one nonessential task",
      "Take a micro-break",
      "Ask for one concrete support",
      "Protect a small boundary",
      "Choose a sustainable next step",
    ],
  },
  {
    slug: "self-worth-rebuild",
    title: "7-Day Self-Worth Rebuild",
    color: "#C47A7A",
    days: [
      "Spot the inner critic",
      "Use a kinder label",
      "Name one effort",
      "Write a common-humanity line",
      "Choose one value action",
      "Remember one repair",
      "Keep one sentence worth returning to",
    ],
  },
  {
    slug: "overthinking-reset",
    title: "7-Day Overthinking Reset",
    color: "#7D9B82",
    days: [
      "Label the loop",
      "Separate facts from predictions",
      "Choose a decision timer",
      "Write the next tiny action",
      "Practice defusion",
      "Make a good-enough choice",
      "Close the loop kindly",
    ],
  },
];

export function getChallengeBySlug(slug) {
  return CHALLENGES.find((challenge) => challenge.slug === slug) || CHALLENGES[0];
}

export function getChallengeDay(challengeSlug, completedCount = 0) {
  const challenge = getChallengeBySlug(challengeSlug);
  const dayIndex = Math.min(Math.max(Number(completedCount) || 0, 0), challenge.days.length - 1);
  return {
    challenge,
    dayNumber: dayIndex + 1,
    prompt: challenge.days[dayIndex],
    isMilestone: [1, 3, 7].includes(dayIndex + 1),
  };
}
