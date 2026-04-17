export const ANONYMOUS_METRIC_EVENTS = new Set([
  "tool_started",
  "tool_completed",
]);

export const DURATION_BUCKETS = new Set([
  "under_2m",
  "2_to_5m",
  "5_to_10m",
  "10m_plus",
]);

export const SHIFT_BUCKETS = new Set([
  "down_3_or_more",
  "down_1_to_2",
  "flat",
  "up_1_to_2",
  "up_3_or_more",
]);

export function sanitizeMetricToken(value, maxLength = 80) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, maxLength);

  return normalized || null;
}

export function bucketDurationSeconds(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  if (seconds < 120) return "under_2m";
  if (seconds < 300) return "2_to_5m";
  if (seconds < 600) return "5_to_10m";
  return "10m_plus";
}

export function bucketMoodShift(value) {
  const shift = Number(value);
  if (!Number.isFinite(shift)) return null;
  if (shift <= -3) return "down_3_or_more";
  if (shift <= -1) return "down_1_to_2";
  if (shift < 1) return "flat";
  if (shift < 3) return "up_1_to_2";
  return "up_3_or_more";
}
