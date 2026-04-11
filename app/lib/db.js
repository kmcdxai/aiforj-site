"use client";

/*
  AIForj IndexedDB Data Layer
  ALL data lives exclusively on-device. Nothing is ever sent to any server.
  Stores: sessions, moodCheckins, blueprints, streaks, preferences
*/

const DB_NAME = "aiforj";
const DB_VERSION = 2;

const STORES = {
  sessions: "sessions",         // { id, timestamp, emotion, pathway, duration, completedSteps, techniqueUsed }
  moodCheckins: "moodCheckins", // { id, timestamp, moodScore (1-5), note }
  blueprints: "blueprints",     // { id, timestamp, archetype, dimensionScores }
  streaks: "streaks",           // { key, lastSessionDate, currentStreak, longestStreak }
  preferences: "preferences",  // { key, value } — darkMode, soundEnabled, name
  weeklyInsights: "weeklyInsights", // { id, timestamp, title, insight, meta }
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains(STORES.sessions)) {
        const s = db.createObjectStore(STORES.sessions, { keyPath: "id" });
        s.createIndex("timestamp", "timestamp");
        s.createIndex("emotion", "emotion");
      }

      if (!db.objectStoreNames.contains(STORES.moodCheckins)) {
        const m = db.createObjectStore(STORES.moodCheckins, { keyPath: "id" });
        m.createIndex("timestamp", "timestamp");
      }

      if (!db.objectStoreNames.contains(STORES.blueprints)) {
        const b = db.createObjectStore(STORES.blueprints, { keyPath: "id" });
        b.createIndex("timestamp", "timestamp");
      }

      if (!db.objectStoreNames.contains(STORES.streaks)) {
        db.createObjectStore(STORES.streaks, { keyPath: "key" });
      }

      if (!db.objectStoreNames.contains(STORES.preferences)) {
        db.createObjectStore(STORES.preferences, { keyPath: "key" });
      }
      
          if (!db.objectStoreNames.contains(STORES.weeklyInsights)) {
            const w = db.createObjectStore(STORES.weeklyInsights, { keyPath: "id" });
            w.createIndex("timestamp", "timestamp");
          }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function toDateKey(value) {
  const date = new Date(typeof value === "number" ? value : toTimestamp(value));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ── Generic CRUD ──

async function put(storeName, record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(record);
    tx.oncomplete = () => resolve(record);
    tx.onerror = () => reject(tx.error);
  });
}

