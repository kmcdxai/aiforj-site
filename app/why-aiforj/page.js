import BiophilicBackground from "../components/BiophilicBackground";
import EditorialReviewCard from "../components/EditorialReviewCard";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

const NARRATIVE_POINTS = [
  {
    title: "Problem",
    body: "Care is delayed, expensive, and hard to access. Stigma still stops many people before they ever reach a clinician, and privacy failures in the category have made trust fragile.",
  },
  {
    title: "Insight",
    body: "A large share of emotional distress happens between formal moments of care. People often do not need a diagnosis engine in that moment. They need a concrete, credible intervention in minutes.",
  },
  {
    title: "Solution",
    body: "AIForj provides clinician-informed emotional first aid: fast matching, guided tools, measurable self-reported shifts, and a bridge to human support when the moment crosses the line into crisis or clinical care.",
  },
  {
    title: "Moat",
    body: "The moat is the combination, not any one layer alone: privacy-first architecture, trust and evidence framing, care-based social loops, and an SEO/content footprint built for high-intent emotional moments.",
  },
  {
    title: "Business model",
    body: "The business model is paid depth without paywalling first aid: Premium, sponsored gifting, family access, clinician tools, and privacy-first organization rollouts that avoid monetizing individual vulnerability through ads.",
  },
];

export const metadata = buildContentPageMetadata({
  title: "Why AIForj Exists | AIForj",
  description:
    "The core narrative behind AIForj: why emotional first aid matters, what makes the product defensible, and how trust-compatible growth works.",
  path: "/why-aiforj",
  socialTitle: "Why AIForj Exists",
  socialDescription:
    "The problem, insight, solution, moat, and business model behind AIForj.",
  type: "article",
});

export default function Page() {
  const articleSchema = buildArticleSchema({
    title: "Why AIForj exists",
    description: metadata.description,
    url: "https://aiforj.com/why-aiforj",
    section: "Company narrative",
    about: "AIForj company narrative and product vision",
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Why AIForj", item: "https://aiforj.com/why-aiforj" },
  ]);

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 900, margin: "84px auto 40px", padding: "0 20px" }}>
        <article style={{ display: "grid", gap: 24 }}>
          <section
            style={{
              display: "grid",
              gap: 16,
              padding: "clamp(24px, 4vw, 34px)",
              borderRadius: 24,
              background:
                "linear-gradient(135deg, rgba(125,155,130,0.14), rgba(255,255,255,0.78))",
              border: "1px solid rgba(45,42,38,0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--accent-sage)",
                fontWeight: 700,
              }}
            >
              Why AIForj
            </p>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(30px, 5vw, 48px)",
                lineHeight: 1.08,
                color: "var(--text-primary)",
              }}
            >
              Building the emotional first-aid layer of the internet
            </h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.9 }}>
              AIForj is built around a simple belief: when someone is spiraling,
              frozen, or overwhelmed, they should be able to reach specific,
              trustworthy support quickly without giving up their privacy or being
              pushed into an ad-tech funnel.
            </p>
          </section>

          <EditorialReviewCard kind="Company narrative" />

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {NARRATIVE_POINTS.map((item) => (
              <section
                key={item.title}
                style={{
                  padding: "22px 20px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.68)",
                  border: "1px solid rgba(45,42,38,0.08)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px",
                    fontFamily: "'Fraunces', serif",
                    fontSize: 24,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.title}
                </h2>
                <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  {item.body}
                </p>
              </section>
            ))}
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 20,
              background: "rgba(107,155,158,0.08)",
              border: "1px solid rgba(107,155,158,0.16)",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                color: "var(--text-primary)",
              }}
            >
              The ambition in one sentence
            </h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.85 }}>
              AIForj is building the emotional first-aid layer of the internet:
              fast, private, clinically grounded support that people feel safe using
              and safe sharing.
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
