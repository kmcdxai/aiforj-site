export const METRIC_EVENTS = Object.freeze({
  page_view: {
    sensitive: false,
    allowed: ["event", "routeGroup", "acquisitionSource"],
  },
  tool_started: {
    sensitive: true,
    allowed: ["event", "toolKind", "toolSlug", "emotionCategory", "acquisitionSource", "clientId"],
  },
  tool_completed: {
    sensitive: true,
    allowed: [
      "event",
      "toolKind",
      "toolSlug",
      "emotionCategory",
      "durationBucket",
      "moodShiftBucket",
      "acquisitionSource",
      "clientId",
    ],
  },
  daily_checkin_started: {
    sensitive: true,
    allowed: ["event", "emotionCategory", "acquisitionSource", "clientId"],
  },
  daily_checkin_completed: {
    sensitive: true,
    allowed: ["event", "toolSlug", "emotionCategory", "durationBucket", "acquisitionSource", "clientId"],
  },
  challenge_day_completed: {
    sensitive: true,
    allowed: ["event", "toolSlug", "durationBucket", "acquisitionSource", "clientId"],
  },
  share_card_generated: {
    sensitive: false,
    allowed: ["event", "cardType", "toolSlug", "archetype", "acquisitionSource"],
  },
  share_link_opened: {
    sensitive: false,
    allowed: ["event", "cardType", "toolSlug", "archetype", "acquisitionSource"],
  },
  checkout_started: {
    sensitive: false,
    allowed: ["event", "planType", "acquisitionSource"],
  },
  checkout_success: {
    sensitive: false,
    allowed: ["event", "planType", "acquisitionSource"],
  },
  newsletter_signup: {
    sensitive: false,
    allowed: ["event", "routeGroup", "acquisitionSource"],
  },
  provider_search_started: {
    sensitive: true,
    allowed: ["event", "acquisitionSource", "clientId"],
  },
});

export const METRIC_EVENT_NAMES = Object.freeze(Object.keys(METRIC_EVENTS));
export const METRIC_EVENT_SET = new Set(METRIC_EVENT_NAMES);

export const DURATION_BUCKETS = new Set([
  "under_30s",
  "30s_to_2m",
  "2_to_5m",
  "5_to_10m",
  "10m_plus",
]);

export const MOOD_SHIFT_BUCKETS = new Set([
  "down_2_plus",
  "down_1",
  "no_change",
  "up_1",
  "up_2_plus",
]);

export const ACQUISITION_SOURCES = new Set([
  "direct",
  "organic_search",
  "shared_card",
  "clinician_card",
  "org_link",
  "newsletter",
  "social",
  "internal",
  "unknown",
]);

export const PLAN_TYPES = new Set([
  "premium",
  "family",
  "gift",
  "clinician",
  "organization",
  "workbook",
]);

export const CARD_TYPES = new Set([
  "technique",
  "blueprint",
  "garden",
  "challenge",
  "send_calm",
]);

export const TOOL_KINDS = new Set([
  "technique",
  "intervention",
  "daily",
  "challenge",
  "companion",
  "provider_search",
  "blueprint",
  "garden",
]);

export const EMOTION_CATEGORIES = new Set([
  "anxious",
  "low",
  "sad",
  "angry",
  "overwhelmed",
  "lonely",
  "numb",
  "stressed",
  "burned_out",
  "grieving",
  "scared",
  "stuck",
  "self_critical",
  "okay_growth",
  "general",
  "unknown",
]);

export const ROUTE_GROUPS = Object.freeze({
  "/": "home",
  "/start": "guided_checkin",
  "/companion": "companion",
  "/techniques": "techniques",
  "/intervention": "intervention",
  "/garden": "garden",
  "/send": "send_calm",
  "/gift": "send_calm",
  "/find-help": "find_help",
  "/blueprint": "blueprint",
  "/family": "family",
  "/clinician-pack": "clinician_pack",
  "/organizations/reporting": "org_reporting",
  "/organizations": "organizations",
  "/how-aiforj-stays-safe": "trust",
  "/what-we-collect": "privacy",
  "/editorial-policy": "trust",
  "/today": "today",
  "/share": "share",
  "/feelings": "feelings",
  "/moments": "moments",
  "/help": "help",
  "/admin/growth": "admin_growth",
});

