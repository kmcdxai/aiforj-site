# AIForj Growth Release Notes

Last updated: 2026-04-23

## Summary

This release adds privacy-first growth infrastructure for measurement, sharing, retention, and monetization while preserving AIForj's scope as self-guided emotional first aid. AIForj remains a wellness companion, not therapy, diagnosis, medication advice, crisis care, or a substitute for professional support.

## Major Files Changed

- `lib/metricsSchema.mjs`, `lib/metrics.js`, `app/api/metrics/route.js`: strict first-party metrics taxonomy, validation, consent-aware client utility, and aggregate event ingestion.
- `components/metrics/ConsentToggle.jsx`, `components/metrics/PageViewBeacon.jsx`, `components/metrics/AdminGrowthDashboard.jsx`: consent UI, aggregate page views, and founder/admin growth dashboard.
- `lib/shareToken.mjs`, `components/share/*`, `app/share/[token]/page.js`, `app/api/og/calm-card/route.js`: safe Calm Card share engine with minimal non-sensitive tokens and OG images.
- `app/today/page.js`, `components/today/*`, `lib/dailyPlan.js`, `lib/challenges.js`, `lib/localProgress.js`: Today's Reset, local progress, compassionate streaks, and bounded 7-day challenges.
- `app/garden/GardenClient.jsx`: better empty state, local recommendations, and safe Garden sharing.
- `app/components/ForjVoiceCompanion.jsx`, `lib/safetyClassifier.mjs`: companion boundaries for crisis/self-harm, medication, and diagnosis requests before normal response generation.
- `lib/stripe.js`, `lib/licenseTokens.mjs`, `app/api/stripe/*`, `app/activate/[token]/*`: unified Stripe checkout, signed local activation links, and checkout-success metrics.
- `app/components/Homepage.jsx`: embedded mini check-in, trust row, share loop explanation, pricing preview, and copy consistency improvements.
- `data/seoPages.js`, `app/feelings/[slug]/page.js`, `app/moments/[slug]/page.js`, `components/content/SeoLandingPage.jsx`: high-intent feeling/moment landing pages with safe boundaries and JSON-LD.
- `app/components/FindHelpPage.jsx`: provider-search privacy copy, opt-in-only search-start metric, local shortlist, and provider verification disclaimers.
- `app/what-we-collect/page.js`: exact metrics/payment/share/privacy disclosure.
- `tests/*.test.mjs`: safety classifier, metrics schema, share token, and activation token tests.

## New Routes

- `/today`
- `/share/[token]`
- `/api/og/calm-card`
- `/admin/growth`
- `/feelings/[slug]`
- `/moments/[slug]`
- `/api/stripe/create-checkout-session`
- `/api/stripe/webhook`
- `/api/stripe/activation-token`
- `/api/stripe/redeem-activation`
- `/activate/[token]`

## Feature Flags

All default to enabled unless set to `false`, `0`, `off`, or `no`.

- `NEXT_PUBLIC_ENABLE_PRIVACY_METRICS`
- `NEXT_PUBLIC_ENABLE_SHARE_ENGINE`
- `NEXT_PUBLIC_ENABLE_PREMIUM_CHECKOUT`
- `NEXT_PUBLIC_ENABLE_DAILY_CHECKIN`
- `NEXT_PUBLIC_ENABLE_ORG_REPORTING`

## Required Environment Variables

Stripe:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_PREMIUM_MONTHLY`
- `STRIPE_PRICE_FAMILY_MONTHLY`
- `STRIPE_PRICE_GIFT_MONTH`
- `STRIPE_PRICE_CLINICIAN_MONTHLY`
- `STRIPE_PRICE_ORG_PILOT_MONTHLY`
- `ENTITLEMENT_SECRET`

Metrics and reporting:

- `AIFORJ_AGGREGATE_METRICS_FILE` for local/file aggregate storage, optional.
- `BLOB_READ_WRITE_TOKEN` and `AIFORJ_ORG_REPORTING_PREFIX` for Vercel Blob aggregate storage, optional.
- `METRICS_STORE_SECRET` is reserved if authenticated metrics administration is added later.

Email/lead capture:

- `BUTTONDOWN_API_KEY`
- `BUTTONDOWN_PANIC_LEAD_MAGNET_EMAIL_ID`, optional legacy lead-magnet support.

Legacy analytics:

- `NEXT_PUBLIC_ENABLE_LEGACY_GA=true` is required before Google Analytics loads.

## Safety and Privacy Assumptions

- Public marketing page views can be recorded as aggregate first-party counters without identity, cookies, raw user agent, IP address, free-text, or full query strings.
- Sensitive tool/session/provider-search events are only sent when anonymous metrics are explicitly enabled locally.
- Anonymous sensitive metrics use a short rotating local client id; the server hashes it before aggregate storage.
- Journal entries, chat transcripts, voice transcripts, gift-note text, provider-search details, crisis details, and full mood histories are not stored server-side by this release.
- Share tokens contain only card type, tool slug or archetype, optional first name, optional short non-sensitive message, milestone, and referral code.
- Stripe receives payment and customer data. AIForj checkout metadata contains plan/acquisition/activation fields only, never emotional content.
- Family and gift invite codes remain Stripe-metadata-backed and redeem locally. Individual activation links are signed with `ENTITLEMENT_SECRET` and activate Premium locally.
- Talk to Forj uses local-first generation where browser support allows. Browser speech recognition may depend on browser/device speech services; AIForj does not store voice audio or transcripts on its server.
- Crisis/self-harm/immediate danger and medication/diagnosis requests are classified before normal companion response generation and route to boundaries/handoff copy.

## Verification

- `npm test`
- `npm run build`
