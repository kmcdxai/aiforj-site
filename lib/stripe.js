import Stripe from "stripe";
import { FAMILY_PLAN_PRICE_CENTS, FAMILY_SEAT_COUNT, createFamilySeatCodes, sanitizeHouseholdName, serializeFamilyCodes } from "./familyPlan";

export const STRIPE_PLANS = {
  premium: {
    planType: "premium",
    checkoutKind: "premium",
    mode: "subscription",
    priceEnv: "STRIPE_PRICE_PREMIUM_MONTHLY",
    legacyPriceEnv: "STRIPE_PRICE_ID",
    name: "AIForj Premium",
    description: "Monthly AIForj Premium subscription.",
    amount: 999,
    trialPeriodDays: 7,
    successKind: "subscription",
    cancelPath: "/",
  },
  family: {
    planType: "family",
    checkoutKind: "family_plan",
    mode: "subscription",
    priceEnv: "STRIPE_PRICE_FAMILY_MONTHLY",
    legacyPriceEnv: "STRIPE_FAMILY_PRICE_ID",
    name: "AIForj Family Plan",
    description: "Monthly household plan with four private Premium invite links.",
    amount: FAMILY_PLAN_PRICE_CENTS,
    successKind: "family",
    cancelPath: "/family",
  },
  gift: {
    planType: "gift",
    checkoutKind: "sponsor_friend",
    mode: "payment",
    priceEnv: "STRIPE_PRICE_GIFT_MONTH",
    legacyPriceEnv: "STRIPE_SPONSOR_PRICE_ID",
    name: "AIForj Premium Gift",
    description: "One month of AIForj Premium for one person.",
    amount: 999,
    successKind: "sponsor",
    cancelPath: "/sponsor",
  },
  clinician: {
    planType: "clinician",
    checkoutKind: "clinician_pack",
    mode: "subscription",
    priceEnv: "STRIPE_PRICE_CLINICIAN_MONTHLY",
    name: "AIForj Clinician Pack",
    description: "Monthly clinician handout and calm-card pack.",
    amount: 4900,
    successKind: "clinician",
    cancelPath: "/clinician-pack",
  },
  organization: {
    planType: "organization",
    checkoutKind: "organization_pilot",
    mode: "subscription",
    priceEnv: "STRIPE_PRICE_ORG_PILOT_MONTHLY",
    name: "AIForj Organization Pilot",
    description: "Monthly privacy-first organization pilot with aggregate-only reporting.",
    amount: 39900,
    successKind: "organization",
    cancelPath: "/organizations",
  },
};

export function createStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return null;

  return new Stripe(apiKey, {
    timeout: 8000,
    maxNetworkRetries: 0,
  });
}

export function sanitizePlanType(value = "premium") {
  const token = String(value || "premium").toLowerCase().replace(/[^a-z_]/g, "");
  return STRIPE_PLANS[token] ? token : "premium";
}

export function sanitizeCheckoutText(value = "", maxLength = 80) {
  return String(value || "")
    .replace(/[<>{}[\]\\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function buildLineItems(plan) {
  const configuredPrice = process.env[plan.priceEnv] || (plan.legacyPriceEnv ? process.env[plan.legacyPriceEnv] : "");
  if (configuredPrice) {
    return [{ price: configuredPrice, quantity: 1 }];
  }

  return [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: plan.name,
          description: plan.description,
        },
        ...(plan.mode === "subscription" ? { recurring: { interval: "month" } } : {}),
        unit_amount: plan.amount,
      },
      quantity: 1,
    },
  ];
}

export function buildPlanMetadata({ plan, payload = {}, acquisitionSource = "direct" }) {
  const metadata = {
    checkout_kind: plan.checkoutKind,
    plan_type: plan.planType,
    acquisition_source: acquisitionSource,
  };

  if (plan.planType === "family") {
    const seatCodes = createFamilySeatCodes();
    metadata.household_name = sanitizeHouseholdName(payload.householdName);
    metadata.family_seat_count = String(FAMILY_SEAT_COUNT);
    metadata.family_seat_codes = serializeFamilyCodes(seatCodes);
    metadata.family_redeemed_codes = "";
  }

  if (plan.planType === "gift") {
    metadata.gift_code = crypto.randomUUID();
    metadata.recipient_name = sanitizeCheckoutText(payload.recipientName, 40);
    metadata.gift_length_days = "30";
    metadata.gift_redeemed_at = "";
    metadata.gift_redeemed_expires_at = "";
  }

  if (plan.planType === "clinician") {
    metadata.practice_name = sanitizeCheckoutText(payload.practiceName, 80);
  }

  if (plan.planType === "organization") {
    metadata.organization_name = sanitizeCheckoutText(payload.organizationName, 80);
  }

  return metadata;
}
