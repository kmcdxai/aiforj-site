export const FAMILY_SEAT_COUNT = 4;
export const FAMILY_PLAN_PRICE_CENTS = 1999;
export const FAMILY_PLAN_PRICE_LABEL = "$19.99/month";

export function sanitizeHouseholdName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function sanitizeFamilySessionId(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_]/g, "");
}

export function sanitizeFamilySeatCode(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 120);
}

export function createFamilySeatCodes(count = FAMILY_SEAT_COUNT) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export function serializeFamilyCodes(codes) {
  return (codes || [])
    .map((code) => String(code || "").trim())
    .filter(Boolean)
    .join(",");
}

export function parseFamilyCodes(value) {
  return String(value || "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

export function buildFamilySeatLinks({
  domain,
  sessionId,
  seatCodes,
  redeemedCodes = [],
}) {
  const redeemedSet = new Set(redeemedCodes);

  return (seatCodes || []).map((code, index) => ({
    seatNumber: index + 1,
    code,
    redeemed: redeemedSet.has(code),
    redeemUrl: `${domain}/redeem-family?session_id=${encodeURIComponent(
      sessionId
    )}&code=${encodeURIComponent(code)}`,
  }));
}
