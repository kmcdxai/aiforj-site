import Link from "next/link";
import BiophilicBackground from "../components/BiophilicBackground";
import EditorialReviewCard from "../components/EditorialReviewCard";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import SponsorCheckoutCard from "../../components/monetization/SponsorCheckoutCard";
import WhenToSeekHelpCard from "../components/WhenToSeekHelpCard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Sponsor a Friend: Gift One Month of AIForj Premium | AIForj",
  description:
    "Gift one month of AIForj Premium to someone you care about, without paywalling first aid or requiring an account.",
  path: "/sponsor",
  socialTitle: "Sponsor a Friend with One Month of AIForj Premium",
  socialDescription:
    "A trust-compatible gift flow for one month of Premium support.",
  type: "article",
});

export default function Page() {
  const articleSchema = buildArticleSchema({
    title: "Sponsor a friend with one month of AIForj Premium",
    description: metadata.description,
    url: "https://aiforj.com/sponsor",
    section: "Premium gifting",
    about: "Gifting AIForj Premium to a friend",
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Sponsor", item: "https://aiforj.com/sponsor" },
  ]);

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 960, margin: "84px auto 40px", padding: "0 20px" }}>
        <article style={{ display: "grid", gap: 28 }}>
          <SponsorCheckoutCard />

          <EditorialReviewCard kind="Gifting flow" />
          <WhenToSeekHelpCard />

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                title: "What the gift does",
                body: "It unlocks one month of Premium features like deeper guided sessions, progress tools, and premium companion access.",
              },
              {
                title: "What stays unchanged",
                body: "Free emotional first aid remains free. This is about paying for added depth, not putting the basic help layer behind a wall.",
              },
              {
                title: "How the link works",
                body: "After checkout you receive a single redeem link. Send it directly to the person you want to support. The first successful redemption activates the gift.",
              },
            ].map((item) => (
              <section
                key={item.title}
                style={{
                  padding: "20px 18px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.58)",
                  border: "1px solid rgba(45,42,38,0.08)",
                }}
              >
                <h2 style={{ margin: "0 0 10px", fontFamily: "'Fraunces', serif", fontSize: 22, color: "var(--text-primary)" }}>
                  {item.title}
                </h2>
                <p style={{ margin: 0, lineHeight: 1.75, color: "var(--text-secondary)" }}>
                  {item.body}
                </p>
              </section>
            ))}
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(196,149,106,0.07)",
              border: "1px solid rgba(196,149,106,0.16)",
            }}
          >
            <h2 style={{ margin: "0 0 10px", fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--text-primary)" }}>
              Keep it personal
            </h2>
            <p style={{ margin: "0 0 10px", lineHeight: 1.8, color: "var(--text-secondary)" }}>
              The gift flow is designed for personal care, not broad outreach. It works best when it comes with context, like “I thought this might help you have more support this month.”
            </p>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              If you want the plain-English privacy details behind this approach, read{" "}
              <Link href="/what-we-collect" style={{ color: "var(--interactive)", textDecoration: "underline" }}>
                What AIForj collects
              </Link>
              .
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
