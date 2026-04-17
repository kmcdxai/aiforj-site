"use client";

import {
  bucketDurationSeconds,
  bucketMoodShift,
  sanitizeMetricToken,
} from "../lib/anonymousMetricsShared";

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

function getEphemeralClientId() {
  if (!canUseBrowserApis()) return null;

  const now = Date.now();
  const existing = readStoredClientState();

  if (
    existing?.id &&
    Number.isFinite(existing.createdAt) &&
    now - existing.createdAt < ROTATION_MS
  ) {
    return existing.id;
  }

  const next = {
    id: generateClientId(),
    createdAt: now,
  };
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
    window.dispatchEvent(
      new CustomEvent(CONSENT_EVENT, {
        detail: { enabled: next },
      })
    );
  } catch {}

  return next;
}

export function subscribeToAnonymousMetricsConsent(callback) {
  if (typeof window === "undefined") return () => {};

  const handler = (event) => callback(Boolean(event?.detail?.enabled));
  window.addEventListener(CONSENT_EVENT, handler);

  return () => {
    window.removeEventListener(CONSENT_EVENT, handler);
  };
}

function buildMetricPayload({
  event,
  toolKind,
  toolId,
  emotion = null,
  source = null,
  durationSeconds = null,
  shift = null,
}) {
  const sanitizedEvent = sanitizeMetricToken(event, 32);
  const sanitizedKind = sanitizeMetricToken(toolKind, 24);
  const sanitizedToolId = sanitizeMetricToken(toolId, 80);

  if (!sanitizedEvent || !sanitizedKind || !sanitizedToolId) {
    return null;
  }

  return {
    event: sanitizedEvent,
    toolKind: sanitizedKind,
    toolId: sanitizedToolId,
    emotion: sanitizeMetricToken(emotion, 40),
    source: sanitizeMetricToken(source, 40),
    durationBucket: bucketDurationSeconds(durationSeconds),
    shiftBucket: bucketMoodShift(shift),
    clientId: getEphemeralClientId(),
  };
}

export function trackAnonymousMetric(input) {
  if (!getAnonymousMetricsConsent()) return false;

  const payload = buildMetricPayload(input);
  if (!payload?.clientId) return false;

  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      return navigator.sendBeacon("/api/anonymous-metrics", blob);
    }

    fetch("/api/anonymous-metrics", {
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
