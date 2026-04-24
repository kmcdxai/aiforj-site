import test from "node:test";
import assert from "node:assert/strict";
import { createShareToken, parseShareToken, getShareCardView } from "../lib/shareToken.mjs";

test("round-trips a safe technique share token", () => {
  const token = createShareToken({ type: "technique", toolSlug: "physiological-sigh", message: "This helped me slow down." });
  const parsed = parseShareToken(token);
  assert.equal(parsed.type, "technique");
  assert.equal(parsed.toolSlug, "physiological-sigh");
  assert.equal(parsed.message, "This helped me slow down.");
});

test("drops potentially sensitive optional share text", () => {
  const token = createShareToken({ type: "send_calm", message: "I am in crisis and need a therapist" });
  const parsed = parseShareToken(token);
  assert.equal(parsed.message, undefined);
});

test("renders blueprint share as reflection, not diagnosis", () => {
  const view = getShareCardView({ type: "blueprint", archetype: "sentinel" });
  assert.match(view.body, /not a diagnosis/i);
});
