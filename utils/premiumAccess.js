"use client";

const PREMIUM_KEY = "aiforj_premium";
const TIER_KEY = "forj_tier";
const GIFT_LENGTH_DAYS = 30;

function canUseBrowserApis() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJSON(key) {
  if (!canUseBrowserApis()) return null;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  if (!canUseBrowserApis()) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function createGiftPremiumState({ sessionId, redeemedAt = Date.now(), expiresAt = null }) {
  const issuedAt = Number.isFinite(redeemedAt) ? redeemedAt : Date.now();
  return {
    active: true,
    source: "gift",
    sessionId,
    grantedAt: new Date(issuedAt).toISOString(),
    expiresAt:
      expiresAt ||
      new Date(issuedAt + GIFT_LENGTH_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function createSubscriptionPremiumState() {
  return {
    active: true,
    source: "subscription",
    grantedAt: new Date().toISOString(),
    expiresAt: null,
  };
}

export function createFamilyPremiumState({ sessionId, seatCode, grantedAt = Date.now() }) {
  const issuedAt = Number.isFinite(grantedAt) ? grantedAt : Date.now();
  return {
    active: true,
    source: "family",
    sessionId,
    seatCode,
    grantedAt: new Date(issuedAt).toISOString(),
    expiresAt: null,
  };
}

export function getStoredPremiumState() {
  const stored = readJSON(PREMIUM_KEY);

  if (stored === true) {
    return null;
  }

  if (stored && typeof stored === "object") {
    return stored;
  }

  return null;
}

export function isPremiumStateActive(state) {
  if (!state) return false;
  if (state === true) return false;
  if (state.active !== true) return false;
  if (["subscription", "premium", "clinician", "organization"].includes(state.source) && (!state.activationToken || !state.expiresAt)) return false;
  if (!state.expiresAt) return state.source === "family";

  const expiry = Date.parse(state.expiresAt);
  if (!Number.isFinite(expiry)) return false;
  return expiry > Date.now();
}

export function clearPremiumAccess() {
  if (!canUseBrowserApis()) return;

  try {
    localStorage.removeItem(PREMIUM_KEY);
    localStorage.removeItem(TIER_KEY);
  } catch {}
}

export function persistPremiumState(state, { tier = "premium" } = {}) {
  writeJSON(PREMIUM_KEY, state);
  writeJSON(TIER_KEY, tier);
  return state;
}

export function activateSubscriptionPremium() {
  return persistPremiumState(createSubscriptionPremiumState(), { tier: "premium" });
}

export function activateGiftPremium({ sessionId, expiresAt = null }) {
  return persistPremiumState(
    createGiftPremiumState({ sessionId, expiresAt }),
    { tier: "premium" }
  );
}

export function activateFamilyPremium({ sessionId, seatCode }) {
  return persistPremiumState(
    createFamilyPremiumState({ sessionId, seatCode }),
    { tier: "premium" }
  );
}

export function getPremiumAccessStatus() {
  const state = getStoredPremiumState();

  if (!state) {
    return { active: false, tier: readJSON(TIER_KEY), source: null, expiresAt: null };
  }

  if (!isPremiumStateActive(state)) {
    return { active: false, tier: null, source: state.source || null, expiresAt: state.expiresAt || null };
  }

  return {
    active: true,
    tier: readJSON(TIER_KEY) || "premium",
    source: state.source || "subscription",
    expiresAt: state.expiresAt || null,
    grantedAt: state.grantedAt || null,
  };
}


// Refresh only payment entitlement; no journal, mood, or companion content is sent.
export async function refreshPremiumAccess() {
  const state = getStoredPremiumState();
  if (!state?.activationToken) return getPremiumAccessStatus();
  if (state.active && Date.parse(state.expiresAt) > Date.now() + 60_000) return getPremiumAccessStatus();
  try {
    const response = await fetch('/api/stripe/redeem-activation', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: state.activationToken }),
    });
    if (response.ok) {
      const data = await response.json();
      persistPremiumState({ ...state, active: true, expiresAt: data.expiresAt });
    } else if (response.status === 400 || response.status === 403) {
      persistPremiumState({ ...state, active: false });
    }
  } catch { /* A brief outage may use only the remaining verified lease. */ }
  return getPremiumAccessStatus();
}