const UNSAFE_KEYS = new Set([
  "text",
  "message",
  "body",
  "transcript",
  "prompt",
  "journal",
  "note",
  "notes",
  "query",
  "zip",
  "city",
  "state",
  "provider",
  "providerName",
  "phone",
  "email",
  "name",
  "mood",
  "moodScore",
  "preRating",
  "postRating",
  "route",
  "url",
  "href",
  "path",
  "userAgent",
  "ip",
]);

const MARKETING_ROUTE_GROUPS = new Set([
  "home",
  "guided_checkin",
  "companion",
  "techniques",
  "intervention",
  "garden",
  "help",
  "feelings",
  "moments",
  "find_help",
  "blueprint",
  "family",
  "clinician_pack",
  "organizations",
  "org_reporting",
  "trust",
  "privacy",
  "today",
  "send_calm",
  "share",
  "admin_growth",
]);

export function sanitizeMetricToken(value, maxLength = 80) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, maxLength);

  return normalized || null;
}

export function normalizeDateBucket(date = new Date()) {
  const safeDate = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(safeDate.getTime())) return new Date().toISOString().slice(0, 10);
  return safeDate.toISOString().slice(0, 10);
}

export function normalizeHourBucket(date = new Date()) {
  const safeDate = date instanceof Date ? date : new Date(date);
  const source = Number.isNaN(safeDate.getTime()) ? new Date() : safeDate;
  return `${source.toISOString().slice(0, 13)}:00Z`;
}

export function bucketDurationSeconds(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  if (seconds < 30) return "under_30s";
  if (seconds < 120) return "30s_to_2m";
  if (seconds < 300) return "2_to_5m";
  if (seconds < 600) return "5_to_10m";
  return "10m_plus";
}

export function bucketMoodShift(value) {
  const shift = Number(value);
  if (!Number.isFinite(shift)) return null;
  if (shift <= -2) return "down_2_plus";
  if (shift === -1) return "down_1";
  if (shift === 0) return "no_change";
  if (shift === 1) return "up_1";
  return "up_2_plus";
}

export function normalizeEmotionCategory(value) {
  const token = sanitizeMetricToken(value, 40);
  if (!token) return null;

  const aliases = {
    sadness: "sad",
    "sad-low": "sad",
    "stressed-burned-out": "burned_out",
    burnout: "burned_out",
    "burned-out": "burned_out",
    "grief-loss": "grieving",
    grief: "grieving",
    "scared-fearful": "scared",
    "stuck-lost": "stuck",
    "shame-guilt": "self_critical",
    shame: "self_critical",
    "numb-disconnected": "numb",
    fine: "okay_growth",
    "okay-but-want-to-grow": "okay_growth",
  };

  const normalized = aliases[token] || token;
  return EMOTION_CATEGORIES.has(normalized) ? normalized : "unknown";
}

export function normalizeRouteGroup(value = "") {
  const routeToken = sanitizeMetricToken(value, 48);
  if (routeToken && MARKETING_ROUTE_GROUPS.has(routeToken)) return routeToken;

  const raw = String(value || "").split("?")[0].split("#")[0] || "/";
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;

  const exact = ROUTE_GROUPS[normalized];
  if (exact) return exact;

  const match = Object.entries(ROUTE_GROUPS)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([prefix]) => prefix !== "/" && normalized.startsWith(`${prefix}/`));

  return match?.[1] || "other";
}

export function normalizeAcquisitionSource(value = "", referrer = "") {
  const token = sanitizeMetricToken(value, 40);
  if (token && ACQUISITION_SOURCES.has(token)) return token;

  const ref = String(referrer || "").toLowerCase();
  if (!ref) return "direct";
  if (/google|bing|duckduckgo|yahoo|ecosia|brave\.com/.test(ref)) return "organic_search";
  if (/facebook|instagram|threads|twitter|x\.com|reddit|linkedin|tiktok/.test(ref)) return "social";
  return "unknown";
}

function normalizeToolKind(value) {
  const token = sanitizeMetricToken(value, 32);
  return token && TOOL_KINDS.has(token) ? token : null;
}

