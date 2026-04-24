import test from "node:test";
import assert from "node:assert/strict";
import { classifySafetyInput } from "../lib/safetyClassifier.mjs";

test("classifies crisis language before companion response", () => {
  const result = classifySafetyInput("I want to die and I can't stay safe");
  assert.equal(result.level, "crisis");
  assert.equal(result.crisis, true);
});

test("classifies medication and diagnosis questions as boundaries", () => {
  assert.equal(classifySafetyInput("Should I stop my SSRI medication?").level, "medication");
  assert.equal(classifySafetyInput("Can you diagnose me with ADHD?").level, "medication");
});

test("classifies non-urgent distress without over-escalating", () => {
  assert.equal(classifySafetyInput("I feel anxious before a meeting").level, "none");
});