async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function get(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const request = tx.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function remove(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function clearStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── Sessions ──

export async function saveSession({
  id,
  legacySessionId,
  emotion,
  pathway,
  timePreference,
  duration,
  completedSteps,
  techniqueUsed,
  intervention,
  interventionName,
  preRating,
  postRating,
  shift,
  intensity,
  source,
  timestamp,
}) {
  const record = {
    id: id || generateId(),
    legacySessionId: legacySessionId || null,
    timestamp: toTimestamp(timestamp),
    emotion,
    pathway: pathway || timePreference || null,
    timePreference: timePreference || pathway || null,
    duration: duration ?? null,
    completedSteps: completedSteps ?? null,
    techniqueUsed: techniqueUsed || interventionName || intervention || null,
    intervention: intervention || null,
    interventionName: interventionName || techniqueUsed || null,
    preRating: preRating ?? null,
    postRating: postRating ?? null,
    shift: shift ?? (typeof preRating === "number" && typeof postRating === "number" ? postRating - preRating : null),
    intensity: intensity ?? null,
    source: source || "app",
  };
  await put(STORES.sessions, record);
  await recomputeStreak();
  return record;
}

export async function getSessions() {
  const sessions = await getAll(STORES.sessions);
  return sessions.sort((a, b) => b.timestamp - a.timestamp);
}

// ── Mood Check-ins ──

export async function saveMoodCheckin({ moodScore, note }) {
  const record = {
    id: generateId(),
    timestamp: Date.now(),
    moodScore,
    note: note || null,
  };
  return put(STORES.moodCheckins, record);
}

export async function getMoodCheckins() {
  const checkins = await getAll(STORES.moodCheckins);
  return checkins.sort((a, b) => b.timestamp - a.timestamp);
}

// ── Blueprints ──

export async function saveBlueprint({ archetype, dimensionScores }) {
  const record = {
    id: generateId(),
    timestamp: Date.now(),
    archetype,
    dimensionScores,
  };
  return put(STORES.blueprints, record);
}

export async function getBlueprints() {
  const blueprints = await getAll(STORES.blueprints);
  return blueprints.sort((a, b) => b.timestamp - a.timestamp);
}

// ── Weekly Insights ──
export async function saveWeeklyInsight({ title, insight, meta }) {
  const record = {
    id: generateId(),
    timestamp: Date.now(),
    title: title || "Weekly Insight",
    insight,
    meta: meta || {},
  };
  return put(STORES.weeklyInsights, record);
}

export async function getWeeklyInsights() {
  const items = await getAll(STORES.weeklyInsights);
  return items.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getLatestWeeklyInsight() {
  const all = await getWeeklyInsights();
  return all.length ? all[0] : null;
}

// ── Streaks ──

async function recomputeStreak() {
  const sessions = await getAll(STORES.sessions);
  if (!sessions.length) {
    return put(STORES.streaks, {
      key: "main",
      lastSessionDate: null,
      currentStreak: 0,
      longestStreak: 0,
    });
  }

  const uniqueDates = [...new Set(sessions.map((session) => toDateKey(session.timestamp)))].sort();
  const latestDate = uniqueDates[uniqueDates.length - 1];

  let longestStreak = 1;
  let runningLongest = 1;
  for (let index = 1; index < uniqueDates.length; index += 1) {
    const prev = new Date(`${uniqueDates[index - 1]}T00:00:00`);
    const current = new Date(`${uniqueDates[index]}T00:00:00`);
    const diffDays = Math.round((current - prev) / 86400000);
    if (diffDays === 1) {
      runningLongest += 1;
      longestStreak = Math.max(longestStreak, runningLongest);
    } else {
      runningLongest = 1;
    }
  }

  const today = toDateKey(Date.now());
  const yesterday = toDateKey(Date.now() - 86400000);
  let currentStreak = 0;

  if (latestDate === today || latestDate === yesterday) {
    currentStreak = 1;
    for (let index = uniqueDates.length - 1; index > 0; index -= 1) {
      const current = new Date(`${uniqueDates[index]}T00:00:00`);
      const prev = new Date(`${uniqueDates[index - 1]}T00:00:00`);
      const diffDays = Math.round((current - prev) / 86400000);
      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return put(STORES.streaks, {
    key: "main",
    lastSessionDate: latestDate,
    currentStreak,
    longestStreak,
  });
}

export async function getStreak() {
  const streak = await get(STORES.streaks, "main");
  return streak || { currentStreak: 0, longestStreak: 0, lastSessionDate: null };
}

// ── Preferences ──

export async function setPreference(key, value) {
  return put(STORES.preferences, { key, value });
}

export async function getPreference(key) {
  const record = await get(STORES.preferences, key);
  return record ? record.value : null;
}

export async function getAllPreferences() {
  const prefs = await getAll(STORES.preferences);
  return Object.fromEntries(prefs.map((p) => [p.key, p.value]));
}

// ── Export & Delete ──

export async function exportAllData() {
  const [sessions, moodCheckins, blueprints, streaks, preferences, weeklyInsights] = await Promise.all([
    getAll(STORES.sessions),
    getAll(STORES.moodCheckins),
    getAll(STORES.blueprints),
    getAll(STORES.streaks),
    getAll(STORES.preferences),
    getAll(STORES.weeklyInsights),
  ]);

  return {
    exportDate: new Date().toISOString(),
    version: DB_VERSION,
    data: { sessions, moodCheckins, blueprints, streaks, preferences, weeklyInsights },
  };
}

export async function syncLegacyLocalSessions() {
  if (typeof window === "undefined") {
    return { imported: 0, total: 0 };
  }

  let legacySessions = [];
  try {
    legacySessions = JSON.parse(localStorage.getItem("aiforj_sessions") || "[]");
  } catch {
    legacySessions = [];
  }

  if (!Array.isArray(legacySessions) || legacySessions.length === 0) {
    return { imported: 0, total: 0 };
  }

  const existing = await getAll(STORES.sessions);
  const existingLegacyIds = new Set(existing.map((session) => session.legacySessionId).filter(Boolean));
  let imported = 0;

  for (const legacy of legacySessions) {
    const legacyId = legacy?.id || `${legacy?.timestamp || "unknown"}-${legacy?.intervention || legacy?.interventionName || "session"}`;
    if (existingLegacyIds.has(legacyId)) continue;

    await saveSession({
      id: `legacy-${legacyId}`,
      legacySessionId: legacyId,
      timestamp: legacy?.timestamp,
      emotion: legacy?.emotion || "unknown",
      pathway: legacy?.timePreference || legacy?.pathway || null,
      timePreference: legacy?.timePreference || legacy?.pathway || null,
      duration: legacy?.duration ?? null,
      completedSteps: legacy?.completedSteps ?? null,
      techniqueUsed: legacy?.interventionName || legacy?.techniqueUsed || legacy?.intervention || null,
      intervention: legacy?.intervention || null,
      interventionName: legacy?.interventionName || null,
      preRating: legacy?.preRating ?? null,
      postRating: legacy?.postRating ?? null,
      shift: legacy?.shift ?? null,
      intensity: legacy?.intensity ?? null,
      source: "legacy-session-history",
    });
    imported += 1;
  }

  return { imported, total: legacySessions.length };
}

export async function deleteAllData() {
  await Promise.all(
    Object.values(STORES).map((store) => clearStore(store))
  );
}
