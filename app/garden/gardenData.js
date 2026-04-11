export const EMOTION_PLANTS = {
  anxious: { name: "Lavender", bloom: "Anxious", color: "#9B8EC4", stem: "#6B8C6B", note: "Calming structure for racing thoughts." },
  "sad-low": { name: "Rain Lily", bloom: "Sad / Low", color: "#7AAFC4", stem: "#5B8C5A", note: "Small contact with light on heavy days." },
  angry: { name: "Red Sage", bloom: "Angry", color: "#C47A7A", stem: "#6B7F4A", note: "Heat that wants a boundary and a pause." },
  overwhelmed: { name: "Peace Lily", bloom: "Overwhelmed", color: "#E8E4F0", stem: "#5A7A5A", note: "Gentle order for flooded moments." },
  "shame-guilt": { name: "Camellia", bloom: "Shame / Guilt", color: "#C47A8A", stem: "#6B8C6B", note: "Softness where self-judgment usually hardens." },
  "grief-loss": { name: "White Rose", bloom: "Grief / Loss", color: "#F0ECE8", stem: "#8A8A6A", note: "A marker for love that still matters." },
  "numb-disconnected": { name: "Snow Drop", bloom: "Numb / Disconnected", color: "#E4E8EC", stem: "#7A8A6A", note: "Signals of sensation returning." },
  lonely: { name: "Forget-Me-Not", bloom: "Lonely", color: "#7AA4D4", stem: "#5A7A5A", note: "Connection cues, even when they are small." },
  "stressed-burned-out": { name: "Chamomile", bloom: "Stressed / Burned Out", color: "#F5E6A0", stem: "#6B8C5A", note: "Recovery growing beside the pressure." },
  "scared-fearful": { name: "Foxglove", bloom: "Scared / Fearful", color: "#D4A87A", stem: "#5A7A4A", note: "Orienting back toward safety." },
  "stuck-lost": { name: "Sunflower", bloom: "Stuck / Lost", color: "#E8C44A", stem: "#5B8C3A", note: "Turning back toward direction and warmth." },
  "self-destructive": { name: "Moonflower", bloom: "Self-Destructive", color: "#C4C8E4", stem: "#6A7A8A", note: "Hold on. Human support comes first." },
  sad: { name: "Rain Lily", bloom: "Sad", color: "#7AAFC4", stem: "#5B8C5A", note: "Small contact with light on heavy days." },
  grief: { name: "White Rose", bloom: "Grief", color: "#F0ECE8", stem: "#8A8A6A", note: "A marker for love that still matters." },
  numb: { name: "Snow Drop", bloom: "Numb", color: "#E4E8EC", stem: "#7A8A6A", note: "Signals of sensation returning." },
  stressed: { name: "Chamomile", bloom: "Stressed", color: "#F5E6A0", stem: "#6B8C5A", note: "Recovery growing beside the pressure." },
  "burned-out": { name: "Aloe Vera", bloom: "Burned Out", color: "#8BC48B", stem: "#5A7A4A", note: "Restorative care for depleted days." },
  "social-anxiety": { name: "Violet", bloom: "Social Anxiety", color: "#9A7AC4", stem: "#5A7A5A", note: "Bravery in small social exposures." },
  imposter: { name: "Iris", bloom: "Imposter", color: "#8A7AB4", stem: "#5A7A5A", note: "Reality checks for self-doubt." },
  relationship: { name: "Jasmine", bloom: "Relationship", color: "#F5F0E0", stem: "#5B8C5A", note: "Care, clarity, and repair." },
  "3am-spiral": { name: "Moonflower", bloom: "3AM Spiral", color: "#C4C8E4", stem: "#6A7A8A", note: "Nighttime spirals deserve gentleness." },
  fine: { name: "Daisy", bloom: "Fine", color: "#F5F0E0", stem: "#5B8C5A", note: "Quiet steadiness still counts." },
};

const GARDEN_MILESTONES = [
  { id: "first-seed", label: "First seed planted", threshold: 1, unit: "session" },
  { id: "sprout", label: "Sprouting", threshold: 3, unit: "sessions" },
  { id: "root-system", label: "Root system", threshold: 7, unit: "sessions" },
  { id: "pollinator", label: "Pollinator", threshold: 12, unit: "sessions" },
  { id: "bloom-line", label: "Bloom line", threshold: 20, unit: "sessions" },
  { id: "canopy", label: "Canopy", threshold: 35, unit: "sessions" },
];

function toTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function getDateKey(value) {
  const date = new Date(toTimestamp(value));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatRelativeDate(value) {
  const timestamp = toTimestamp(value);
  const diff = Date.now() - timestamp;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function summarizeSeason({ sessions, averageShift, streak, emotionsExplored }) {
  if (!sessions) {
    return {
      label: "Ready soil",
      description: "Your garden is ready for its first seed.",
    };
  }

  if (averageShift >= 2.5 || streak >= 7) {
    return {
      label: "Bloom season",
      description: "Your recent shifts are strong and the landscape is opening up.",
    };
  }

  if (emotionsExplored >= 4 || sessions >= 10) {
    return {
      label: "Rooting season",
      description: "Patterns are becoming visible and your garden has real structure now.",
    };
  }

  return {
    label: "Sprouting season",
    description: "Early sessions are starting to form a private map of what helps.",
  };
}

function buildSeasonStory({ totalSessions, weeklySessions, streak, topEmotion, topTechnique, averageShift, latestSession }) {
  if (!totalSessions) {
    return {
      title: "Your garden begins with one honest moment.",
      body: "Nothing grows here until you actually use a tool. The first completed session becomes the first visible seed, and from there the pattern starts to take shape.",
    };
  }

  const opening = topEmotion
    ? `${topEmotion.bloom} has been the loudest signal in your garden so far.`
    : "Your garden is starting to show a pattern.";

  const techniqueLine = topTechnique
    ? `${topTechnique.name} is the tool you've returned to most.`
    : latestSession
      ? `${latestSession.techniqueName} is your latest planted moment.`
      : "Your latest tool use is starting to leave a trace.";

  const momentumLine = streak >= 3
    ? `You are on a ${streak}-day streak, which means this is becoming a rhythm, not a fluke.`
    : weeklySessions >= 2
      ? `${weeklySessions} sessions this week is enough for the Garden to start spotting what helps.`
      : "A few more sessions will make your strongest relief patterns easier to see.";

  const shiftLine = averageShift > 0
    ? `Across your sessions, your average mood shift is ${averageShift > 0 ? "+" : ""}${averageShift}, so something here is genuinely helping.`
    : "The Garden is still collecting enough signal to tell you which tools move the needle most.";

  return {
    title: seasonTitleFromData({ streak, weeklySessions, averageShift }),
    body: `${opening} ${techniqueLine} ${momentumLine} ${shiftLine}`.trim(),
  };
}

function seasonTitleFromData({ streak, weeklySessions, averageShift }) {
  if (averageShift >= 3) return "This season looks restorative.";
  if (streak >= 5) return "Your recovery rhythm is getting real.";
  if (weeklySessions >= 3) return "The garden is learning your patterns.";
  return "A real pattern is beginning to show.";
}

export function buildGardenSnapshot({ sessions = [], moods = [], blueprints = [], streakData = { currentStreak: 0, longestStreak: 0 } }) {
  const normalizedSessions = sessions
    .map((session) => ({
      ...session,
      timestampMs: toTimestamp(session.timestamp),
      shift: typeof session.shift === "number"
        ? session.shift
        : typeof session.preRating === "number" && typeof session.postRating === "number"
          ? session.postRating - session.preRating
          : null,
      techniqueName: session.interventionName || session.techniqueUsed || session.intervention || session.pathway || "Session",
    }))
    .sort((a, b) => b.timestampMs - a.timestampMs);

  const normalizedMoods = moods
    .map((mood) => ({ ...mood, timestampMs: toTimestamp(mood.timestamp) }))
    .sort((a, b) => b.timestampMs - a.timestampMs);

  const totalSessions = normalizedSessions.length;
  const totalMoodCheckins = normalizedMoods.length;
  const uniqueEmotions = [...new Set(normalizedSessions.map((session) => session.emotion).filter(Boolean))];
  const emotionsExplored = uniqueEmotions.length;
  const sessionShifts = normalizedSessions.map((session) => session.shift).filter((value) => typeof value === "number");
  const averageShift = sessionShifts.length
    ? Math.round((sessionShifts.reduce((sum, value) => sum + value, 0) / sessionShifts.length) * 10) / 10
    : 0;
  const positiveShiftCount = sessionShifts.filter((value) => value > 0).length;
  const improvingShare = sessionShifts.length ? Math.round((positiveShiftCount / sessionShifts.length) * 100) : 0;

  const emotionCounts = {};
  const techniqueCounts = {};
  const biomeMap = new Map();

  normalizedSessions.forEach((session) => {
    if (session.emotion) {
      emotionCounts[session.emotion] = (emotionCounts[session.emotion] || 0) + 1;
      const plant = EMOTION_PLANTS[session.emotion] || EMOTION_PLANTS.fine;
      const existing = biomeMap.get(session.emotion) || {
        id: session.emotion,
        label: plant.bloom,
        plantName: plant.name,
        color: plant.color,
        stem: plant.stem,
        note: plant.note,
        sessions: 0,
        totalShift: 0,
        shiftCount: 0,
        lastTimestamp: session.timestampMs,
      };
      existing.sessions += 1;
      existing.lastTimestamp = Math.max(existing.lastTimestamp, session.timestampMs);
      if (typeof session.shift === "number") {
        existing.totalShift += session.shift;
        existing.shiftCount += 1;
      }
      biomeMap.set(session.emotion, existing);
    }

    if (session.techniqueName) {
      techniqueCounts[session.techniqueName] = (techniqueCounts[session.techniqueName] || 0) + 1;
    }
  });

  const biome = [...biomeMap.values()]
    .map((entry) => ({
      ...entry,
      averageShift: entry.shiftCount ? Math.round((entry.totalShift / entry.shiftCount) * 10) / 10 : 0,
      lastSeen: formatRelativeDate(entry.lastTimestamp),
    }))
    .sort((a, b) => b.sessions - a.sessions || b.averageShift - a.averageShift);

  const topEmotionEntry = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
  const topEmotion = topEmotionEntry
    ? {
        id: topEmotionEntry[0],
        count: topEmotionEntry[1],
        ...(EMOTION_PLANTS[topEmotionEntry[0]] || EMOTION_PLANTS.fine),
      }
    : null;

  const topTechniqueEntry = Object.entries(techniqueCounts).sort((a, b) => b[1] - a[1])[0];
  const topTechnique = topTechniqueEntry
    ? { name: topTechniqueEntry[0], count: topTechniqueEntry[1] }
    : null;

  const season = summarizeSeason({
    sessions: totalSessions,
    averageShift,
    streak: streakData.currentStreak || 0,
    emotionsExplored,
  });

  const latestSession = normalizedSessions[0] || null;
  const recentMood = normalizedMoods[0] || null;
  const latestBlueprint = blueprints[0] || null;
  const moodAverage = totalMoodCheckins
    ? Math.round((normalizedMoods.reduce((sum, mood) => sum + (mood.moodScore || 0), 0) / totalMoodCheckins) * 10) / 10
    : null;

  const weeklySessions = normalizedSessions.filter((session) => Date.now() - session.timestampMs <= 7 * 86400000).length;
  const last30Days = [...new Set(normalizedSessions.filter((session) => Date.now() - session.timestampMs <= 30 * 86400000).map((session) => getDateKey(session.timestampMs)))].length;

  const unlockedMilestones = GARDEN_MILESTONES.filter((milestone) => totalSessions >= milestone.threshold);
  const nextMilestone = GARDEN_MILESTONES.find((milestone) => totalSessions < milestone.threshold) || null;
  const recentTrail = normalizedSessions
    .slice(0, 5)
    .reverse()
    .map((session) => {
      const plant = EMOTION_PLANTS[session.emotion] || EMOTION_PLANTS.fine;
      return {
        id: session.id,
        emotion: session.emotion,
        emotionLabel: plant.bloom,
        techniqueName: session.techniqueName,
        shift: session.shift,
        timestamp: session.timestampMs,
        label: formatRelativeDate(session.timestampMs),
        color: plant.color,
        stem: plant.stem,
      };
    });
  const seasonStory = buildSeasonStory({
    totalSessions,
    weeklySessions,
    streak: streakData.currentStreak || 0,
    topEmotion,
    topTechnique,
    averageShift,
    latestSession,
  });

  return {
    totalSessions,
    totalMoodCheckins,
    emotionsExplored,
    averageShift,
    improvingShare,
    topEmotion,
    topTechnique,
    season,
    latestSession,
    latestSessionLabel: latestSession ? formatRelativeDate(latestSession.timestampMs) : null,
    recentMood,
    moodAverage,
    latestBlueprint,
    streak: streakData.currentStreak || 0,
    longestStreak: streakData.longestStreak || 0,
    weeklySessions,
    activeDays30: last30Days,
    biome,
    unlockedMilestones,
    nextMilestone,
    recentTrail,
    seasonStory,
  };
}
