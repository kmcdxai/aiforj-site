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

export async function saveSession({ emotion, pathway, duration, completedSteps, techniqueUsed }) {
  const record = {
    id: generateId(),
    timestamp: Date.now(),
    emotion,
    pathway,
    duration,
    completedSteps,
    techniqueUsed,
  };
  await put(STORES.sessions, record);
  await updateStreak();
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

async function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const existing = await get(STORES.streaks, "main");

  if (!existing) {
    return put(STORES.streaks, {
      key: "main",
      lastSessionDate: today,
      currentStreak: 1,
      longestStreak: 1,
    });
  }

  const lastDate = existing.lastSessionDate;
  if (lastDate === today) return existing; // already counted today

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = lastDate === yesterday ? existing.currentStreak + 1 : 1;
  const longest = Math.max(newStreak, existing.longestStreak);

  return put(STORES.streaks, {
    key: "main",
    lastSessionDate: today,
    currentStreak: newStreak,
    longestStreak: longest,
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
  const [sessions, moodCheckins, blueprints, streaks, preferences] = await Promise.all([
    getAll(STORES.sessions),
    getAll(STORES.moodCheckins),
    getAll(STORES.blueprints),
    getAll(STORES.streaks),
    getAll(STORES.preferences),
  ]);

  return {
    exportDate: new Date().toISOString(),
    version: DB_VERSION,
    data: { sessions, moodCheckins, blueprints, streaks, preferences },
  };
}

export async function deleteAllData() {
  await Promise.all(
    Object.values(STORES).map((store) => clearStore(store))
  );
}
