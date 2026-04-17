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
    return createSubscriptionPremiumState();
  }

  if (stored && typeof stored === "object") {
    return stored;
  }

  return null;
}

export function isPremiumStateActive(state) {
  if (!state) return false;
  if (state === true) return true;
  if (state.active === false) return false;
  if (!state.expiresAt) return true;

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
    clearPremiumAccess();
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
