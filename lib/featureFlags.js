export function isFeatureEnabled(name, fallback = true) {
  const value = process.env[name];
  if (value == null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

export const FEATURE_FLAGS = {
  privacyMetrics: isFeatureEnabled("NEXT_PUBLIC_ENABLE_PRIVACY_METRICS", true),
  shareEngine: isFeatureEnabled("NEXT_PUBLIC_ENABLE_SHARE_ENGINE", true),
  premiumCheckout: isFeatureEnabled("NEXT_PUBLIC_ENABLE_PREMIUM_CHECKOUT", true),
  dailyCheckin: isFeatureEnabled("NEXT_PUBLIC_ENABLE_DAILY_CHECKIN", true),
  orgReporting: isFeatureEnabled("NEXT_PUBLIC_ENABLE_ORG_REPORTING", true),
};
