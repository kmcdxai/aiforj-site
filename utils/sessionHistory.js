import { getAllInterventions } from '../data/interventions';

/**
 * Session History Utility
 * Manages mood measurement sessions in localStorage
 * Foundation for personalization and analytics
 */

const STORAGE_KEY = 'aiforj_sessions';
const MS_IN_HOUR = 1000 * 60 * 60;

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

function roundToOne(value) {
  return Math.round(value * 10) / 10;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toTimestamp(value) {
  if (typeof value === 'number') return value;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function createAggregate() {
  return {
    count: 0,
    totalShift: 0,
  };
}

function updateAggregate(aggregate, shift) {
  aggregate.count += 1;
  aggregate.totalShift += shift;
}

function getAverageShiftForAggregate(aggregate) {
  if (!aggregate?.count) return 0;
  return aggregate.totalShift / aggregate.count;
}

function getRecencyPenalty(lastUsedTs) {
  if (!lastUsedTs) return 0;
  const ageInHours = (Date.now() - lastUsedTs) / MS_IN_HOUR;

  if (ageInHours < 24) return 2.1;
  if (ageInHours < 72) return 1.0;
  if (ageInHours < 168) return 0.35;
  return 0;
}

function formatShift(value) {
  const rounded = roundToOne(Math.abs(value));
  return `${value >= 0 ? '+' : '-'}${rounded}`;
}

export function getMeasuredSessions(sourceSessions = null) {
  const sessions = Array.isArray(sourceSessions) ? sourceSessions : getSessions();

  return sessions
    .filter((session) => session && session.intervention && Number.isFinite(Number(session.shift)))
    .map((session) => ({
      ...session,
      shift: Number(session.shift),
      preRating: Number.isFinite(Number(session.preRating)) ? Number(session.preRating) : null,
      postRating: Number.isFinite(Number(session.postRating)) ? Number(session.postRating) : null,
      intensity: Number.isFinite(Number(session.intensity)) ? Number(session.intensity) : null,
      timestampMs: toTimestamp(session.timestamp),
      timePreference: session.timePreference || session.tier || null,
    }))
    .filter((session) => session.timestampMs > 0)
    .sort((a, b) => a.timestampMs - b.timestampMs);
}

export function getToolStats(sourceSessions = null) {
  const sessions = getMeasuredSessions(sourceSessions);
  const stats = new Map();

  sessions.forEach((session) => {
    const existing = stats.get(session.intervention) || {
      id: session.intervention,
      name: session.interventionName || session.intervention,
      count: 0,
      totalShift: 0,
      lastUsedTs: 0,
      byEmotion: {},
      byTimePreference: {},
    };

    existing.count += 1;
    existing.totalShift += session.shift;
    existing.lastUsedTs = Math.max(existing.lastUsedTs, session.timestampMs);

    if (session.emotion) {
      existing.byEmotion[session.emotion] = existing.byEmotion[session.emotion] || createAggregate();
      updateAggregate(existing.byEmotion[session.emotion], session.shift);
    }

    if (session.timePreference) {
      existing.byTimePreference[session.timePreference] = existing.byTimePreference[session.timePreference] || createAggregate();
      updateAggregate(existing.byTimePreference[session.timePreference], session.shift);
    }

    stats.set(session.intervention, existing);
  });

  return stats;
}

export function rankInterventions(candidates = [], options = {}) {
  const {
    sessions = null,
    emotionId = null,
    timePreference = null,
    limit = candidates.length,
  } = options;

  const measuredSessions = getMeasuredSessions(sessions);
  const toolStats = getToolStats(measuredSessions);

  return candidates
    .map((candidate, index) => {
      const stats = toolStats.get(candidate.id);
      const overallAverageShift = roundToOne(getAverageShiftForAggregate(stats));
      const emotionStats = emotionId ? stats?.byEmotion?.[emotionId] : null;
      const emotionAverageShift = roundToOne(getAverageShiftForAggregate(emotionStats));
      const timeStats = timePreference ? stats?.byTimePreference?.[timePreference] : null;
      const timeAverageShift = roundToOne(getAverageShiftForAggregate(timeStats));

      let score = Math.max(0.35, 3 - index * 0.3);

      if (stats?.count) {
        score += clamp(overallAverageShift * 1.35, -1.5, 4.5);
        score += Math.min(1.1, stats.count * 0.18);
      } else {
        score += 0.15;
      }

      if (emotionStats?.count) {
        score += clamp(emotionAverageShift * 1.1, -0.8, 2.5) + 0.45;
      }

      if (timeStats?.count) {
        score += clamp(timeAverageShift * 0.65, -0.5, 1.25) + 0.2;
      }

      score -= getRecencyPenalty(stats?.lastUsedTs);

      let recommendationReason = null;
      let recommendationKind = 'match';

      if (emotionStats?.count && emotionAverageShift > 0) {
        recommendationReason = `Because it helped before for ${candidate.emotionLabel?.toLowerCase() || 'this feeling'}`;
        recommendationKind = 'history';
      } else if (stats?.count && overallAverageShift > 0) {
        recommendationReason = `Because it averaged ${formatShift(overallAverageShift)} for you`;
        recommendationKind = 'history';
      } else if (emotionId && timePreference) {
        recommendationReason = `Strong fit for ${timePreference} support right now`;
      } else if (emotionId) {
        recommendationReason = `Strong fit for ${candidate.emotionLabel?.toLowerCase() || 'your recent pattern'}`;
      } else {
        recommendationReason = 'Based on what has helped on this device';
      }

      return {
        ...candidate,
        recommendationScore: roundToOne(score),
        recommendationReason,
        recommendationKind,
        recommendationStats: {
          useCount: stats?.count || 0,
          averageShift: overallAverageShift,
          emotionUseCount: emotionStats?.count || 0,
          emotionAverageShift,
          timeUseCount: timeStats?.count || 0,
          timeAverageShift,
          lastUsedTs: stats?.lastUsedTs || null,
        },
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
}

export function getForYouRecommendations(options = {}) {
  const { sessions = null, limit = 3 } = options;
  const measuredSessions = getMeasuredSessions(sessions);

  if (!measuredSessions.length) return [];

  const recentSession = measuredSessions[measuredSessions.length - 1];
  const candidates = getAllInterventions();

  return rankInterventions(candidates, {
    sessions: measuredSessions,
    emotionId: recentSession.emotion || null,
    timePreference: recentSession.timePreference || null,
    limit,
  });
}
