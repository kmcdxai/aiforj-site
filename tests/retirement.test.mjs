import test from 'node:test';
import assert from 'node:assert/strict';
import {retirementAction} from '../lib/retirement.mjs';
test('old entry points lead to the new tool',()=>{for(const p of ['/','/start','/companion/','/tools'])assert.equal(retirementAction(p),'redirect');});
test('every old checkout endpoint is closed',()=>{for(const p of ['/api/stripe/create-checkout-session','/api/create-checkout-session','/api/create-family-session','/api/create-sponsor-session','/api/family-plan-session','/api/sponsor-gift-session'])assert.equal(retirementAction(p),'closed-checkout');});
test('billing, restoration, payment webhooks and support remain accessible',()=>{for(const p of ['/billing','/activate/private-token','/api/stripe/webhook','/api/webhook','/api/stripe/redeem-activation','/what-we-collect','/redeem-gift'])assert.equal(retirementAction(p),'preserve');});
test('retired articles return an honest gone response instead of unrelated redirects',()=>{assert.equal(retirementAction('/help/cant-sleep'),'retired');assert.equal(retirementAction('/family'),'retired');});