function normalizePlanType(value) {
  const token = sanitizeMetricToken(value, 32);
  return token && PLAN_TYPES.has(token) ? token : null;
}

function normalizeCardType(value) {
  const token = sanitizeMetricToken(value, 32);
  return token && CARD_TYPES.has(token) ? token : null;
}

function normalizeBucket(value, validSet) {
  if (value == null) return null;
  const token = sanitizeMetricToken(value, 32);
  return token && validSet.has(token) ? token : null;
}

export function hasUnsafeMetricKeys(payload = {}) {
  return Object.keys(payload || {}).some((key) => UNSAFE_KEYS.has(key));
}

export function validateMetricPayload(payload = {}, options = {}) {
  const event = sanitizeMetricToken(payload?.event, 48);
  const definition = event ? METRIC_EVENTS[event] : null;

  if (!definition) {
    return { ok: false, error: "Unknown metric event" };
  }

  if (hasUnsafeMetricKeys(payload)) {
    return { ok: false, error: "Metric payload contains unsafe keys" };
  }

  const allowed = new Set(definition.allowed);
  const unknownKeys = Object.keys(payload).filter((key) => !allowed.has(key));
  if (unknownKeys.length) {
    return { ok: false, error: `Metric payload contains non-whitelisted keys: ${unknownKeys.join(",")}` };
  }

  if (definition.sensitive && !options.allowSensitive) {
    return { ok: false, error: "Sensitive metric requires opt-in" };
  }

  const sanitized = { event };

  if (allowed.has("routeGroup")) {
    const routeGroup = normalizeRouteGroup(payload.routeGroup);
    sanitized.routeGroup = MARKETING_ROUTE_GROUPS.has(routeGroup) ? routeGroup : "other";
  }

  if (allowed.has("toolKind")) {
    sanitized.toolKind = normalizeToolKind(payload.toolKind);
    if (!sanitized.toolKind) return { ok: false, error: "Invalid tool kind" };
  }

  if (allowed.has("toolSlug")) {
    sanitized.toolSlug = sanitizeMetricToken(payload.toolSlug, 96);
    if (!sanitized.toolSlug && ["tool_started", "tool_completed", "daily_checkin_completed", "challenge_day_completed"].includes(event)) {
      return { ok: false, error: "Invalid tool slug" };
    }
  }

  if (allowed.has("emotionCategory")) {
    sanitized.emotionCategory = normalizeEmotionCategory(payload.emotionCategory);
  }

  if (allowed.has("durationBucket")) {
    sanitized.durationBucket = normalizeBucket(payload.durationBucket, DURATION_BUCKETS);
  }

  if (allowed.has("moodShiftBucket")) {
    sanitized.moodShiftBucket = normalizeBucket(payload.moodShiftBucket, MOOD_SHIFT_BUCKETS);
  }

  if (allowed.has("acquisitionSource")) {
    sanitized.acquisitionSource = normalizeAcquisitionSource(payload.acquisitionSource);
  }

  if (allowed.has("clientId")) {
    sanitized.clientId = sanitizeMetricToken(payload.clientId, 80);
    if (definition.sensitive && !sanitized.clientId) {
      return { ok: false, error: "Sensitive metric requires rotating anonymous client id" };
    }
  }

  if (allowed.has("planType")) {
    sanitized.planType = normalizePlanType(payload.planType);
    if (!sanitized.planType) return { ok: false, error: "Invalid plan type" };
  }

  if (allowed.has("cardType")) {
    sanitized.cardType = normalizeCardType(payload.cardType);
    if (!sanitized.cardType) return { ok: false, error: "Invalid card type" };
  }

  if (allowed.has("archetype")) {
    sanitized.archetype = sanitizeMetricToken(payload.archetype, 40);
  }

  return { ok: true, event, definition, sanitized };
}

export function assertNoFreeTextMetric(payload = {}) {
  if (hasUnsafeMetricKeys(payload)) return false;

  return Object.entries(payload).every(([, value]) => {
    if (typeof value !== "string") return true;
    if (value.length > 100) return false;
    if (/\s{2,}|[.!?]{2,}/.test(value)) return false;
    return true;
  });
}
