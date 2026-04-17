import Link from "next/link";
import BiophilicBackground from "../components/BiophilicBackground";
import EditorialReviewCard from "../components/EditorialReviewCard";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import ClinicianPackBuilder from "../../components/monetization/ClinicianPackBuilder";
import ClinicianPackInterestCard from "../../components/monetization/ClinicianPackInterestCard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "AIForj Clinician Pack: Private-Practice Support Tools | AIForj",
  description:
    "A privacy-first clinician pack with handout links, branded calm cards, and patient-safe disclaimers for between-visit support.",
  path: "/clinician-pack",
  socialTitle: "AIForj Clinician Pack for Private Practice",
  socialDescription:
    "Handout-ready support tools for clinicians who want between-visit help without surveillance.",
  type: "article",
});

export default function Page() {
  const articleSchema = buildArticleSchema({
    title: "AIForj clinician pack for private-practice support",
    description: metadata.description,
    url: "https://aiforj.com/clinician-pack",
    section: "Clinician tools",
    about: "AIForj clinician pack",
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Clinician pack", item: "https://aiforj.com/clinician-pack" },
  ]);

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 960, margin: "84px auto 40px", padding: "0 20px" }}>
        <article style={{ display: "grid", gap: 28 }}>
          <ClinicianPackBuilder />
          <ClinicianPackInterestCard />

          <EditorialReviewCard kind="Clinician pack" />

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                title: "Handout-ready links",
                body: "Give patients a direct path into specific AIForj tools after sessions instead of generic homework instructions that get lost.",
              },
              {
                title: "Branded calm cards",
                body: "Use the existing calm-card system to create shareable, practice-safe assets that feel useful instead of promotional.",
              },
              {
                title: "Patient-safe framing",
                body: "Every pack includes clear language about scope, crisis escalation, and privacy so clinicians can hand it out without overclaiming.",
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
              background: "rgba(125,155,130,0.08)",
              border: "1px solid rgba(125,155,130,0.16)",
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
              Built for between visits, not diagnosis
            </h2>
            <p
              style={{
                margin: "0 0 10px",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
              }}
            >
              The clinician pack is meant to support homework, emotional first aid,
              and skill reinforcement between visits. It does not replace clinical
              judgment, diagnosis, or crisis care.
            </p>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              For the public safety framing behind that, read{" "}
              <Link
                href="/how-aiforj-stays-safe"
                style={{ color: "var(--interactive)", textDecoration: "underline" }}
              >
                How AIForj stays safe
              </Link>
              {" "}and, if you need an employer, school, or nonprofit rollout instead, see{" "}
              <Link
                href="/organizations"
                style={{ color: "var(--interactive)", textDecoration: "underline" }}
              >
                the organization toolkit
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
