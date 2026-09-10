# Forj by Tredici release — September 10, 2026

Homepage now offers three clear starting points and links to the new Tredici introduction. Free tools and Premium remain prominent; other existing plan routes are retained but the five-plan homepage comparison was removed. Marketing outcome claims were softened, illustrative Garden numbers labeled, and the unconfirmed graduation date removed.

The success page previously granted local Premium before verifying checkout. It now requires Stripe verification of a completed subscription checkout and active/trialing status. Signed activation links are bearer credentials, rechecked against Stripe before granting at most five minutes of device-cached access. Companion and Garden refresh near expiry and no longer trust the legacy saved tier. Activation links are deliberately long-lived; they do not authorize access without checking Stripe. Keep them private.

Legacy subscribers may need to revisit their saved activation or checkout-success link. Existing gift and family access formats were preserved and have not received the same subscription revalidation work in this release. This remains device-local feature gating, not server-enforced protection for a remote AI service.

Validation: production build and automated tests, including incomplete checkout, active/trialing, canceled/unpaid/past_due, expiry, item-period compatibility, legacy flags, and gift/family compatibility. No live purchase, renewal, cancellation, or refund was performed. Human review of clinical exercises, browser/device voice compatibility, paid restoration, family cancellation, and the workbook remains outstanding before wider paid promotion.
