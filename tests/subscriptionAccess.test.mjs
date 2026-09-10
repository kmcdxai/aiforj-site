import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSubscriptionAccess } from '../lib/subscriptionAccess.mjs';
const now = Date.UTC(2026, 8, 10);
function mock(status='active', sessionOverrides={}, subOverrides={}) {
  return { checkout:{sessions:{retrieve:async()=>({id:'cs_test_verified',status:'complete',mode:'subscription',subscription:'sub_test',metadata:{plan_type:'premium'},...sessionOverrides})}}, subscriptions:{retrieve:async()=>({status,current_period_end:now/1000+3600,...subOverrides})} };
}
test('unfinished checkout and one-time gift cannot unlock subscription', async()=>{
  assert.equal(await resolveSubscriptionAccess(mock('active',{status:'open'}),'cs_test_verified',now),null);
  assert.equal(await resolveSubscriptionAccess(mock('active',{mode:'payment'}),'cs_test_verified',now),null);
});
test('canceled, unpaid, and past-due subscriptions do not grant access',async()=>{
  for(const status of ['canceled','unpaid','past_due','incomplete']) assert.equal(await resolveSubscriptionAccess(mock(status),'cs_test_verified',now),null);
});
test('active subscriptions get at most five minutes of cached access',async()=>{
  const access=await resolveSubscriptionAccess(mock(),'cs_test_verified',now);
  assert.equal(Date.parse(access.expiresAt),now+300000);
});
test('trial and billing boundaries cap access; expired periods fail',async()=>{
  assert.equal(Date.parse((await resolveSubscriptionAccess(mock('trialing',{}, {trial_end:now/1000+30}),'cs_test_verified',now)).expiresAt),now+30000);
  assert.equal(await resolveSubscriptionAccess(mock('active',{}, {current_period_end:now/1000-1}),'cs_test_verified',now),null);
  assert.equal(await resolveSubscriptionAccess(mock('active',{}, {current_period_end:undefined}),'cs_test_verified',now),null);
});
test('modern item period timestamps are supported and family cannot bypass seat redemption',async()=>{
  assert.ok(await resolveSubscriptionAccess(mock('active',{}, {current_period_end:undefined,items:{data:[{current_period_end:now/1000+3600}]}}),'cs_test_verified',now));
  assert.equal(await resolveSubscriptionAccess(mock('active',{metadata:{plan_type:'family'}}),'cs_test_verified',now),null);
});
