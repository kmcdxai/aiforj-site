const VERSION = 1;

export const SHARE_CARD_TYPES = new Set([
  "technique",
  "blueprint",
  "garden",
  "challenge",
  "send_calm",
]);

const ARCHETYPES = new Set([
  "sentinel",
  "empath",
  "architect",
  "phoenix",
  "storm",
  "ghost",
]);

function base64UrlEncode(input) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }
  return btoa(unescape(encodeURIComponent(input)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input) {
  const normalized = String(input || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }
  return decodeURIComponent(escape(atob(padded)));
}

function isPotentiallySensitiveShareText(value = "") {
  return /\b(suicid|self[-\s]?harm|kill myself|hurt myself|hurt someone|crisis|diagnos|medication|prescription|dose|therapy|therapist|psychiatrist|provider search|journal|transcript)\b/i.test(String(value || ""));
}

export function cleanShareTokenText(value = "", maxLength = 96) {
  const cleaned = String(value || "")
    .replace(/[<>{}[\]\\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

  return isPotentiallySensitiveShareText(cleaned) ? "" : cleaned;
}

function cleanToken(value = "", maxLength = 80) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);
}

export function sanitizeSharePayload(input = {}) {
  const type = cleanToken(input.type || input.cardType || "technique", 32);
  if (!SHARE_CARD_TYPES.has(type)) {
    throw new Error("Unsupported share card type");
  }

  const payload = {
    v: VERSION,
    type,
    ref: cleanToken(input.ref || input.referral || "shared_card", 32) || "shared_card",
  };

  const toolSlug = cleanToken(input.toolSlug || input.slug || "", 80);
  if (toolSlug) payload.toolSlug = toolSlug;

  const archetype = cleanToken(input.archetype || "", 32);
  if (archetype && ARCHETYPES.has(archetype)) payload.archetype = archetype;

  const sender = cleanShareTokenText(input.sender || input.senderName || "", 28);
  if (sender) payload.sender = sender;

  const message = cleanShareTokenText(input.message || "", 96);
  if (message) payload.message = message;

  const milestone = cleanToken(input.milestone || "", 24);
  if (milestone) payload.milestone = milestone;

  return payload;
}

export function createShareToken(input = {}) {
  const payload = sanitizeSharePayload(input);
  return base64UrlEncode(JSON.stringify(payload));
}

export function parseShareToken(token = "") {
  try {
    if (!token || String(token).length > 1200) return null;
    const parsed = JSON.parse(base64UrlDecode(String(token)));
    if (parsed?.v !== VERSION) return null;
    return sanitizeSharePayload(parsed);
  } catch {
    return null;
  }
}

export function getShareCardView(payload = {}) {
  const safe = sanitizeSharePayload(payload);

  const base = {
    eyebrow: "AIForj Calm Card",
    title: "A small reset, no pressure",
    body: "Self-guided emotional first aid for the next few minutes.",
    cta: "Open the reset",
    path: "/start",
    cardType: safe.type,
    color: "#7D9B82",
  };

  if (safe.type === "technique") {
    return {
      ...base,
      eyebrow: "2-minute reset",
      title: "A reset for racing thoughts",
      body: safe.message || "I found this useful for slowing down.",
      cta: "Try the reset",
      path: safe.toolSlug ? `/techniques/${safe.toolSlug}` : "/start",
      color: "#6B9B9E",
    };
  }

  if (safe.type === "blueprint") {
    const label = safe.archetype
      ? safe.archetype.charAt(0).toUpperCase() + safe.archetype.slice(1)
      : "Stress Style";
    return {
      ...base,
      eyebrow: "Emotional Blueprint",
      title: `My stress style: ${label}`,
      body: "A reflection pattern, not a diagnosis.",
      cta: "Take the blueprint",
      path: "/blueprint",
      color: "#8B7DA8",
    };
  }

  if (safe.type === "garden") {
    return {
      ...base,
      eyebrow: "Mood Garden",
      title: "I planted a calm bloom today",
      body: "A private progress ritual, shared without the private details.",
      cta: "Plant your first bloom",
      path: "/today",
      color: "#7D9B82",
    };
  }

  if (safe.type === "challenge") {
    return {
      ...base,
      eyebrow: "7-day reset",
      title: safe.milestone ? `${safe.milestone.replace(/_/g, " ")} of my reset` : "A small reset milestone",
      body: "A bounded daily practice. No shame for missing days.",
      cta: "Start today",
      path: "/today",
      color: "#C4956A",
    };
  }

  if (safe.type === "send_calm") {
    return {
      ...base,
      eyebrow: safe.sender ? `From ${safe.sender}` : "Send Calm",
      title: "Someone sent you a reset",
      body: safe.message || "Sending you a calm link, no pressure.",
      cta: "Open the calm link",
      path: safe.toolSlug ? `/gift/${safe.toolSlug}` : "/send",
      color: "#7AAFC4",
    };
  }

  return base;
}
