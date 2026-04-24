import Link from "next/link";
import BiophilicBackground from "../components/BiophilicBackground";
import EditorialReviewCard from "../components/EditorialReviewCard";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import AnalyticsPreferenceCard from "../components/AnalyticsPreferenceCard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "What AIForj Collects and What It Never Collects | AIForj",
  description:
    "A plain-English explanation of AIForj's local-first data model, anonymous metrics opt-in, and the session content that stays on your device.",
  path: "/what-we-collect",
  socialTitle: "What AIForj Collects and What It Never Collects",
  socialDescription:
    "Plain-English privacy details, including the anonymous metrics opt-in and what stays on your device.",
  type: "article",
});

export default function Page() {
  const articleSchema = buildArticleSchema({
    title: "What AIForj collects and what it never collects",
    description: metadata.description,
    url: "https://aiforj.com/what-we-collect",
    section: "Privacy and metrics",
    about: "AIForj data collection and anonymous metrics",
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "What We Collect", item: "https://aiforj.com/what-we-collect" },
  ]);

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 860, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: "var(--accent-sage)",
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Privacy and Metrics
          </p>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              lineHeight: 1.15,
              marginBottom: 18,
              color: "var(--text-primary)",
            }}
          >
            What AIForj collects and what it never collects
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 16 }}>
            AIForj is built around a local-first idea: your sessions, mood shifts, and guided-tool history should help you without becoming a pile of sensitive content sent to a remote analytics vendor by default.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 28 }}>
            This page explains the plain-English version of that promise. If you want the broader product-safety framing, read{" "}
            <Link href="/how-aiforj-stays-safe" style={{ color: "var(--interactive)", textDecoration: "underline" }}>
              How AIForj stays safe
            </Link>
            .
          </p>

          <EditorialReviewCard kind="Privacy guide" />
          <AnalyticsPreferenceCard />

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(45,42,38,0.08)",
              marginBottom: 28,
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, margin: "0 0 12px", color: "var(--text-primary)" }}>
              What stays on your device by default
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.85 }}>
              <li>your mood ratings and mood-shift history</li>
              <li>session history used for “For You, right now” recommendations</li>
              <li>written responses you enter inside techniques and interventions</li>
              <li>Talk to Forj typed messages and local companion memory, unless a feature clearly says otherwise</li>
              <li>garden progress data and local streaks</li>
              <li>your anonymous-metrics preference itself</li>
            </ul>
            <p style={{ margin: "12px 0 0", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Voice input depends on your browser and device. Some browsers process speech through their own speech services. AIForj does not store voice audio or transcripts on its server.
            </p>
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(107,127,110,0.06)",
              border: "1px solid rgba(107,127,110,0.12)",
              marginBottom: 28,
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, margin: "0 0 12px", color: "var(--text-primary)" }}>
              What can be shared only if you opt in
            </h2>
            <p style={{ margin: "0 0 12px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Public marketing pages can send aggregate page-view counters without cookies, user identity, raw URLs, or free-text. Sensitive tool usage requires the anonymous metrics opt-in. If you turn it on, AIForj can send a small set of whitelisted counters to a first-party AIForj endpoint:
            </p>
            <ul style={{ margin: "0 0 12px", paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.85 }}>
              <li>whether a tool was started</li>
              <li>whether a tool was completed</li>
              <li>a duration bucket such as “2 to 5 minutes”</li>
              <li>a mood-shift bucket such as “up 1” or “up 2 plus” when a measured intervention has both ratings</li>
              <li>safe share-card counts and share-link opens</li>
              <li>checkout starts and successes by plan type only</li>
              <li>a short rotating anonymous client id that refreshes regularly</li>
            </ul>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              The goal is to understand which tools get used and which kinds of shifts are happening, without sending session content or building identity profiles.
            </p>
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(196,149,106,0.07)",
              border: "1px solid rgba(196,149,106,0.16)",
              marginBottom: 28,
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, margin: "0 0 12px", color: "var(--text-primary)" }}>
              What AIForj never sends as anonymous metrics
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.85 }}>
              <li>free-text responses from techniques or interventions</li>
              <li>audio, voice transcripts, or message bodies</li>
              <li>names, phone numbers, email addresses, or gift-note text</li>
              <li>provider-search details or anything meant for crisis support</li>
              <li>full raw mood histories as a default background feed</li>
              <li>IP addresses or raw browser user-agent strings</li>
            </ul>
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(107,155,158,0.07)",
              border: "1px solid rgba(107,155,158,0.16)",
              marginBottom: 28,
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, margin: "0 0 12px", color: "var(--text-primary)" }}>
              Payments, gifts, and share links
            </h2>
            <p style={{ margin: "0 0 12px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Payments are handled by Stripe. AIForj stores only what is needed for checkout, entitlement, invite, and redeem flows: plan type, Stripe session/customer/subscription identifiers when needed, gift or family invite codes, activation status, and expiration status. Emotional content is not attached to Stripe metadata.
            </p>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Calm Card share links use a minimal token with card type, tool slug or blueprint archetype, optional sender first name, and optional short non-sensitive message. They do not include journal text, chat text, raw mood scores, crisis status, provider searches, or full histories.
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 12 }}>Why this is structured so narrowly</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 10 }}>
              Mental-health-adjacent products lose trust quickly when they treat vulnerable moments like ad-tech fuel. AIForj is trying to do the opposite: keep emotional first aid useful, fast, and measurable without turning the underlying session content into a broad analytics stream.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
              If the product can learn enough from counts and buckets, it should not demand more than that.
            </p>
          </section>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
