const DAILY_KEY = "aiforj_daily_progress_v1";

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayDiff(a, b) {
  const first = new Date(`${a}T00:00:00`);
  const second = new Date(`${b}T00:00:00`);
  return Math.round((second - first) / 86400000);
}

export function loadDailyProgress() {
  if (typeof window === "undefined") {
    return { completions: [], currentStreak: 0, longestStreak: 0, comebackCount: 0, challenges: {} };
  }

  return {
    completions: [],
    currentStreak: 0,
    longestStreak: 0,
    comebackCount: 0,
    challenges: {},
    ...safeParse(window.localStorage.getItem(DAILY_KEY), {}),
  };
}

export function saveDailyProgress(progress) {
  if (typeof window === "undefined") return progress;
  window.localStorage.setItem(DAILY_KEY, JSON.stringify(progress));
  return progress;
}

export function recordDailyCompletion(entry = {}, date = new Date()) {
  const today = getTodayKey(date);
  const progress = loadDailyProgress();
  const completions = progress.completions || [];
  const alreadyToday = completions.some((item) => item.date === today);
  const previousDate = completions.length ? completions[completions.length - 1].date : null;
  const gap = previousDate ? dayDiff(previousDate, today) : 0;
  const currentStreak = alreadyToday
    ? progress.currentStreak || 1
    : gap === 1
      ? (progress.currentStreak || 0) + 1
      : 1;
  const comebackCount = !alreadyToday && previousDate && gap > 1
    ? (progress.comebackCount || 0) + 1
    : progress.comebackCount || 0;

  const next = {
    ...progress,
    completions: alreadyToday
      ? completions.map((item) => item.date === today ? { ...item, ...entry, date: today, completedAt: Date.now() } : item)
      : [...completions, { ...entry, date: today, completedAt: Date.now() }].slice(-120),
    currentStreak,
    longestStreak: Math.max(progress.longestStreak || 0, currentStreak),
    comebackCount,
    lastCompletedDate: today,
  };

  return saveDailyProgress(next);
}

export function recordChallengeDay(challengeSlug, date = new Date()) {
  const today = getTodayKey(date);
  const progress = loadDailyProgress();
  const current = progress.challenges?.[challengeSlug] || { completedDates: [] };
  if (current.completedDates.includes(today)) return { progress, dayNumber: current.completedDates.length, alreadyCompleted: true };

  const nextDates = [...current.completedDates, today].slice(0, 7);
  const next = {
    ...progress,
    challenges: {
      ...(progress.challenges || {}),
      [challengeSlug]: {
        completedDates: nextDates,
        updatedAt: Date.now(),
      },
    },
  };
  saveDailyProgress(next);
  return { progress: next, dayNumber: nextDates.length, alreadyCompleted: false };
}
