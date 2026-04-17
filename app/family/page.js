import Link from "next/link";
import BiophilicBackground from "../components/BiophilicBackground";
import EditorialReviewCard from "../components/EditorialReviewCard";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import WhenToSeekHelpCard from "../components/WhenToSeekHelpCard";
import FamilyCheckoutCard from "../../components/monetization/FamilyCheckoutCard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "AIForj Family Plan: Premium Support for Your Household | AIForj",
  description:
    "Cover up to four people with private AIForj Premium access without turning your household into a shared account.",
  path: "/family",
  socialTitle: "AIForj Family Plan for Private Household Support",
  socialDescription:
    "A privacy-first Premium option for up to four people in one household.",
  type: "article",
});

export default function Page() {
  const articleSchema = buildArticleSchema({
    title: "AIForj family plan for privacy-first household support",
    description: metadata.description,
    url: "https://aiforj.com/family",
    section: "Premium family plan",
    about: "AIForj Premium family plan",
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Family plan", item: "https://aiforj.com/family" },
  ]);

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 960, margin: "84px auto 40px", padding: "0 20px" }}>
        <article style={{ display: "grid", gap: 28 }}>
          <FamilyCheckoutCard />

          <EditorialReviewCard kind="Family plan" />
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
                title: "What each person gets",
                body: "Every invite link activates the full Premium layer on one device, including deeper guided sessions, Mood Garden upgrades, and progress tools.",
              },
              {
                title: "What stays separate",
                body: "Each person keeps their own private device-based history. No family member sees someone else’s journal, conversation, or emotional data.",
              },
              {
                title: "How invites work",
                body: "After checkout you receive four one-time invite links. Send them directly to the people in your household. Each seat can only be claimed once.",
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
                <h2
                  style={{
                    margin: "0 0 10px",
                    fontFamily: "'Fraunces', serif",
                    fontSize: 22,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.75,
                    color: "var(--text-secondary)",
                  }}
                >
                  {item.body}
                </p>
              </section>
            ))}
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
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
              Designed for closeness, not oversight
            </h2>
            <p
              style={{
                margin: "0 0 10px",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
              }}
            >
              This is for households that want easier access to support, not a
              monitoring layer. There is no parent dashboard, no employer-style
              reporting, and no sale of emotional behavior to ad systems.
            </p>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              For the plain-English privacy details behind that, read{" "}
              <Link
                href="/what-we-collect"
                style={{ color: "var(--interactive)", textDecoration: "underline" }}
              >
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
