import { createHmac, timingSafeEqual } from "crypto";

function getSecret() {
  return process.env.ENTITLEMENT_SECRET || process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_SECRET_KEY || "";
}

function base64UrlEncode(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createActivationToken({ planType = "premium", stripeSessionId = "", expiresAt = null }) {
  if (!getSecret()) throw new Error("ENTITLEMENT_SECRET is not configured");
  const payload = base64UrlEncode(JSON.stringify({
    v: 1,
    planType,
    stripeSessionId,
    expiresAt,
    issuedAt: new Date().toISOString(),
  }));
  return `${payload}.${signPayload(payload)}`;
}

export function verifyActivationToken(token = "") {
  if (!getSecret()) return null;
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return null;

  const expected = signPayload(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload));
    if (parsed?.v !== 1) return null;
    if (parsed.expiresAt && Date.parse(parsed.expiresAt) <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}
