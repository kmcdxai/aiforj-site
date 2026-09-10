// A completed checkout is not proof that a subscription is still active.
export async function resolveSubscriptionAccess(stripe, sessionId, now = Date.now()) {
  if (!/^cs_[a-zA-Z0-9_]+$/.test(String(sessionId || ''))) return null;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.status !== 'complete' || session.mode !== 'subscription' || !session.subscription) return null;
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  if (!['active', 'trialing'].includes(subscription.status)) return null;
  const periodEnds = [subscription.current_period_end, ...(subscription.items?.data || []).map(item => item.current_period_end)].filter(value => Number.isFinite(value) && value > 0);
  const end = subscription.status === 'trialing' ? subscription.trial_end : Math.min(...periodEnds);
  if (!Number.isFinite(end) || end * 1000 <= now) return null;
  const planType = session.metadata?.plan_type || 'premium';
  if (!['premium', 'clinician', 'organization'].includes(planType)) return null;
  return { planType, stripeSessionId: session.id, expiresAt: new Date(Math.min(end * 1000, now + 5 * 60 * 1000)).toISOString() };
}
