import { NextResponse } from "next/server";
import { appendOrganizationMetricEntry } from "../../../../lib/organizationReporting";
import { FEATURE_FLAGS } from "../../../../lib/featureFlags";
import { buildLineItems, buildPlanMetadata, createStripeClient, sanitizePlanType, STRIPE_PLANS } from "../../../../lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeAcquisitionSource(value = "") {
  const source = String(value || "direct").toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 40);
  return source || "direct";
}

export async function POST(request) {
  if (!FEATURE_FLAGS.premiumCheckout) {
    return NextResponse.json({ error: "Checkout is currently disabled." }, { status: 404 });
  }

  const stripe = createStripeClient();
  const domain = (process.env.NEXT_PUBLIC_DOMAIN || "https://aiforj.com").trim();
  let payload = {};

  try {
    payload = await request.json();
  } catch {}

  const planType = sanitizePlanType(payload?.planType || payload?.plan || "premium");
  const plan = STRIPE_PLANS[planType];
  const acquisitionSource = sanitizeAcquisitionSource(payload?.acquisitionSource || payload?.medium || "direct");

  if (!stripe) {
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 });
  }

  const metadata = buildPlanMetadata({ plan, payload, acquisitionSource });
  const successKind = plan.successKind === "subscription" ? "" : `kind=${encodeURIComponent(plan.successKind)}&`;
  const successUrl = `${domain}/success?${successKind}session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: buildLineItems(plan),
      mode: plan.mode,
      success_url: successUrl,
      cancel_url: `${domain}${plan.cancelPath}`,
      allow_promotion_codes: true,
      metadata,
      ...(plan.mode === "subscription"
        ? {
            subscription_data: {
              ...(plan.trialPeriodDays ? { trial_period_days: plan.trialPeriodDays } : {}),
              metadata,
            },
          }
        : {
            payment_intent_data: {
              metadata,
            },
          }),
    });

    await appendOrganizationMetricEntry({
      event: "checkout_started",
      planType,
      acquisitionSource,
      receivedAt: new Date().toISOString(),
      dateBucket: new Date().toISOString().slice(0, 10),
    }).catch(() => {});

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 });
  }
}
