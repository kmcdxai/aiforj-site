import test from "node:test";
import assert from "node:assert/strict";

process.env.ENTITLEMENT_SECRET = "test-secret";

const { createActivationToken, verifyActivationToken } = await import("../lib/licenseTokens.mjs");

test("creates and verifies a signed activation token", () => {
  const token = createActivationToken({ planType: "premium", stripeSessionId: "cs_test_123" });
  const parsed = verifyActivationToken(token);
  assert.equal(parsed.planType, "premium");
  assert.equal(parsed.stripeSessionId, "cs_test_123");
});

test("rejects tampered activation token", () => {
  const token = createActivationToken({ planType: "premium", stripeSessionId: "cs_test_123" });
  assert.equal(verifyActivationToken(`${token}tampered`), null);
});
