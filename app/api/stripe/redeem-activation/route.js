import { NextResponse } from "next/server";
import { createStripeClient } from "../../../../lib/stripe";
import { resolveSubscriptionAccess } from "../../../../lib/subscriptionAccess.mjs";
import { verifyActivationToken } from "../../../../lib/licenseTokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let payload = {};
  try {
    payload = await request.json();
  } catch {}

  const token = String(payload?.token || "");
  const activation = verifyActivationToken(token);
  if (!activation) {
    return NextResponse.json({ error: "Activation link is invalid or expired." }, { status: 400 });
  }

  const stripe = createStripeClient();
  if (!stripe) return NextResponse.json({ error: "Subscription verification is temporarily unavailable." }, { status: 503 });
  try {
    const access = await resolveSubscriptionAccess(stripe, activation.stripeSessionId);
    if (!access || access.planType !== activation.planType) return NextResponse.json({ error: "No active subscription or trial was found." }, { status: 403 });
    return NextResponse.json({ active: true, ...access });
  } catch {
    return NextResponse.json({ error: "Subscription verification is temporarily unavailable." }, { status: 503 });
  }
}
