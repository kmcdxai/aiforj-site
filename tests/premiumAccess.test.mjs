import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../utils/premiumAccess.js', import.meta.url),'utf8');
const { isPremiumStateActive } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('legacy flags and unverified subscription states cannot unlock Premium',()=>{
  for(const state of [true,null,{}, {active:true,source:'subscription'}, {active:true,source:'premium',expiresAt:new Date(Date.now()+300000).toISOString()}]) assert.equal(isPremiumStateActive(state),false);
});
test('verified subscription cache respects expiration and denial',()=>{
  const state={active:true,source:'subscription',activationToken:'signed-example',expiresAt:new Date(Date.now()+300000).toISOString()};
  assert.equal(isPremiumStateActive(state),true);
  assert.equal(isPremiumStateActive({...state,active:false}),false);
  assert.equal(isPremiumStateActive({...state,expiresAt:'invalid'}),false);
  assert.equal(isPremiumStateActive({...state,expiresAt:new Date(Date.now()-1000).toISOString()}),false);
});
test('existing gift and family formats remain compatible',()=>{
  assert.equal(isPremiumStateActive({active:true,source:'gift',expiresAt:new Date(Date.now()+300000).toISOString()}),true);
  assert.equal(isPremiumStateActive({active:true,source:'family',expiresAt:null}),true);
});
