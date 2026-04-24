"use client";

import {
  bucketDurationSeconds,
  bucketMoodShift,
  normalizeAcquisitionSource,
  normalizeEmotionCategory,
  normalizeRouteGroup,
  sanitizeMetricToken,
  validateMetricPayload,
} from "./metricsSchema.mjs";
import { FEATURE_FLAGS } from "./featureFlags";

const CONSENT_KEY = "aiforj_anonymous_metrics_opt_in";
const CLIENT_KEY = "aiforj_anonymous_metrics_client";
const ROTATION_MS = 1000 * 60 * 60 * 24 * 7;
const CONSENT_EVENT = "aiforj-anonymous-metrics-consent-change";

function canUseBrowserApis() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function generateClientId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStoredClientState() {
  if (!canUseBrowserApis()) return null;
  try {
    const raw = localStorage.getItem(CLIENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredClientState(state) {
  if (!canUseBrowserApis()) return;
  try {
    localStorage.setItem(CLIENT_KEY, JSON.stringify(state));
  } catch {}
}

function getRotatingClientId() {
  if (!canUseBrowserApis()) return null;
  const now = Date.now();
  const existing = readStoredClientState();

  if (existing?.id && Number.isFinite(existing.createdAt) && now - existing.createdAt < ROTATION_MS) {
    return existing.id;
  }

  const next = { id: generateClientId(), createdAt: now };
  writeStoredClientState(next);
  return next.id;
}

export function getAnonymousMetricsConsent() {
  if (!canUseBrowserApis()) return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAnonymousMetricsConsent(enabled) {
  if (!canUseBrowserApis()) return false;
  const next = Boolean(enabled);

  try {
    localStorage.setItem(CONSENT_KEY, next ? "true" : "false");
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { enabled: next } }));
  } catch {}

  return next;
}

export function subscribeToAnonymousMetricsConsent(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = (event) => callback(Boolean(event?.detail?.enabled));
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

function sendMetric(payload) {
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      return navigator.sendBeacon("/api/metrics", new Blob([body], { type: "application/json" }));
    }

    fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export function buildSafeMetric(input = {}) {
  const event = sanitizeMetricToken(input.event, 48);
  const routeGroup = input.routeGroup || (canUseBrowserApis() ? normalizeRouteGroup(window.location.pathname) : null);
  const acquisitionSource = normalizeAcquisitionSource(
    input.acquisitionSource || input.source,
    canUseBrowserApis() ? document.referrer : ""
  );

  const payload = {
    event,
    acquisitionSource,
  };

  if (routeGroup) payload.routeGroup = routeGroup;
  if (input.toolKind) payload.toolKind = input.toolKind;
  if (input.toolSlug || input.toolId) payload.toolSlug = input.toolSlug || input.toolId;
  if (input.emotionCategory || input.emotion) payload.emotionCategory = normalizeEmotionCategory(input.emotionCategory || input.emotion);
  if (input.durationBucket) payload.durationBucket = input.durationBucket;
  if (input.durationSeconds != null) payload.durationBucket = bucketDurationSeconds(input.durationSeconds);
  if (input.moodShiftBucket) payload.moodShiftBucket = input.moodShiftBucket;
  if (input.shift != null) payload.moodShiftBucket = bucketMoodShift(input.shift);
  if (input.planType) payload.planType = input.planType;
  if (input.cardType) payload.cardType = input.cardType;
  if (input.archetype) payload.archetype = input.archetype;

  const allowSensitive = getAnonymousMetricsConsent();
  const validation = validateMetricPayload(payload, { allowSensitive });
  if (!validation.ok) return null;

  if (validation.definition.sensitive) {
    validation.sanitized.clientId = getRotatingClientId();
    const secondPass = validateMetricPayload(validation.sanitized, { allowSensitive: true });
    if (!secondPass.ok) return null;
    return secondPass.sanitized;
  }

  return validation.sanitized;
}

export function trackSafeMetric(input = {}) {
  if (!FEATURE_FLAGS.privacyMetrics) return false;
  const payload = buildSafeMetric(input);
  if (!payload) return false;
  return sendMetric(payload);
}

export function trackPageView(route = null, source = null) {
  if (!FEATURE_FLAGS.privacyMetrics || !canUseBrowserApis()) return false;
  return trackSafeMetric({
    event: "page_view",
    routeGroup: route || window.location.pathname,
    acquisitionSource: source || undefined,
  });
}
