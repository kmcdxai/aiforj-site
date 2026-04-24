"use client";

export {
  getAnonymousMetricsConsent,
  setAnonymousMetricsConsent,
  subscribeToAnonymousMetricsConsent,
  trackSafeMetric as trackAnonymousMetric,
} from "../lib/metrics";
