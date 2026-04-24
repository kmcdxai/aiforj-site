import test from "node:test";
import assert from "node:assert/strict";
import { assertNoFreeTextMetric, validateMetricPayload } from "../lib/metricsSchema.mjs";

test("rejects unsafe metric keys", () => {
  const result = validateMetricPayload({
    event: "tool_completed",
    toolKind: "technique",
    toolSlug: "box-breathing",
    message: "private journal text",
    clientId: "client-1",
  }, { allowSensitive: true });
  assert.equal(result.ok, false);
});

test("requires opt-in for sensitive events", () => {
  const result = validateMetricPayload({
    event: "provider_search_started",
    acquisitionSource: "internal",
    clientId: "client-1",
  }, { allowSensitive: false });
  assert.equal(result.ok, false);
});

test("allows public checkout event with plan type only", () => {
  const result = validateMetricPayload({
    event: "checkout_started",
    planType: "premium",
    acquisitionSource: "internal",
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.sanitized, {
    event: "checkout_started",
    acquisitionSource: "internal",
    planType: "premium",
  });
});

test("free-text heuristic catches sentence-like values", () => {
  assert.equal(assertNoFreeTextMetric({ event: "page_view", routeGroup: "home" }), true);
  assert.equal(assertNoFreeTextMetric({ event: "page_view", routeGroup: "this is a full sentence!!" }), false);
});
