import {
  DURATION_BUCKETS,
  METRIC_EVENT_SET,
  MOOD_SHIFT_BUCKETS,
  bucketDurationSeconds,
  bucketMoodShift,
  sanitizeMetricToken,
} from "./metricsSchema.mjs";

export const ANONYMOUS_METRIC_EVENTS = METRIC_EVENT_SET;
export { DURATION_BUCKETS };
export const SHIFT_BUCKETS = MOOD_SHIFT_BUCKETS;
export { bucketDurationSeconds, bucketMoodShift, sanitizeMetricToken };
