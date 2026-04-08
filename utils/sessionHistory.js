/**
 * Session History Utility
 * Manages mood measurement sessions in localStorage
 * Foundation for personalization and analytics
 */

const STORAGE_KEY = 'aiforj_sessions';

// Generate a simple UUID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save a session to localStorage
export function saveSession(sessionData) {
  try {
    const sessions = getSessions();
    const newSession = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...sessionData,
    };
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return newSession.id;
  } catch (error) {
    console.warn('Failed to save session:', error);
    return null;
  }
}

// Get all sessions
export function getSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Failed to get sessions:', error);
    return [];
  }
}

// Get sessions filtered by emotion
export function getSessionsByEmotion(emotion) {
  return getSessions().filter(session => session.emotion === emotion);
}

// Calculate average mood shift across all sessions
export function getAverageShift() {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;

  const shifts = sessions.map(s => s.shift || 0);
  return Math.round((shifts.reduce((a, b) => a + b, 0) / shifts.length) * 10) / 10;
}

// Calculate consecutive days with at least one session
export function getStreakDays() {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;

  // Sort by date descending
  const sortedSessions = sessions
    .map(s => new Date(s.timestamp).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));

  // Remove duplicates
  const uniqueDates = [...new Set(sortedSessions)];

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Check if today or yesterday has a session
  if (uniqueDates.includes(today)) {
    streak = 1;
  } else if (uniqueDates.includes(yesterday)) {
    streak = 1;
  }

  // Count consecutive days backwards from the most recent
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);
    const diffTime = Math.abs(current - next);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Find the most effective technique (highest average shift)
export function getMostEffectiveTechnique() {
  const sessions = getSessions();
  if (sessions.length === 0) return null;

  const techniqueShifts = {};

  sessions.forEach(session => {
    const technique = session.intervention;
    if (!techniqueShifts[technique]) {
      techniqueShifts[technique] = { total: 0, count: 0, name: session.interventionName };
    }
    techniqueShifts[technique].total += session.shift || 0;
    techniqueShifts[technique].count += 1;
  });

  let bestTechnique = null;
  let bestAverage = -Infinity;

  Object.entries(techniqueShifts).forEach(([technique, data]) => {
    const average = data.total / data.count;
    if (average > bestAverage) {
      bestAverage = average;
      bestTechnique = {
        id: technique,
        name: data.name,
        averageShift: Math.round(average * 10) / 10,
      };
    }
  });

  return bestTechnique;
}

// Get total number of sessions
export function getTotalSessions() {
  return getSessions().length;
}

// Clear all sessions (for testing/debugging)
export function clearSessions() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear sessions:', error);
  }
}
